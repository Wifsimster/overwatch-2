<template>
    <q-card>
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
  props: [ 'device' ],
  computed: {
    progress() {
      return Math.round(this.device.openedAt)
    }
  },
})
</script>
