<template>
  <v-form ref="vFormRef">
    <EmailField
      ref="aliasField"
      v-model="currentAlias"
      :placeholder="$gettext('Start typing a name here...')"
      @domain-selected="addAlias"
      :hint="
        $gettext(
          'Alias(es) of this mailbox. To create a catchall alias, just enter the domain name (@domain.tld).'
        )
      "
      persistent-hint
      :loading="isValidating"
    />
    <v-chip
      v-for="(alias, index) in account.aliases"
      :key="index"
      class="mr-2 mt-2"
      closable
      @click:close="removeAlias(index)"
    >
      {{ alias }}
    </v-chip>
  </v-form>
</template>

<script setup lang="js">
import accountsApi from '@/api/accounts'
import EmailField from '@/components/tools/EmailField'
import { computed, ref } from 'vue'

const props = defineProps({ modelValue: { type: Object, default: null } })
const emit = defineEmits(['update:model-value'])

const account = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:model-value', value)
  },
})

const currentAlias = ref('')
const aliasField = ref()
const vFormRef = ref()
const isValidating = ref(false)

async function addAlias() {
  isValidating.value = true
  try {
    await accountsApi.validate({
      aliases: [currentAlias.value],
      mailbox: account.value.mailbox,
    })
    account.value.aliases.push(currentAlias.value)
    currentAlias.value = ''
    vFormRef.value.resetValidation()
  } catch (error) {
    let errorMsg = null
    if (error.response.data.aliases) {
      errorMsg = error.response.data.aliases
    } else if (error.response.data.non_field_errors) {
      errorMsg = error.response.data.non_field_errors
    }
    //TODO : v-alert !!
  } finally {
    isValidating.value = false
  }
}

function removeAlias(index) {
  account.value.aliases.splice(index, 1)
}

defineExpose({ vFormRef })
</script>
