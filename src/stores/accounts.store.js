import { defineStore } from 'pinia'
import { ref } from 'vue'

import { useBusStore } from './bus.store'

import accountsApi from '@/api/accounts'
import gettext from '@/plugins/gettext'

export const useAccountsStore = defineStore('accounts', () => {
  const busStore = useBusStore()

  const { $gettext } = gettext

  const accounts = ref([])
  const accountsLoaded = ref(false)

  async function getAll() {
    return accountsApi.getAll().then((response) => {
      accounts.value = response.data
      return response
    })
  }

  async function createAccount(data) {
    return accountsApi.create(data).then((response) => {
      accounts.value.push(response.data)
      busStore.displayNotification({ msg: $gettext('Account created') })
      return response
    })
  }
  return {
    accounts,
    accountsLoaded,
    getAll,
    createAccount,
  }
})
