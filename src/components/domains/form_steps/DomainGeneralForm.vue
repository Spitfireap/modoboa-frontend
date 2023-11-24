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
import rules from '@/plugins/rules.js'
import { useGettext } from 'vue3-gettext'
import { ref, onMounted } from 'vue'

const { $gettext } = useGettext()

const props = defineProps({
  domain: Object,
})

const form = ref({})
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

onMounted(() => {
  form.value = { ...props.domain }
})

defineExpose({ vFormRef })
</script>
