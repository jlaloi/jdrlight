<template>
  <i
    id="Lookup"
    class="material-icons clickable"
    :class="{'rotating': loading}"
    @click="refresh()"
  >refresh</i>
</template>

<script>
import HTTP from '../config/http';

export default {
  name: 'Lookup',
  data() {
    return {
      loading: false
    };
  },
  methods: {
    async refresh() {
      this.loading = true;
      await HTTP.get('/lookup');
      setTimeout(() => {
        this.$store.dispatch('fetchLights');
        this.$store.dispatch('fetchMusics');
        this.$store.dispatch('fetchCasts');
        this.$store.dispatch('fetchImages');
        this.loading = false;
      }, 5000);
    }
  }
};
</script>
<style lang="scss" scoped>
#Lookup {
  position: fixed;
  right: 0.5em;
  top: 0.5em;
}
</style>
