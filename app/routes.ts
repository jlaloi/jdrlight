import * as fsWithCallbacks from 'fs'
import * as Hapi from '@hapi/hapi'
const fs = fsWithCallbacks.promises

import {getLights, setBright, setPower, setRGB, initLookUpLight} from './light'
import {getCasts, cast, initLookUpCast} from './cast'

const DIR_PUBLIC = 'public/'
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
    path: '/effects',
    handler: async () => await readDir(DIR_PUBLIC + DIR_EFFECT, DIR_EFFECT),
  },
  {
    method: 'GET',
    path: '/lookup',
    handler: () => {
      initLookup()
      return {result: 'ok'}
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
    handler: async ({headers, params: {deviceId}, payload: {media}}: any) =>
      await cast(deviceId, media, DIR_PUBLIC + DIR_IMG, (headers.referer || headers.host + '/') + DIR_IMG),
  },
]
