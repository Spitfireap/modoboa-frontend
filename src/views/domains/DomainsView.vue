<template>
  <div>
    <v-toolbar flat>
      <v-toolbar-title>{{ $gettext('Domains') }}</v-toolbar-title>
      <v-spacer />
      <v-btn
        class="mr-2"
        :title="$gettext('Import domains and aliases from CSV file')"
        variant="elevated"
        icon="mdi-file-import-outline"
        @click="showImportForm = true"
      ></v-btn>
      <v-btn
        class="mr-2"
        :title="$gettext('Export domains and aliases to CSV')"
        variant="elevated"
        icon="mdi-file-export-outline"
        @click="exportDomains"
      >
      </v-btn>
      <v-menu offset-y>
        <template #activator="{ props }">
          <v-btn
            color="primary"
            variant="flat"
            v-bind="props"
            prepend-icon="mdi-plus"
          >
            {{ $gettext('New') }}
          </v-btn>
        </template>
        <v-list dense>
          <v-list-item @click="showDomainWizard = true">
            <v-list-item-title>{{ $gettext('Domain') }}</v-list-item-title>
          </v-list-item>
          <v-list-item @click="showAliasForm = true">
            <v-list-item-title>{{ $gettext('Alias') }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-toolbar>

    <DomainList />

    <v-dialog
      v-model="showDomainWizard"
      fullscreen
      scrollable
      transition="dialog-bottom-transition"
    >
    </v-dialog>
    <v-dialog v-model="showAliasForm" persistent max-width="800px"> </v-dialog>
    <v-dialog v-model="showImportForm" persistent max-width="800px"> </v-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import domainApi from '@/api/domains'
import { useGettext } from 'vue3-gettext'
//import DomainAliasForm from '@/components/domains/DomainAliasForm'
//import DomainCreationForm from '@/components/domains/DomainCreationForm'
import DomainList from '@/components/domains/DomainList'
//import ImportForm from '@/components/tools/ImportForm'
import { importExportMixin } from '@/mixins/importExport'

const showAliasForm = ref(false)
const showDomainWizard = ref(false)
const showImportForm = ref(false)

const { $gettext } = useGettext()

function exportDomains() {
  domainApi.exportAll().then((resp) => {
    const { exportContent } = importExportMixin()
    exportContent(resp.data, 'domains', $gettext)
    console.log(resp.data)
  })
}
/*
function importDomains (data) {
  this.importContent(domains, data)
}
*/
</script>

<style scoped>
.v-toolbar {
  background-color: #f7f8fa !important;
}

.v-tabs-items {
  background-color: #f7f8fa !important;
}
</style>
