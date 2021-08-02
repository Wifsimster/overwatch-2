<template>
    <q-card v-if="device">
        <q-card-section class="column wrap items-center">
            <div class="text-h6">{{ device.name }}</div>
            <div class="text-subtitle1">{{ progress }}%</div>
            <br />
            <q-btn
            unelevated
            rounded
            label="Ouvrir"
            color="primary"
            class="full-width" 
            v-if="!device.isClosing"
            :loading="device.isOpening"
            @click="open()"
            >
            <template>
            <q-spinner-radio/>
            Ouverture ...
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
            @click="close()"
            >
            <template>
            <q-spinner-radio class="on-left" />
            Click "Stop" Button
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
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'device',
  props: [ 'client', 'device' ],
  computed: {
    progress() {
      return Math.round(this.device.openedAt)
    }
  },
  methods: {
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
  watch: {
    client() {
      this.client.subscribe(`stat/${this.device.id}/Power`, (err) => {
        if (err) {
          console.error(err)
          this.error = err
        } else {
          console.log(`Subscribe to stat/${this.device.id}/Power`)
          this.client.publish(`cmnd/${this.device.id}/Power1`, '')
        }
      })
    }
  }
})
</script>
