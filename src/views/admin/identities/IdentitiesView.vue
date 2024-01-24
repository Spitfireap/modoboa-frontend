<template>
  <div>
    <v-toolbar flat>
      <v-toolbar-title>{{ $gettext('Identities') }}</v-toolbar-title>
      <v-spacer />
      <v-btn
        class="mr-2"
        :title="$gettext('Import accounts and aliases from CSV file')"
        variant="elevated"
        icon="mdi-file-import-outline"
        @click="showImportForm = true"
      ></v-btn>
      <v-btn
        class="mr-2"
        :title="$gettext('Export accounts and aliases to CSV')"
        icon="mdi-file-export-outline"
        variant="elevated"
        @click="exportIdentities"
      ></v-btn>
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
    <v-dialog v-if="showAliasCreationWizard" fullscreen scrollable z-index="10">
      <AliasCreationForm @close="showAliasCreationWizard.value = false" />
    </v-dialog>

    <v-dialog v-model="showCreationWizard" fullscreen scrollable z-index="10">
      <AccountCreationForm @close="showCreationWizard = false" />
    </v-dialog>
  </div>
</template>

<script setup lang="js">
import { ref } from 'vue'
import { useGettext } from 'vue3-gettext'
import IdentityList from '@/components/admin/identities/IdentityList.vue'
import AliasCreationForm from '@/components/admin/identities/AliasCreationForm.vue'
import AccountCreationForm from '@/components/admin/identities/AccountCreationForm.vue'

const { $gettext } = useGettext()

const showCreationWizard = ref(false)
const showAliasCreationWizard = ref(false)

function exportIdentities() {}

function closeCreationForm() {
  showCreationWizard.value = false
}
</script>

<style scoped>
.v-toolbar {
  background-color: #f7f8fa !important;
}

.v-tabs-items {
  background-color: #f7f8fa !important;
}
</style>
