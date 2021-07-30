<template>
  <div>
    <q-banner v-if="error" inline-actions class="text-white bg-red">{{ error }}
      <template v-slot:action>
        <q-btn flat color="white" label="Fermer" @click="closeError()" />
      </template>
    </q-banner>
    <q-banner v-if="isConnecting" inline-actions class="text-white bg-green">Connection en cours au broker MQTT ...</q-banner>    
    <q-banner v-if="!isConnecting && !isConnected" inline-actions class="text-white bg-red">Broker inaccessible !</q-banner>
    <q-page v-if="isConnected" class="flex flex-center">
      <q-list bordered>
        <q-item clickable v-ripple>
          <q-item-section> Volet roulant </q-item-section>
          <q-item-section> {{ rollerShutter.progress }}% </q-item-section>
          <q-item-section style="width: 200px" class="q-col-gutter row">
            <q-btn
              unelevated
              rounded
              label="Ouvrir"
              color="primary"
              @click="open"
            />
            &nbsp;
            <q-btn
              unelevated
              rounded
              label="Fermer"
              color="primary"
              @click="close"
            />
          </q-item-section>
        </q-item>
      </q-list>
    </q-page>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import * as mqtt from 'mqtt/dist/mqtt.min'

export default defineComponent({
  name: 'PageIndex',
  data() {
    return {
      rollerShutter: {
        id: 'tasmota_6C09EE',
        progress: 0,
        duration: 28000,
        ratio: 100 / 28000,
      },
      client: null,
      error: null,
      isConnected: false,
      isConnecting: false
    }
  },
  created() {
    this.isConnecting = true
    this.client = mqtt.connect('ws://192.168.0.195:9001', {
      connectTimeout: 5 * 1000,
      reconnectPeriod: 5000
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

    this.client.on('error', err => {
      console.log('error', err)
      this.error = err
    })
  },
  methods: {
    closeError() {
      this.error = null
    },
    open() {
      this.client.publish(`cmnd/${this.rollerShutter.id}/Power1`, '1')

      setInterval(() => {
        this.progress -= this.ratio
      }, 1000)

      setTimeout(() => {
        this.client.publish(`cmnd/${this.rollerShutter.id}/Power1`, '0')
        this.progress = 0
      }, this.rollerShutter.duration)
    },
    close() {
      this.client.publish(`cmnd/${this.rollerShutter.id}/Power2`, '1')

      setInterval(() => {
        this.progress += this.ratio
      }, 1000)

      setTimeout(() => {
        this.client.publish(`cmnd/${this.rollerShutter.id}/Power2`, '0')
        this.progress = 100
      }, this.rollerShutter.duration)
    },
  },
})
</script>
