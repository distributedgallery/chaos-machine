<template>
    <div id="welcome" class="flex fullscreen">
        <ui-title>Chaos Machine</ui-title>

        <div v-if="!$store.state.web3" class="content">
            <ui-frame>
                Your browser does not come with an ethereum wallet.<br>
                Install <a href="#" target="_blank">Metamask</a>, fill it with
                <a href="#" target="_blank">a few ETHs</a>
                and come back once you're done.
            </ui-frame>
        </div>

        <div v-else-if="$store.state.network !== '1'" class="content">
            <ui-frame>
                Your wallet is connected to the wrong network.<br>
                Please select 'Ethereum Main Net' in Metamask.
            </ui-frame>
        </div>

        <div v-else class="content">
            <div class="buttons">
                <ui-button v-on:click="$router.push('authenticate')"><router-link to="authenticate">Upload a track</router-link></ui-button>
            </div>
        </div>
    </div>
</template>

<script>
import button from './ui/button'
import frame from './ui/frame'
import title from './ui/title'

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
        a {
            text-decoration: none;
        }
    }
}
</style>
