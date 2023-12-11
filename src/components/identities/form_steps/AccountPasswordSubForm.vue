<template>
  <div>
    <template v-if="withPasswordCheck">
      <label class="m-label">{{ $gettext('Current password') }}</label>
      <v-text-field
        v-model="account.currentPassword"
        variant="outlined"
        type="password"
        density="compact"
        validate-on="submit"
        :rules="[rules.required]"
      />
    </template>
    <div class="d-flex align-center">
      <v-switch
        v-model="account.random_password"
        :label="$gettext('Random password')"
        @update:model-value="updatePassword"
        density="compact"
        color="primary"
      />
      <template v-if="account.random_password">
        <v-alert
          style="background-color: #515d78"
          class="ml-6"
          density="compact"
        >
          <span class="white--text mr-4">{{ account.password }}</span>
          <v-btn
            size="small"
            color="white"
            variant="flat"
            icon="mdi-clipboard-multiple-outline"
            :title="$gettext('Copy to clipboard')"
            @click="copyPassword"
          />
        </v-alert>
      </template>
    </div>
    <template v-if="!account.random_password">
      <label class="m-label">{{ $gettext('Password') }}</label>
      <v-text-field
        v-model="account.password"
        variant="outlined"
        type="password"
        density="compact"
        :rules="[rules.required]"
      />
      <label class="m-label">{{ $gettext('Confirmation') }}</label>
      <v-text-field
        v-model="account.password_confirmation"
        variant="outlined"
        type="password"
        density="compact"
        :rules="[rules.required, passwordConfirmationRules]"
      />
      <v-input validate-on="submit lazy" :rules="[validPassword]"> </v-input>
    </template>
  </div>
</template>

<script setup lang="js">
import { useBusStore } from '@/stores'
import accountsApi from '@/api/accounts'
import accountApi from '@/api/account'
import { computed } from 'vue'
import rules from '@/plugins/rules'
import { useGettext } from 'vue3-gettext'

const { $gettext } = useGettext()
const busStore = useBusStore()
const props = defineProps({
  modelValue: { type: Object, default: null },
  withPasswordCheck: { type: Boolean, default: false },
})
const emit = defineEmits(['update:model-value'])

const account = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:model-value', value)
  },
})

const passwordConfirmationRules = (value) =>
  value === account.value.password || $gettext('Password mismatch')

function copyPassword() {
  navigator.clipboard.writeText(account.value.password).then(() => {
    busStore.displayNotfication({
      msg: $gettext('Password copied to clipboard'),
    })
  })
}

function updatePassword(value) {
  if (value) {
    accountsApi.getRandomPassword().then((resp) => {
      account.value.password = resp.data.password
    })
  } else {
    account.value.password = null
    account.value.password_confirmation = null
  }
}

async function validPassword() {
  return accountApi
    .checkPassword(account.value.password)
    .then(() => true)
    .catch(() => $gettext('Invalid password'))
}
</script>
