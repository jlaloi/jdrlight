<template>
  <div id="scene" v-bind:class="{dragStart: isDragStart, dragEnter: isDragEnter}">
    <ApolloMutation
      :mutation="updateScene"
      :variables="{id: scene.id, name, music, order: Number(order)}"
      :update="update"
    >
      <template slot-scope="{mutate, loading, error}">
        <div v-if="loading">Loading</div>
        <div v-else>
          <input v-model="name" type="text" placeholder="Scene name" class="sceneName" />
          <input v-model="order" type="number" placeholder="Order" class="sceneOrder" />
          <!-- Actions -->
          <div class="actions">
            <i title="Save" v-if="!loading" class="material-icons clickable" :class="{unsaved}" @click="mutate()"
              >save</i
            >
            <i
              title="Change order (drag to other drag icon)"
              class="material-icons draggable"
              height="40px"
              draggable="true"
              v-on:dragstart="dragStart($event)"
              v-on:drop="dragDrop($event)"
              v-on:dragend="dragEnd()"
              v-on:dragenter="dragEnter()"
              v-on:dragleave="dragLeave()"
              v-on:dragover="dragOver()"
              >open_with</i
            >
            <i title="Duplicate" class="material-icons clickable" @click="duplicate()">content_copy</i>
            <i
              title="Delete"
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
            <i class="material-icons logo" title="Audio">music_note</i>
            <audio-player ref="audioPlayer" v-if="music" :key="music" config="true" :music="music"></audio-player>
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
import audioPlayer from './audioPlayer'
import lights from './lights'
import casts from './casts'
import {UPDATE_SCENE, DELETE_SCENE, GET_SCENES} from '../config/graph'
import {duplicateScene, updateSceneOrder} from '../config/duplicate'

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
      order: 0,
      music: undefined,
      deleteLoading: false,
      deleteError: undefined,
      isDragStart: false,
      isDragEnter: false,
    }
  },
  computed: {
    lightsSorted() {
      return this.$store.state.lights.slice(0).sort()
    },
    sceneLights() {
      return this.scene.lights.slice(0).sort((a, b) => a.deviceId - b.deviceId)
    },
    unsaved() {
      return this.name !== this.scene.name || this.music != this.scene.music || this.order != this.scene.order
    },
  },
  mounted() {
    this.reset()
  },
  methods: {
    reset() {
      ;({name: this.name, music: this.music, order: this.order} = this.scene)
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
      }
      const data = proxy.readQuery(query)
      const sceneIndex = data.allScenes.findIndex(s => s.id === this.scene.id)
      data.allScenes[sceneIndex] = updateScene
      data.allScenes.sort((a, b) => a.order - b.order)
      proxy.writeQuery({...query, data})
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
      }
      const {allScenes} = store.readQuery(query)
      store.writeQuery({
        ...query,
        data: {
          allScenes: allScenes.filter(s => s.id !== deleteScene.id),
        },
      })
    },
    delScene() {
      this.deleteLoading = true
      this.deleteError = undefined
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
          this.deleteLoading = false
        })
    },
    confirm(msg) {
      return window.confirm(msg)
    },
    async duplicate() {
      await duplicateScene.bind(this)(this.scene)
    },
    dragStart(event) {
      const payload = JSON.stringify({id: this.scene.id, order: this.scene.order})
      event.dataTransfer.setData('scene', payload)
      this.isDragStart = true
    },
    async dragDrop(event) {
      event.preventDefault()
      this.isDragEnter = false
      const {id, order} = JSON.parse(event.dataTransfer.getData('scene'))
      if (id === this.scene.id) return
      const newOrder = this.scene.order < order ? this.scene.order - 1 : this.scene.order + 1
      await updateSceneOrder.bind(this)(id, newOrder)
    },
    dragEnd() {
      this.isDragStart = false
    },
    dragEnter() {
      this.isDragEnter = true
    },
    dragLeave() {
      this.isDragEnter = false
    },
    dragOver() {
      event.preventDefault()
    },
  },
  watch: {
    'scene.order'() {
      this.order = this.scene.order
      // YT BUG...
      if (this.scene.music && this.$refs.audioPlayer) this.$refs.audioPlayer.forceRefresh()
    },
  },
}
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
    margin: 0;
    width: 7em;
    display: inline-block;
  }
  .sceneName {
    width: 10em;
    font-weight: bold;
    text-align: center;
  }
  .sceneOrder {
    width: 3em;
    margin: 0;
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
      width: 6em;
    }
  }
}
</style>
