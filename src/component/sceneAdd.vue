<template>
  <div id="sceneAdd">
    <div v-if="loading">Loading</div>
    <input v-model="name" :disabled="loading" type="text" placeholder="Scene name" />
    <button :disabled="loading || !name" @click="createScene()">Add</button>
    <p v-if="error">An error occured: {{ error }}</p>
  </div>
</template>

<script>
import {CREATE_SCENE, GET_SCENES} from '../config/graph.js';

export default {
  name: 'SceneAdd',
  props: ['scenarioId'],
  data() {
    return {
      loading: false,
      name: undefined,
      error: undefined,
      addScene: CREATE_SCENE
    };
  },
  methods: {
    createScene() {
      this.loading = true;
      this.error = undefined;
      this.$apollo
        .mutate({
          mutation: CREATE_SCENE,
          variables: {
            name: this.name,
            scenarioId: this.scenarioId
          },
          update(
            proxy,
            {
              data: {createScene}
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
            proxy.writeQuery({...query, data});
          }
        })
        .catch(error => (this.error = error))
        .then(() => {
          this.loading = false;
          this.name = undefined;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
#sceneAdd {
  width: 100%;
}
</style>
