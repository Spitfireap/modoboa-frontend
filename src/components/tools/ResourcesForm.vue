<template>
  <v-form ref="vFormRef">
    <template v-for="resource in resources" :key="resource.name">
      <label class="m-label">{{ resource.label }}</label>
      <v-text-field
        v-model="resource.max_value"
        type="number"
        variant="outlined"
        dense
        :rules="[rules.required]"
      />
    </template>
  </v-form>
</template>

<script setup lang="js">
import { ref, computed } from 'vue'

const props = defineProps({ modelValue: { type: Object, default: null } })
const emit = defineEmits(['update:modelValue'])

const resources = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})

const vFormRef = ref()

async function validateForm() {
  return await vFormRef.value.validate()
}

function getPayload() {
  return resources.value.map((r) => {
    return { name: r.name, max_value: r.max_value }
  })
}

defineExpose({ validateForm, getPayload })
</script>
