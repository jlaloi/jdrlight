<template>
  <div v-if="music" id="audioPlayer">
    <audio v-if="isAudioFile" :id="audioPlayerId" controls loop></audio>
    <div v-else>
      <div :id="ytPlayerId"></div>
    </div>
    <input
      v-if="volumeControl && music"
      v-model="volume"
      type="range"
      min="0"
      max="100"
      step="10"
      :orient="volumeOrient"
      :title="`Volume : ${volume}`"
    />
  </div>
</template>

<script>
import YouTubePlayer from 'youtube-player'

export default {
  name: 'AudioPlayer',
  props: ['music', 'config', 'onPlaying', 'onEnded', 'noRepeat', 'volumeControl'],
  data() {
    return {
      audioPlayer: undefined,
      youTubePlayer: undefined,
      volume: 100,
    }
  },
  computed: {
    audioPlayerId() {
      return this._uid + 'AP'
    },
    ytPlayerId() {
      return this._uid + 'YT'
    },
    ytConfig() {
      return {
        height: `${192}`,
        width: `${312}`,
        autoplay: 0,
      }
    },
    isAudioFile() {
      return this.isFile(this.music)
    },
  },
  watch: {
    music(newMusic, oldMusic) {
      if (this.isAudioFile && this.youTubePlayer) {
        this.youTubePlayer.destroy()
        this.youTubePlayer = undefined
      }
      // Required YT Player
      this.$nextTick(() => {
        if (!oldMusic || this.isAudioFile !== this.isFile(oldMusic)) this.initPlayer()
        else this.playMusic()
      })
    },
    volume(newVolume) {
      if (this.youTubePlayer) this.youTubePlayer.setVolume(newVolume)
      else if (this.audioPlayer) this.audioPlayer.volume = newVolume / 100
    },
  },
  mounted() {
    this.initPlayer()
  },
  methods: {
    forceRefresh() {
      if (!this.isAudioFile && this.youTubePlayer) {
        this.youTubePlayer.destroy()
        this.youTubePlayer = undefined
        this.$nextTick(this.initVideo)
      }
    },
    isFile(music) {
      return music && music.indexOf('.') !== -1
    },
    initPlayer() {
      if (this.isAudioFile) this.initAudioFile()
      else this.initVideo()
    },
    playMusic() {
      if (this.isAudioFile) this.playAudioFile()
      else this.playVideo()
    },
    initAudioFile() {
      this.audioPlayer = document.getElementById(this.audioPlayerId)
      this.audioPlayer.onplaying = this.playing
      this.audioPlayer.onended = this.onEnded
      this.playAudioFile()
    },
    playAudioFile() {
      this.audioPlayer.src = this.music
      this.audioPlayer.load()
      if (this.noRepeat) this.audioPlayer.loop = false
      if (!this.config) this.audioPlayer.play()
    },
    initVideo() {
      this.youTubePlayer = YouTubePlayer(this.ytPlayerId, {...this.ytConfig})
      this.youTubePlayerEvent = this.youTubePlayer.on('stateChange', event => {
        if (event && event.data === 1) this.playing()
        else if (event && event.data === 0) {
          if (!this.noRepeat) this.youTubePlayer.playVideo() // Fix loop...
          if (this.onEnded) this.onEnded()
        }
      })
      this.playVideo()
    },
    playVideo() {
      this.youTubePlayer.loadVideoById(this.music)
      if (!this.config) this.youTubePlayer.playVideo()
      else this.youTubePlayer.stopVideo()
    },
    playing() {
      if (this.onPlaying) this.onPlaying()
    },
  },
}
</script>
<style lang="scss" scoped>
#audioPlayer {
  width: 20em;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
  input[type='range'] {
    width: 90%;
  }
}
</style>
