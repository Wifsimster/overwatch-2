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
    <div v-if="!isConnecting && isConnected" class="column items-center wrap q-gutter-md q-pa-md">
    <!-- <div class="column items-center wrap q-gutter-md q-pa-md"> -->
      <div v-for="device in devices" :key="device.id">
        <roller-shutter v-if="device.id === 'tasmota_6C09EE'" :client="mqttClient" :device="device" />
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import * as mqtt from 'mqtt/dist/mqtt.min'
import RollerShutter from '../components/RollerShutter.vue'
import { getStates } from 'src/api/state'

const MQTT_BROKER = 'ws://192.168.0.195:9001'

export default defineComponent({
  name: 'Dashboard',
  components: { RollerShutter },
  data() {
    return {
      mqttClient: null,
      error: null,
      isConnected: false,
      isConnecting: false,
      devices: null
    }
  },
  created() { 
    this.isConnecting = true
    this.mqttClient = mqtt.connect(MQTT_BROKER, {
      connectTimeout: 5 * 1000,
      reconnectPeriod: 0,
    })

    this.mqttClient.on('connect', () => {
      this.isConnecting = false
      this.isConnected = true
    })

    this.mqttClient.on('reconnect', () => {
      console.log('reconnect')
      this.isConnecting = true
      this.isConnected = false
    })

    this.mqttClient.on('close', () => {
      console.log('close')
      this.isConnecting = false
      this.isConnected = false
    })

    this.mqttClient.on('message', (topic, message) => {
      console.log(topic + ':' + message.toString())
    })

    this.mqttClient.on('error', (err) => {
      console.log('error', err)
      this.error = err
    })
  },
  methods: {
    closeError() {
      this.error = null
    },
  },
  watch: {
    async isConnected(status) {
      if(status) {
        this.devices = await getStates()
      }
    }
  }
})
</script>
