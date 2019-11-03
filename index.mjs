import Express from 'express'
import bodyParser from 'body-parser'
import compression from 'compression'
import {default as fsWithCallbacks} from 'fs'
const fs = fsWithCallbacks.promises
import {getLights, setBright, setPower, setRGB, initLookUpLight} from './light.mjs'
import {getCasts, cast, castStop, initLookUpCast} from './cast.mjs'

const PORT = 9090
const DIR_PUBLIC = 'public/'
const DIR_MUSIC = 'music/'
const DIR_IMG = 'image/'
const DIR_FONTS = 'node_modules/material-design-icons/iconfont'

const initLookup = () => {
  initLookUpLight()
  initLookUpCast()
}

const app = Express()
app.use(compression({filter: () => true}))
app.use(bodyParser.json())

app.get('/lookup', (req, res) => {
  initLookup()
  res.json({
    result: 'ok',
  })
})

app.get('/light', (req, res) => res.json(getLights()))
app.post('/light/:deviceId', async (req, res) => {
  try {
    const scene = req.body
    console.log('scene', scene)
    if (scene.power) await setPower(req.params.deviceId, scene.power)
    if (scene.rgb) await setRGB(req.params.deviceId, scene.rgb)
    if (scene.bright) await setBright(req.params.deviceId, Number(scene.bright))
    res.json({
      result: 'ok',
    })
  } catch (error) {
    console.log(error)
    res.json(error)
  }
})

app.get('/cast', (req, res) => res.json(getCasts()))
app.post('/cast/:deviceId', async (req, res) => {
  try {
    res.json(
      await cast(
        req.params.deviceId,
        req.body.media,
        DIR_PUBLIC + DIR_IMG,
        (req.headers.referer || req.headers.host + '/') + DIR_IMG,
      ),
    )
  } catch (error) {
    console.log(error)
    res.json(error)
  }
})

app.delete('/cast/:deviceId', async (req, res) => {
  try {
    res.json(await castStop(req.params.deviceId))
  } catch (error) {
    console.log(error)
    res.json(error)
  }
})

app.use(Express.static(DIR_PUBLIC))
app.use('/fonts', Express.static(DIR_FONTS))
app.get('/musics', async (req, res) => res.json(await readDir(DIR_PUBLIC + DIR_MUSIC, DIR_MUSIC)))

const readDir = async (path, prefix) => {
  const result = []
  for (const file of await fs.readdir(path)) {
    if ((await fs.lstat(path + file)).isDirectory())
      result.push.apply(result, await readDir(path + file + '/', prefix + file + '/'))
    else result.push(prefix + file)
  }
  return result
}

app.get('/images', async (req, res) => res.json(await readDir(DIR_PUBLIC + DIR_IMG, DIR_IMG)))
app.listen(PORT, () => console.log(`Listening on port ${PORT}...`))

initLookup()
