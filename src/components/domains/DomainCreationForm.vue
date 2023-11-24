<template>
  <CreationForm
    ref="form"
    :title="'New domain' | translate"
    :steps="steps"
    :form-getter="getForm"
    :form-observer-getter="getObserver"
    :validate-object="validateDomain"
    :summary-sections="summarySections"
    @close="close"
    @create="submit"
  >
    <template v-slot:form.general="{ step }">
      <DomainGeneralForm :ref="formsRef[`form_${step}`]" v-model="domain" />
    </template>
  </CreationForm>
</template>

<script setup>
import CreationForm from '@/components/tools/CreationForm'
//import DomainDNSForm from './DomainDNSForm'
import DomainGeneralForm from './DomainGeneralForm'
//import DomainLimitationsForm from './DomainLimitationsForm'
//import DomainOptionsForm from './DomainOptionsForm'
//import DomainTransportForm from './DomainTransportForm'
import { useGettext } from 'vue3-gettext'
import { ref, computed, onMounted } from 'vue'
import { useBusStore } from '@/stores'

const { $gettext } = useGettext()
const busStore = useBusStore()

const props = defineProps(['value'])

const emit = defineEmits(['close'])

const domain = ref({
  domain_admin: {},
})

const createAdmin = ref(false)
const formErrors = ref({})
const formsRef = ref({})
const domainSteps = [{ name: 'general', title: $gettext('General') }]
const relaySteps = [{ name: 'general', title: $gettext('General') }]

const summarySections = computed(() => {
  const result = [
    {
      title: $gettext('General'),
      items: [
        { key: $gettext('Name'), value: domain.value.name },
        { key: $gettext('Type'), value: domain.value.type },
        {
          key: $gettext('Enabled'),
          value: domain.value.enabled,
          type: 'yesno',
        },
      ],
    },
  ]
  return result
})

const steps = computed(() => {
  return domain.value.type === 'domain' ? domainSteps : relaySteps
})

onMounted(() => {
  initDomain()
})

function copyPassword() {
  navigator.clipboard.writeText(domain.value.domain_admin.password).then(() => {
    busStore.displayNotification({
      msg: this.$gettext('Password copied to clipboard'),
    })
  })
}

function initDomain() {
  domain.value = {
    name: '',
    type: 'domain',
    enabled: true,
    enable_dns_checks: true,
    enable_dkim: false,
    dkim_key_selector: 'modoboa',
    quota: 0,
    default_mailbox_quota: 0,
    domain_admin: {
      username: 'admin',
      with_random_password: false,
      with_mailbox: false,
      with_aliases: false,
    },
    transport: {},
  }
}

function close() {
  initDomain()
  emit('close')
}
function getForm(step) {
  return this.$refs[`form_${step}`]
}
function getObserver(step) {
  return this.$refs[`form_${step}`].$refs.observer
}
function validateDomain() {}
function updateCreateAdmin(value) {
  this.createAdmin = value
}
function submit() {
  const data = JSON.parse(JSON.stringify(this.domain))
  if (!this.createAdmin) {
    delete data.domain_admin
  }
  if (data.type === 'relaydomain') {
    this.$refs.form_4.checkSettingTypes(data)
  } else {
    delete data.transport
  }
  this.$store.dispatch('domains/createDomain', data).then((resp) => {
    this.$router.push({ name: 'DomainDetail', params: { id: resp.data.pk } })
    bus.$emit('notification', { msg: this.$gettext('Domain created') })
    this.close()
  })
}
</script>

<style lang="scss">
.highligth {
  background-color: #515d78;
}
</style>
