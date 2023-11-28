<template>
  <v-card v-if="domain">
    <v-card-title>
      <span> DNS </span>
      <v-btn
        icon="mdi-information-outline"
        :title="$gettext('DNS configuration help')"
        variant="text"
        size="x-small"
        @click="showConfigHelp = true"
      ></v-btn>
    </v-card-title>
    <v-card-text>
      <translate class="overline">MX records</translate>
      <template v-if="domain.dns_global_status == 'pending'">
        <v-row>
          <v-col>
            <v-chip color="info" size="small">
              {{ $gettext('Pending') }}>
            </v-chip>
          </v-col>
        </v-row>
      </template>
      <template v-else>
        <v-data-table
          :headers="mxRecordHeaders"
          :items="detail.mx_records"
          hide-default-footer
        >
          <template v-slot:item.updated="{ item }">
            {{ $date(item.updated) }}
          </template>
        </v-data-table>
      </template>
      <div class="overline">{{ $gettext('Auto configuration') }}</div>
      <template v-if="domain.dns_global_status == 'pending'">
        <v-row>
          <v-col>
            <v-chip color="info" size="small">
              {{ $gettext('Pending') }}
            </v-chip>
          </v-col>
        </v-row>
      </template>
      <template v-else>
        <v-row>
          <v-col>
            <v-chip v-if="detail.autoconfig_record" color="success">
              {{
                $gettext('autoconfig record (Mozilla): %{ value }', {
                  value: detail.autoconfig_record.value,
                })
              }}
            </v-chip>
            <v-chip v-else color="warning">
              {{ $gettext('autoconfig record (Mozilla) not found') }}
            </v-chip>
          </v-col>
          <v-col>
            <v-chip v-if="detail.autodiscover_record" color="success">
              {{
                $gettext('autodiscover record (Microsoft): %{ value }', {
                  value: detail.autodiscover_record.value,
                })
              }}
            </v-chip>
            <v-chip v-else color="warning">
              {{ $gettext('autodiscover record (Microsoft) not found') }}
            </v-chip>
          </v-col>
        </v-row>
        <div class="overline">{{ $gettext('Authentication') }}</div>
        <v-row>
          <v-col>
            <v-chip v-if="detail.spf_record" color="success">
              {{ $gettext('SPF record found') }}
            </v-chip>
            <v-chip v-else color="error">
              {{ $gettext('SPF record not found') }}
            </v-chip>
          </v-col>
          <v-col>
            <v-chip v-if="detail.dkim_record" color="success">
              {{ $gettext('DKIM record found') }}
            </v-chip>
            <v-chip v-else color="error">
              {{ $gettext('DKIM record not found') }}
            </v-chip>
          </v-col>
          <v-col>
            <v-chip v-if="detail.dmarc_record" color="success">
              {{ $gettext('DMARC record found') }}
            </v-chip>
            <v-chip v-else color="error">
              {{ $gettext('DMARC record not found') }}
            </v-chip>
          </v-col>
        </v-row>
      </template>
      <template v-if="domain.enable_dkim">
        <v-row>
          <v-col cols="3">{{ $gettext('DKIM key') }}</v-col>
          <v-col cols="9">
            <div v-if="domain.dkim_private_key_path && domain.dkim_public_key">
              <v-btn color="primary" small @click="showDKIMKey = true">
                {{ $gettext('Show key') }}
              </v-btn>
              <v-btn
                icon="mdi-refresh"
                :title="'Generate a new DKIM key' | translate"
                @click="generateNewKey"
              ></v-btn>
            </div>
            <div v-else>{{ $gettext('Not generated') }}</div>
          </v-col>
        </v-row>
      </template>
    </v-card-text>
    <v-dialog v-model="showConfigHelp" max-width="800px" persistent>
      <DomainDNSConfig :domain="domain" @close="showConfigHelp = false" />
    </v-dialog>
    <v-dialog v-model="showDKIMKey" max-width="800px" persistent>
      <DomainDKIMKey :domain="domain" @close="showDKIMKey = false" />
    </v-dialog>
    <ConfirmDialog ref="dialog" @agree="confirmGenNewKey" />
  </v-card>
</template>

<script setup lang="js">
import { useGettext } from 'vue3-gettext'
import { useBusStore } from '@/stores'
import domainsApi from '@/api/domains'
import DomainDKIMKey from './DomainDKIMKey.vue'
import DomainDNSConfig from './DomainDNSConfig.vue'
import ConfirmDialog from '@/components/tools/ConfirmDialog.vue'
import { ref, computed } from 'vue'

const { $gettext } = useGettext()
const busStore = useBusStore()

const props = defineProps({
  modelValue: { type: Object, default: null },
})
const emit = defineEmits(['update:modelValue'])

const dialog = ref()
const detail = ref({})
const mxRecordHeaders = ref([
  { text: $gettext('Name'), value: 'name' },
  { text: $gettext('Address'), value: 'address' },
  { text: $gettext('Updated'), value: 'updated' },
])

const showConfigHelp = ref(false)
const showDKIMKey = ref(false)

const domain = computed({
  get() {
    if (props.modelValue) {
      domainsApi.getDomainDNSDetail(props.modelValue.pk).then((resp) => {
        detail.value = resp.data
      })
    }
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})

function confirmGenNewKey() {
  const payload = {
    dkim_private_key_path: '',
  }
  domainsApi.patchDomain(domain.value.pk, payload).then(() => {
    busStore.displayNotification({
      msg: $gettext(
        'A new key will be generated soon. Refresh the page in a moment to see it.'
      ),
      type: 'success',
    })
    domain.value.dkim_private_key_path = ''
  })
}

async function generateNewKey() {
  dialog.value.open(
    $gettext('Warning'),
    $gettext(
      'DKIM keys already exist for this domain. Do you want to overwrite them?'
    ),
    {
      color: 'error',
      cancelLabel: $gettext('No'),
      agreeLabel: $gettext('Yes'),
    }
  )
}
</script>
