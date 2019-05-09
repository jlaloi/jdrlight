import Express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';

import fs from 'fs';
import { getLights, setBright, setPower, setRGB } from './light';

const PORT = 9090;
const DIR_PUBLIC = 'public/';
const DIR_MUSIC = 'music/';

const app = Express();
app.use(compression({ filter: () => true }));
app.use(bodyParser.json());

app.get('/light', (req, res) => res.json(getLights()));
app.post('/light/:deviceId', async (req, res) => {
  const scene = req.body;
  console.log('scene', scene);
  if (scene.power) await setPower(req.params.deviceId, scene.power);
  if (scene.rgb) await setRGB(req.params.deviceId, scene.rgb);
  if (scene.bright) await setBright(req.params.deviceId, Number(scene.bright));
  res.json({
    result: 'ok'
  });
});

app.use(Express.static(DIR_PUBLIC));
app.get('/musics', (req, res) =>
  fs.readdir(DIR_PUBLIC + DIR_MUSIC, (err, files) =>
    res.json(files.map(f => DIR_MUSIC + f))
  )
);

app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
