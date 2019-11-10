import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as compression from 'compression'
import * as fsWithCallbacks from 'fs'
const fs = fsWithCallbacks.promises
import {getLights, setBright, setPower, setRGB, initLookUpLight} from './light'
import {getCasts, cast, castStop, initLookUpCast} from './cast'

const PORT = 9090
const DIR_PUBLIC = 'public/'
const DIR_MUSIC = 'music/'
const DIR_IMG = 'image/'
const DIR_FONTS = 'node_modules/material-design-icons/iconfont'

const initLookup = () => {
  initLookUpLight()
  initLookUpCast()
}

const app = express()
app.use(compression({filter: () => true}))
app.use(bodyParser.json())

app.get('/lookup', (req: express.Request, res: express.Response) => {
  initLookup()
  return res.json({
    result: 'ok',
  })
})

app.get('/light', (req: express.Request, res: express.Response) => res.json(getLights()))
app.post('/light/:deviceId', async (req: express.Request, res: express.Response) => {
  try {
    const scene = req.body
    if (scene.power) return res.json(await setPower(req.params.deviceId, scene.power))
    if (scene.rgb) return res.json(await setRGB(req.params.deviceId, scene.rgb))
    if (scene.bright) return res.json(await setBright(req.params.deviceId, Number(scene.bright)))
  } catch (error) {
    console.error(error)
    return res.status(500).json({error: error.message})
  }
})

app.get('/cast', (req: express.Request, res: express.Response) => res.json(getCasts()))
app.post('/cast/:deviceId', async (req: express.Request, res: express.Response) => {
  try {
    return res.json(
      await cast(
        req.params.deviceId,
        req.body.media,
        DIR_PUBLIC + DIR_IMG,
        (req.headers.referer || req.headers.host + '/') + DIR_IMG,
      ),
    )
  } catch (error) {
    console.error(error)
    return res.status(500).json({error: error.message})
  }
})

app.delete('/cast/:deviceId', async (req: express.Request, res: express.Response) => {
  try {
    return res.json(await castStop(req.params.deviceId))
  } catch (error) {
    console.error(error)
    return res.status(500).json({error: error.message})
  }
})

app.use(express.static(DIR_PUBLIC))
app.use('/fonts', express.static(DIR_FONTS))
app.get('/musics', async (req: express.Request, res: express.Response) =>
  res.json(await readDir(DIR_PUBLIC + DIR_MUSIC, DIR_MUSIC)),
)

const readDir = async (path: string, prefix: string) => {
  const result = []
  for (const file of await fs.readdir(path)) {
    if ((await fs.lstat(path + file)).isDirectory())
      result.push.apply(result, await readDir(path + file + '/', prefix + file + '/'))
    else result.push(prefix + file)
  }
  return result
}

app.get('/images', async (req: express.Request, res: express.Response) =>
  res.json(await readDir(DIR_PUBLIC + DIR_IMG, DIR_IMG)),
)
app.listen(PORT, () => console.log(`Listening on port ${PORT}...`))

initLookup()
