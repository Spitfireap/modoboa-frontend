import { defineStore } from 'pinia'
import { ref } from 'vue'

import accountsApi from '@/api/accounts'

export const useAccountsStore = defineStore('accounts', () => {
  const accounts = ref([])

  const accountsLoaded = ref(false)

  async function getAll() {
    return accountsApi.getAll().then((response) => {
      accounts.value = response.data
      return response
    })
  }
  return {
    accounts,
    accountsLoaded,
    getAll,
  }
})
