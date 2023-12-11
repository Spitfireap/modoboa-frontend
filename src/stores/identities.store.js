import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

import { useAccountsStore } from './accounts.store'
import { useAliasesStore } from './aliases.store'

import identitiesApi from '@/api/identities'

export const useIdentitiesStore = defineStore('identities', () => {
  const aliasesStore = useAliasesStore()
  const accountsStore = useAccountsStore()

  const identitiesLoaded = ref(false)

  const identities = ref([])

  async function _deleteIdByPkAndType(type, pk) {
    for (let i = 0; i < identities.value.length; i++) {
      if (identities.value[i].pk === pk && identities.value[i].type === type) {
        identities.value.splice(i, 1)
        return
      }
    }
  }

  async function getIdentities() {
    identitiesLoaded.value = false
    return identitiesApi.getAll().then((response) => {
      identities.value = response.data
      identitiesLoaded.value = true
      return response
    })
  }

  async function createIdentity(type, data) {
    identitiesLoaded.value = false
    if (type === 'alias') {
      return aliasesStore.createAlias(data).then((response) => {
        const alias = response.data
        const name_or_rcpt =
          alias.recipients.length > 1
            ? `${alias.recipients[0]}, ...`
            : alias.recipients[0]
        const newIdentity = {
          pk: alias.pk,
          type: 'alias',
          identity: alias.address,
          name_or_rcpt: name_or_rcpt,
          tags: [{ name: 'alias', label: 'alias', type: 'idt' }],
          possible_actions: [],
        }
        console.log(newIdentity)
        identities.value.push(newIdentity)
        console.log(identities.value)
        identitiesLoaded.value = true
        return response
      })
    }
  }

  async function deleteIdentity(type, pk) {
    identitiesLoaded.value = false
    if (type === 'alias') {
      return aliasesStore.deleteAlias(pk).then((response) => {
        _deleteIdByPkAndType(type, pk)
        identitiesLoaded.value = true
        return response
      })
    } else if (type === 'account') {
    }
  }

  return {
    identities,
    getIdentities,
    identitiesLoaded,
    deleteIdentity,
    createIdentity,
  }
})
