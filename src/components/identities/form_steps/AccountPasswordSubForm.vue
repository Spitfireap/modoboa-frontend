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
    <v-row justify="center">
      <v-col cols="auto">
        <v-switch
          v-model="account.random_password"
          :label="$gettext('Random password')"
          density="compact"
          color="primary"
          class="text-center"
          @update:model-value="updatePassword"
        />
      </v-col>
      <template v-if="account.random_password">
        <v-col>
          <v-alert
            style="background-color: #515d78"
            class="ml-6"
            density="compact"
          >
            <span class="text-white mr-4">{{ account.password }}</span>
            <v-btn
              size="small"
              color="white"
              variant="text"
              density="compact"
              icon="mdi-clipboard-multiple-outline"
              :title="$gettext('Copy to clipboard')"
              @click="copyPassword"
            />
          </v-alert>
        </v-col>
      </template>
    </v-row>
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

const account = computed(() => props.modelValue)

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
