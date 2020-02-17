import * as fsWithCallbacks from 'fs'
import {IncomingMessage, ServerResponse} from 'http'
import {FastifyRequest, FastifyReply, HTTPMethod} from 'fastify'

const fs = fsWithCallbacks.promises

import {getLights, setBright, setPower, setRGB, initLookUpLight} from './light'
import {getCasts, cast, initLookUpCast} from './cast'

export const DIR_PUBLIC = 'public/'
const DIR_MUSIC = 'music/'
const DIR_IMG = 'image/'
const DIR_EFFECT = 'effect/'

export const initLookup = () => {
  initLookUpLight()
  initLookUpCast()
}

const readDir = async (path: string, prefix: string) => {
  const result = []
  for (const file of await fs.readdir(path)) {
    if ((await fs.lstat(path + file)).isDirectory())
      result.push.apply(result, await readDir(path + file + '/', prefix + file + '/'))
    else result.push(prefix + file)
  }
  return result
}

export const routes = [
  {
    method: 'GET' as HTTPMethod,
    url: '/images',
    handler: async (request: FastifyRequest<IncomingMessage>, reply: FastifyReply<ServerResponse>) =>
      readDir(DIR_PUBLIC + DIR_IMG, DIR_IMG),
  },
  {
    method: 'GET' as HTTPMethod,
    url: '/musics',
    handler: async (request: FastifyRequest<IncomingMessage>, reply: FastifyReply<ServerResponse>) =>
      readDir(DIR_PUBLIC + DIR_MUSIC, DIR_MUSIC),
  },
  {
    method: 'GET' as HTTPMethod,
    url: '/effects',
    handler: async (request: FastifyRequest<IncomingMessage>, reply: FastifyReply<ServerResponse>) =>
      readDir(DIR_PUBLIC + DIR_EFFECT, DIR_EFFECT),
  },
  {
    method: 'GET' as HTTPMethod,
    url: '/lookup',
    handler: async (request: FastifyRequest<IncomingMessage>, reply: FastifyReply<ServerResponse>) => {
      initLookup()
      reply.send({result: 'ok'})
    },
  },
  {
    method: 'GET' as HTTPMethod,
    url: '/light',
    handler: async (request: FastifyRequest<IncomingMessage>, reply: FastifyReply<ServerResponse>) => getLights(),
  },
  {
    method: 'POST' as HTTPMethod,
    url: '/light/:deviceId',
    handler: async (request: FastifyRequest<IncomingMessage>, reply: FastifyReply<ServerResponse>) => {
      const {deviceId} = request.params
      const {power, rgb, bright} = request.body
      if (power) await setPower(deviceId, power)
      if (rgb) await setRGB(deviceId, rgb)
      if (bright) await setBright(deviceId, Number(bright))
      reply.send({result: 'ok'})
    },
  },
  {
    method: 'GET' as HTTPMethod,
    url: '/cast',
    handler: async (request: FastifyRequest<IncomingMessage>, reply: FastifyReply<ServerResponse>) => getCasts(),
  },
  {
    method: 'POST' as HTTPMethod,
    url: '/cast/:deviceId',
    handler: async (request: FastifyRequest<IncomingMessage>, reply: FastifyReply<ServerResponse>) => {
      const {deviceId} = request.params
      const {media} = request.body
      const {referer, host} = request.headers
      const result = await cast(deviceId, media, DIR_PUBLIC + DIR_IMG, (referer || host + '/') + DIR_IMG)
      reply.send(result)
    },
  },
]
