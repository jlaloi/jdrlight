<template>
  <div id="dashboard">
    <div v-if="$apollo.loading">Loading..</div>
    <a v-for="s in allScenes" v-else :key="s.id" @click="playScene(s)">{{ s.name }}</a>
    <audio-player v-if="music" :key="music" :music="music"></audio-player>
  </div>
</template>

<script>
import { ALL_SCENES } from '../config/graph.js';
import HTTP from '../config/http';
import audioPlayer from './AudioPlayer';

export default {
  name: 'Dashboard',
  components: {
    audioPlayer
  },
  data() {
    return {
      allScenes: [],
      music: undefined
    };
  },
  methods: {
    async playScene(scene) {
      this.music = scene.music;
      for (let i = 0; i < scene.lights.length; i++)
        await HTTP.post(`/light/${scene.lights[i].deviceId}`, scene.lights[i]);
    }
  },
  apollo: {
    allScenes: {
      query: ALL_SCENES
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../styles/config';
a {
  text-decoration: none;
  cursor: pointer;
  border: $border;
  background-color: $bg2;
  color: #eee;
  font-weight: bold;
  border-radius: 2px;
  width: 10em;
  height: 10em;
  line-height: 10em;
  text-align: center;
  display: inline-block;
  margin: 0.5em;
}
a:hover {
  background-color: #111;
}
</style>
