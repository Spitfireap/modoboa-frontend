<template>
<v-card class="mt-6">
  <v-toolbar flat>
    <v-menu offset-y>
      <template v-slot:activator="{ props }">
        <v-btn v-bind="props" size="small">
          {{ $gettext('Actions') }} <v-icon right>mdi-chevron-down</v-icon>
        </v-btn>
      </template>
      <v-list density="compact">
        <menu-items :items="getActionMenuItems()"/>
      </v-list>
    </v-menu>
    <v-spacer></v-spacer>
    <v-text-field
      v-model="search"
      prepend-inner-icon="mdi-magnify"
      placeholder="Search"
      variant="outlined"
      density="compact"
      hide-details
      />
  </v-toolbar>

  <v-data-table
    v-model="selected"
    :headers="headers"
    :items="identities"
    :search="search"
    :loading="loading"
    item-value="identity"
    class="elevation-1"
    show-select
    >
    <template v-slot:item.identity="{ item }">
      <template v-if="item.type === 'account'">
        <router-link :to="{ name: 'AccountDetail', params: { id: item.pk } }">
          {{ item.identity }}
        </router-link>
      </template>
      <template v-else>
        <router-link :to="{ name: 'AliasDetail', params: { id: item.pk } }">
          {{ item.identity }}
        </router-link>
      </template>
    </template>
    <template v-slot:item.tags="{ item }">
      <v-chip v-for="(tag, index) in item.tags"
              :key="tag.name"
              :color="(tag.type !== 'idt') ? 'primary' : 'default'"
              :class="(index > 0) ? 'ml-2' : ''"
              small
              >
        {{ tag.label }}
      </v-chip>
    </template>
    <template v-slot:item.actions="{ item }">
      <template v-if="item.possible_actions.length !== 0">
        <v-icon size="2.5em" color="blue">mdi-circle-small</v-icon>
      </template>
      <v-menu offset-y>
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" size="small" icon="mdi-dots-horizontal">
          </v-btn>
        </template>
        <menu-items :items="getMenuItems(item)" :object="item" />
      </v-menu>
    </template>
  </v-data-table>
</v-card>
</template>

<script setup lang="js">
import { ref } from 'vue'
import { useGettext } from 'vue3-gettext'
import identitiesApi from '@/api/identities'
import MenuItems from '@/components/tools/MenuItems.vue'

const { $gettext } = useGettext()

const headers = ref([
  { title: $gettext('Name'), key: 'identity' },
  { title: $gettext('Fullname/recipient'), key: 'name_or_rcpt' },
  { title: $gettext('Tags'), key: 'tags' },
  { title: $gettext('Actions'), key: 'actions', sortable: false, align: 'right' }
])
const identities = ref([])
const loading = ref(false)
const search = ref('')
const selected = ref([])

function fetchIdentities() {
  loading.value = true
  identitiesApi.getAll().then(resp => {
    identities.value = resp.data
    selected.value = []
    loading.value = false
  })
}

function deleteIdentities() {

}

function getMenuItems(item) {
  const result = []
  if (item.type === 'account') {
    item.possible_actions.forEach(element => {
      result.push({
        label: element.label,
        icon: element.icon,
        onClick: () => {
          if (element.type === 'download') {
            downloadFile(element)
          }
          fetchIdentities()
        }
      })
    })
    result.push({
      label: $gettext('Edit'),
      icon: 'mdi-circle-edit-outline',
      onClick: editAccount
    })
    result.push({
      label: $gettext('Delete'),
      icon: 'mdi-delete-outline',
      onClick: deleteAccount,
      color: 'red'
    })
  } else if (item.type === 'alias') {
    result.push({
      label: $gettext('Edit'),
      icon: 'mdi-circle-edit-outline',
      onClick: editAlias
    })
    result.push({
      label: $gettext('Delete'),
      icon: 'mdi-delete-outline',
      onClick: deleteAlias,
      color: 'red'
    })
  }
  return result
}

function getActionMenuItems () {
  const result = []
  if (selected.value.length > 0) {
    result.push({ label: $gettext('Delete'), icon: 'mdi-delete-outline', onClick: deleteIdentities, color: 'red' })
  }
  result.push({ label: $gettext('Reload'), icon: 'mdi-reload', onClick: fetchIdentities })
  return result
}

function editAccount() {

}

function deleteAccount() {

}

function editAlias() {

}

function deleteAlias() {

}

fetchIdentities()
</script>
