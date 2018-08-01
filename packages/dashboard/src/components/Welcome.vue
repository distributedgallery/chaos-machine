<template>
  <div id="dashboard">
    <h1 data-text="Let's vote">Chaos Machine</h1>
    <QrcodeReader
   :paused="paused"
   @decode="onDecode"
   @init="onInit">
   <div v-if="content" class="decoded-content">{{ content }}</div>

   <LoadingIndicator v-show="loading" />
 </QrcodeReader>
  </div>


</template>

<script>
import { QrcodeReader } from 'vue-qrcode-reader'

export default {
  name: 'dashboard',
  components: { QrcodeReader },
  data() {
    return {
      paused: false,
      content: null
    }
  },
  methods: {
    onDecode(content) {
      this.content = content
      this.paused = true
    }
  }
}
</script>

<style lang="scss" scoped>
.decoded-content {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  max-width: 100%;
  color: #fff;
  font-weight: bold;
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
