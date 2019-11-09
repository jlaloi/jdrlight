import * as castv2 from 'castv2-player'
import * as fs from 'fs'
import * as request from 'request'
import * as os from 'os'

const Scanner = castv2.Scanner()
const ScannerPromise = castv2.ScannerPromise()
const MediaPlayer = castv2.MediaPlayer()

const devices = new Map()

/*
 * Interval to prevent sleep mod
 */
const refreshIntervals = new Map()
const REFRESH_INTERVAL = 180 * 1000
const stopRefresh = (deviceName: string) => {
  if (refreshIntervals.has(deviceName)) {
    clearInterval(refreshIntervals.get(deviceName))
    refreshIntervals.delete(deviceName)
  }
}
const startRefresh = (deviceName: string, media: string, imgDir: string, serverHost: string) => {
  stopRefresh(deviceName)
  const refresh = () => cast(deviceName, media, imgDir, serverHost)
  refreshIntervals.set(deviceName, setInterval(refresh, REFRESH_INTERVAL))
}

/*
 * Local addresses for cache
 */
const networkInterfaces = os.networkInterfaces()
const ips = Object.keys(networkInterfaces)
  .map(key => networkInterfaces[key])
  .flat()
  .map(i => i.address)
  .filter(i => !i.includes('::'))
const isLocalUrl = (url: string) => ips.find(ip => url.match(new RegExp(`^http?://${ip}?:([0-9]*)/(.*)`)))

/*
 * Lookup
 */
export const initLookUpCast = () => new Scanner(device => devices.set(device.name, undefined), {scanInterval: 0})

export const getCasts = () => [...devices.keys()]

export const cast = async (deviceName: string, media: string, imgDir: string, serverHost: string) => {
  if (!media) return castStop(deviceName)
  if (imgDir && serverHost && !isLocalUrl(media)) {
    // Download local copie
    const fileName = media.substr(media.lastIndexOf('/') + 1)
    const filePath = imgDir + fileName
    if (/\.(gif|jpg|jpeg|tiff|png)$/i.test(fileName) && !fs.existsSync(filePath)) {
      try {
        await download(media, filePath)
        media = serverHost + fileName
      } catch (error) {
        console.error(error)
      }
    }
  }
  const onConnect = async (device, mediaPlayer, resolve) => {
    await mediaPlayer.playUrlPromise(media)
    startRefresh(deviceName, media, imgDir, serverHost)
    resolve(media)
  }
  return castUpdate(deviceName, onConnect)
}

export const castStop = async (deviceName: string) => {
  stopRefresh(deviceName)
  const onConnect = async (device, mediaPlayer, resolve) => {
    await mediaPlayer.close()
    await mediaPlayer.stopClientPromise()
    devices.set(deviceName, undefined)
    resolve(null)
  }
  return castUpdate(deviceName, onConnect)
}

const castUpdate = async (deviceName: string, onConnect) =>
  new Promise(async (resolve, reject) => {
    try {
      if (!devices.has(deviceName))
        return reject({
          result: `Cast device ${deviceName} not found`,
        })
      const device = await ScannerPromise(deviceName)
      if (!device)
        return reject({
          result: `Cast device ${deviceName} not connected`,
        })
      else {
        if (!devices.get(deviceName)) devices.set(deviceName, new MediaPlayer(device))
        return onConnect(device, devices.get(deviceName), resolve, reject)
      }
    } catch (err) {
      console.error(err)
      return reject({
        result: err,
      })
    }
  })

export const download = (url: string, target: string) =>
  new Promise((resolve, reject) => {
    request(url)
      .pipe(fs.createWriteStream(target))
      .on('error', error => reject(error))
      .on('close', () => resolve(target))
  })
