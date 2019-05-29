<template>
  <div id="app">
    <p>
      <router-link
        v-for="r in routes"
        :key="r.path"
        class="router-link"
        :to="r.path"
        :exact="r.path === '/'"
      >
        {{
        r.title
        }}
      </router-link>
    </p>
    <router-view></router-view>
    <lookup></lookup>
  </div>
</template>

<script>
import {routes} from '../config/router';
import lookup from './lookup';

export default {
  name: 'App',
  components: {
    lookup
  },
  computed: {
    routes() {
      return routes.filter(r => !r.name);
    }
  }
};
</script>
