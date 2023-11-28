<template>
  <div>
    <v-toolbar flat>
      <v-toolbar-title
        >{{ $gettext('Domain') }} {{ domain.name }}</v-toolbar-title
      >
      <v-btn
        color="primary"
        icon="mdi-circle-edit-outline"
        :to="{ name: 'DomainEdit', params: { id: domain.pk } }"
      ></v-btn>
    </v-toolbar>

    <v-tabs v-model="tab">
      <v-tab>
        {{ $gettext('General') }}
      </v-tab>
      <v-tab>
        {{ $gettext('Statistics') }}
      </v-tab>
      <v-tab>
        {{ $gettext('DMARC') }}
      </v-tab>
    </v-tabs>
    <v-window v-model="tab">
      <v-window-item>
        <v-layout class="pa-2">
          <v-row>
            <v-col cols="6">
              <DomainSummary :domain="domain" />
              <div class="mt-4" />
              <DomainAdminList :domain="domain" />
            </v-col>
            <v-col cols="6">
              <DNSDetail v-model="domain" />
              <div class="mt-4" />
              <ResourcesForm
                v-if="
                  limitsConfig.params &&
                  limitsConfig.params.enable_domain_limits &&
                  domain.resources &&
                  domain.resources.length
                "
                :resources="domain.resources"
              />
            </v-col>
          </v-row>
        </v-layout>
      </v-window-item>
      <v-window-item>
        <v-layout class="pa-2">
          <v-row class="mt-2">
            <v-col cols="12">
              <TimeSerieChart
                v-if="domain.name"
                :domain="domain"
                graphic-set="mailtraffic"
                graphic-name="averagetraffic"
              />
            </v-col>
            <v-col cols="12">
              <TimeSerieChart
                v-if="domain.name"
                :domain="domain"
                graphic-set="mailtraffic"
                graphic-name="averagetrafficsize"
              />
            </v-col>
          </v-row>
        </v-layout>
      </v-window-item>
      <v-window-item>
        <DmarcAligmentChart :domain="domain" />
      </v-window-item>
    </v-window>
    <v-dialog v-model="showEditForm" persistent max-width="800px">
      <DomainEditForm :domain="domain" @close="showEditForm = false" />
    </v-dialog>
  </div>
</template>

<script setup lang="js">
import DomainAdminList from '@/components/domains/DomainAdminList.vue'
import DmarcAligmentChart from '@/components/dmarc/DmarcAligmentChart.vue'
import DNSDetail from '@/components/domains/DNSDetail.vue'
import DomainEditForm from '@/components/domains/DomainEditForm.vue'
import DomainSummary from '@/components/domains/DomainSummary.vue'
import parametersApi from '@/api/parameters'
import domainsApi from '@/api/domains'
import ResourcesForm from '@/components/tools/ResourcesForm.vue'
import TimeSerieChart from '@/components/tools/TimeSerieChart.vue'
import { useGettext } from 'vue3-gettext'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const { $gettext } = useGettext()
const route = useRoute()

const domain = ref({ pk: route.params.id })

const limitsConfig = ref({})
const showEditForm = ref(false)
//TODO: const showAdminList = ref(false)
const tab = ref(null)

onMounted(() => {
  parametersApi.getApplication('limits').then((resp) => {
    limitsConfig.value = resp.data
  })
  domainsApi.getDomain(route.params.id).then((resp) => {
    domain.value = resp.data
  })
})
</script>

<style scoped>
.v-toolbar {
  background-color: #f7f8fa !important;
}
.v-tabs-items {
  background-color: #f7f8fa !important;
}
</style>
