<template>
  <div id="scenarios">
    <!-- CREATE -->
    <ApolloMutation
      :mutation="createScenario"
      :variables="{name}"
      :update="updateCreate"
      @done="onDone"
    >
      <template slot-scope="{ mutate, loading, error }">
        <div v-if="loading">Loading</div>
        <input v-model="name" :disabled="loading" type="text" placeholder="Scenario name">
        <button :disabled="loading || !name" @click="mutate()">Create</button>
        <p v-if="error">An error occured: {{ error }}</p>
      </template>
    </ApolloMutation>
    <!-- ALL -->
    <ul>
      <li v-for="s in allScenarios" :key="s.id">
        <!-- MOVE -->
        <router-link :to="{name: 'scenario', params: { id: s.id }}">{{s.name}}</router-link>
        <!-- DELETE -->
        <ApolloMutation :mutation="deleteScenario" :variables="{id: s.id}" :update="updateDelete">
          <template slot-scope="{ mutate, loading, error }">
            <div v-if="loading">Loading</div>
            <button else :disabled="loading" class="delete" @click="mutate()">X</button>
            <p v-if="error">An error occured: {{ error }}</p>
          </template>
        </ApolloMutation>
      </li>
    </ul>
  </div>
</template>

<script>
import {
  ALL_SCENARIOS,
  CREATE_SCENARIO,
  DELETE_SCENARIO
} from '../config/graph.js';

export default {
  name: 'Scenarios',
  data() {
    return {
      name: undefined,
      allScenarios: [],
      createScenario: CREATE_SCENARIO,
      deleteScenario: DELETE_SCENARIO
    };
  },
  methods: {
    onDone() {
      this.name = undefined;
    },
    updateCreate(
      proxy,
      {
        data: { createScenario }
      }
    ) {
      const data = proxy.readQuery({ query: ALL_SCENARIOS });
      data.allScenarios.push(createScenario);
      proxy.writeQuery({ query: ALL_SCENARIOS, data });
    },
    updateDelete(
      store,
      {
        data: { deleteScenario }
      }
    ) {
      const query = { query: ALL_SCENARIOS };
      const { allScenarios } = store.readQuery({ query: ALL_SCENARIOS });
      store.writeQuery({
        ...query,
        data: {
          allScenarios: allScenarios.filter(s => s.id !== deleteScenario.id)
        }
      });
    }
  },
  apollo: {
    allScenarios: {
      query: ALL_SCENARIOS
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../styles/config';
#scenarios {
  li {
    * {
      display: inline-block;
      text-decoration: none;
      color: $color2;
    }
    button {
      color: $colorError;
    }
  }
}
</style>
