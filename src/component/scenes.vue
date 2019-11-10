<template>
  <div id="scenes">
    <scene-add v-if="!$apollo.loading" :scenario-id="scenarioId"></scene-add>
    <div v-if="$apollo.loading">Loading..</div>
    <scene v-for="s in allScenes" v-else :key="s.id" :scene="s"></scene>
  </div>
</template>

<script>
import scene from './scene'
import sceneAdd from './sceneAdd'
import {GET_SCENES} from '../config/graph'

export default {
  name: 'Scenes',
  components: {
    scene,
    sceneAdd,
  },
  props: ['scenarioId'],
  data() {
    return {
      allScenes: [],
    }
  },
  apollo: {
    allScenes: {
      query: GET_SCENES,
      variables() {
        return {
          scenario: this.scenarioId,
        }
      },
    },
  },
  created() {
    this.$store.dispatch('fetchLights')
    this.$store.dispatch('fetchMusics')
    this.$store.dispatch('fetchCasts')
    this.$store.dispatch('fetchImages')
  },
}
</script>
