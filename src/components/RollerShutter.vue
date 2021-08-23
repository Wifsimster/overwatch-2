<template>
  <div>
    <q-card v-if="device">
      <q-card-section class="column wrap items-center">
        <div class="text-h6">{{ device.name || device.id }}
          <q-icon name="settings" @click="openSettings()" />
        </div>
        <div class="text-subtitle1">Ouverture {{ typeof progress === 'number' ? progress + '%' : 'inconnue' }}</div>
        <br />
        <q-btn
          unelevated
          rounded
          label="Ouvrir"
          color="primary"
          class="full-width"
          v-if="!device.isClosing"
          :loading="device.isOpening"
          :disable="progress === 100"
          @click="open()"
        >
          <template>
            <q-spinner-radio />
          </template>
        </q-btn>
        &nbsp;
        <q-btn
          unelevated
          rounded
          label="Fermer"
          color="primary"
          class="full-width"
          v-if="!device.isOpening"
          :loading="device.isClosing"
          :disable="progress === 0"
          @click="close()"
        >
          <template>
            <q-spinner-radio class="on-left" />
          </template>
        </q-btn>
        &nbsp;
        <q-btn
          unelevated
          rounded
          label="Arrêter"
          color="red"
          class="full-width"
          v-if="device.isOpening || device.isClosing"
          @click="stop()"
        />
      </q-card-section>
    </q-card>
    <roller-shutter-settings @close="onCloseSettings()" :client="client" :device="device" :open="isSettingsOpen" />
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import RollerShutterSettings from 'components/RollerShutterSettings.vue'

export default defineComponent({
  name: 'device',
  props: ['client', 'device'],
  emits: ['update'],
  components: { RollerShutterSettings },
  computed: {
    progress() {
      return Math.round(this.device.openedAt)
    },
  },
  data() {
    return {
      ratio: null,
      isSettingsOpen: false,
      name: null
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {      
      this.ratio = 100 / this.device.duration
    },
    openSettings() {
      this.isSettingsOpen = true
    },
    stop() {
      this.client.send(JSON.stringify({ prefix: 'stop', device: { id: this.device.id } }))
    },
    open() {
      if (this.device.openedAt < 100 && !this.device.isClosing && this.ratio > 0) {
        this.client.send(JSON.stringify({ prefix: 'open', device: { id: this.device.id } }))
      }
    },
    close() {
      if (this.device.openedAt > 0 && !this.device.isOpening && this.ratio > 0) {
        this.client.send(JSON.stringify({ prefix: 'close', device: { id: this.device.id } }))
      }
    },
    onCloseSettings() {
      this.isSettingsOpen = false
    },
  },
  watch: {
    device() {
      this.init()
    }
  },
})
</script>
