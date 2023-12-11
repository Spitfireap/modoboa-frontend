import { defineStore } from 'pinia'
import { ref } from 'vue'
import aliasesApi from '@/api/aliases'
import { useBusStore } from './bus.store'

import gettext from '@/plugins/gettext'

export const useAliasesStore = defineStore('aliases', () => {
  const busStore = useBusStore()
  const { $gettext } = gettext

  const aliases = ref([])

  const aliasesLoaded = ref(false)

  async function _getIndexByPk(pk) {
    for (let i = 0; i < aliases.value.length; i++) {
      if (aliases[i].pk === pk) {
        return i
      }
    }
    return null
  }

  async function getAll() {
    return aliasesApi.getAll().then((response) => {
      aliases.value = response.data
      return response
    })
  }

  async function createAlias(data) {
    aliasesLoaded.value = false
    return aliasesApi.create(data).then((response) => {
      aliases.value.push(response.data)
      aliasesLoaded.value = true
      busStore.displayNotification({
        msg: $gettext('Alias successfully created'),
      })
      return response
    })
  }

  async function deleteAlias(pk) {
    aliasesLoaded.value = false
    const apiRequest = aliasesApi.delete(pk)
    const aliasIndex = _getIndexByPk(pk)
    Promise.all([apiRequest, aliasIndex]).then((response) => {
      if (response[1] !== null) {
        aliases.value.splice(response[1], 1)
      }
      aliasesLoaded.value = true
      busStore.displayNotification({
        msg: $gettext('Alias successfully deleted'),
      })
      return response[0]
    })
  }

  return {
    aliases,
    aliasesLoaded,
    getAll,
    createAlias,
    deleteAlias,
  }
})
