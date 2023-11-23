import { onMounted } from 'vue';
<template>
  <v-card>
    <v-form ref="vform" @submit.prevent="submit">
      <v-card-title>
        <span class="headline">{{ title }}</span>
      </v-card-title>
      <v-card-text>
        <label class="m-label">{{ $gettext('Name') }}</label>
        <v-text-field
          v-model="form.name"
          dense
          outlined
          :rules="[rules.required]"
        />
        <label class="m-label">{{ $gettext('Choose a domain') }}</label>
        <v-select
          v-model="form.target"
          :items="domains"
          item-text="name"
          item-value="pk"
          :error-messages="errors"
          single-line
          dense
          outlined
          :rules="[rules.required]"
        />
        <v-switch v-model="form.enabled" label="Enabled" color="primary" />
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="close">
          {{ $gettext('Close') }}
        </v-btn>
        <v-btn
          v-if="domainAlias && domainAlias.pk"
          color="error"
          @click="deleteAlias"
        >
          {{ $gettext('Delete') }}
        </v-btn>
        <v-btn color="primary" type="submit">
          {{ submitLabel }}
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script setup>
import domainApi from '@/api/domains'
import { useDomainsStore, useBusStore } from '@/stores'
import { useGettext } from 'vue3-gettext'
import { ref, computed, onMounted, watch } from 'vue'
import rules from '@/plugins/rules.js'

const domainsStore = useDomainsStore()
const busStore = useBusStore()
const { $gettext } = useGettext()

const emit = defineEmits(['close', 'alias-deleted', 'alias-created'])

const props = defineProps({
  domainAlias: {
    type: Object,
    default: null,
  },
})

const form = ref({
  enabled: true,
})

const vform = ref()

const domains = computed(() => domainsStore.domains)

const submitLabel = computed(() => {
  return props.domainAlias ? $gettext('Update') : $gettext('Add')
})

const title = computed(() => {
  return props.domainAlias
    ? $gettext('Edit domain alias')
    : $gettext('Add a new domain alias')
})

function close() {
  emit('close')
  form.value = {
    enabled: true,
  }
}

function deleteAlias() {
  domainApi.deleteDomainAlias(props.domainAlias.pk).then(() => {
    emit('alias-deleted')
    busStore.displayNotification({
      msg: $gettext('Domain alias deleted'),
    })
  })
}

async function submit() {
  const { valid } = await vform.value.validate()
  if (!valid) {
    return
  }
  try {
    if (!form.value.pk) {
      await domainApi.createDomainAlias(form.value).then((resp) => {
        busStore.displayNotification({
          msg: $gettext('Domain alias created'),
        })
        emit('alias-created', resp.data)
        close()
      })
    } else {
      const data = JSON.parse(JSON.stringify(form.value))
      data.target = data.target.pk
      await domainApi.updateDomainAlias(form.value.pk, data).then(() => {
        busStore.displayNotification({
          msg: this.$gettext('Domain alias updated'),
        })
        close()
      })
    }
  } catch (error) {
    //TODO: add v-alert !
  }
}

onMounted(() => {
  if (props.domainAlias) {
    form.value = JSON.parse(JSON.stringify(props.domainAlias))
  }
})

watch(props.domainAlias, (newDomainAlias) => {
  if (newDomainAlias) {
    form.value = JSON.parse(JSON.stringify(newDomainAlias))
  }
})
</script>
