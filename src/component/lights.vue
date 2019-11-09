<template>
  <div id="lights">
    <!-- Add Light -->
    <div v-if="loading">Loading</div>
    <select v-if="!loading" v-model="selectedLight" :disabled="loading || lightsSorted.length === 0" @change="onChange">
      <option />
      <option v-for="(l, index) in lightsSorted" :key="index" :value="l">{{ l.name || l.deviceId }}</option>
    </select>
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
<style lang="scss" scoped>
@import '../styles/config';
#lights {
  border-top: $border;
  max-width: 23em;
  select {
    margin: 0.5em auto 0.5em auto;
    width: 10em;
    display: block;
  }
}
</style>
