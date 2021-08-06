<template>
    <q-dialog v-model="isOpen" persistent>
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 col">{{ device.id }}</div>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input v-model="name" placeholder="Name" />
          <q-input type="number" v-model="duration" placeholder="Duration" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn label="Submit" color="primary" @click="save()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>

<script>
import { setState } from 'src/api/state'
export default {
  props: {
    open: {
      type: Boolean,
      default: false
    },
    device: {
      type: Object,
      require: true
    }
  },
  data() {
    return {
      isOpen: this.open,
      name: null,
      duration: null
    }
  },
  created() {
    this.name = this.device?.name
    this.duration = this.device?.duration
  },
  methods: {
    async save() {
      await setState(this.device.id, { name: this.name, duration: this.duration })
      this.isOpen = false
    }
  },
  watch: {
    open() {
      this.isOpen = this.open
    }
  }
}
</script>