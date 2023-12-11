<template>
  <div>
    <v-text-field
      ref="inputRef"
      v-model="input"
      variant="outlined"
      :placeholder="placeholder"
      :hint="hint"
      :persistent-hint="persistentHint"
      density="compact"
      autocomplete="new-password"
      @keydown="onKeyDown"
      :rules="rules"
      :type="type"
      :loading="loading"
    />
    <div class="menu" v-if="showMenu" :style="`width: ${width}px;`">
      <v-list class="list">
        <v-list-item
          v-for="(domain, index) in filteredDomains"
          :key="index"
          @click="selectDomain(domain)"
          :class="selectionIndex === index ? 'bg-primary-lighten-1' : ''"
          @mouseenter="selectionIndex = index"
        >
          <v-list-item-title>{{ domain.name }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </div>
  </div>
</template>

<script setup lang="js">
import { ref, computed, onMounted, onUnmounted, onUpdated, nextTick } from 'vue'
import { useDomainsStore } from '@/stores'

const domainsStore = useDomainsStore()
const props = defineProps({
  modelValue: { type: String, default: '' },
  allowAdd: { type: Boolean, default: false },
  rules: { type: Array, default: () => [] },
  placeholder: { type: String, default: '' },
  hint: { type: String, default: '' },
  persistentHint: { type: Boolean, default: false },
  type: { type: String, default: 'email' },
  loading: { type: Boolean, default: false },
})
const emit = defineEmits(['update:model-value', 'domain-selected'])

const input = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    if (value.indexOf('@') !== -1) {
      domainSearch.value = value.split('@')[1]
      if (props.allowAdd) {
        showMenu.value = filteredDomains.value.length > 0
      } else {
        showMenu.value = true
      }
    } else {
      showMenu.value = false
    }
    emit('update:model-value', value)
  },
})

const filteredDomains = computed(() => {
  return Object.values(domainsStore.domains).filter((domain) =>
    domain.name.startsWith(domainSearch.value)
  )
})

const domainSearch = ref('')
const selectionIndex = ref(0)
const showMenu = ref(false)
const width = ref(500)
const inputRef = ref()

function onKeyDown(e) {
  const keyCode = e.keyCode

  if (keyCode === 40 || keyCode === 34) {
    // on arrow down or page down
    if (!showMenu.value) {
      domainSearch.value = ''
      showMenu.value = true
    } else {
      increaseSelectionIndex()
    }
    e.preventDefault()
  } else if (keyCode === 38 || keyCode === 33) {
    // on arrow up or page up
    if (!showMenu.value) {
      domainSearch.value = ''
      showMenu.value = true
    } else {
      decreaseSelectionIndex()
    }
    e.preventDefault()
  } else if (keyCode === 13 || keyCode === 9) {
    // on enter or tab
    if (filteredDomains.value.length > 0) {
      selectDomain(filteredDomains.value[selectionIndex.value])
    } else if (props.allowAdd) {
      selectDomain()
    }
    e.preventDefault()
  } else if (keyCode === 27) {
    // on escape
    if (filteredDomains.value.length > 0) {
      showMenu.value = false
      e.preventDefault()
    }
  }
}

function increaseSelectionIndex() {
  if (selectionIndex.value >= filteredDomains.value.length - 1) {
    selectionIndex.value = 0
  } else {
    selectionIndex.value += 1
  }
}

function decreaseSelectionIndex() {
  if (selectionIndex.value <= 0) {
    selectionIndex.value = filteredDomains.value.length - 1
  } else {
    selectionIndex.value -= 1
  }
}

function selectDomain(domain) {
  if (domain !== undefined) {
    input.value = input.value.split('@')[0] + '@' + domain.name //TODO
  }
  showMenu.value = false
  emit('domain-selected')
}

function updateMinWidthProperty() {
  width.value = inputRef.value.$el.clientWidth
}

onMounted(() => {
  domainsStore.getDomains()
  window.addEventListener('resize', updateMinWidthProperty)
})
onUnmounted(() => {
  window.removeEventListener('resize', updateMinWidthProperty)
})
onUpdated(() => {
  nextTick(() => {
    updateMinWidthProperty()
  })
})
</script>

<style scoped>
.menu {
  display: inline-block;
  position: fixed;
  margin-top: -20px;
  padding: 5px 0;
  box-shadow: 0 1px 5px 1px rgba(0, 0, 0, 0.3);
  overflow-y: auto;
  overflow-x: hidden;
  contain: content;
  z-index: 99;
}

.list {
  width: 100%;
  height: 100%;
  font-size: 1.1em;
  overflow-x: hidden;
  padding: 0;
}
</style>
