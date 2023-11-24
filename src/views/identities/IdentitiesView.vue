<template>
<v-toolbar flat>
  <v-toolbar-title>{{ $gettext('Identities') }}</v-toolbar-title>
  <v-spacer />
  <v-btn
    class="mr-2"
    :title="$gettext('Import accounts and aliases from CSV file')"
    @click="showImportForm = true"
    icon="mdi-file-import-outline"
    >
  </v-btn>
  <v-btn
    class="mr-2"
    :title="$gettext('Export accounts and aliases to CSV')"
    @click="exportIdentities"
    icon="mdi-file-export-outline"
    >
  </v-btn>
  <v-menu offset-y>
    <template v-slot:activator="{ props }">
      <v-btn color="primary" v-bind="props">
        <v-icon icon="mdi-plus"></v-icon>
        {{ $gettext('New') }}
      </v-btn>
    </template>
    <v-list density="compact">
      <v-list-item @click="showCreationWizard = true">
        <v-list-item-title>{{ $gettext('Account') }}</v-list-item-title>
      </v-list-item>
      <v-list-item @click="showAliasCreationWizard = true">
        <v-list-item-title>{{ $gettext('Alias') }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</v-toolbar>

<IdentityList />
</template>

<script setup lang="js">
import { ref } from 'vue'
import { useGettext } from 'vue3-gettext'
import identities from '@/api/identities'
import IdentityList from '@/components/identities/IdentityList'

const { $gettext } = useGettext()

const showCreationWizard = ref(false)
const showAliasCreationWizard = ref(false)

function exportIdentities() {

}

</script>
