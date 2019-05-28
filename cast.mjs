import chromecastjs from 'chromecast-js';

const browser = new chromecastjs.Browser();

const devices = [];

browser.on('deviceOn', device => {
  console.log(`Cast device detected : ${device.config.name}`);
  devices.push(device);
});

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

export const castImage = (deviceId, media) => {
  console.log(`Cast image ${JSON.stringify(media)} to ${deviceId}`);
  const onConnect = (device, resolve) => device.play(media, 60, () => resolve(media));
  return castUpdate(deviceId, onConnect);
};

export const castStop = deviceId => {
  console.log(`Stop cast on ${deviceId}`);
  castUpdate(deviceId, (device, resolve) => device.close(resolve));
};
