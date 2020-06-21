<template>
  <div id="scenePreview" @click="click">
    {{ scene.name }}
    <span class="actions">
      <i v-if="scene.music" class="material-icons logo">music_note</i>
      <i
        v-for="c in scene.casts"
        :key="c.id"
        class="material-icons"
        :class="[c.media === null ? 'warning' : 'logo']"
      >photo</i>
      <i
        v-for="l in scene.lights"
        :key="l.id"
        :style="{color: l.color}"
        class="material-icons"
      >lightbulb_outline</i>
    </span>
  </div>
</template>

<script>
export default {
  name: 'ScenePreview',
  props: ['scene', 'click'],
}
</script>

<style lang="scss" scoped>
@import '../styles/config';
#scenePreview {
  text-align: center;
  text-decoration: none;
  border: $border;
  background-color: $bg2;
  color: #eee;
  font-weight: bold;
  border-radius: 2px;
  padding: 0.5em;
  width: 10em;
  height: 3em;
  text-align: center;
  display: inline-grid;
  margin: 0.5em;
  .actions {
    display: inline;
    font-size: 0.5em;
  }
}
#scenePreview:hover {
  background-color: #111;
}
</style>
