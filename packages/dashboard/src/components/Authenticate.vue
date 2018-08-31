<template>
    <div id="authenticate" class="flex fullscreen">
        <ui-title>Authenticate with a QRCode</ui-title>

        <div v-if="!content" class="content qrcode">
            <ui-frame>
                <QrcodeReader v-if="!content" :paused="paused" @decode="onDecode" @init="onInit" class="content">
                    <div v-if="content" class="decoded-content">{{ content }}</div>
                    <div class="loading-indicator" v-show="loading" >Loading...</div>
                </QrcodeReader>
            </ui-frame>
        </div>

        <div v-else class="content">
            <ui-frame>You're gonna be redirected to {{ content }} in 2 seconds</ui-frame>
        </div>
    </div>
</template>

<script>
import { QrcodeReader } from 'vue-qrcode-reader'
import button from './ui/button'
import frame from './ui/frame'
import title from './ui/title'

export default {
    name: 'dashboard',
    components: { 'ui-title': title, 'ui-button': button, 'ui-frame': frame, QrcodeReader },
    data() {
        return {
            loading: true,
            paused:  false,
            content: null
        }
    },
    methods: {
        async onInit(promise) {
            this.loading = true
            try {
                await promise
                this.$emit('success')
            } catch (error) {
                if (error.name === 'NotAllowedError') {
                    this.$emit('error', 'To detect and decode QR codes this page needs access to your camera.')
                    this.$notify({
                        group: 'all',
                        type:  'error',
                        title: 'Error',
                        text:  'To detect and decode QR codes this page needs access to your camera.'
                    })
                } else if (error.name === 'NotFoundError') {
                    this.$emit('error', 'Seems like you have no suitable camera on your device.')
                    this.$notify({
                        group: 'all',
                        type:  'error',
                        title: 'Error',
                        text:  'Seems like you have no suitable camera on your device.'
                    })
                } else if (error.name === 'NotSupportedError') {
                    this.$emit('error', "Seems like this page is served in non-secure context. Your browser doesn't support that.")
                    this.$notify({
                        group: 'all',
                        type:  'error',
                        title: 'Error',
                        text:  "Seems like this page is served in non-secure context. Your browser doesn't support that."
                    })
                } else if (error.name === 'NotReadableError') {
                    this.$emit('error', "Couldn't access your camera. Is it already in use?")
                    this.$notify({
                        group: 'all',
                        type:  'error',
                        title: 'Error',
                        text:  "Couldn't access your camera. Is it already in use?"
                    })
                } else if (error.name === 'OverconstrainedError') {
                    this.$emit('error', "Constraints don't match any installed camera. Did you asked for the front camera although there is none?")
                    this.$notify({
                        group: 'all',
                        type:  'error',
                        title: 'Error',
                        text:  "Constraints don't match any installed camera. Did you asked for the front camera although there is none?"
                    })
                } else {
                    this.$emit('error', 'Unknown error: ' + error.message)
                    this.$notify({
                        group: 'all',
                        type:  'error',
                        title: 'Unknown error',
                        text:  error.message
                    })
                }
            } finally {
                this.loading = false
            }
        },
        onDecode(content) {
            this.content = content
            this.paused  = true
            setTimeout(() => { document.location.href = content }, 2000)
        }
    }
}
</script>

<style lang="scss">
.qrcode {
    .frame {
        .inner-frame {
            padding: 0;
        }
    }
}
.qrcode-reader__overlay,
.qrcode-reader__tracking-layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
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
.loading-indicator {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
</style>
