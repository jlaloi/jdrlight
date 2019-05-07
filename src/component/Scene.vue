<template>
  <div id="scene">
    <ApolloMutation
      :mutation="updateScene"
      :variables="{id: scene.id, name: scene.name, music: scene.music}"
      :update="update"
    >
      <template slot-scope="{ mutate, loading, error }">
        <div v-if="loading">Loading</div>
        <div v-else>
          <input v-model="scene.name" type="text" placeholder="Scene name" class="sceneName">
          <!-- AUDIO -->
          <select v-model="scene.music">
            <option/>
            <option v-for="(m, index) in $store.state.musics" :key="index">{{ m }}</option>
          </select>
          <audio-player v-if="scene.music" config="true" :music="scene.music"></audio-player>
          <!-- LIGHTS -->
          <lights :scene="scene"></lights>
          <!-- ACTIONS -->
          <button @click="mutate()">Save scene</button>
          <scene-delete :scene="scene"></scene-delete>
        </div>
        <p v-if="error">An error occured: {{ error }}</p>
      </template>
    </ApolloMutation>
  </div>
</template>

<script>
import audioPlayer from './AudioPlayer';
import sceneDelete from './SceneDelete';
import lights from './Lights';
import { UPDATE_SCENE, ALL_SCENES } from '../config/graph';

export default {
  name: 'Scene',
  components: {
    audioPlayer,
    sceneDelete,
    lights
  },
  props: ['scene'],
  data() {
    return {
      updateScene: UPDATE_SCENE
    };
  },
  computed: {
    lightsSorted() {
      return this.$store.state.lights.slice(0).sort();
    },
    sceneLights() {
      return this.scene.lights.slice(0).sort((a, b) => a.deviceId - b.deviceId);
    }
  },
  methods: {
    update(
      proxy,
      {
        data: { updateScene }
      }
    ) {
      const data = proxy.readQuery({ query: ALL_SCENES });
      const sceneIndex = data.allScenes.findIndex(s => s.id === this.scene.id);
      Object.assign(data.allScenes[sceneIndex], updateScene);
      proxy.writeQuery({ query: ALL_SCENES, data });
    }
  }
};
</script>

<style lang="scss" scsoped>
@import '../styles/config';
#scene {
  border: $border;
  border-radius: 2px;
  display: inline-block;
  margin: 0.25em;
  vertical-align: top;
  input,
  button,
  select {
    display: block;
    width: 25em;
    font-size: 1em;
  }
  .sceneName {
    font-weight: bold;
    text-align: center;
  }
}
</style>
