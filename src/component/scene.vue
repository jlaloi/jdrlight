<template>
  <div id="scene">
    <ApolloMutation :mutation="updateScene" :variables="{id: scene.id, name, music}" :update="update">
      <template slot-scope="{mutate, loading, error}">
        <div v-if="loading">Loading</div>
        <div v-else>
          <input v-model="name" type="text" placeholder="Scene name" class="sceneName" />
          <!-- Actions -->
          <div class="actions">
            <i v-if="!loading" class="material-icons clickable" :class="{unsaved}" @click="mutate()">save</i>
            <i
              v-if="!deleteLoading"
              class="material-icons clickable"
              @click="confirm(`Delete ${scene.name}?`) && delScene()"
              >delete</i
            >
          </div>
          <!-- Audio -->
          <div class="audio">
            <select v-model="music">
              <option />
              <option v-for="(m, index) in $store.state.musics" :key="index">{{ m }}</option>
            </select>
            <input v-model="music" type="text" placeholder="YT id / URL" />
            <audio-player v-if="music" :key="music" config="true" :music="music"></audio-player>
          </div>
          <!-- Casts -->
          <casts :scene-id="scene.id"></casts>
          <!-- Lights -->
          <lights :scene-id="scene.id"></lights>
        </div>
        <p v-if="error || deleteError">An error occured: {{ error || deleteError }}</p>
      </template>
    </ApolloMutation>
  </div>
</template>

<script>
import audioPlayer from './audioPlayer';
import lights from './lights';
import casts from './casts';
import {UPDATE_SCENE, DELETE_SCENE, GET_SCENES} from '../config/graph';

export default {
  name: 'Scene',
  components: {
    audioPlayer,
    lights,
    casts,
  },
  props: ['scene'],
  data() {
    return {
      updateScene: UPDATE_SCENE,
      name: undefined,
      music: undefined,
      deleteLoading: false,
      deleteError: undefined,
    };
  },
  computed: {
    lightsSorted() {
      return this.$store.state.lights.slice(0).sort();
    },
    sceneLights() {
      return this.scene.lights.slice(0).sort((a, b) => a.deviceId - b.deviceId);
    },
    unsaved() {
      return this.name !== this.scene.name || this.music != this.scene.music;
    },
  },
  mounted() {
    this.reset();
  },
  methods: {
    reset() {
      ({name: this.name, music: this.music} = this.scene);
    },
    update(
      proxy,
      {
        data: {updateScene},
      },
    ) {
      const query = {
        query: GET_SCENES,
        variables: {
          scenario: updateScene.scenario.id,
        },
      };
      const data = proxy.readQuery(query);
      const sceneIndex = data.allScenes.findIndex(s => s.id === this.scene.id);
      data.allScenes[sceneIndex] = updateScene;
      proxy.writeQuery({...query, data});
    },
    updateDelete(
      store,
      {
        data: {deleteScene},
      },
    ) {
      const query = {
        query: GET_SCENES,
        variables: {
          scenario: this.scene.scenario.id,
        },
      };
      const {allScenes} = store.readQuery(query);
      store.writeQuery({
        ...query,
        data: {
          allScenes: allScenes.filter(s => s.id !== deleteScene.id),
        },
      });
    },
    delScene() {
      this.deleteLoading = true;
      this.deleteError = undefined;
      this.$apollo
        .mutate({
          mutation: DELETE_SCENE,
          variables: {
            id: this.scene.id,
          },
          update: this.updateDelete,
        })
        .catch(error => (this.deleteError = error))
        .then(() => {
          this.deleteLoading = false;
        });
    },
    confirm(msg) {
      return window.confirm(msg);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../styles/config';
#scene {
  border: $border;
  border-radius: 2px;
  display: inline-block;
  margin: 0.25em;
  padding: 0.25em;
  vertical-align: top;
  text-align: center;
  input,
  button,
  select {
    font-size: 1em;
  }
  button {
    display: inline-block;
    width: 10em;
  }
  input {
    width: 16.5em;
  }
  .actions {
    width: 4em;
    display: inline-block;
  }
  .sceneName {
    font-weight: bold;
    text-align: center;
  }
  .audio {
    margin: 0;
    padding: 0;
    input,
    select {
      display: inline-block;
      margin: 0.25em;
    }
    input {
      width: 12.5em;
    }
    select {
      width: 7.5em;
    }
  }
}
</style>
