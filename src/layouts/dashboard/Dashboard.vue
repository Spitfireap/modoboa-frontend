<template>
  <v-app>
    <navbar />
    <dashboard-view />
    <v-snackbar
      v-model="snackbar"
      :color="notificationColor"
      :timeout="notificationTimeout"
      top
      >
      {{ notification }}

      <template v-slot:action="{ attrs }">
        <v-btn
          color="white"
          variant="text"
          v-bind="attrs"
          @click="snackbar = false"
          >
          {{ $gettext('Close') }}
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script setup>
  import DashboardView from './View.vue'
  import Navbar from './Navbar.vue'
  import { ref, watch, computed } from 'vue'
  import { useGettext } from 'vue3-gettext'

  import { useBusStore } from '@/stores'

  const busStore = useBusStore()
  const { $gettext } = useGettext()

  const snackbar = ref(false)
  const notificationColor = computed(() => busStore.notificationColor)
  const notificationTimeout = 2000
  const notification = computed(() => busStore.notification)

  busStore.$subscribe((mutation, state) => {
    snackbar.value = true
})

</script>
