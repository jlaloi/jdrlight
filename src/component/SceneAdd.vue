<template>
  <div id="sceneAdd">
    <ApolloMutation :mutation="addScene" :variables="{name}" :update="update" @done="onDone">
      <template slot-scope="{ mutate, loading, error }">
        <div v-if="loading">Loading</div>
        <input v-model="name" :disabled="loading" type="text" placeholder="Scene name">
        <button :disabled="loading || !name" @click="mutate()">Add scene</button>
        <p v-if="error">An error occured: {{ error }}</p>
      </template>
    </ApolloMutation>
  </div>
</template>

<script>
import { CREATE_SCENE, ALL_SCENES } from '../config/graph.js';

export default {
  name: 'SceneAdd',
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
      const data = proxy.readQuery({ query: ALL_SCENES });
      data.allScenes.push(createScene);
      proxy.writeQuery({ query: ALL_SCENES, data });
    }
  }
};
</script>

<style lang="scss" scoped>
#sceneAdd {
  width: 100%;
}
</style>
