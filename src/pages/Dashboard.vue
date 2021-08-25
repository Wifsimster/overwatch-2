<template>
  <div>
    <q-banner v-if="error" inline-actions class="text-white bg-red"
      >{{ error }}
      <template v-slot:action>
        <q-btn flat color="white" label="Fermer" @click="closeError()" />
      </template>
    </q-banner>
    <q-banner v-if="isConnecting" inline-actions class="text-white bg-green"
      >Connection au serveur en cours ...</q-banner
    >
    <q-banner
      v-if="!isConnecting && !isConnected"
      inline-actions
      class="text-white bg-red"
      >Serveur inaccessible !</q-banner
    >
    <div v-if="!isConnecting && isConnected" class="column items-center wrap q-gutter-md q-pa-md">
      <div v-for="device in devices" :key="device.id">
        <roller-shutter v-if="device.status === 'Online' && device.model === 'Generic'" :client="socket" :device="device" />
        <!-- TODO: Add more device type component -->
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import RollerShutter from '../components/RollerShutter.vue'

export default defineComponent({
  name: 'Dashboard',
  components: { RollerShutter },
  data() {
    return {
      mqttClient: null,
      error: null,
      isConnected: false,
      isConnecting: false,
      devices: null,
      socket: null
    }
  },
  created() { 
    this.socket = new WebSocket(`ws://${location.host}:8080`)
    this.isConnecting = true

    this.socket.onopen = () => {
      this.isOnline()
    }

    this.socket.onmessage = (event) => {
      let message = JSON.parse(event.data)
      if(message.devices) {
        this.devices = message.devices
      }
    }
    
    this.socket.onclose = function(event) {
      if (event.wasClean) {
        console.log(`[WS] Connection closed cleanly, code=${event.code} reason=${event.reason}`)
      } else {
        console.log('[WS] Connection died')
      }
      this.isOffline
    }

    this.socket.onerror = (error) => {
      console.warn(`[WS] ${error.message}`)
    }
  },
  methods: {
    isOnline() {
      this.isConnecting = false
      this.isConnected = true
      console.log('[WS] Connection established !')
    },
    isOffline() {
      this.isConnecting = false
      this.isConnected = false
    },
    closeError() {
      this.error = null
    }
  }
})
</script>
