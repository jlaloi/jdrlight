<template>
  <div id="sceneAdd">
    <ApolloMutation
      :mutation="addScene"
      :variables="{name, scenarioId}"
      :update="update"
      @done="onDone"
    >
      <template slot-scope="{ mutate, loading, error }">
        <div v-if="loading">Loading</div>
        <input v-model="name" :disabled="loading" type="text" placeholder="Scene name">
        <button :disabled="loading || !name" @click="mutate()">Add</button>
        <p v-if="error">An error occured: {{ error }}</p>
      </template>
    </ApolloMutation>
  </div>
</template>

<script>
import { CREATE_SCENE, GET_SCENES } from '../config/graph.js';

export default {
  name: 'SceneAdd',
  props: ['scenarioId'],
  data() {
    return {
      name: undefined,
      addScene: CREATE_SCENE
    };
  },
  methods: {
    onDone() {
      this.name = undefined;
    },
    update(
      proxy,
      {
        data: { createScene }
      }
    ) {
      const query = {
        query: GET_SCENES,
        variables: {
          scenario: createScene.scenario.id
        }
      };
      const data = proxy.readQuery(query);
      data.allScenes.push(createScene);
      proxy.writeQuery({ ...query, data });
    }
  }
};
</script>

<style lang="scss" scoped>
#sceneAdd {
  width: 100%;
}
</style>
