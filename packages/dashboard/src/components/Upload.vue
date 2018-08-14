<template>
  <div id="upload-track" class="page fullscreen">
    <ui-title>Register a track</ui-title>
    <div class="content">
      <ui-dropbox v-on:change="fileUpdated">
        {{ placeholder }}
      </ui-dropbox>
      <ui-button :class="track.valid ? '': 'disabled'" v-on:click="upload">Register track</ui-button>
    </div>
  </div>
</template>

<script>
import isMp3 from 'is-mp3'
import IPFS from 'ipfs-api'
import title from './ui/title'
import dropbox from './ui/dropbox'
import button from './ui/button'

export default {
  name: 'dashboard',
  components: { 'ui-title': title, 'ui-dropbox': dropbox, 'ui-button': button },
  data() {
    return {
      track: {
        valid: false,
        buffer: undefined,
        name: undefined
      },
      reader: null,
      proposals: [],
      newProposal: undefined,
      winningProposal: undefined
    }
  },
  computed: {
    placeholder: function() {
      if (this.track.valid) {
        return "register '" + this.track.name + "' or select a new track"
      } else {
        return 'drag your track here or click to browse'
      }
    }
  },
  methods: {
    fileUpdated: function(files) {
      const self = this
      const reader = new FileReader()
      reader.onload = function(e) {
        const buffer = Buffer(reader.result)
        if (!isMp3(buffer)) {
          self.track.valid = false
          self.track.buffer = undefined
          self.track.name = undefined
          self.$notify({
            group: 'all',
            type: 'error',
            title: 'Wrong file format',
            text:
              'The ChaosMachine only handles .mp3 files. Please pick a mp3 encoded track.',
            duration: 10000
          })
        } else {
          self.track.valid = true
          self.track.buffer = buffer
          self.track.name = files[0].name
          self.$notify({
            group: 'all',
            type: 'success',
            title: 'Valid file',
            text: 'You can now register your track on the blockchain.'
          })
        }
      }
      reader.readAsArrayBuffer(files[0])
    },
    upload: async function() {
      if (this.track.valid) {
        const ipfs = IPFS({
          host: 'ipfs.infura.io',
          port: '5001',
          protocol: 'https'
        })

        this.$notify({
          group: 'all',
          title: 'Uploading track',
          text:
            'Your track is being uploaded to IPFS.<br><div class="spinner"><div class="rect1"></div><div class="rect2"></div><div class="rect3"></div><div class="rect4"></div><div class="rect5"></div></div>',
          duration: -1
        })

        const results = await ipfs.files.add(this.track.buffer)

        this.$notify({
          group: 'all',
          clean: true
        })

        this.$notify({
          group: 'all',
          type: 'success',
          title: 'Track uploaded',
          text: 'Hash: ' + results[0].hash,
          duration: 10000
        })
      }
    }
  }
}
</script>

<style lang="scss">
.spinner {
  margin: 0;
  width: 30px;
  height: 30px;
  text-align: center;
  font-size: 10px;
}

.spinner > div {
  background-color: #ebece6;
  margin-right: 2px;
  height: 100%;
  width: 4px;
  display: inline-block;

  -webkit-animation: sk-stretchdelay 1.2s infinite ease-in-out;
  animation: sk-stretchdelay 1.2s infinite ease-in-out;
}

.spinner .rect2 {
  -webkit-animation-delay: -1.1s;
  animation-delay: -1.1s;
}

.spinner .rect3 {
  -webkit-animation-delay: -1s;
  animation-delay: -1s;
}

.spinner .rect4 {
  -webkit-animation-delay: -0.9s;
  animation-delay: -0.9s;
}

.spinner .rect5 {
  -webkit-animation-delay: -0.8s;
  animation-delay: -0.8s;
}

@-webkit-keyframes sk-stretchdelay {
  0%,
  40%,
  100% {
    -webkit-transform: scaleY(0.4);
  }
  20% {
    -webkit-transform: scaleY(1);
  }
}

@keyframes sk-stretchdelay {
  0%,
  40%,
  100% {
    transform: scaleY(0.4);
    -webkit-transform: scaleY(0.4);
  }
  20% {
    transform: scaleY(1);
    -webkit-transform: scaleY(1);
  }
}

form {
  width: 30%;
}

.fullscreen {
  position: absolute;
  top: 0;
  left: 0;
  min-height: 100vh;
  width: 100vw;
}

.flex {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: center;
  min-height: 100%;

  h1 {
    flex: 0 1 auto;
    /* The above is shorthand for:
  flex-grow: 0,
  flex-shrink: 1,
  flex-basis: auto
  */
  }

  .content {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
  }
}
</style>
