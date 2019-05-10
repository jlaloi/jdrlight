<template>
  <div id="dashboard">
    <div v-if="$apollo.loading">Loading..</div>
    <!-- Scenario list -->
    <select v-else v-model="scenario">
      <option/>
      <option v-for="s in allScenarios" :key="s.id" :value="s">{{s.name}}</option>
    </select>
    <!-- Scene list -->
    <div v-if="scenario">
      <a v-for="s in scenario.scenes" :key="s.id" @click="playScene(s)">{{ s.name }}</a>
    </div>
    <!--Player(s) -->
    <audio-player
      v-if="scene.music"
      :key="scene.music"
      :music="scene.music"
      :on-playing="onMusicPlaying"
    ></audio-player>
  </div>
</template>

<script>
import {ALL_DASHBOARD} from '../config/graph.js';
import HTTP from '../config/http';
import audioPlayer from './audioPlayer';

export default {
  name: 'Dashboard',
  components: {
    audioPlayer
  },
  data() {
    return {
      allScenarios: [],
      scenario: undefined,
      scene: {}
    };
  },
  methods: {
    playScene(scene) {
      this.scene = scene;
      if (!this.scene.music) this.updateLight();
    },
    async updateLight() {
      for (let i = 0; i < this.scene.lights.length; i++)
        await HTTP.post(`/light/${this.scene.lights[i].deviceId}`, this.scene.lights[i]);
    },
    onMusicPlaying() {
      this.updateLight();
    }
  },
  apollo: {
    allScenarios: {
      query: ALL_DASHBOARD,
      fetchPolicy: 'network-only'
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../styles/config';
#dashboard {
  text-align: center;
  a {
    text-decoration: none;
    cursor: pointer;
    border: $border;
    background-color: $bg2;
    color: #eee;
    font-weight: bold;
    border-radius: 2px;
    width: 10em;
    height: 3em;
    line-height: 3em;
    text-align: center;
    display: inline-block;
    margin: 0.5em;
  }
  a:hover {
    background-color: #111;
  }
}
</style>
