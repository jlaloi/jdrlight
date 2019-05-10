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
  props: ['music', 'config', 'onPlaying'],
  data() {
    return {
      youTubePlayer: undefined
    };
  },
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
      audio.onplaying = this.playing;
      audio.src = this.music;
      audio.load();
      if (!this.config) audio.play();
    },
    playVideo() {
      this.youTubePlayer = YouTubePlayer(this.ytPlayerId, this.ytConfig);
      this.youTubePlayer.loadVideoById(this.music);
      this.youTubePlayer.on('stateChange', event => {
        if (event && event.data === 1) this.playing();
      });
      if (!this.config) this.youTubePlayer.playVideo();
      else this.youTubePlayer.stopVideo();
    },
    playing() {
      if (this.onPlaying) this.onPlaying();
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
