<template>
  <div id="Lookup">
    <i class="material-icons clickable" :class="{rotating: loading}" title="Refresh media list" @click="refreshMedia()"
      >perm_media</i
    >
    <i class="material-icons clickable" :class="{rotating: loading}" title="Refresh cast list" @click="refreshCast()"
      >cast</i
    >
  </div>
</template>

<script>
import HTTP from '../config/http';

export default {
  name: 'Lookup',
  data() {
    return {
      loading: false,
    };
  },
  methods: {
    async refreshCast() {
      this.loading = true;
      await HTTP.get('/lookup');
      setTimeout(() => {
        this.$store.dispatch('fetchCasts');
        this.loading = false;
      }, 5000);
    },
    async refreshMedia() {
      this.loading = true;
      Promise.all([this.$store.dispatch('fetchMusics'), this.$store.dispatch('fetchImages')]).finally(
        () => (this.loading = false),
      );
    },
  },
};
</script>
<style lang="scss" scoped>
#Lookup {
  position: fixed;
  right: 0.5em;
  top: 0.5em;
}
</style>
