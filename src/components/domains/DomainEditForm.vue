<template>
  <div>
    <v-expansion-panels v-model="panel">
      <v-expansion-panel>
        <v-expansion-panel-header v-slot="{ open }">
          <v-row no-gutters>
            <v-col cols="4">
              {{ $gettext('General') }}
            </v-col>
            <v-col cols="8" class="text-secondary">
              <v-fade-transition leave-absolute>
                <span v-if="open"></span>
                <v-row v-else no-gutters style="width: 100%">
                  <v-col cols="6">
                    {{ $gettext('Name: ') }} {{ editedDomain.name }}
                  </v-col>
                  <v-col cols="6">
                    {{ $gettext('Type: ') }} {{ editedDomain.type }}
                  </v-col>
                </v-row>
              </v-fade-transition>
            </v-col>
          </v-row>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <DomainGeneralForm ref="generalForm" v-model="editedDomain" />
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header v-slot="{ open }">
          <v-row no-gutters>
            <v-col cols="4">
              {{ $gettext('DNS') }}
            </v-col>
            <v-col cols="8" class="text-secondary">
              <v-fade-transition leave-absolute>
                <span v-if="open"></span>
                <v-row v-else no-gutters style="width: 100%">
                  <v-col cols="6">
                    <div class="mr-2">{{ $gettext('DNS checks') }}</div>
                    <v-icon
                      v-if="editedDomain.enable_dns_checks"
                      color="success"
                      >mdi-check-circle-outline</v-icon
                    >
                    <v-icon v-else>mdi-close-circle-outline</v-icon>
                  </v-col>
                  <v-col cols="6">
                    <div class="mr-2">{{ $gettext('DKIM signing') }}</div>
                    <v-icon v-if="editedDomain.enable_dkim" color="success"
                      >mdi-check-circle-outline</v-icon
                    >
                    <v-icon v-else>mdi-close-circle-outline</v-icon>
                  </v-col>
                </v-row>
              </v-fade-transition>
            </v-col>
          </v-row>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <DomainDNSForm ref="dnsForm" v-model="editedDomain" />
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header v-slot="{ open }">
          <v-row no-gutters>
            <v-col cols="4">
              {{ $gettext('Limitations') }}
            </v-col>
            <v-col cols="8" class="text-secondary">
              <v-fade-transition leave-absolute>
                <span v-if="open"></span>
                <v-row v-else no-gutters style="width: 100%">
                  <v-col cols="6">
                    <div class="mr-2">
                      {{ $gettext('Quota: ') }} {{ domain.quota }}
                    </div>
                  </v-col>
                  <v-col v-if="domain.message_limit" cols="6">
                    <div class="mr-2">
                      {{ $gettext('Sending limit: ') }}
                      {{ domain.message_limit }}
                    </div>
                  </v-col>
                  <v-col v-else cols="6">
                    <div class="mr-2">{{ $gettext('No sending limit') }}</div>
                  </v-col>
                </v-row>
              </v-fade-transition>
            </v-col>
          </v-row>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <DomainLimitationsForm v-model="editedDomain" />
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel v-if="editedDomain.type === 'relaydomain'">
        <v-expansion-panel-header v-slot="{ open }">
          <v-row no-gutters>
            <v-col cols="4">
              {{ $gettext('Transport') }}
            </v-col>
            <v-col cols="8" class="text-secondary">
              <v-fade-transition leave-absolute>
                <span v-if="open"></span>
                <v-row v-else no-gutters style="width: 100%">
                  <v-col cols="6">
                    <div class="mr-2">
                      {{ $gettext('Service: ') }}
                      {{ editedDomain.transport.service }}
                    </div>
                  </v-col>
                </v-row>
              </v-fade-transition>
            </v-col>
          </v-row>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <DomainTransportForm ref="transportForm" v-model="editedDomain" />
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel
        v-if="
          limitsConfig.params &&
          limitsConfig.params.enable_domain_limits &&
          (authUser.role === 'SuperAdmins' || authUser.role === 'Resellers')
        "
      >
        <v-expansion-panel-header>
          <v-row no-gutters>
            <v-col cols="4">
              {{ $gettext('Resources') }}
            </v-col>
          </v-row>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <ResourcesForm ref="resourcesForm" v-model="editedDomain.resources" />
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <div class="mt-4 d-flex justify-end">
      <v-btn :loading="working" @click="$router.go(-1)">
        {{ $gettext('Cancel') }}
      </v-btn>
      <v-btn
        class="ml-4"
        color="primary darken-1"
        :loading="working"
        @click="save"
      >
        {{ $gettext('Save') }}
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="js">
import DomainDNSForm from './form_steps/DomainDNSForm.vue'
import DomainGeneralForm from './form_steps/DomainGeneralForm.vue'
import DomainLimitationsForm from './form_steps/DomainLimitationsForm.vue'
import DomainTransportForm from './form_steps/DomainTransportForm.vue'
import parametersApi from '@/api/parameters'
import ResourcesForm from '@/components/tools/ResourcesForm.vue'
import { computed, ref } from 'vue'
import { useGettext } from 'vue3-gettext'
import { useAuthStore, useDomainsStore, useBusStore } from '@/stores'

const { $gettext } = useGettext()
const authStore = useAuthStore()
const domainsStore = useDomainsStore()
const busStore = useBusStore()

const props = defineProps({ domain: { type: Object, default: null } })
const authUser = computed(() => authStore.authUser)

const editedDomain = computed(() => {
  const _editdomain = props.domain
  if (
    _editdomain.value.type === 'relaydomain' &&
    _editdomain.value.transport === null
  ) {
    _editdomain.value.transport = {}
  }
  return _editdomain
})
const limitsConfig = ref({})
const panel = ref(0)
const working = ref(false)

//refs
const generalForm = ref()
const resourcesForm = ref()
const transportForm = ref()

async function save() {
  if (generalForm.value !== undefined) {
    const { valid } = await generalForm.value.vFormRef.value.validate()
    if (!valid) {
      return
    }
  }
  if (resourcesForm.value !== undefined) {
    const { valid } = await resourcesForm.value.vFormRef.value.validate()
    if (!valid) {
      return
    }
  }
  working.value = true
  try {
    const data = JSON.parse(JSON.stringify(editedDomain.value))
    if (data.transport === null) {
      delete data.transport
    }
    if (data.type === 'relaydomain') {
      transportForm.value.checkSettingTypes(data)
    }
    domainsStore.updateDomain(data).then(() => {
      busStore.displayNotification({ msg: this.$gettext('Domain updated') })
    })
  } finally {
    working.value = false
  }
}

parametersApi.getApplication('limits').then((resp) => {
  limitsConfig.value.data = resp.data
})
</script>
