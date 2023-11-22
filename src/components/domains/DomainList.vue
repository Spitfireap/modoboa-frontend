<template>
  <v-card class="mt-6">
    <v-toolbar flat>
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-bind="attrs" v-on="on" small>
            Actions <v-icon right>mdi-chevron-down</v-icon>
          </v-btn>
        </template>
        <v-list dense> </v-list>
      </v-menu>
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        prepend-inner-icon="mdi-magnify"
        placeholder="Search"
        filled
        outlined
        dense
        hide-details
      ></v-text-field>
    </v-toolbar>
    <v-data-table
      v-model="selected"
      :headers="headers"
      :items="domains"
      :search="search"
      item-key="name"
      class="elevation-1"
      show-select
      single-expand
      :expanded.sync="expanded"
      @item-expanded="loadAliases"
      @click:row="showAliases"
      :loading="!domainsLoaded"
    >
      <template v-slot:item="{ item, isExpanded, expand }">
        <tr>
          <td>
            <v-checkbox />
          </td>
          <td>
            <router-link
              :to="{ name: 'DomainDetail', params: { id: item.pk } }"
            >
              {{ item.name }}
            </router-link>
            <v-chip
              v-if="item.type === 'relaydomain'"
              small
              color="primary"
              class="ml-2"
            >
              {{ $gettext('Relay') }}
            </v-chip>
            <template v-if="!item.enabled">
              {{ $gettext('(disabled)') }}
            </template>
          </td>
          <td>
            {{ item.domainalias_count }} aliases
            <v-btn
              v-if="item.domainalias_count"
              icon
              @click="expand(!isExpanded)"
            >
              <v-icon v-if="!isExpanded">mdi-chevron-down</v-icon>
              <v-icon v-else>mdi-chevron-up</v-icon>
            </v-btn>
          </td>
          <td>
            <dns-status-chip :status="item.dns_global_status" />
          </td>
          <td>
            <v-progress-linear v-model="item.allocated_quota_in_percent" />
          </td>
          <td>
            <v-progress-linear v-model="item.allocated_quota_in_percent" />
          </td>
          <td>
            <div class="text-right">
              <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <v-badge
                    v-if="item.opened_alarms_count"
                    bordered
                    color="error"
                    icon="mdi-bell"
                    overlap
                  >
                    <v-btn icon v-bind="attrs" v-on="on">
                      <v-icon>mdi-dots-horizontal</v-icon>
                    </v-btn>
                  </v-badge>
                  <v-btn v-else icon v-bind="attrs" v-on="on">
                    <v-icon>mdi-dots-horizontal</v-icon>
                  </v-btn>
                </template>
                <menu-items :items="getDomainMenuItems(item)" :object="item" />
              </v-menu>
            </div>
          </td>
        </tr>
      </template>
      <template v-slot:expanded-item="{ headers, item }">
        <tr class="grey lighten-4">
          <td :colspan="headers.length">
            <span
              v-for="alias in aliases[item.name]"
              :key="alias.name"
              class="mr-4"
            >
              <a href="#" class="mr-2" @click="editDomainAlias(item, alias)">{{
                alias.name
              }}</a>
              <v-chip x-small color="success">DNS OK</v-chip>
            </span>
          </td>
        </tr>
      </template>
    </v-data-table>
    <confirm-dialog ref="confirm">
      <v-checkbox
        v-model="keepDomainFolder"
        :label="'Do not delete domain folder' | translate"
        hide-details
      />
    </confirm-dialog>
    <v-dialog v-model="showAliasForm" persistent max-width="800px">
      <domain-alias-form
        @close="closeDomainAliasForm"
        :domain-alias="selectedDomainAlias"
        @alias-created="domainAliasCreated"
        @alias-deleted="domainAliasDeleted"
      />
    </v-dialog>
    <v-dialog v-model="showAdminList" persistent max-width="800px">
      <administrator-list
        :domain="selectedDomain"
        @close="showAdminList = false"
        dialog-mode
      />
    </v-dialog>
  </v-card>
</template>

