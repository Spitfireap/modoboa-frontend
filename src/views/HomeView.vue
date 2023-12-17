<template>
  <HelloWorld />
  <v-btn @click="openDialog">OpenDialog</v-btn>
  <v-btn @click="sendNotification({ msg: 'ok' })">Send notification</v-btn>
  <v-btn @click="sendNotification({ msg: 'pas ok du tout !', type: 'error' })"
    >Send notification2</v-btn
  >
  <ConfirmDialog ref="dialog" @agree="agree" />
</template>

<script setup>
import HelloWorld from '@/components/HelloWorld.vue'
import ConfirmDialog from '@/components/tools/ConfirmDialog.vue'
import { ref } from 'vue'
import { useGettext } from 'vue3-gettext'
import { useBusStore } from '@/stores'

const busStore = useBusStore()
const dialog = ref(null)
const { $gettext } = useGettext()

function sendNotification(notif) {
  busStore.displayNotification(notif)
}

function openDialog() {
  dialog.value.open(
    $gettext('Warning'),
    $gettext('Do you really want to delete the domain %{ domain }?', {
      domain: 'test',
    }),
    {
      color: 'warning',
      cancelLabel: $gettext('No'),
      agreeLabel: $gettext('Yes'),
    },
    { testpassthrough: 'pl' }
  )
}

function agree(passthrough) {
  console.log('agree!')
  console.log(passthrough)
}
</script>
