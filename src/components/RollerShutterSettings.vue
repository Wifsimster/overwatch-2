<template>
    <q-dialog v-model="isOpen" persistent>
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 col">{{ device.id }}</div>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-input v-model="name" placeholder="Nom" />          
          <q-input type="number" min="1" max="30" v-model="duration" placeholder="Duration" hint="Temps d'ouverture complète (en secondes)" />
        </q-card-section>
        
        <q-card-section class="row">
            <div class="col q-pr-md">
              <q-btn outline label="Forcer en fermeture" color="red" @click="setClose()" />
            </div>
            <div class="col">
              <q-btn outline label="Forcer en ouverture" color="red" @click="setOpen()" />
            </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Annuler" color="primary" v-close-popup />
          <q-btn label="Sauvegarder" color="primary" @click="save()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>

<script>
export default {
  emits: ['close'],
  props: {
    open: {
      type: Boolean,
      default: false
    },
    device: {
      type: Object,
      require: true
    },
    client: {
      type: Object,
      required: true
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
    validate() {
      return this.duration > 0 && this.duration <= 30
    },
    save() {
      if(this.validate()) {
        this.client.send(JSON.stringify({ prefix: 'update', device: { id: this.device.id, name: this.name, duration: this.duration } }))
        this.$emit('close')
      }
    },
    setClose() {
      this.client.send(JSON.stringify({ prefix: 'update', device: { id: this.device.id, openedAt: 0 } }))
      this.$emit('close')
    },
    setOpen() {
      this.client.send(JSON.stringify({ prefix: 'update', device: { id: this.device.id, openedAt: 100 } }))
      this.$emit('close')
    }
  },
  watch: {
    open() {
      this.isOpen = this.open
    }
  }
}
</script>