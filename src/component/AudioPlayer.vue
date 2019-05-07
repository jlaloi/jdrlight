<template>
  <div id="audioPlayer">
    <audio :id="audioPlayerId" controls loop />
  </div>
</template>

<script>
export default {
  name: 'AudioPlayer',
  props: ['music', 'config'],
  computed: {
    audioPlayerId() {
      return this._uid + 'AP';
    }
  },
  watch: {
    music() {
      this.playMusic();
    }
  },
  mounted() {
    this.playMusic();
  },
  methods: {
    playMusic() {
      const audio = document.getElementById(this.audioPlayerId);
      audio.src = this.music;
      audio.load();
      if (!this.config && this.music) audio.play();
    }
  }
};
</script>
<style lang="scss" scoped>
#audioPlayer {
  width: 20em;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
}
</style>
