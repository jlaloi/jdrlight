<template>
  <div id="textToSpeech">
    <select v-model="voice">
      <option v-for="v in voices" :key="v.name" :value="v">{{ `${v.lang} - ${v.name}`}}</option>
    </select>
    <input v-model="volume" type="range" min="0.1" max="1" step="0.1" :title="`Volume : ${volume}`" />
    Volume: {{volume}}
    <input
      v-model="rate"
      type="range"
      min="0.1"
      max="10"
      step="0.1"
      :title="`Rate : ${rate}`"
    />
    Rate: {{rate}}
    <input
      v-model="pitch"
      type="range"
      min="0"
      max="2"
      step="0.1"
      :title="`Pitch : ${pitch}`"
    />
    Pitch: {{pitch}}
    <textarea v-model="text" />
    <button @click="sayIt">Say it!</button>
  </div>
</template>

<script>
export default {
  name: 'TextToSpeech',
  data() {
    return {
      text: "Il est l'ancien, il est la terre!",
      voice: undefined,
      volume: 1,
      rate: 1,
      pitch: 1,
    }
  },
  computed: {
    voices() {
      return (window.speechSynthesis && window.speechSynthesis.getVoices()) || []
    },
  },
  mounted() {
    if (!this.voice && this.voices && this.voices.length) this.voice = this.voices[0]
    this.sayIt()
  },
  methods: {
    async sayIt() {
      if (!this.voice || !this.text) return
      const msg = new SpeechSynthesisUtterance()
      msg.voice = this.voice
      msg.volume = this.volume // 0 to 1
      msg.rate = this.rate // 0.1 to 10
      msg.pitch = this.pitch //0 to 2
      msg.text = this.text
      msg.lang = this.voice.lang
      speechSynthesis.speak(msg)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../styles/config';
#textToSpeech {
  border: $border;
  border-radius: 2px;
  display: inline-block;
  text-align: center;
  margin: 0.25em;
  padding: 0.25em;
  input,
  textarea,
  button,
  select {
    display: block;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 0;
    width: 100%;
  }
}
</style>
