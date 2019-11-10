<template>
  <div id="app">
    <p>
      <router-link v-for="r in routes" :key="r.path" class="router-link" :to="r.path" :exact="r.path === '/'">
        {{ r.title }}
      </router-link>
    </p>
    <router-view></router-view>
    <lookup></lookup>
    <host-warn></host-warn>
  </div>
</template>

<script lang="ts">
import {routes} from '../config/router'
import lookup from './lookup.vue'
import hostWarn from './hostWarn.vue'

export default {
  name: 'App',
  components: {
    lookup,
    hostWarn,
  },
  computed: {
    routes() {
      return routes.filter(r => !r.name)
    },
  },
}
</script>
