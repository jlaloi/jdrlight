import Yeelight from 'node-yeelight-wifi';

let look;

export const initLookUpLight = () => (look = new Yeelight.Lookup());

export const getLights = () =>
  look.getLights().map(l => {
    return {
      deviceId: l.id,
      name: l.name
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

// Need to modify the lib (@node-yeelight-wifi/yeelight.js:417) to allow it but command should be accepted
export const setName = (id, name) => {
  console.log(`Updating ${id} to name ${name}`);
  updateLight(light => light.sendCommand('set_name', [name]), id);
};
//setTimeout(() => setName('0x0000000000000000', 'Salle à manger'), 1000);