<script setup>
import { useBusStore, useDomainStore } from '@/stores'
import { useGettext } from '@/stores'
import { useRouter } from 'vue-router'
import domainApi from '@/api/domains'
import AdministratorList from './AdministratorList'
import ConfirmDialog from '@/components/layout/ConfirmDialog'
import DNSStatusChip from './DNSStatusChip'
import DomainAliasForm from '@/components/domains/DomainAliasForm'
import MenuItems from '@/components/tools/MenuItems'

import { computed, ref } from 'vue'

const { $gettext } = useGettext()
const router = useRouter()

const busStore = useBusStore()
const domainStore = useDomainStore()
const domains = computed(() => domainStore.domains)
const domainsLoaded = computed(() => domainStore.domainsLoaded)

const headers = [
  { text: $gettext('Name'), value: 'name' },
  { text: $gettext('Aliases'), value: 'domainalias_count' },
  { text: $gettext('DNS status'), value: 'dns_global_status', sortable: false },
  { text: $gettext('Sending limit'), value: 'message_limit' },
  { text: $gettext('Quota'), value: 'allocated_quota_in_percent' },
  {
    text: $gettext('Actions'),
    value: 'actions',
    sortable: false,
    align: 'right',
  },
]

const keepDomainFolder = ref(false)
const selectedDomain = ref(null)
const selectedDomainAlias = ref(null)
const showAdminList = ref(false)
const showConfirmDialog = ref(false)
const showAliasForm = ref(false)
const search = ref('')
const selected = ref([])
const expanded = ref([])
const aliases = ref({})

domainStore.getDomains()

function closeDomainAliasForm() {
  showAliasForm.value = false
  selectedDomain.value = null
  selectedDomainAlias.value = null
}

async function deleteDomain(domain) {
  const confirm = await this.$refs.confirm.open(
    $gettext('Warning'),
    $gettext('Do you really want to delete the domain %{ domain }?', {
      domain: domain.name,
    }),
    {
      color: 'error',
      cancelLabel: $gettext('No'),
      agreeLabel: $gettext('Yes'),
    }
  )
  if (!confirm) {
    return
  }
  const data = { keep_folder: keepDomainFolder.value }
  domainStore.deleteDomain({ id: domain.pk, data }).then(() => {
    busStore.displayNotification({ msg: this.$gettext('Domain deleted') })
    keepDomainFolder.value = false
  })
}

function domainAliasCreated() {
  domainStore.getDomains()
}

function domainAliasDeleted() {
  const newList = aliases.value[this.selectedDomain.name].filter((alias) => {
    return alias.pk !== selectedDomainAlias.value.pk
  })
  this.$set(this.aliases, this.selectedDomain.name, newList)
  if (!newList.length) {
    this.expanded = []
  }
  domainStore.getDomains()
  closeDomainAliasForm()
}

function editDomain(domain) {
  router.push({ name: 'DomainEdit', params: { id: domain.pk } })
}

function editDomainAlias(domain, alias) {
  selectedDomain.value = domain
  selectedDomainAlias.value = alias
  showAliasForm.value = true
}

function loadAliases({ item, value }) {
  if (!value) {
    return
  }
  domainApi.getDomainAliases(item.name).then((resp) => {
    this.$set(this.aliases, item.name, resp.data)
  })
}

function openAdminList(domain) {
  selectedDomain.value = domain
  showAdminList.value = true
}

function showAliases(item) {
  expanded.value = [{ item }]
}

function getDomainMenuItems(domain) {
  const result = [
    {
      label: $gettext('Administrators'),
      icon: 'mdi-account-supervisor',
      onClick: openAdminList,
    },
    {
      label: $gettext('Edit'),
      icon: 'mdi-circle-edit-outline',
      onClick: editDomain,
    },
    {
      label: $gettext('Delete'),
      icon: 'mdi-delete-outline',
      onClick: deleteDomain,
      color: 'red',
    },
  ]
  if (domain.opened_alarms_count) {
    result.push({
      label: $gettext('Alarms'),
      icon: 'mdi-bell',
      color: 'red',
      onClick: () => router.push({ name: 'Alarms' }),
    })
  }
  return result
}
</script>

<style scoped>
.v-text-field--outlined >>> fieldset {
  border-color: #bfc5d2;
}
.v-input--checkbox >>> .v-label {
  font-size: 0.875rem !important;
}
</style>
