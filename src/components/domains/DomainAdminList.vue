<template>
  <v-card>
    <v-card-title>
      <span class="headline">
        <template v-if="dialogMode" class="headline">
          {{ $gettext('Administrators of') }} {{ domain.name }}
        </template>
        <template v-else class="headline">
          {{ $gettext('Administrators') }}
        </template>
      </span>
    </v-card-title>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="administrators"
        hide-default-footer
      >
        <template v-slot:item.username="{ item }">
          <span v-if="item.id">{{ item.username }}</span>
          <v-autocomplete
            v-else
            v-model="selectedAccount"
            :label="$gettext('Select an account')"
            :items="accounts"
            item-text="username"
            return-object
          >
            <template v-slot:append-outer>
              <v-btn
                v-if="selectedAccount"
                icon
                color="primary"
                @click="addAdministrator"
              >
                <v-icon>mdi-content-save</v-icon>
              </v-btn>
            </template>
          </v-autocomplete>
        </template>
        <template v-slot:item.name="{ item }">
          {{ item.first_name }} {{ item.last_name }}
        </template>
        <template v-slot:item.actions="{ item }">
          <v-btn
            v-if="item.id"
            icon
            color="red"
            @click="removeAdministrator(item)"
            :title="$gettext('Remove this administrator')"
          >
            <v-icon>mdi-delete-outline</v-icon>
          </v-btn>
        </template>
      </v-data-table>
      <v-btn v-if="!hideAddBtn" small color="primary" outlined @click="addRow">
        <v-icon small>mdi-plus</v-icon> {{ $gettext('Add administrator') }}
      </v-btn>
    </v-card-text>
    <v-card-actions v-if="dialogMode">
      <v-spacer></v-spacer>
      <v-btn color="grey darken-1" text @click="close">
        {{ $gettext('Close') }}>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import accountApi from '@/api/accounts'
import domainApi from '@/api/domains'
import { useBusStore } from '@/stores'
import { useGettext } from 'vue3-gettext'
import { ref, watch } from 'vue'

const busStore = useBusStore()
const { $gettext } = useGettext()

const props = defineProps({
  domain: Object,
  dialogMode: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close'])

const accounts = ref([])
const administrators = ref([])

const headers = ref([
  { text: $gettext('Username'), value: 'username' },
  { text: $gettext('Name'), value: 'name' },
  { text: '', value: 'actions', align: 'right', sortable: false },
])

const hideAddBtn = ref(false)
const selectedAccount = ref(null)

function addRow() {
  administrators.value.push({})
  hideAddBtn.value = true
}

function close() {
  emit('close')
  hideAddBtn.value = false
}
function fetchAdministrators(domain) {
  domainApi.getDomainAdministrators(domain.pk).then((resp) => {
    administrators.value = resp.data
  })
}

function fetchAccounts() {
  accountApi.getAll({ role: 'DomainAdmins' }).then((resp) => {
    accounts.value = resp.data.filter(
      (account) =>
        administrators.value.find((admin) => admin.id === account.pk) ===
        undefined
    )
  })
}
function addAdministrator() {
  domainApi
    .addDomainAdministrator(props.domain.pk, selectedAccount.value.pk)
    .then((resp) => {
      fetchAdministrators(props.domain)
      accounts.value = accounts.value.filter(
        (account) => account.pk !== selectedAccount.value.pk
      )
      selectedAccount.value = null
      hideAddBtn.value = false
      busStore.displayNotification({ msg: $gettext('Administrator added') })
    })
}

function removeAdministrator(admin) {
  domainApi
    .removeDomainAdministrator(props.domain.pk, admin.id)
    .then((resp) => {
      fetchAdministrators(props.domain)
      fetchAccounts()
      bus.$emit('notification', { msg: $gettext('Administrator removed') })
    })
}

watch(
  props.domain,
  (old, newDomain) => {
    fetchAdministrators(newDomain)
    fetchAccounts()
  },
  { immediate: true }
)
</script>
