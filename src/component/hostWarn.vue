<template>
  <div id="hostWarn" v-if="shouldDisplay">
    <i class="material-icons">warning</i> WARNING : YOU ARE CONNECTED WITH A LOCAL ADDRESS {{ currentIP }}
    <i class="material-icons">warning</i>
  </div>
</template>

<script>
export default {
  name: 'HostWarn',
  data() {
    return {
      currentIP: location.hostname,
      shouldDisplay: ['localhost', '127.0.0.1'].find(ip => ip === location.hostname),
    }
  },
}
</script>
<style lang="scss" scoped>
@import '../styles/config';
#hostWarn {
  position: fixed;
  left: 0;
  bottom: 0em;
  width: 100%;
  text-align: center;
  font-weight: bold;
  background-color: $colorWarning;
}
</style>
