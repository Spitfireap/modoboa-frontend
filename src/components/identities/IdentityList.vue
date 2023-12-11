<template>
  <v-card class="mt-6">
    <v-data-table
      v-model="selected"
      :headers="headers"
      :items="identities"
      :search="search"
      :loading="!identitiesLoaded"
      item-value="identity"
      class="elevation-0"
      show-select
    >
      <template #top>
        <v-toolbar flat color="white">
          <v-menu location="bottom">
            <template #activator="{ props }">
              <v-btn
                append-icon="mdi-chevron-down"
                v-bind="props"
                size="small"
                variant="flat"
              >
                {{ $gettext('Actions') }}
              </v-btn>
            </template>
            <v-list density="compact">
              <menu-items :items="getActionMenuItems()" />
            </v-list>
          </v-menu>
          <v-btn
            variant="text"
            icon="mdi-reload"
            @click="fetchIdentities"
          ></v-btn>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            prepend-inner-icon="mdi-magnify"
            :placeholder="$gettext('Search')"
            variant="outlined"
            hide-details
            single-line
            flat
          ></v-text-field>
        </v-toolbar>
      </template>
      <template #item.identity="{ item }">
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
      <template #item.tags="{ item }">
        <v-chip
          v-for="(tag, index) in item.tags"
          :key="tag.name"
          :color="tag.type !== 'idt' ? 'primary' : 'default'"
          :class="index > 0 ? 'ml-2' : ''"
          size="small"
        >
          {{ tag.label }}
        </v-chip>
      </template>
      <template #item.actions="{ item }">
        <template
          v-if="
            item.possible_actions !== undefined &&
            item.possible_actions.length !== 0
          "
        >
          <v-icon size="2.5em" color="blue">mdi-circle-small</v-icon>
        </template>
        <v-menu location="bottom">
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              size="small"
              icon="mdi-dots-horizontal"
              variant="text"
            >
            </v-btn>
          </template>
          <MenuItems :items="getMenuItems(item)" :obj="item" />
        </v-menu>
      </template>
    </v-data-table>
    <ConfirmDialog ref="confirm" @agree="deleteIdentity" />
  </v-card>
</template>

<script setup lang="js">
import { ref, computed, onMounted } from 'vue'
import { useGettext } from 'vue3-gettext'
import { useIdentitiesStore } from '@/stores'
import MenuItems from '@/components/tools/MenuItems.vue'
import ConfirmDialog from '@/components/tools/ConfirmDialog.vue'

const { $gettext } = useGettext()
const identitiesStore = useIdentitiesStore()

const headers = ref([
  { title: $gettext('Name'), key: 'identity' },
  { title: $gettext('Fullname/recipient'), key: 'name_or_rcpt' },
  { title: $gettext('Tags'), key: 'tags' },
  {
    title: $gettext('Actions'),
    key: 'actions',
    sortable: false,
    align: 'end',
  },
])

const identities = computed(() => identitiesStore.identities)
const identitiesLoaded = computed(() => identitiesStore.identitiesLoaded)
const search = ref('')
const selected = ref([])
const confirm = ref()

function fetchIdentities() {
  identitiesStore.getIdentities().then(() => {
    selected.value = []
  })
}

function getMenuItems(item) {
  const result = []
  if (item.type === 'account') {
    item.possible_actions.forEach((element) => {
      result.push({
        label: element.label,
        icon: element.icon,
        onClick: () => {
          if (element.type === 'download') {
            downloadFile(element)
          }
          fetchIdentities()
        },
      })
    })
    result.push({
      label: $gettext('Edit'),
      icon: 'mdi-circle-edit-outline',
      onClick: editAccount,
    })
  } else if (item.type === 'alias') {
    result.push({
      label: $gettext('Edit'),
      icon: 'mdi-circle-edit-outline',
      onClick: editAlias,
    })
  }
  result.push({
    label: $gettext('Delete'),
    icon: 'mdi-delete-outline',
    onClick: confirmDelete,
    color: 'red',
  })
  return result
}

function getActionMenuItems() {
  const result = []
  if (selected.value.length > 0) {
    result.push({
      label: $gettext('Delete'),
      icon: 'mdi-delete-outline',
      onClick: deleteIdentities,
      color: 'red',
    })
  }
  return result
}

async function confirmDelete(item) {
  confirm.value.open(
    $gettext('Warning'),
    $gettext('Are you sure you want to delete this identity ?'),
    {
      color: 'warning',
      agreeLabel: $gettext('Yes'),
      cancelLabel: $gettext('No'),
    },
    item
  )
}

function editAccount() {}

function deleteIdentity(item) {
  identitiesStore.deleteIdentity(item.type, item.pk)
}

function deleteIdentities() {}

function editAlias() {}

onMounted(() => {
  if (identities.value.length < 1) {
    fetchIdentities()
  }
})
</script>
