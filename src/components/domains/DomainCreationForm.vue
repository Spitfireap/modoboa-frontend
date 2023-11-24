<template>
  <CreationForm
    ref="form"
    :title="$gettext('New domain')"
    :steps="steps"
    :formGetter="getForm"
    :getVFormRef="getVFormRef"
    :validateDomain="validateDomain"
    :summarySections="summarySections"
    @close="close"
    @create="submit"
  >
    <template #form.general>
      <DomainGeneralForm ref="general" class="ml-4" :domain="domain" />
    </template>
  </CreationForm>
</template>

<script setup lang="js">
import CreationForm from '@/components/tools/CreationForm'
//import DomainDNSForm from './DomainDNSForm'
import DomainGeneralForm from './form_steps/DomainGeneralForm'
//import DomainLimitationsForm from './DomainLimitationsForm'
//import DomainOptionsForm from './DomainOptionsForm'
//import DomainTransportForm from './DomainTransportForm'
import { useGettext } from 'vue3-gettext'
import { ref, computed, onMounted } from 'vue'
import { useBusStore, useDomainsStore } from '@/stores'
import { useRouter } from 'vue-router'

const { $gettext } = useGettext()
const busStore = useBusStore()
const domainsStore = useDomainsStore()
const router = useRouter()

const emit = defineEmits(['close'])

const domain = ref({
  domain_admin: {},
})

const createAdmin = ref(false)

// Reference to steps components
const general = ref()

// Object to reference
const formStepsComponenents = { general: general }

const domainSteps = [{ name: 'general', title: $gettext('General') }]
const relaySteps = [{ name: 'general', title: $gettext('General') }]

const steps = computed(() => {
  return domain.value.type === 'domain' ? domainSteps : relaySteps
})

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

onMounted(() => {
  initDomain()
})

function copyPassword() {
  navigator.clipboard.writeText(domain.value.domain_admin.password).then(() => {
    busStore.displayNotification({
      msg: $gettext('Password copied to clipboard'),
    })
  })
}

function getForm(step) {
  return formsRef.value[step.name]
}
function getVFormRef(step) {
  console.log(formStepsComponenents[step.name].value)
  return formStepsComponenents[step.name].value.vFormRef
}

function validateDomain() {}

function updateCreateAdmin(value) {
  createAdmin.value = value
}

function submit() {
  const data = JSON.parse(JSON.stringify(domain.value))
  if (!createAdmin.value) {
    delete data.domain_admin
  }
  domainsStore.createDomain(data).then((resp) => {
    router.push({ name: 'DomainDetail', params: { id: resp.data.pk } })
    busStore.displayNotification({ msg: $gettext('Domain created') })
    close()
  })
}
</script>

<style lang="scss">
.highligth {
  background-color: #515d78;
}
</style>
