<template>
  <q-page class="flex flex-center">
    <q-list bordered>
      <q-item clickable v-ripple>
        <q-item-section>
          Volet roulant
        </q-item-section>
        <q-item-section>
          {{ rollerShutter.progress }}%
        </q-item-section>
        <q-item-section style="width:200px" class="q-col-gutter row">
          <q-btn unelevated rounded label="Ouvrir" color="primary" @click="open" />
          &nbsp;
          <q-btn unelevated rounded label="Fermer" color="primary" @click="close" />
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
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
        ratio: 100 / 28000
      },
      client: null
    }
  },
  created() {
    this.client = mqtt.connect('ws://192.168.0.195:9001')

    this.client.on('connect', () => {
      this.client.subscribe(`stat/${this.rollerShutter.id}/Power`, (err) => {
        if (err) {
          console.error(err)
        } else {
          console.log(`Subscribe to stat/${this.rollerShutter.id}/Power`)
          this.client.publish(`cmnd/${this.rollerShutter.id}/Power1`, '')
        }
      })
    })

    this.client.on('message', (topic, message) => {
      console.log(topic + ':' + message.toString())
      // this.client.end()
    })
  },
  methods: {
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
