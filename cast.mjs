import {default as castv2} from 'castv2-player';
import fs from 'fs';
import request from 'request';

const Scanner = castv2.Scanner();
const ScannerPromise = castv2.ScannerPromise();
const MediaPlayer = castv2.MediaPlayer();

const devices = [];

/*
 * Lookup
 */
export const initLookUpCast = () => new Scanner(device => devices.push(device), {scanInterval: 0});

export const getCasts = () => devices.map(c => c.name);

export const getCast = deviceName => devices.find(l => l.name === deviceName);

export const cast = async (deviceName, media, imgDir, serverHost) => {
  if (media === 'off') return castStop(deviceName);
  if (imgDir && serverHost) {
    // Download local copie
    const fileName = media.substr(media.lastIndexOf('/') + 1);
    const filePath = imgDir + fileName;
    if (/\.(gif|jpg|jpeg|tiff|png)$/i.test(fileName) && !fs.existsSync(filePath)) {
      try {
        await download(media, filePath);
        media = serverHost + fileName;
      } catch (error) {
        console.error(error);
      }
    }
  }
  console.log(`Cast ${JSON.stringify(media)} to ${deviceName}`);
  const onConnect = async (device, mediaPlayer, resolve) => {
    await mediaPlayer.playUrlPromise(media);
    await mediaPlayer.close();
    resolve(media);
  };
  return castUpdate(deviceName, onConnect);
};

export const castStop = async deviceName => {
  console.log(`Stop cast on ${deviceName}`);
  const onConnect = async (device, mediaPlayer, resolve) => {
    await mediaPlayer.stopClientPromise();
    resolve('off');
  };
  return castUpdate(deviceName, onConnect);
};

const castUpdate = async (deviceName, onConnect) =>
  new Promise(async (resolve, reject) => {
    try {
      const device = await ScannerPromise(deviceName);
      if (!device)
        reject({
          result: `Cast device ${deviceName} not found`,
        });
      else onConnect(device, new MediaPlayer(device), resolve, reject);
    } catch (err) {
      console.error(err);
      reject({
        result: err,
      });
    }
  });

export const download = (url, target) =>
  new Promise((resolve, reject) => {
    console.log(`Downloading ${url} to ${target}`);
    request(url)
      .pipe(fs.createWriteStream(target))
      .on('error', error => reject(error))
      .on('close', () => resolve(target));
  });
