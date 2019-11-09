<template>
  <div id="casts" class="deviceList">
    <!-- Add Cast -->
    <div v-if="loading">Loading</div>
    <div v-else class="list">
      <select v-model="selectedCast.deviceId" :disabled="loading || castsSorted.length === 0" @change="onChange">
        <option />
        <option v-for="(l, index) in castsSorted" :key="index" :value="l">{{ l }}</option>
      </select>
      <i class="material-icons">cast</i>
    </div>
    <p v-if="error">An error occured: {{ error }}</p>
    <!-- Cast List -->
    <cast v-for="c in allCasts" :key="c.id" :cast="c"></cast>
  </div>
</template>

<script>
import {CREATE_CAST, GET_CASTS} from '../config/graph'
import {createCast} from '../config/duplicate'
import cast from './cast'

export default {
  name: 'Casts',
  components: {
    cast,
  },
  props: ['sceneId'],
  data() {
    return {
      allCasts: [],
      selectedCast: {},
      createCast: CREATE_CAST,
      loading: false,
      error: undefined,
    }
  },
  computed: {
    castsSorted() {
      return this.$store.state.casts.filter(l => !this.allCasts.find(sl => sl.deviceId === l)).sort()
    },
  },
  methods: {
    async create() {
      await createCast.bind(this)(this.sceneId, this.selectedCast.deviceId)
      this.selectedCast = {}
    },
    onChange() {
      setTimeout(() => this.selectedCast.deviceId && this.create(), 100)
    },
  },
  apollo: {
    allCasts: {
      query: GET_CASTS,
      variables() {
        return {
          sceneId: this.sceneId,
        }
      },
    },
  },
}
</script>
