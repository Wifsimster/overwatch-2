<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>Domotique</q-toolbar-title>
        <div>v{{ version }}</div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent } from 'vue'
import pkg from '../../package.json'

export default defineComponent({
  name: 'MainLayout',
  setup() {
    return {
      version: pkg.version
    }
  },
})
</script>
