<template>
  <v-form ref="vFormRef">
    <div>
      <v-switch
        :label="$gettext('Enable DNS checks')"
        v-model="domain.enable_dns_checks"
        color="primary"
      />
      <v-switch
        :label="$gettext('Enable DKIM signing')"
        v-model="domain.enable_dkim"
        color="primary"
      />
      <v-text-field
        :label="$gettext('DKIM key selector')"
        v-model="domain.dkim_key_selector"
        :disabled="!domain.enable_dkim"
        variant="outlined"
      />
      <choice-field
        :label="$gettext('DKIM key length')"
        v-model="domain.dkim_key_length"
        :choices="dkimKeyLengths"
        :disabled="!domain.enable_dkim"
      />
    </div>
  </v-form>
</template>

<script setup lang="js">
import ChoiceField from '@/components/tools/ChoiceField'
import { useGettext } from 'vue3-gettext'
import { ref, computed } from 'vue'

const { $gettext } = useGettext()

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const vFormRef = ref()

const domain = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})

const dkimKeyLengths = ref([
  {
    label: '1024',
    value: 1024,
  },
  {
    label: '2048',
    value: 2048,
  },
  {
    label: '4096',
    value: 4096,
  },
])

defineExpose({ vFormRef })
</script>
