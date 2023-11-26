<template>
  <v-form ref="vFormRef">
    <v-text-field
      :label="$gettext('Domain name (ex: domain.tld)')"
      v-model="form.name"
      :rules="[rules.required]"
      variant="outlined"
      class="mb-5"
    />

    <choice-field
      v-model="form.type"
      :label="$gettext('Type')"
      :choices="domainTypes"
    />

    <v-switch
      :label="$gettext('Enabled')"
      v-model="form.enabled"
      :hint="
        $gettext(
          'Control if this domain will be allowed to send and receive messages'
        )
      "
      color="primary"
      persistent-hint
    />
  </v-form>
</template>

<script setup lang="js">
import ChoiceField from '@/components/tools/ChoiceField'
import { useGettext } from 'vue3-gettext'
import { ref, computed } from 'vue'
import rules from '@/plugins/rules.js'

const { $gettext } = useGettext()

const props = defineProps({
  modelValue: Object,
})

const emit = defineEmits(['update:model-value'])

const form = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:model-value', value)
  },
})

const vFormRef = ref()

const domainTypes = [
  {
    label: 'Domain',
    icon: 'mdi-earth',
    value: 'domain',
  },
  {
    label: 'Relay domain',
    icon: 'mdi-earth',
    value: 'relaydomain',
  },
]

defineExpose({ vFormRef })
</script>
