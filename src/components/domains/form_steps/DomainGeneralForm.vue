<template>
  <v-form ref="vFormRef">
    <v-text-field
      v-model="domain.name"
      :label="$gettext('Domain name (ex: domain.tld)')"
      :rules="[rules.required]"
      variant="outlined"
      class="mb-5"
    />

    <ChoiceField
      v-model="domain.type"
      :label="$gettext('Type')"
      :choices="domainTypes"
    />

    <v-switch
      v-model="domain.enabled"
      :label="$gettext('Enabled')"
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

const props = defineProps({ modelValue: { type: Object, default: null } })

const domain = computed(() => props.modelValue)

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
