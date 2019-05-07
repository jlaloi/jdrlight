<template>
  <div id="app">
    <p>
      <router-link class="router-link" to="/">Dashboard</router-link>
      <router-link class="router-link" to="/scenes">Scenes</router-link>
    </p>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  created() {
    this.$store.dispatch('fetchLights');
    this.$store.dispatch('fetchMusics');
  }
};
</script>
