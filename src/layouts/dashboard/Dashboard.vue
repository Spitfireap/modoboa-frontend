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
  import { useStore } from 'vuex'
  import { ref, watch, computed } from 'vue'
  import { useGettext } from 'vue3-gettext'

  const store = useStore()
  const { $gettext } = useGettext()

  const snackbar = ref(false)
  const notificationColor = ref('error')
  const notificationTimeout = 2000
  const notification = computed(() => store.state.bus.notification)

  watch(notification, (old, notif) => {
    notificationColor.value = store.state.notification.notificationColor
    snackbar.value = true
  })

</script>
