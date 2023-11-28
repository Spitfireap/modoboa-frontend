<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    min-width="auto"
  >
    <template #activator="{ props }">
      <v-text-field
        :value="modelValue"
        :label="label"
        prepend-icon="mdi-calendar"
        readonly
        v-bind="props"
      ></v-text-field>
    </template>
    <v-date-picker :value="modelValue" no-title @input="update">
    </v-date-picker>
  </v-menu>
</template>

<script setup lang="js">
import { ref, computed } from 'vue'

const props = defineProps({
  modelValue: { type: Object, default: null },
  label: { type: String, default: '' },
})
const emit = defineEmits(['update:modelValue'])

const menu = ref(false)
function update(value) {
  emit('update:modelValue', value)
  menu.value = false
}
</script>
