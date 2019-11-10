<template>
  <div id="importJSON">
    <input type="file" @change="doImport($event)" />
    <i class="material-icons clickable" @click="doExport">file_download</i>
  </div>
</template>

<script>
import {clearObject, exportJSON} from '../config/misc'

export default {
  name: 'ImportJSON',
  props: ['export', 'exportName', 'onImport'],
  methods: {
    doExport() {
      exportJSON(clearObject(this.export), this.exportName)
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
  font-size: 0.8em;
}
</style>
