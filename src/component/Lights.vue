<template>
  <div id="lights">
    <ApolloMutation
      :mutation="createLight"
      :variables="{deviceId : selectedLight.deviceId, power:'ON', bright: 100, rgb:[255,255,255], sceneId: scene.id}"
      :update="update"
      @done="onDone"
    >
      <template slot-scope="{ mutate, loading, error }">
        <div v-if="loading">Loading</div>
        <select v-model="selectedLight" :disabled="loading || lightsSorted.length ===0">
          <option/>
          <option v-for="(l, index) in lightsSorted" :key="index" :value="l">{{ l.deviceId }}</option>
        </select>
        <button :disabled="!selectedLight.deviceId" @click="mutate()">Add light</button>
        <p v-if="error">An error occured: {{ error }}</p>
      </template>
    </ApolloMutation>
    <light v-for="l in scene.lights" :key="l.id" :light="l"></light>
  </div>
</template>

<script>
import { CREATE_LIGHT, ALL_SCENES } from '../config/graph.js';
import light from './Light';

export default {
  name: 'Lights',
  components: {
    light
  },
  props: ['scene'],
  data() {
    return {
      selectedLight: {},
      createLight: CREATE_LIGHT
    };
  },
  computed: {
    lightsSorted() {
      return this.$store.state.lights
        .filter(l => !this.scene.lights.find(sl => sl.deviceId === l.deviceId))
        .sort();
    }
  },
  methods: {
    onDone() {
      this.selectedLight = {};
    },
    update(
      proxy,
      {
        data: { createLight }
      }
    ) {
      const data = proxy.readQuery({ query: ALL_SCENES });
      data.allScenes
        .find(s => s.id === this.scene.id)
        .lights.push(createLight);
      proxy.writeQuery({ query: ALL_SCENES, data });
    }
  }
};
</script>
<style lang="scss" scoped>
#lights {
  select,
  button {
    width: 12em;
    display: inline-block;
  }
}
</style>
