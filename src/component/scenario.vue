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
  </div>
</template>

<script>
import {GET_SCENARIO, UPDATE_SCENARIO} from '../config/graph'
import scenes from './scenes'

export default {
  name: 'Scenario',
  components: {
    scenes,
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
