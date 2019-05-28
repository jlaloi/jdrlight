<template>
  <div id="casts">
    <!-- Add Cast -->
    <ApolloMutation
      :mutation="createCast"
      :variables="{deviceId: selectedCast.deviceId, media: '', sceneId}"
      :update="update"
      @done="onDone"
    >
      <template slot-scope="{mutate, loading, error}">
        <div v-if="loading">Loading</div>
        <select v-model="selectedCast.deviceId" :disabled="loading || castsSorted.length === 0">
          <option/>
          <option v-for="(l, index) in castsSorted" :key="index" :value="l">{{ l }}</option>
        </select>
        <button :disabled="!selectedCast.deviceId" @click="mutate()">Add cast to scene</button>
        <p v-if="error">An error occured: {{ error }}</p>
      </template>
    </ApolloMutation>
    <!-- Cast List -->
    <cast v-for="c in allCasts" :key="c.id" :cast="c"></cast>
  </div>
</template>

<script>
import {CREATE_CAST, GET_CASTS} from '../config/graph.js';
import cast from './cast';

export default {
  name: 'Casts',
  components: {
    cast
  },
  props: ['sceneId'],
  data() {
    return {
      allCasts: [],
      selectedCast: {},
      createCast: CREATE_CAST
    };
  },
  computed: {
    castsSorted() {
      return this.$store.state.casts.filter(l => !this.allCasts.find(sl => sl.deviceId === l)).sort();
    }
  },
  methods: {
    onDone() {
      this.selectedCast = {};
    },
    update(
      proxy,
      {
        data: {createCast}
      }
    ) {
      const query = {
        query: GET_CASTS,
        variables: {
          sceneId: createCast.scene.id
        }
      };
      const data = proxy.readQuery(query);
      data.allCasts.push(createCast);
      proxy.writeQuery({...query, data});
    }
  },
  apollo: {
    allCasts: {
      query: GET_CASTS,
      variables() {
        return {
          sceneId: this.sceneId
        };
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import '../styles/config';
#casts {
  border-top: $border;
  margin: 0;
  padding: 0;
  select,
  button {
    width: 10em;
    display: inline-block;
  }
}
</style>
