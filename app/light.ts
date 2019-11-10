// @ts-ignore
import * as Yeelight from 'node-yeelight-wifi'

let look: any

export const initLookUpLight = () => (look = new Yeelight.Lookup())

export const getLights = () =>
  look.getLights().map((l: any) => {
    return {
      deviceId: l.id,
      name: l.name,
    }
  })

export const getLight = (deviceId: string) => look.getLights().find((l: any) => l.id === deviceId)

export const updateLight = async (fct: Function, deviceId: string) => {
  try {
    const light = getLight(deviceId)
    if (light)
      return {
        result: 'success',
        light: await fct(light),
      }
    else throw Error(`light ${deviceId} not found`)
  } catch (error) {
    console.error(error)
    throw Error(error)
  }
}

export const setBright = (id: string, value: number) => updateLight((light: any) => light.setBright(value), id)
export const setPower = (id: string, value: string) => updateLight((light: any) => light.setPower(value), id)
export const setRGB = (id: string, value: number[]) => updateLight((light: any) => light.setRGB(value), id)

// Need to modify the lib (@node-yeelight-wifi/yeelight.js:417) to allow it but command should be accepted
export const setName = (id: string, name: string) =>
  updateLight((light: any) => light.sendCommand('set_name', [name]), id)
//setTimeout(() => setName('0x0000000000000000', 'Salle à manger'), 1000);
