<template>
  <v-form ref="vFormRef">
    <v-switch
      v-model="createAdmin"
      :label="$gettext('Create a domain administrator')"
      color="primary"
      @update:model-value="updateCreateAdmin"
    />
    <v-text-field
      v-model="domain.domain_admin.username"
      :label="$gettext('Name')"
      :hint="$gettext('Name of the administrator')"
      persistent-hint
      variant="outlined"
      :disabled="!createAdmin"
      :suffix="`@${domain.name}`"
      :rules="[!createAdmin || rules.required]"
    />
    <v-switch
      v-model="domain.domain_admin.with_random_password"
      :label="$gettext('Random password')"
      :disabled="!createAdmin"
      :hint="$gettext('Generate a random password for the administrator.')"
      persistent-hint
      color="primary"
      @update:model-value="updatePassword"
    />
    <v-switch
      v-model="domain.domain_admin.with_mailbox"
      :label="$gettext('With a mailbox')"
      :disabled="!createAdmin"
      :hint="$gettext('Create a mailbox for the administrator.')"
      persistent-hint
      color="primary"
    />
    <v-switch
      v-model="domain.domain_admin.with_aliases"
      :label="$gettext('Create aliases')"
      :disabled="!createAdmin"
      :hint="$gettext('Create standard aliases for the domain.')"
      persistent-hint
      color="primary"
    />
  </v-form>
</template>

<script setup lang="js">
import accountsApi from '@/api/accounts'
import { ref, computed } from 'vue'
import { useGettext } from 'vue3-gettext'
import rules from '@/plugins/rules.js'

const { $gettext } = useGettext()

const props = defineProps({ modelValue: { type: Object, default: () => {} } })
const emit = defineEmits(['update:modelValue', 'createAdmin'])

const vFormRef = ref()

const createAdmin = ref(false)

const domain = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})

function updatePassword(value) {
  if (value) {
    accountsApi.getRandomPassword().then((resp) => {
      domain.value.domain_admin.password = resp.data.password
    })
  } else {
    delete domain.value.domain_admin.password
  }
}
function updateCreateAdmin(val) {
  emit('createAdmin', val)
}

defineExpose({ vFormRef })
</script>
