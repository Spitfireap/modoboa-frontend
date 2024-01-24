<template>
  <v-dialog
    v-model="dialog"
    :max-width="options.width"
    :z-index="options.zIndex"
    @keydown.esc="cancel"
  >
    <v-card>
      <v-toolbar :color="options.color" density="compact" flat>
        <v-toolbar-title class="text-body-2 font-weight-bold">
          {{ title }}
        </v-toolbar-title>
      </v-toolbar>
      <v-card-text v-show="!!message" class="pa-4">
        {{ message }}
        <slot></slot>
      </v-card-text>
      <v-card-actions class="pt-3">
        <v-spacer></v-spacer>
        <v-btn v-if="!options.noconfirm" @click="cancel">
          {{ options.cancelLabel }}
        </v-btn>
        <v-btn :color="options.color" @click="agree">
          {{ options.agreeLabel }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="js">
import { ref } from 'vue'
import { useGettext } from 'vue3-gettext'

const { $gettext } = useGettext()

const dialog = ref(false)
const message = ref('')
const title = ref('')
let storedResolve
let storedReject
let passthrough = null

const emit = defineEmits(['agree', 'cancel'])

const options = ref({
  color: 'primary',
  width: 400,
  zIndex: 2400,
  noconfirm: false,
  cancelLabel: $gettext('Cancel'),
  agreeLabel: $gettext('OK'),
})

function open(_title, _message, _options, _passthrough = null) {
  dialog.value = true
  title.value = _title
  message.value = _message
  options.value = Object.assign(options.value, _options)
  if (_passthrough !== null) {
    passthrough = _passthrough
  }
  return new Promise((resolve, reject) => {
    storedResolve = resolve
    storedReject = reject
  })
}
defineExpose({
  open,
})

function agree() {
  storedResolve(true)
  dialog.value = false
  emit('agree', passthrough)
  passthrough = null
}

function cancel() {
  storedResolve(false)
  dialog.value = false
  emit('cancel', passthrough)
  passthrough = null
}
</script>
