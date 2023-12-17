<template>
  <span class="text-h4">{{ $gettext('Edit account') }}</span>
  <div class="mt-4" />
  <AccountForm :account="account" />
</template>

<script setup lang="js">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import accounts from '@/api/accounts'
import AccountForm from '@/components/identities/AccountForm.vue'

const route = useRoute()
const account = ref({})

accounts.get(route.params.id).then((resp) => {
  account.value = resp.data
})
</script>
