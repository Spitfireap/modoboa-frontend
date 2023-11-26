<template>
  <div>
    <label class="m-label">{{ $gettext('Service') }}</label>
    <v-autocomplete
      v-model="service"
      :items="backends"
      item-text="name"
      return-object
      variant="outlined"
      :rules="[rules.required]"
    />
    <template v-if="service">
      <template v-for="setting in service.settings" :key="setting.name">
        <template v-if="setting.type === 'str' || setting.type === 'int'">
          <label class="m-label">{{ setting.label }}</label>
          <v-text-field
            v-model="
              domain.transport.settings[`${service.name}_${setting.name}`]
            "
            variant="outlined"
            :type="setting.type === 'int' ? 'number' : 'text'"
            :rules="[!!settings.required || rules.required]"
          />
        </template>
        <v-checkbox
          v-else-if="setting.type === 'boolean'"
          v-model="domain.transport.settings[`${service.name}_${setting.name}`]"
          :label="setting.label"
        />
      </template>
    </template>
  </div>
</template>

<script setup lang="js">
import transports from '@/api/transports'
import { useGettext } from 'vue3-gettext'
import { ref, computed, onMounted } from 'vue'
import rules from '@/plugins/rules.js'

const { $gettext } = useGettext()

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const domain = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    return emit('update:modelValue', value)
  },
})

const backends = ref([])
const service = ref(null)

function checkSettingTypes(data) {
  for (const setting of service.value.settings) {
    if (setting.type === 'int') {
      const fullName = `${service.value.name}_${setting.name}`
      data.transport.settings[fullName] = parseInt(
        data.transport.settings[fullName]
      )
    }
  }
}

onMounted(() => {
  transports.getAll().then((resp) => {
    backends.value = resp.data

    service.value = backends.value.find(
      (backend) => backend.name === domain.value.transport.service
    )
  })
})

defineExpose({ checkSettingTypes, service })
</script>
