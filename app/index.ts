import * as fsWithCallbacks from 'fs'
import * as Hapi from '@hapi/hapi'
import * as Inert from '@hapi/inert'
import * as Joi from '@hapi/joi'
const fs = fsWithCallbacks.promises

import {getLights, setBright, setPower, setRGB, initLookUpLight} from './light'
import {getCasts, cast, initLookUpCast} from './cast'

const PORT = 9090
const DIR_PUBLIC = 'public/'
const DIR_MUSIC = 'music/'
const DIR_IMG = 'image/'

const initLookup = () => {
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

const routes = [
  {
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: DIR_PUBLIC,
        index: ['index.html'],
      },
    },
  },
  {
    method: 'GET',
    path: '/images',
    handler: async () => await readDir(DIR_PUBLIC + DIR_IMG, DIR_IMG),
  },
  {
    method: 'GET',
    path: '/musics',
    handler: async () => await readDir(DIR_PUBLIC + DIR_MUSIC, DIR_MUSIC),
  },
  {
    method: 'GET',
    path: '/lookup',
    handler: () => {
      initLookup()
      return 'ok'
    },
  },
  {
    method: 'GET',
    path: '/light',
    handler: getLights,
  },
  {
    method: 'POST',
    path: '/light/{deviceId}',
    options: {
      validate: {
        params: Joi.object({
          deviceId: Joi.string().required(),
        }),
        payload: Joi.object({
          power: Joi.string().required(),
          rgb: Joi.array().required(),
          bright: Joi.number().required(),
        }),
      },
    },
    handler: async ({params: {deviceId}, payload: {power, rgb, bright}}: any) => {
      if (power) await setPower(deviceId, power)
      if (rgb) await setRGB(deviceId, rgb)
      if (bright) await setBright(deviceId, Number(bright))
      return {result: 'ok'}
    },
  },
  {
    method: 'GET',
    path: '/cast',
    handler: getCasts,
  },
  {
    method: 'POST',
    path: '/cast/{deviceId}',
    options: {
      validate: {
        params: Joi.object({
          deviceId: Joi.string().required(),
        }),
        payload: Joi.object({
          media: Joi.string().required(),
        }),
      },
    },
    handler: async ({headers, params: {deviceId}, payload: {media}}: any) =>
      await cast(deviceId, media, DIR_PUBLIC + DIR_IMG, (headers.referer || headers.host + '/') + DIR_IMG),
  },
]

interface ReqCast extends Hapi.Request {
  payload: {
    media: string
  }
}

interface ReqLight extends Hapi.Request {
  payload: {
    power: string
    rgb: number[]
    bright: number
  }
}

const init = async () => {
  const server = new Hapi.Server({
    port: PORT,
  })
  await server.register(Inert)
  server.route(routes)
  await server.start()
  console.log(`Server running on port ${PORT}`)
}

init()
initLookup()
