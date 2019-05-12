<template>
  <div v-if="music" id="audioPlayer">
    <audio v-if="isAudioFile" :id="audioPlayerId" controls loop></audio>
    <div v-else>
      <div :id="ytPlayerId"></div>
    </div>
  </div>
</template>

<script>
import YouTubePlayer from 'youtube-player';

export default {
  name: 'AudioPlayer',
  props: ['music', 'config', 'onPlaying'],
  data() {
    return {
      audioPlayer: undefined,
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
      return this.isFile(this.music);
    }
  },
  watch: {
    music(newMusic, oldMusic) {
      if (this.isAudioFile && this.youTubePlayer) {
        this.youTubePlayer.destroy();
        this.youTubePlayer = undefined;
      }
      // Required YT Player
      this.$nextTick(() => {
        if (!oldMusic || this.isAudioFile !== this.isFile(oldMusic)) this.initPlayer();
        else this.playMusic();
      });
    }
  },
  mounted() {
    this.initPlayer();
  },
  methods: {
    isFile(music) {
      return music && music.indexOf('.') !== -1;
    },
    initPlayer() {
      if (this.isAudioFile) this.initAudioFile();
      else this.initVideo();
    },
    playMusic() {
      if (this.isAudioFile) this.playAudioFile();
      else this.playVideo();
    },
    initAudioFile() {
      this.audioPlayer = document.getElementById(this.audioPlayerId);
      this.audioPlayer.onplaying = this.playing;
      this.playAudioFile();
    },
    playAudioFile() {
      this.audioPlayer.src = this.music;
      this.audioPlayer.load();
      if (!this.config) this.audioPlayer.play();
    },
    initVideo() {
      this.youTubePlayer = YouTubePlayer(this.ytPlayerId, {...this.ytConfig });
      this.youTubePlayerEvent = this.youTubePlayer.on('stateChange', event => {
        if (event && event.data === 1) this.playing();
      });
      this.playVideo();
    },
    playVideo() {
      this.youTubePlayer.loadVideoById(this.music);
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
