<template>
  <div id="app">
    <p>
      <router-link v-for="r in routes" :key="r.path" class="router-link" :to="r.path" :exact="r.path === '/'">{{r.title}}</router-link>
    </p>
    <router-view></router-view>
  </div>
</template>

<script>
import { routes } from '../config/router';
export default {
  name: 'App',
  computed: {
    routes() {
      return routes.filter(r => !r.name);
    }
  }
};
</script>
