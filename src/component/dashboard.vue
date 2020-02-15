<template>
  <div id="dashboard">
    <div v-if="$apollo.loading">Loading..</div>
    <!-- Scenario list -->
    <select v-else v-model="scenario">
      <option />
      <option v-for="s in allScenarios" :key="s.id" :value="s">{{ s.name }}</option>
    </select>
    <!-- Scene list -->
    <div v-if="scenario">
      <scene-preview
        v-for="s in scenario.scenes"
        :key="s.id"
        :scene="s"
        :click="() => playScene(s)"
        class="clickable"
        :class="{selected: scene && scene.id === s.id}"
      ></scene-preview>
    </div>
    <!--Player(s) -->
    <audio-player
      v-if="music && scenario"
      :music="music"
      :on-playing="onMusicPlaying"
      volume-control="yes"
    ></audio-player>
    <effects v-if="scenario"></effects>
    <!-- Next Scene
    <scene-preview
      v-if="nextScene"
      :scene="nextScene"
      :click="() => playScene(nextScene)"
      class="nextScene clickable"
    ></scene-preview>-->
  </div>
</template>

<script>
import {ALL_DASHBOARD} from '../config/graph'
import HTTP from '../config/http'
import audioPlayer from './audioPlayer'
import scenePreview from './scenePreview'
import effects from './effects'

export default {
  name: 'Dashboard',
  components: {
    audioPlayer,
    scenePreview,
    effects,
  },
  data() {
    return {
      allScenarios: [],
      scenario: undefined,
      music: undefined,
      scene: undefined,
    }
  },
  computed: {
    nextScene() {
      if (!this.scenario || !this.scenario.scenes.length) return
      if (!this.scene) return this.scenario.scenes[0]
      const sceneIndex = this.scenario.scenes.findIndex(s => s.id === this.scene.id)
      if (sceneIndex + 1 < this.scenario.scenes.length) return this.scenario.scenes[sceneIndex + 1]
      return null
    },
  },
  methods: {
    playScene(scene) {
      this.scene = scene
      if (!this.scene.music || this.scene.music === this.music) this.updateLight()
      this.music = this.scene.music
      this.updateCast()
    },
    async updateLight() {
      for (let i = 0; i < this.scene.lights.length; i++)
        await HTTP.post(`/light/${this.scene.lights[i].deviceId}`, this.scene.lights[i])
    },
    updateCast() {
      this.scene.casts.forEach(cast => HTTP.post(`/cast/${cast.deviceId}`, {media: cast.media}))
    },
    onMusicPlaying() {
      this.updateLight()
    },
  },
  apollo: {
    allScenarios: {
      query: ALL_DASHBOARD,
      fetchPolicy: 'network-only',
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../styles/config';
#dashboard {
  text-align: center;
  .nextScene {
    margin: 0 auto;
    bottom: 0;
    left: 0;
    width: 100%;
    position: fixed;
  }
  .selected {
    background-color: $colorSelected;
  }
}
</style>
