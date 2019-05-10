<template>
  <div id="light">
    <h4>{{ light.deviceId }}</h4>
    <!-- Fields -->
    <ApolloMutation
      :mutation="updateLight"
      :variables="{id: light.id, power, bright: Number(bright), rgb}"
      :update="update"
    >
      <template slot-scope="{ mutate, loading, error }">
        <!-- Bright -->
        <input v-model="bright" type="range" min="0" max="100" step="5">
        <!-- Color -->
        <input v-model="color" type="color">
        <!-- Power -->
        <select v-model="power">
          <option value="ON">ON</option>
          <option value="OFF">OFF</option>
        </select>
        <!-- Actions -->
        <button id="test" @click="testLight">Test</button>
        <div v-if="loading">Loading</div>
        <button v-else :class="{unsaved}" @click="mutate()">Save</button>
        <p v-if="error">An error occured: {{ error }}</p>
      </template>
    </ApolloMutation>
    <!-- Action Delete -->
    <ApolloMutation :mutation="deleteLight" :variables="{id: light.id}" :update="updateDelete">
      <template slot-scope="{ mutate, loading, error }">
        <button :disabled="loading" @click="mutate()">Delete</button>
        <p v-if="error">An error occured: {{ error }}</p>
      </template>
    </ApolloMutation>
  </div>
</template>

<script>
import HTTP from '../config/http';
import { DELETE_LIGHT, UPDATE_LIGHT, GET_LIGHTS } from '../config/graph.js';

export default {
  name: 'Light',
  props: ['light'],
  data() {
    return {
      deleteLight: DELETE_LIGHT,
      updateLight: UPDATE_LIGHT,
      power: undefined,
      bright: undefined,
      color: undefined,
      query: {
        query: GET_LIGHTS,
        variables: {
          sceneId: this.light.scene.id
        }
      }
    };
  },
  computed: {
    rgb() {
      if (this.color)
        return this.color.match(/[A-Za-z0-9]{2}/g).map(v => parseInt(v, 16));
      else return undefined;
    },
    getConfig() {
      return {
        power: this.power,
        bright: this.bright,
        rgb: this.rgb
      };
    },
    unsaved() {
      return (
        this.power !== this.light.power ||
        this.bright != this.light.bright ||
        this.color !== this.rgbToHex(this.light.rgb)
      );
    }
  },
  mounted() {
    this.reset();
  },
  methods: {
    async testLight() {
      await HTTP.post(`/light/${this.light.deviceId}`, this.getConfig);
    },
    update(
      proxy,
      {
        data: { updateLight }
      }
    ) {
      const data = proxy.readQuery(this.query);
      const lightIndex = data.allLights.findIndex(l => l.id == this.light.id);
      data.allLights[lightIndex] = updateLight;
      proxy.writeQuery({ ...this.query, data });
    },
    updateDelete(
      proxy,
      {
        data: { deleteLight }
      }
    ) {
      const data = proxy.readQuery(this.query);
      proxy.writeQuery({
        ...this.query,
        data: {
          allLights: data.allLights.filter(s => s.id !== deleteLight.id)
        }
      });
    },
    reset() {
      ({ power: this.power, bright: this.bright } = this.light);
      this.color = this.rgbToHex(this.light.rgb);
    },
    rgbToHex(rgb) {
      return (
        '#' +
        ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2])
          .toString(16)
          .slice(1)
      );
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../styles/config';
#light {
  border: $border;
  border-radius: 2px;
  display: inline-block;
  text-align: center;
  margin: 0.25em;
  padding: 0.25em;
  width: 11em;
  input,
  button,
  select {
    width: 10em;
    display: block;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 0;
  }
  select,
  #test {
    width: 4.35em;
    display: inline-block;
  }
}
</style>
