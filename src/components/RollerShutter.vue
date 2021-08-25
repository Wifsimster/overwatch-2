<template>
  <div>
    <q-card v-if="device">
      <q-card-section class="column wrap items-center">
        <div class="text-h6">{{ device.name || device.id }}
          <q-icon name="settings" @click="openSettings()" />
        </div>
        <!-- <div class="text-subtitle1">Ouverture {{ typeof progress === 'number' ? progress + '%' : 'inconnue' }}</div> -->
         <q-knob
      show-value
      class="text-light-blue q-ma-md"
      v-model="progress"
      size="60px"
       :thickness="0.22"
      color="primary"
      track-color="grey-3"
      disable
    />
        <q-btn
          unelevated
          rounded
          label="Ouvrir"
          color="primary"
          class="full-width"
          v-if="!device.isClosing && progress < 100"
          :loading="device.isOpening"
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
          v-if="!device.isOpening && progress > 0"
          :loading="device.isClosing"
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
          v-if="(device.isOpening || device.isClosing) && progress > 0 && progress < 100"
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
      if(typeof this.device.openedAt === 'number') {
        return Math.round(this.device.openedAt)
      }
      return 0
    },
  },
  data() {
    return {
      isSettingsOpen: false,
      name: null
    }
  },
  methods: {
    openSettings() {
      this.isSettingsOpen = true
    },
    stop() {
      this.client.send(JSON.stringify({ prefix: 'stop', device: { id: this.device.id } }))
    },
    open() {
      if (this.device.openedAt < 100 && !this.device.isClosing && this.device.duration > 0) {
        this.client.send(JSON.stringify({ prefix: 'open', device: { id: this.device.id } }))
      }
    },
    close() {
      if (this.device.openedAt > 0 && !this.device.isOpening && this.device.duration > 0) {
        this.client.send(JSON.stringify({ prefix: 'close', device: { id: this.device.id } }))
      }
    },
    onCloseSettings() {
      this.isSettingsOpen = false
    },
  },
})
</script>
