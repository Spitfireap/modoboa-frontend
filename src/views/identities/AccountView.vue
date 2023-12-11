<template>
  <v-toolbar flat>
    <v-toolbar-title
      >{{ $gettext('Account') }} {{ account.username }}</v-toolbar-title
    >
    <v-btn
      color="primary"
      icon="mdi-circle-edit-outline"
      :to="{ name: 'AccountEdit', params: { id: account.pk } }"
    >
    </v-btn>
  </v-toolbar>
  <v-row>
    <v-col cols="6">
      <AccountSummary :account="account" />
      <DomainAdminDomains
        v-if="account.role === 'DomainAdmins'"
        class="mt-2"
        :account="account"
      />
    </v-col>
    <v-col cols="6">
      <ResourcesView
        v-if="
          limitsConfig.params &&
          limitsConfig.params.enable_admin_limits &&
          account.role !== 'SimpleUsers' &&
          account.role !== 'SuperAdmins'
        "
        :resources="account.resources"
      />
      <AccountAliases v-if="account.aliases" class="mt-2" :account="account" />
      <AccountSenderAddresses
        v-if="account.mailbox"
        class="mt-2"
        :account="account"
      />
    </v-col>
  </v-row>
</template>

<script setup lang="js">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import accounts from '@/api/accounts'
import parameters from '@/api/parameters'
import AccountAliases from '@/components/identities/AccountAliases.vue'
import AccountSenderAddresses from '@/components/identities/AccountSenderAddresses.vue'
import AccountSummary from '@/components/identities/AccountSummary.vue'
import DomainAdminDomains from '@/components/identities/DomainAdminDomains.vue'
import ResourcesView from '@/components/tools/ResourcesView.vue'

const route = useRoute()
const account = ref({ pk: route.params.id })
const limitsConfig = ref({})

accounts.get(route.params.id).then((resp) => {
  account.value = resp.data
})
parameters.getApplication('limits').then((resp) => {
  limitsConfig.value = resp.data
})
</script>
