<template>
  <v-form ref="vFormRef">
    <label class="m-label">{{ $gettext('Username') }}</label>
    <EmailField
      ref="username"
      v-model="account.username"
      :placeholder="usernamePlaceholder"
      :type="usernameInputType"
      :rules="
        usernameInputType === 'email'
          ? [rules.required, rules.email]
          : [rules.required]
      "
    />
    <label class="m-label">{{ $gettext('First name') }}</label>
    <v-text-field
      v-model="account.first_name"
      autocomplete="new-password"
      variant="outlined"
      density="compact"
    />
    <label class="m-label">{{ $gettext('Last name') }}</label>
    <v-text-field
      v-model="account.last_name"
      autocomplete="new-password"
      variant="outlined"
      density="compact"
    />

    <AccountPasswordSubForm ref="passwordForm" v-model="account" />

    <v-switch
      v-model="account.is_active"
      :label="$gettext('Enabled')"
      density="compact"
      color="primary"
    />
  </v-form>
</template>

<script setup lang="js">
import AccountPasswordSubForm from './AccountPasswordSubForm.vue'
import EmailField from '@/components/tools/EmailField.vue'
import { ref, computed } from 'vue'
import { useGettext } from 'vue3-gettext'
import rules from '@/plugins/rules'

const { $gettext } = useGettext()
const props = defineProps({ modelValue: { type: Object, default: null } })
const emit = defineEmits(['update:model-value'])

const vFormRef = ref()

const account = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    if (value.username.indexOf('@') !== -1) {
      value.mailbox.full_address = value.username
      value.mailbox.message_limit = null
    } else {
      delete value.mailbox.full_address
      delete value.mailbox.message_limit
    }
    emit('update:model-value', value)
  },
})

const usernamePlaceholder = computed(() => {
  if (account.value.role === 'SimpleUsers') {
    return $gettext('Enter an email address')
  }
  return $gettext('Enter a simple username or an email address')
})

const usernameInputType = computed(() => {
  return account.value.role === 'SimpleUsers' ? 'email' : 'text'
})

defineExpose({ vFormRef })
</script>
