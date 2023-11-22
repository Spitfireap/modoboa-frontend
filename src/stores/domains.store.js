import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

import domainApi from '@/api/domains'

export const useDomainsStore = defineStore('domains', () => {
  const domainsLoaded = ref(false)
  const domains = ref([])

  const getDomainByPk = computed((pk) => {
    for (const domain of domains.value) {
      if (domain.pk == parseInt(pk, 10)) {
        return domain
      }
    }
    return null
  })

  async function getDomains() {
    return domainApi.getDomains().then((response) => {
      domainsLoaded.value = true
      domains.value = response.data
    })
  }

  async function createDomain(data) {
    return domainApi.createDomain(data).then((response) => {
      domains.value.push(response.data)
    })
  }

  async function updateDomain(data) {
    return domainApi.updateDomain(data.pk, data).then((response) => {
      domains.value.forEach(function (item, pos) {
        if (item.pk === response.data.pk) {
          domains.value[pos] = response.data
        }
      })
    })
  }

  async function deleteDomain({ id, data }) {
    return domainApi.deleteDomain(id, data).then(() => {
      domains.value = domains.value.filter((item) => item.pk !== id)
    })
  }

  return {
    domainsLoaded,
    domains,
    getDomainByPk,
    getDomains,
    createDomain,
    updateDomain,
    deleteDomain,
  }
})
