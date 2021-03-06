<template>
  <div id="cast">
    <p>{{ cast.deviceId }}</p>
    <!-- Fields -->
    <ApolloMutation :mutation="updateCast" :variables="{id: cast.id, media}" :update="update">
      <template slot-scope="{mutate, loading, error}">
        <!-- Media -->
        <select v-model="image" @change="imageSelected()">
          <option :value="null" />
          <option v-for="(l, index) in imagesSorted" :key="index" :value="serverUrl + l">{{ l }}</option>
        </select>
        <input v-model="media" type="text" placeholder="url" />
        <!-- Actions -->
        <div class="actions">
          <!-- Preview -->
          <a v-if="media" :href="media" :title="media" target="_blank">
            <img :src="media" />
          </a>
          <i v-else class="material-icons warning" title="OFF">cast_off</i>
          <i class="material-icons clickable" :class="{rotating: testLoading}" @click="testCast()"
            >play_circle_outline</i
          >
          <div v-if="loading || deleteLoading">Loading</div>
          <i v-else class="material-icons clickable" :class="{unsaved}" @click="mutate()">save</i>
          <i
            v-if="!deleteLoading"
            class="material-icons clickable"
            @click="confirm(`Delete ${cast.deviceId}?`) && delCast()"
            >delete</i
          >
        </div>
        <p v-if="error || deleteError">An error occured: {{ error || deleteError }}</p>
      </template>
    </ApolloMutation>
  </div>
</template>

<script>
import HTTP from '../config/http'
import {DELETE_CAST, UPDATE_CAST, GET_CASTS} from '../config/graph'
import {serverUrl} from '../config/router'

export default {
  name: 'Cast',
  props: ['cast'],
  data() {
    return {
      serverUrl,
      deleteCast: DELETE_CAST,
      updateCast: UPDATE_CAST,
      image: undefined,
      media: undefined,
      query: {
        query: GET_CASTS,
        variables: {
          sceneId: this.cast.scene.id,
        },
      },
      deleteLoading: false,
      deleteError: undefined,
      testLoading: false,
    }
  },
  computed: {
    getConfig() {
      return {
        media: this.media,
      }
    },
    unsaved() {
      return this.media !== this.cast.media
    },
    imagesSorted() {
      return this.$store.state.images.slice(0).sort()
    },
  },
  mounted() {
    this.reset()
  },
  methods: {
    async testCast() {
      this.testLoading = true
      try {
        const {
          body: {result: mediaCasted},
        } = await HTTP.post(`/cast/${this.cast.deviceId}`, this.getConfig)
        if (mediaCasted !== this.media) {
          this.media = mediaCasted
          this.$store.dispatch('fetchImages')
        }
      } catch (error) {
        console.error(error)
      }
      this.testLoading = false
    },
    update(proxy, {data: {updateCast}}) {
      const data = proxy.readQuery(this.query)
      const castIndex = data.allCasts.findIndex(l => l.id == this.cast.id)
      data.allCasts[castIndex] = updateCast
      proxy.writeQuery({...this.query, data})
    },
    updateDelete(proxy, {data: {deleteCast}}) {
      const data = proxy.readQuery(this.query)
      proxy.writeQuery({
        ...this.query,
        data: {
          allCasts: data.allCasts.filter(s => s.id !== deleteCast.id),
        },
      })
    },
    delCast() {
      this.deleteLoading = true
      this.deleteError = undefined
      this.$apollo
        .mutate({
          mutation: DELETE_CAST,
          variables: {
            id: this.cast.id,
          },
          update: this.updateDelete,
        })
        .catch(error => (this.deleteError = error))
        .then(() => {
          this.deleteLoading = false
        })
    },
    reset() {
      this.media = this.cast.media
    },
    imageSelected() {
      this.media = this.image
      this.image = undefined
    },
    confirm(msg) {
      return window.confirm(msg)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../styles/config';
#cast {
  p {
    margin: 0;
    font-weight: bold;
  }
  border: $border;
  border-radius: 2px;
  display: inline-block;
  text-align: center;
  margin: 0.25em;
  padding: 0.25em;
  width: 9.5em;
  input,
  select {
    display: inline-block;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 0;
  }
  input {
    width: 7em;
  }
  select {
    width: 1.75em;
  }
  .actions {
    display: inline-block;
    padding-top: 0.2em;
    text-align: center;
    margin-top: 0.25em;
    margin: 0;
    vertical-align: middle;
    a {
      vertical-align: middle;
      width: 2em;
      height: 1em;
      display: inline-block;
      text-align: left;
      img {
        display: inline-block;
        position: absolute;
        height: 1em;
        border: $border;
        border-radius: 2px;
      }
      img:hover {
        height: 10em;
      }
    }
  }
}
</style>
