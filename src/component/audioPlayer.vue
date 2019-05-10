<template>
  <div v-if="music" id="audioPlayer">
    <audio v-if="isAudioFile" :id="audioPlayerId" controls loop></audio>
    <div v-else :id="ytPlayerId"></div>
  </div>
</template>

<script>
import YouTubePlayer from 'youtube-player';

export default {
  name: 'AudioPlayer',
  props: ['music', 'config'],
  computed: {
    audioPlayerId() {
      return this._uid + 'AP';
    },
    ytPlayerId() {
      return this._uid + 'YT';
    },
    ytConfig() {
      return {
        height: '192',
        width: '312',
        autoplay: 0,
        loop: 1
      };
    },
    isAudioFile() {
      return this.music.startsWith('music/');
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
      if (!this.music) return;
      if (this.isAudioFile) this.playAudioFile();
      else this.playVideo();
    },
    playAudioFile() {
      const audio = document.getElementById(this.audioPlayerId);
      audio.src = this.music;
      audio.load();
      if (!this.config) audio.play();
    },
    playVideo() {
      const player = YouTubePlayer(this.ytPlayerId, this.ytConfig);
      player.loadVideoById(this.music);
      if (!this.config) player.playVideo();
      else player.stopVideo();
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
