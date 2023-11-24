<template>
  <div>
    <div
      class="text-subtitle-1 text-grey-darken-1 mb-5"
      :class="{ 'label--disabled': disabled }"
    >
      <label class="m-label">{{ label }}</label>
    </div>
    <v-row v-for="lineChoices in formatedChoices" class="ml-5">
      <v-col
        v-for="choice in lineChoices"
        class="choice rounded pa-md-10 pa-5 mr-5 flex-grow-0 mb-5"
        :class="{
          'choice--disabled': disabled,
          'choice--selected': !disabled && currentChoice === choice.value,
        }"
        @click="selectChoice(choice.value)"
        align="center"
      >
        <v-row align="center" justify="center">
          <v-col cols="12" class="pa-0">
            <v-icon
              v-if="choice.icon"
              class="hidden-md-and-down mb-5 align-center"
              :color="iconColor(choice.value)"
              size="x-large"
            >
              {{ choice.icon }}
            </v-icon>
          </v-col>
        </v-row>
        <v-row align="center" justify="center">
          <v-col cols="12" class="pa-0">
            <div class="text-grey-darken-1">{{ choice.label }}</div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="js">
import { ref, onMounted, watch } from 'vue'

const props = defineProps({
  value: [Number, String],
  label: String,
  choices: Array,
  disabled: {
    type: Boolean,
    default: false,
  },
  choicesPerLine: Number,
})

const currentChoice = ref(null)

const formatedChoices = ref([])

const emit = defineEmits(['input'])

function formatChoices() {
  if (props.choicesPerLine) {
    let sliceIndex = 0
    while (sliceIndex < props.choices.length) {
      const result = props.choices.slice(
        sliceIndex,
        sliceIndex + props.choicesPerLine
      )
      formatedChoices.value.push(result)
      sliceIndex += props.choicesPerLine
    }
  } else {
    formatedChoices.value.push(props.choices)
  }
  currentChoice.value = formatedChoices.value[0].value
}

function iconColor(value) {
  return !props.disabled && value === currentChoice.value ? 'primary' : ''
}
function selectChoice(value) {
  if (props.disabled) {
    return
  }
  currentChoice.value = value
  emit('input', value)
}

onMounted(() => {
  formatChoices()
})

watch(
  () => props.value,
  (newVal) => {
    currentChoice.value = newVal
  }
)
</script>

<style lang="scss" scoped>
.choice {
  // width: 200px;
  flex-basis: 200px;
  background-color: #f2f5f7;
  border: 1px solid #dbdddf;
  cursor: pointer;

  &--selected {
    border-color: #046bf8 !important;
  }

  &--disabled {
    cursor: unset;
    opacity: 0.5;
  }
}
.label--disabled {
  opacity: 0.5;
}
</style>
