<template>
  <div v-if="this.$store.state.effects.length" id="effects">
    <ul>
      <li
        v-for="(e, index) in effectsSorted"
        :key="index"
        :class="{selected: e===current }"
        @click="() => current=e"
      >{{cleanUrl(e)}}</li>
      <li @click="() => current=undefined">STOP</li>
    </ul>
    <input v-model="repeat" type="checkbox" title="Repeat" />
    <audioPlayer
      v-if="current"
      :music="current"
      :no-repeat="!repeat && 'yes'"
      :on-ended="() => current=undefined"
      volume-control="yes"
    ></audioPlayer>
  </div>
</template>

<script>
import audioPlayer from './audioPlayer'
export default {
  name: 'Effects',
  components: {
    audioPlayer,
  },
  data() {
    return {
      repeat: false,
      current: undefined,
    }
  },
  computed: {
    effectsSorted() {
      return this.$store.state.effects.slice(0).sort()
    },
  },
  watch: {
    repeat() {
      if (!this.repeat) this.current = undefined
    },
  },
  mounted() {
    this.$store.dispatch('fetchEffects')
  },
  methods: {
    cleanUrl(url) {
      return url && url.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('.'))
    },
  },
}
</script>
<style lang="scss" scoped>
@import '../styles/config';
#effects {
  * {
    display: inline-block;
  }
  ul {
    li {
      cursor: pointer;
      text-transform: capitalize;
      border: $border;
      border-radius: 2px;
      padding: 0 0.25em;
      margin: 0 0.12em;
    }
    li:hover,
    .selected {
      color: $colorSelected;
    }
  }
}
</style>
