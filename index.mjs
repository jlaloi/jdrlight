import Express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';

import fs from 'fs';
import {getLights, setBright, setPower, setRGB, initLookUpLight} from './light';
import {getCasts, castImage, castStop, initLookUpCast} from './cast';

const PORT = 9090;
const DIR_PUBLIC = 'public/';
const DIR_MUSIC = 'music/';
const DIR_IMG = 'image/';
const DIR_FONTS = 'node_modules/material-design-icons/iconfont';

const initLookup = () => {
  initLookUpLight();
  initLookUpCast();
};

const app = Express();
app.use(compression({filter: () => true}));
app.use(bodyParser.json());

app.get('/lookup', (req, res) => {
  initLookup();
  res.json({
    result: 'ok'
  });
});

app.get('/light', (req, res) => res.json(getLights()));
app.post('/light/:deviceId', async (req, res) => {
  try {
    const scene = req.body;
    console.log('scene', scene);
    if (scene.power) await setPower(req.params.deviceId, scene.power);
    if (scene.rgb) await setRGB(req.params.deviceId, scene.rgb);
    if (scene.bright) await setBright(req.params.deviceId, Number(scene.bright));
    res.json({
      result: 'ok'
    });
  } catch (error) {
    console.log(error);
    res.json(error);
  }
});

app.get('/cast', (req, res) => res.json(getCasts()));
app.post('/cast/:deviceId', async (req, res) => {
  try {
    res.json(
      await castImage(
        req.params.deviceId,
        {
          url: req.body.media,
          contentType: req.body.contentType || 'image/jpeg'
        },
        DIR_PUBLIC + DIR_IMG,
        (req.headers.referer || (req.headers.host + '/'))  + DIR_IMG
      )
    );
  } catch (error) {
    console.log(error);
    res.json(error);
  }
});

app.delete('/cast/:deviceId', async (req, res) => {
  try {
    res.json(await castStop(req.params.deviceId));
  } catch (error) {
    console.log(error);
    res.json(error);
  }
});

app.use(Express.static(DIR_PUBLIC));
app.use('/fonts', Express.static(DIR_FONTS));
app.get('/musics', (req, res) =>
  fs.readdir(DIR_PUBLIC + DIR_MUSIC, (err, files) => res.json(files.map(f => DIR_MUSIC + f)))
);

app.get('/images', (req, res) =>
  fs.readdir(DIR_PUBLIC + DIR_IMG, (err, files) => res.json(files.map(f => DIR_IMG + f)))
);

app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));

initLookup();
