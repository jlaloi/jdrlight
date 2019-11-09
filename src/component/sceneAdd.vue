<template>
  <div id="sceneAdd">
    <div v-if="loading">Loading</div>
    <input v-model="name" :disabled="loading" type="text" placeholder="Scene name" />
    <button :disabled="loading || !name" @click="create()">Add</button>
    <p v-if="error">An error occured: {{ error }}</p>
  </div>
</template>

<script>
import {GET_SCENES} from '../config/graph'
import {createScene} from '../config/duplicate'

export default {
  name: 'SceneAdd',
  props: ['scenarioId'],
  data() {
    return {
      loading: false,
      name: undefined,
      error: undefined,
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
  methods: {
    async create() {
      const order = 10 + this.allScenes.reduce((order, scene) => Math.max(order, scene.order), 0)
      await createScene.bind(this)(this.scenarioId, order, this.name)
      this.name = undefined
    },
  },
}
</script>

<style lang="scss" scoped>
#sceneAdd {
  width: 100%;
}
</style>
