import chromecastjs from 'chromecast-js';
import fs from 'fs';
import http from 'http';

let browser;

const devices = [];

export const initLookUpCast = () => {
  browser = new chromecastjs.Browser();
  browser.on('deviceOn', device => {
    if (!getCast(device.config.name)) {
      console.log(`Cast device detected : ${device.config.name}`);
      devices.push(device);
    }
  });
};

const castUpdate = (deviceId, onConnect) =>
  new Promise(async (resolve, reject) => {
    try {
      const device = getCast(deviceId);
      if (!device)
        reject({
          result: `Cast device ${deviceId} not found`
        });
      else {
        if (!device.client) {
          device.connect();
          device.on('connected', () => {
            const castIndex = devices.findIndex(l => l.config.name == device.config.name);
            devices[castIndex] = device;
            onConnect(device, resolve, reject);
          });
        } else onConnect(device, resolve, reject);
      }
    } catch (err) {
      console.error(err);
      reject({
        result: err
      });
    }
  });

export const getCasts = () => devices.map(c => c.config.name);

export const getCast = deviceId => devices.find(l => l.config.name === deviceId);

export const castImage = async (deviceId, media, imgDir, serverHost) => {
  if (imgDir && serverHost) {
    // Download local copie
    const fileName = media.url.substr(media.url.lastIndexOf('/') + 1);
    const filePath = imgDir + fileName;
    if (!fs.existsSync(filePath)) {
      try {
        await download(media.url, filePath);
        media.url = serverHost + '/' + fileName;
      } catch (error) {
        console.error(error);
      }
    } else media.url = serverHost + '/' + fileName;
  }
  console.log(`Cast image ${JSON.stringify(media)} to ${deviceId}`);
  const onConnect = (device, resolve) => device.play(media, 60, () => resolve(media));
  return castUpdate(deviceId, onConnect);
};

export const castStop = deviceId => {
  console.log(`Stop cast on ${deviceId}`);
  castUpdate(deviceId, (device, resolve) => device.close(resolve));
};

export const download = (url, dest) =>
  new Promise((resolve, reject) => {
    console.log(`Downloading ${url} to ${dest}`);
    const file = fs.createWriteStream(dest);
    http
      .get(url, response => {
        response.pipe(file);
        file.on('finish', () => file.close(resolve));
      })
      .on('error', err => {
        fs.unlink(dest);
        reject(err.message);
      });
  });
