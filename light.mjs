import Yeelight from 'node-yeelight-wifi';

export const look = new Yeelight.Lookup();

export const getLights = () =>
  look.getLights().map(l => {
    return {
      deviceId: l.id
    };
  });
//[{deviceId: 'Dummy'}, {deviceId: 'Dummy2'}];

export const getLight = deviceId => look.getLights().find(l => l.id === deviceId);

export const updateLight = (fct, deviceId) =>
  new Promise(async (resolve, reject) => {
    try {
      const light = getLight(deviceId);
      if (light) {
        resolve({
          result: 'success',
          light: await fct(light)
        });
      } else
        resolve({
          result: `light ${deviceId} not found`
        });
    } catch (err) {
      console.error(err);
      reject({
        result: err
      });
    }
  });

export const setBright = (id, value) => {
  console.log(`Updating ${id} to bright ${value}`);
  return updateLight(light => light.setBright(value), id);
};

export const setPower = (id, value) => {
  console.log(`Updating ${id} to power ${value}`);
  updateLight(light => light.setPower(value), id);
};

export const setRGB = (id, value) => {
  console.log(`Updating ${id} to color ${value}`);
  updateLight(light => light.setRGB(value), id);
};
