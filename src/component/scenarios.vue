<template>
  <div id="scenarios">
    <!-- Create -->
    <ApolloMutation :mutation="createScenario" :variables="{name}" :update="updateCreate" @done="onDone">
      <template slot-scope="{mutate, loading, error}">
        <div v-if="loading">Loading</div>
        <input v-model="name" :disabled="loading" type="text" placeholder="Scenario name" />
        <button :disabled="loading || !name" @click="mutate()">Create</button>
        <p v-if="error">An error occured: {{ error }}</p>
      </template>
    </ApolloMutation>
    <!-- List All -->
    <ul>
      <li v-for="s in allScenarios" :key="s.id">
        <!-- Detail -->
        <router-link :to="{name: 'scenario', params: {id: s.id}}">{{ s.name }}</router-link>
        <!-- Delete -->
        <ApolloMutation :mutation="deleteScenario" :variables="{id: s.id}" :update="updateDelete">
          <template slot-scope="{mutate, loading, error}">
            <div v-if="loading">Loading</div>
            <i v-else class="material-icons clickable" @click="confirm(`Delete ${s.name}?`) && mutate()">delete</i>
            <p v-if="error">An error occured: {{ error }}</p>
          </template>
        </ApolloMutation>
      </li>
    </ul>
  </div>
</template>

<script>
import {ALL_SCENARIOS, CREATE_SCENARIO, DELETE_SCENARIO} from '../config/graph'

export default {
  name: 'Scenarios',
  data() {
    return {
      name: undefined,
      allScenarios: [],
      createScenario: CREATE_SCENARIO,
      deleteScenario: DELETE_SCENARIO,
    }
  },
  methods: {
    confirm(msg) {
      return window.confirm(msg)
    },
    onDone() {
      this.name = undefined
    },
    updateCreate(proxy, {data: {createScenario}}) {
      const data = proxy.readQuery({query: ALL_SCENARIOS})
      data.allScenarios.push(createScenario)
      proxy.writeQuery({query: ALL_SCENARIOS, data})
    },
    updateDelete(store, {data: {deleteScenario}}) {
      const query = {query: ALL_SCENARIOS}
      const {allScenarios} = store.readQuery({query: ALL_SCENARIOS})
      store.writeQuery({
        ...query,
        data: {
          allScenarios: allScenarios.filter(s => s.id !== deleteScenario.id),
        },
      })
    },
  },
  apollo: {
    allScenarios: {
      query: ALL_SCENARIOS,
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../styles/config';
#scenarios {
  ul {
    width: 20em;
    margin-left: auto;
    margin-right: auto;
    text-align: left;
  }
  li {
    * {
      display: inline-block;
      text-decoration: none;
      color: $color2;
    }
    .clickable {
      margin-left: 0.25em;
      color: $colorError;
      font-size: 1.2em;
      vertical-align: bottom;
    }
  }
}
</style>
