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
            v-if="!isClosing"
            :loading="isOpening"
            @click="open()"
            >
            <template>
                <q-spinner-radio/>
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
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'device',
  props: [ 'client', 'device' ],
  computed: {
    progress() {
      return Math.round(this.openedAt)
    }
  },
  data() {
    return {
      ratio: 100 / this.device.duration,
      openedAt: 0,
      isOpening: false,
      isClosing: false,
      interval: null
    }
  },
  methods: {
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
      if (this.openedAt < 100 && !this.isClosing) {
        this.isOpening = true

        this.client.publish(`cmnd/${this.device.id}/Power1`, '1')

        this.interval = setInterval(() => {
          if(this.openedAt < 100 - this.ratio) {
            this.openedAt +=  this.ratio
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
      if (this.openedAt > 0 && !this.isOpening) {
        this.isClosing = true

        this.client.publish(`cmnd/${this.device.id}/Power2`, '1')

        this.interval = setInterval(() => {
          if(this.openedAt > 0 + this.ratio) {
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
