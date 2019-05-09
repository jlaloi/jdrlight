<template>
  <div id="sceneDelete">
    <ApolloMutation :mutation="deleteScene" :variables="{id: scene.id}" :update="update">
      <template slot-scope="{ mutate, loading, error }">
        <div v-if="loading">Loading</div>
        <button else :disabled="loading" @click="mutate()">Delete Scene</button>
        <p v-if="error">An error occured: {{ error }}</p>
      </template>
    </ApolloMutation>
  </div>
</template>

<script>
import { DELETE_SCENE, GET_SCENES } from '../config/graph.js';

export default {
  name: 'SceneDelete',
  props: ['scene'],
  data() {
    return {
      deleteScene: DELETE_SCENE
    };
  },
  methods: {
    update(
      store,
      {
        data: { deleteScene }
      }
    ) {
      const query = {
        query: GET_SCENES,
        variables: {
          scenario: this.scene.scenario.id
        }
      };
      const { allScenes } = store.readQuery(query);
      store.writeQuery({
        ...query,
        data: {
          allScenes: allScenes.filter(s => s.id !== deleteScene.id)
        }
      });
      
    }
  }
};
</script>

<style lang="scss">
#sceneAdd {
  display: inline-block;
}
</style>
