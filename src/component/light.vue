<template>
  <div id="light">
    <p>{{ name }}</p>
    <!-- Fields -->
    <ApolloMutation
      :mutation="updateLight"
      :variables="{id: light.id, power, bright: Number(bright), rgb}"
      :update="update"
    >
      <template slot-scope="{mutate, loading, error}">
        <!-- Bright -->
        <input v-model="bright" type="range" min="0" max="100" step="5" :title="bright + ' %'" />
        <!-- Color -->
        <input v-model="color" type="color" />
        <!-- Power -->
        <select v-model="power">
          <option value="ON">ON</option>
          <option value="OFF">OFF</option>
        </select>
        <!-- Actions -->
        <div class="actions">
          <i class="material-icons clickable" @click="testLight()">play_circle_outline</i>
          <div v-if="loading || deleteLoading">Loading</div>
          <i v-else class="material-icons clickable" :class="{unsaved}" @click="mutate()">save</i>
          <i v-if="!deleteLoading" class="material-icons clickable" @click="confirm(`Delete ${name}?`) && delLight()"
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
import {DELETE_LIGHT, UPDATE_LIGHT, GET_LIGHTS} from '../config/graph'

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
          sceneId: this.light.scene.id,
        },
      },
      deleteLoading: false,
      deleteError: undefined,
    }
  },
  computed: {
    rgb() {
      if (this.color) return this.color.match(/[A-Za-z0-9]{2}/g).map(v => parseInt(v, 16))
      else return undefined
    },
    device() {
      return this.$store.state.lights.find(l => l.deviceId == this.light.deviceId) || {}
    },
    name() {
      return this.device.name || this.light.deviceId
    },
    getConfig() {
      return {
        power: this.power,
        bright: this.bright,
        rgb: this.rgb,
      }
    },
    unsaved() {
      return (
        this.power !== this.light.power ||
        this.bright != this.light.bright ||
        this.color !== this.rgbToHex(this.light.rgb)
      )
    },
  },
  mounted() {
    this.reset()
  },
  methods: {
    async testLight() {
      await HTTP.post(`/light/${this.light.deviceId}`, this.getConfig)
    },
    update(
      proxy,
      {
        data: {updateLight},
      },
    ) {
      const data = proxy.readQuery(this.query)
      const lightIndex = data.allLights.findIndex(l => l.id == this.light.id)
      data.allLights[lightIndex] = updateLight
      proxy.writeQuery({...this.query, data})
    },
    updateDelete(
      proxy,
      {
        data: {deleteLight},
      },
    ) {
      const data = proxy.readQuery(this.query)
      proxy.writeQuery({
        ...this.query,
        data: {
          allLights: data.allLights.filter(s => s.id !== deleteLight.id),
        },
      })
    },
    delLight() {
      this.deleteLoading = true
      this.deleteError = undefined
      this.$apollo
        .mutate({
          mutation: DELETE_LIGHT,
          variables: {
            id: this.light.id,
          },
          update: this.updateDelete,
        })
        .catch(error => (this.deleteError = error))
        .then(() => {
          this.deleteLoading = false
        })
    },
    reset() {
      ({power: this.power, bright: this.bright} = this.light)
      this.color = this.rgbToHex(this.light.rgb)
    },
    rgbToHex(rgb) {
      return '#' + ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1)
    },
    confirm(msg) {
      return window.confirm(msg)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../styles/config';
#light {
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
  width: 10em;
  input,
  button,
  select {
    width: 9em;
    display: block;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 0;
  }
  select {
    width: 3.6em;
    display: inline-block;
    font-size: 1em;
  }
  .actions {
    display: inline-block;
  }
}
</style>
