<template>
  <div id="importJSON">
    <input type="file" @change="doImport($event)" />
    <i class="material-icons clickable" @click="doExport">file_download</i>
  </div>
</template>

<script>
import {exportJSON} from '../config/misc'

export default {
  name: 'ImportJSON',
  props: ['getExport', 'exportName', 'onImport'],
  methods: {
    async doExport() {
      const toExport = await this.getExport()
      exportJSON(toExport, this.exportName)
    },
    doImport(event) {
      const reader = new FileReader()
      reader.onload = ({target: {result: data}}) => this.onImport && this.onImport(JSON.parse(data))
      reader.readAsText(event.target.files[0])
    },
  },
}
</script>
<style lang="scss" scoped>
@import '../styles/config';
#importJSON {
  border: $border;
  border-style: dashed;
  display: inline-block;
  font-size: 0.8em;
  padding: 0.2em 1em;
}
</style>
