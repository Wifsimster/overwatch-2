<template>
  <div>
    <q-card v-if="device">
      <q-card-section class="column wrap items-center">
        <div class="text-h6">{{ device.name || device.id }}
          <q-icon name="settings" @click="openSettings()" />
        </div>
        <div class="text-subtitle1">Ouverture {{ progress }}%</div>
        <br />
        <q-btn
          unelevated
          rounded
          label="Ouvrir"
          color="primary"
          class="full-width"
          v-if="!isClosing"
          :loading="isOpening"
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
          v-if="!isOpening"
          :loading="isClosing"
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
          v-if="isOpening || isClosing"
          @click="stop()"
        />
      </q-card-section>
    </q-card>
    <roller-shutter-settings @close="onCloseSettings()" :device="device" :open="isSettingsOpen" />
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import RollerShutterSettings from 'components/RollerShutterSettings.vue'
import { setDevice } from '../api/device.js'

export default defineComponent({
  name: 'device',
  props: ['client', 'device'],
  emits: ['update'],
  components: { RollerShutterSettings },
  computed: {
    progress() {
      return Math.round(this.openedAt)
    },
  },
  data() {
    return {
      ratio: 100 / this.device.duration,
      openedAt: 0,
      isOpening: false,
      isClosing: false,
      interval: null,
      isSettingsOpen: false,
      name: null,
      duration: null
    }
  },
  created() {
    this.openedAt = this.device.openedAt || 0
  },
  methods: {
    openSettings() {
      this.isSettingsOpen = true
    },
    stop() {
      clearInterval(this.interval)
      if (this.isOpening) {
        this.isOpening = false
        this.client.publish(`cmnd/${this.device.id}/Power1`, '0')
      }
      if (this.isClosing) {
        this.isClosing = false
        this.client.publish(`cmnd/${this.device.id}/Power2`, '0')
      }
    },
    open() {
      if (this.openedAt < 100 && !this.isClosing && this.ratio > 0) {
        this.isOpening = true

        this.client.publish(`cmnd/${this.device.id}/Power1`, '1')

        this.interval = setInterval(async () => {
          if (this.openedAt < 100 - this.ratio) {
            this.openedAt += this.ratio
          } else {
            clearInterval(this.interval)
            this.openedAt = 100
            this.client.publish(`cmnd/${this.device.id}/Power1`, '0')
            this.isOpening = false
          }
        }, 1000)
      }
    },
    close() {
      if (this.openedAt > 0 && !this.isOpening && this.ratio > 0) {
        this.isClosing = true

        this.client.publish(`cmnd/${this.device.id}/Power2`, '1')

        this.interval = setInterval(() => {
          if (this.openedAt > 0 + this.ratio) {
            this.openedAt -= this.ratio
          } else {
            clearInterval(this.interval)
            this.openedAt = 0
            this.client.publish(`cmnd/${this.device.id}/Power2`, '0')
            this.isClosing = false
          }
        }, 1000)
      }
    },
    onCloseSettings() {
      this.isSettingsOpen = false
      this.$emit('update')
    },
  },
  watch: {
    async openedAt() {
      await setDevice(this.device.id, { openedAt: this.openedAt })
    },
  },
})
</script>
