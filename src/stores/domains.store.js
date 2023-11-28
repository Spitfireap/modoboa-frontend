import { defineStore } from 'pinia'
import { useBusStore } from './bus.store'
import { ref } from 'vue'
import gettext from '@/plugins/gettext'

import domainApi from '@/api/domains'

export const useDomainsStore = defineStore('domains', () => {
  const { $gettext } = gettext
  const domainsLoaded = ref(false)
  const domains = ref([])
  const domainAliases = ref({})

  async function getDomainByPk(pk) {
    for (const domain of domains.value) {
      if (domain.pk === parseInt(pk, 10)) {
        return domain
      }
    }
    return null
  }

  async function getDomains() {
    domainsLoaded.value = false
    return domainApi.getDomains().then((response) => {
      domainsLoaded.value = true
      domains.value = response.data
      return response
    })
  }

  async function createDomain(data) {
    return domainApi.createDomain(data).then((response) => {
      domains.value.push(response.data)
      return response
    })
  }

  async function updateDomain(data) {
    return domainApi.updateDomain(data.pk, data).then((response) => {
      domains.value.forEach(function (item, pos) {
        if (item.pk === response.data.pk) {
          domains.value[pos] = response.data
        }
      })
      return response
    })
  }

  async function deleteDomain({ id, data }) {
    return domainApi.deleteDomain(id, data).then((response) => {
      domains.value = domains.value.filter((item) => item.pk !== id)
      return response
    })
  }

  async function getAliases(name) {
    return domainApi.getDomainAliases(name).then((response) => {
      domainAliases.value[name] = response.data
      return response
    })
  }

  async function _filterAlias(domainName, pk) {
    if (domainAliases.value[domainName] !== undefined) {
      return domainAliases.value[domainName].filter((al) => al.pk != pk)
    }
  }

  async function createAlias(data) {
    const busStore = useBusStore()
    const apiRequest = domainApi.createDomainAlias(data)
    const domainLookup = getDomainByPk(data.target)
    return Promise.all([apiRequest, domainLookup]).then((results) => {
      busStore.displayNotification({
        msg: $gettext('Domain alias created'),
      })
      const response = results[0]
      const domain = results[1]
      if (domain !== null) {
        if (domainAliases.value[domain.name] !== undefined) {
          domainAliases.value[domain.name].push(response.data)
        } else {
          domainAliases.value[domain.name] = response.data
        }
        domain.domainalias_count++
      }
      return response
    })
  }

  async function deleteAlias(alias) {
    const busStore = useBusStore()
    const apiRequest = domainApi.deleteDomainAlias(alias.pk)
    const domain = await getDomainByPk(alias.target)
    const filter = _filterAlias(domain.name, alias.pk)
    Promise.all([filter, apiRequest]).then((results) => {
      const newList = results[0]
      busStore.displayNotification({
        msg: $gettext('Domain alias deleted'),
      })
      if (newList != null) {
        domainAliases.value[domain.name] = newList
      }
      domain.domainalias_count--
    })
  }

  async function updateAlias(data) {
    const busStore = useBusStore()
    const domain = await getDomainByPk(data.target)
    const filter = _filterAlias(domain.name, data.pk)
    const apiRequest = domainApi.updateDomainAlias(data.pk, data)
    Promise.all([filter, apiRequest]).then((results) => {
      busStore.displayNotification({
        msg: $gettext('Domain alias updated'),
      })
      const newList = results[0]
      const response = results[1]
      if (newList != null) {
        domainAliases.value[domain.name] = newList
        domainAliases.value[domain.name].push(response.data)
      } else {
        domainAliases.value[domain.name] = response.data
      }
    })
  }
  return {
    domainsLoaded,
    domains,
    domainAliases,
    getDomainByPk,
    getDomains,
    createDomain,
    updateDomain,
    deleteDomain,
    createAlias,
    getAliases,
    deleteAlias,
    updateAlias,
  }
})
