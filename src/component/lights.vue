<template>
  <div id="lights">
    <!-- Add Light -->
    <ApolloMutation
      :mutation="createLight"
      :variables="{deviceId : selectedLight.deviceId, power:'ON', bright: 100, rgb:[255,255,255], sceneId}"
      :update="update"
      @done="onDone"
    >
      <template slot-scope="{ mutate, loading, error }">
        <div v-if="loading">Loading</div>
        <select v-model="selectedLight" :disabled="loading || lightsSorted.length ===0">
          <option/>
          <option v-for="(l, index) in lightsSorted" :key="index" :value="l">{{ l.deviceId }}</option>
        </select>
        <button :disabled="!selectedLight.deviceId" @click="mutate()">Add light</button>
        <p v-if="error">An error occured: {{ error }}</p>
      </template>
    </ApolloMutation>
    <!-- Light  List -->
    <light v-for="l in allLights" :key="l.id" :light="l"></light>
  </div>
</template>

<script>
import { CREATE_LIGHT, GET_LIGHTS } from '../config/graph.js';
import light from './light';

export default {
  name: 'Lights',
  components: {
    light
  },
  props: ['sceneId'],
  data() {
    return {
      allLights: [],
      selectedLight: {},
      createLight: CREATE_LIGHT
    };
  },
  computed: {
    lightsSorted() {
      return this.$store.state.lights
        .filter(l => !this.allLights.find(sl => sl.deviceId === l.deviceId))
        .sort();
    }
  },
  methods: {
    onDone() {
      this.selectedLight = {};
    },
    update(
      proxy,
      {
        data: { createLight }
      }
    ) {
      const query = {
        query: GET_LIGHTS,
        variables: {
          sceneId: createLight.scene.id
        }
      };
      const data = proxy.readQuery(query);
      data.allLights.push(createLight);
      proxy.writeQuery({ ...query, data });
    }
  },
  apollo: {
    allLights: {
      query: GET_LIGHTS,
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
#lights {
  margin: 0;
  padding: 0;
  select,
  button {
    width: 11em;
    display: inline-block;
  }
}
</style>
