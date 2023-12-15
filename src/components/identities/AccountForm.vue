<template>
<v-expansion-panels v-model="panel">
  <v-expansion-panel bg-color="white">
    <v-expansion-panel-title v-slot="{ open }">
      <v-row no-gutters>
        <v-col cols="4">
          {{ $gettext('Role') }}
        </v-col>
        <v-col
          cols="8"
          class="text-secondary"
          >
          <v-fade-transition leave-absolute>
            <span v-if="open"></span>
            <v-row
              v-else
              no-gutters
              style="width: 100%"
              >
              <v-col cols="6" v-if="$refs.roleForm">
                {{ $refs.roleForm.roleLabel }}
              </v-col>
            </v-row>
          </v-fade-transition>
        </v-col>
      </v-row>
    </v-expansion-panel-title>
    <v-expansion-panel-text>
      <AccountRoleForm ref="roleForm" v-model="editedAccount" />
    </v-expansion-panel-text>
  </v-expansion-panel>
</v-expansion-panels>
<div class="mt-4 d-flex justify-end">
  <v-btn @click="router.go(-1)" :loading="working">
    {{ $gettext('Cancel') }}
  </v-btn>
  <v-btn class="ml-4" color="primary darken-1" @click="save" :loading="working">
    {{ $gettext('Save') }}
  </v-btn>
</div>
</template>

<script setup lang="js">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import AccountRoleForm from '@/components/identities/form_steps/AccountRoleForm'

const router = useRouter()

const props = defineProps({
  account: Object
})

const editedAccount = ref({})
const panel = ref(0)
const working = ref(false)

watch(props.account, (value) => {
  editedAccount.value = { ...value }
  delete editedAccount.value.domains
  if (editedAccount.value.mailbox === null) {
    editedAccount.value.mailbox = {}
  }
})

async function save() {

}
</script>
