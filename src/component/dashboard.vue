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
    <audio-player v-if="music" :key="music" :music="music"></audio-player>
  </div>
</template>

<script>
import { ALL_DASHBOARD } from '../config/graph.js';
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
