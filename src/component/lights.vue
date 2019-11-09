<template>
  <div id="ligths" class="deviceList">
    <!-- Add Light -->
    <div v-if="loading">Loading</div>
    <div v-else class="list">
      <select v-model="selectedLight" :disabled="loading || lightsSorted.length === 0" @change="onChange">
        <option />
        <option v-for="(l, index) in lightsSorted" :key="index" :value="l">{{ l.name || l.deviceId }}</option>
      </select>
      <i class="material-icons">lightbulb_outline</i>
    </div>
    <p v-if="error">An error occured: {{ error }}</p>
    <!-- Light  List -->
    <light v-for="l in allLights" :key="l.id" :light="l"></light>
  </div>
</template>

<script>
import {createLight} from '../config/duplicate'
import {GET_LIGHTS} from '../config/graph'
import light from './light'

export default {
  name: 'Lights',
  components: {
    light,
  },
  props: ['sceneId'],
  data() {
    return {
      allLights: [],
      selectedLight: {},
      loading: false,
      error: undefined,
    }
  },
  computed: {
    lightsSorted() {
      return this.$store.state.lights.filter(l => !this.allLights.find(sl => sl.deviceId === l.deviceId))
    },
  },
  methods: {
    async create() {
      await createLight.bind(this)(this.sceneId, this.selectedLight.deviceId, 'ON', 100, [255, 255, 255])
      this.selectedLight = {}
    },
    onChange() {
      setTimeout(() => this.selectedLight && this.create(), 100)
    },
  },
  apollo: {
    allLights: {
      query: GET_LIGHTS,
      variables() {
        return {
          sceneId: this.sceneId,
        }
      },
    },
  },
}
</script>
