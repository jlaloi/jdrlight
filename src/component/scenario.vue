<template>
  <div id="scenario">
    <div v-if="$apollo.loading">Loading {{ id }}..</div>
    <ApolloMutation v-else :mutation="updateScenario" :variables="{id, name}" @done="onDone">
      <template slot-scope="{mutate, loading, error}">
        <h1 @click="onDone">{{ Scenario.name }}</h1>
        <!--Name Edit -->
        <div v-if="toggleChangeName">
          <input v-model="name" :disabled="loading" type="text" placeholder="New scenario name" />
          <div v-if="loading">Loading...</div>
          <button v-else :disabled="!name" @click="mutate()">Save</button>
          <p v-if="error">An error occured: {{ error }}</p>
        </div>
      </template>
    </ApolloMutation>
    <!-- Scene List -->
    <scenes v-if="!$apollo.loading" :scenario-id="id"></scenes>
    <!---  Import / Export -->
    <import-export
      v-if="!$apollo.loading"
      :get-export="getExport"
      :export-name="Scenario.name"
      :on-import="importScenario"
    ></import-export>
  </div>
</template>

<script>
import {FULL_SCENARIO, GET_SCENARIO, UPDATE_SCENARIO} from '../config/graph'
import {importScene} from '../config/duplicate'
import scenes from './scenes'
import importExport from './importExport'

export default {
  name: 'Scenario',
  components: {
    scenes,
    importExport,
  },
  data() {
    return {
      toggleChangeName: false,
      name: undefined,
      updateScenario: UPDATE_SCENARIO,
    }
  },
  computed: {
    id() {
      return this.$route.params.id
    },
  },
  methods: {
    onDone() {
      this.toggleChangeName = !this.toggleChangeName
    },
    async getExport() {
      const {
        data: {Scenario},
      } = await this.$apollo.query({
        query: FULL_SCENARIO,
        variables: {
          id: this.id,
        },
        fetchPolicy: 'network-only',
      })
      return Scenario
    },
    async importScenario(data) {
      if (window.confirm(`Import ${data.scenes.length} scene(s)?`))
        for await (const scene of data.scenes) importScene.bind(this)(scene, this.Scenario.id)
    },
  },
  apollo: {
    Scenario: {
      query: GET_SCENARIO,
      variables() {
        return {
          id: this.id,
        }
      },
    },
  },
}
</script>

<style lang="scss" scoped>
#scenario {
  h1 {
    cursor: pointer;
  }
}
</style>
