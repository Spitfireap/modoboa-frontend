<template>
  <v-form ref="vFormRef">
    <v-text-field
      :label="$gettext('Quota')"
      :hint="
        $gettext(
          'Quota shared between mailboxes. Can be expressed in KB, MB (default) or GB. A value of 0 means no quota.'
        )
      "
      persistent-hint
      v-model="domain.quota"
      class="mb-4"
      variant="outlined"
      :rules="[rules.required]"
    />

    <v-text-field
      :label="$gettext('Default mailbox quota')"
      :hint="
        $gettext(
          'Default quota applied to mailboxes. Can be expressed in KB, MB (default) or GB. A value of 0 means no quota.'
        )
      "
      persistent-hint
      v-model="domain.default_mailbox_quota"
      class="mb-4"
      variant="outlined"
      :rules="[rules.required]"
      @update:model-value="check"
    />
    <v-text-field
      :label="$gettext('Message sending limit')"
      :hint="
        $gettext(
          'Number of messages this domain can send per day. Leave empty for no limit.'
        )
      "
      persistent-hint
      v-model="domain.message_limit"
      variant="outlined"
      :rules="[rules.numericOrNull]"
    />
  </v-form>
</template>

<script setup lang="js">
import { computed, ref, onMounted } from 'vue'
import { useGettext } from 'vue3-gettext'
import rules from '@/plugins/rules.js'

const { $gettext } = useGettext()

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const vFormRef = ref()

onMounted(() => {
  check()
})

function check() {
  console.log(`input is : ${domain.value.default_mailbox_quota}`)
  console.log(typeof domain.value.default_mailbox_quota)
}

const domain = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})

defineExpose({ vFormRef })
</script>
