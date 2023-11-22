<template>
<v-dialog
  v-model="dialog"
  :max-width="options.width"
  :style="{ zIndex: options.zIndex }"
  @keydown.esc="cancel"
  >
  <v-card>
    <v-toolbar dark :color="options.color" dense flat>
      <v-toolbar-title class="text-body-2 font-weight-bold">
        {{ title }}
      </v-toolbar-title>
    </v-toolbar>
    <v-card-text
      v-show="!!message"
      class="pa-4"
      >
      {{ message }}
      <slot></slot>
    </v-card-text>
    <v-card-actions class="pt-3">
      <v-spacer></v-spacer>
      <v-btn
        v-if="!options.noconfirm"
        @click.native="cancel"
        >
        {{ options.cancelLabel }}
      </v-btn>
      <v-btn
        :color="this.options.color"
        @click.native="agree">
        {{ options.agreeLabel }}
      </v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
</template>

<script setup>

import { ref } from 'vue'
import { useGettext } from 'vue3-gettext'

const { $gettext } = useGettext()

const dialog =  ref(false)
const message = ref(null)
const title = ref(null)

const options = ref({
  color: 'primary',
  width: 400,
  zIndex: 200,
  noconfirm: false,
  cancelLabel: $gettext('Cancel'),
  agreeLabel: $gettext('OK')
})

const resolve = null

function open(title, message, options) {
  dialog.value = true
  title.value = title
  message.value = message
  options.value = Object.assign(options.value, options)
  return new Promise((resolve, reject) => {
    resolve.value = resolve
  }
}

function agree () {
  resolve.value = true
  dialog.value = false
}

function cancel () {
  resolve.value = false
  dialog.value = false
}
</script>
