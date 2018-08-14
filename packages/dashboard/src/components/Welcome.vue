<template>
  <div id="welcome" class="flex fullscreen">
    <ui-title>Chaos Machine</ui-title>

    <div class="content">
      <ui-frame v-if="!$store.state.web3">
        Your browser does not come with an ethereum wallet.<br>
        Install <a href="#" target="_blank">Metamask</a>, fill it with
        <a href="#" target="_blank">a few ETHs</a>
        and come back once you're done.
      </ui-frame>

      <div v-else-if="$store.state.network !== '1'" class="">
        Connected to the wrong network
      </div>

      <div v-else class="buttons">
        <ui-button>Register a QRCode</ui-button>
        <ui-button>Upload a track</ui-button>
        <ui-button>Listen to the radio</ui-button>
      </div>
    </div>




  </div>


</template>

<script>
import title from './ui/title'
import button from './ui/button'
import frame from './ui/frame'

export default {
  name: 'welcome',
  components: { 'ui-title': title, 'ui-button': button, 'ui-frame': frame }
}
</script>

<style lang="scss" scoped>
@import '/src/sass/variables';

.buttons {
  .button {
    margin-right: 5em;
    &:last-child {
      margin-right: 0;
    }
  }
}
</style>
