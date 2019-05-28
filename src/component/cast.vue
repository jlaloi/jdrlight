<template>
  <div id="cast">
    <p>
      {{ cast.deviceId }}
      <a v-if="media" :href="media" :title="media" target="_blank">
        <img :src="media">
      </a>
    </p>
    <!-- Fields -->
    <ApolloMutation :mutation="updateCast" :variables="{id: cast.id, media}" :update="update">
      <template slot-scope="{mutate, loading, error}">
        <!-- Media -->
        <select v-model="image" @change="media = image; image = undefined">
          <option/>
          <option v-for="(l, index) in imagesSorted" :key="index" :value="serverUrl + l">{{ l }}</option>
        </select>
        <input v-model="media" type="text" placeholder="url">
        <!-- Actions -->
        <button id="test" @click="testCast">Test</button>
        <div v-if="loading">Loading</div>
        <button v-else :class="{unsaved}" @click="mutate()">Save</button>
        <p v-if="error">An error occured: {{ error }}</p>
      </template>
    </ApolloMutation>
    <!-- Action Delete -->
    <ApolloMutation :mutation="deleteCast" :variables="{id: cast.id}" :update="updateDelete">
      <template slot-scope="{mutate, loading, error}">
        <button :disabled="loading" @click="mutate()">Delete</button>
        <p v-if="error">An error occured: {{ error }}</p>
      </template>
    </ApolloMutation>
  </div>
</template>

<script>
import HTTP from '../config/http';
import {DELETE_CAST, UPDATE_CAST, GET_CASTS} from '../config/graph.js';
import {serverUrl} from '../config/router.js';

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
          sceneId: this.cast.scene.id
        }
      }
    };
  },
  computed: {
    getConfig() {
      return {
        media: this.media
      };
    },
    unsaved() {
      return this.media !== this.cast.media;
    },
    imagesSorted() {
      return this.$store.state.images.slice(0).sort();
    }
  },
  mounted() {
    this.reset();
  },
  methods: {
    async testCast() {
      await HTTP.post(`/cast/${this.cast.deviceId}`, this.getConfig);
    },
    update(
      proxy,
      {
        data: {updateCast}
      }
    ) {
      const data = proxy.readQuery(this.query);
      const castIndex = data.allCasts.findIndex(l => l.id == this.cast.id);
      data.allCasts[castIndex] = updateCast;
      proxy.writeQuery({...this.query, data});
    },
    updateDelete(
      proxy,
      {
        data: {deleteCast}
      }
    ) {
      const data = proxy.readQuery(this.query);
      proxy.writeQuery({
        ...this.query,
        data: {
          allCasts: data.allCasts.filter(s => s.id !== deleteCast.id)
        }
      });
    },
    reset() {
      this.media = this.cast.media;
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../styles/config';
#cast {
  img {
    max-width: 3em;
    max-height: 2em;
    border-radius: 2px;
    margin-left: 0.25em;
  }
  border: $border;
  border-radius: 2px;
  display: inline-block;
  text-align: center;
  margin: 0.25em;
  padding: 0.25em;
  width: 10em;
  input,
  button,
  select {
    width: 9em;
    display: inline-block;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 0;
  }
  button {
    width: 4.35em;
    display: inline-block;
  }
}
</style>
