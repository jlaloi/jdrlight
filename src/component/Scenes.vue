<template>
  <div id="scenes">
    <scene-add v-if="!$apollo.loading"></scene-add>
    <div v-if="$apollo.loading">Loading..</div>
    <scene v-for="s in allScenes" v-else :key="s.id" :scene="s"></scene>
  </div>
</template>

<script>
import scene from './Scene';
import sceneAdd from './SceneAdd';
import { ALL_SCENES } from '../config/graph.js';

export default {
  name: 'Scenes',
  components: {
    scene,
    sceneAdd
  },
  data() {
    return {
      allScenes: []
    };
  },
  methods: {
    refetch() {
      this.$apollo.queries.allScenes.refetch();
    }
  },
  apollo: {
    allScenes: {
      query: ALL_SCENES
    }
  }
};
</script>
