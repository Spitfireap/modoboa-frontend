<template>
  <v-app>
    <Navbar />
    <DashboardView />
    <v-snackbar
      v-model="snackbar"
      :color="notificationColor"
      :timeout="notificationTimeout"
      location="top"
    >
      {{ notification }}
      <template v-slot:actions>
        <v-btn color="white" text @click="snackbar = false">
          {{ $gettext('Close') }}
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script setup>
import DashboardView from './View.vue'
import Navbar from './Navbar.vue'
import { ref, computed } from 'vue'
import { useGettext } from 'vue3-gettext'

import { useBusStore } from '@/stores'

const busStore = useBusStore()
const { $gettext } = useGettext()

const notificationColor = computed(() => busStore.notificationColor)
const notificationTimeout = 2000
const notification = computed(() => busStore.notification)
const snackbar = ref(false)

busStore.$onAction(({ name, after }) => {
  if (name === 'displayNotification') {
    after(() => {
      snackbar.value = true
    })
  }
}, true)
</script>
