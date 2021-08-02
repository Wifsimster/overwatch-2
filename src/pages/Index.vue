<template>
  <div>
    <q-banner v-if="error" inline-actions class="text-white bg-red"
      >{{ error }}
      <template v-slot:action>
        <q-btn flat color="white" label="Fermer" @click="closeError()" />
      </template>
    </q-banner>
    <q-banner v-if="isConnecting" inline-actions class="text-white bg-green"
      >Connection en cours au broker MQTT ...</q-banner
    >
    <q-banner
      v-if="!isConnecting && !isConnected"
      inline-actions
      class="text-white bg-red"
      >Broker inaccessible !</q-banner
    >
    <!-- <div v-if="!isConnecting && isConnected" class="column items-center wrap q-gutter-md q-pa-md"> -->
    <div class="column items-center wrap q-gutter-md q-pa-md">
      <roller-shutter :device="rollerShutter" />
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import * as mqtt from 'mqtt/dist/mqtt.min'
import RollerShutter from '../components/RollerShutter.vue'

export default defineComponent({
  name: 'PageIndex',
  components: {
    'roller-shutter': RollerShutter
  },
  data() {
    return {
      client: null,
      error: null,
      isConnected: false,
      isConnecting: false,
      rollerShutter: {
        id: 'tasmota_6C09EE',
        name: 'Vollet roulant sud',
        duration: 28,
        ratio: 100 / 28,
        openedAt: 0,
        isOpening: false,
        isClosing: false,
        interval: null
      },
    }
  },
  created() {
    this.isConnecting = true
    this.client = mqtt.connect('ws://192.168.0.195:9001', {
      connectTimeout: 5 * 1000,
      reconnectPeriod: 0,
    })

    this.client.on('connect', () => {
      this.isConnecting = false
      this.isConnected = true
      this.client.subscribe(`stat/${this.rollerShutter.id}/Power`, (err) => {
        if (err) {
          console.error(err)
          this.error = err
        } else {
          console.log(`Subscribe to stat/${this.rollerShutter.id}/Power`)
          this.client.publish(`cmnd/${this.rollerShutter.id}/Power1`, '')
        }
      })
    })

    this.client.on('reconnect', () => {
      console.log('reconnect')
      this.isConnecting = true
      this.isConnected = false
    })

    this.client.on('close', () => {
      console.log('close')
      this.isConnecting = false
      this.isConnected = false
    })

    this.client.on('message', (topic, message) => {
      console.log(topic + ':' + message.toString())
    })

    this.client.on('error', (err) => {
      console.log('error', err)
      this.error = err
    })
  },
  methods: {
    closeError() {
      this.error = null
    },
    stop() {
      clearInterval(this.rollerShutter.interval)
      if (this.rollerShutter.isOpening) {
        this.rollerShutter.isOpening = false
        this.client.publish(`cmnd/${this.rollerShutter.id}/Power1`, '0')
      }
      if (this.rollerShutter.isClosing) {
        this.rollerShutter.isClosing = false
        this.client.publish(`cmnd/${this.rollerShutter.id}/Power2`, '0')
      }
    },
    open() {
      if (this.rollerShutter.openedAt < 100 && !this.rollerShutter.isClosing) {
        this.rollerShutter.isOpening = true

        this.client.publish(`cmnd/${this.rollerShutter.id}/Power1`, '1')

        this.rollerShutter.interval = setInterval(() => {
          if(this.rollerShutter.openedAt < 100 - this.rollerShutter.ratio) {
            this.rollerShutter.openedAt +=  this.rollerShutter.ratio
          } else {
            clearInterval(this.rollerShutter.interval)
            this.rollerShutter.openedAt = 100
            this.client.publish(`cmnd/${this.rollerShutter.id}/Power1`, '0')
            this.rollerShutter.isOpening = false
          }          
        }, 1000)
      }
    },
    close() {
      if (this.rollerShutter.openedAt > 0 && !this.rollerShutter.isOpening) {
        this.rollerShutter.isClosing = true

        this.client.publish(`cmnd/${this.rollerShutter.id}/Power2`, '1')

        this.rollerShutter.interval = setInterval(() => {
          if(this.rollerShutter.openedAt > 0 + this.rollerShutter.ratio) {
            this.rollerShutter.openedAt -= this.rollerShutter.ratio
          } else {
            clearInterval(this.rollerShutter.interval)
            this.rollerShutter.openedAt = 0
            this.client.publish(`cmnd/${this.rollerShutter.id}/Power2`, '0')
            this.rollerShutter.isClosing = false
          }
        }, 1000)
      }
    },
  },
})
</script>
