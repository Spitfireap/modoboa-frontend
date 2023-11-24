<template>
  <div class="d-flex justify-center inner">
    <v-stepper v-model="currentStep">
      <v-stepper-header class="align-center px-10">
        <v-img src="../../assets/Modoboa_RVB-BLEU-SANS.png" max-width="190" />
        <v-stepper-step
          v-for="(step, index) in steps"
          :key="index"
          :complete="currentStep > index + 1"
          :step="index + 1"
        >
          {{ step.title }}
        </v-stepper-step>
        <v-stepper-step :step="steps.length + 1">
          <translate>Summary</translate>
        </v-stepper-step>
        <v-btn icon @click="close">
          <v-icon color="primary" x-large>mdi-close</v-icon>
        </v-btn>
      </v-stepper-header>
      <v-stepper-items class="mt-4 d-flex justify-center">
        <v-stepper-content
          v-for="(step, index) in steps"
          :key="index"
          :step="index + 1"
          class="flex-grow-0"
        >
          <div class="mb-6 text-h5">
            <span class="grey--text text--darken-1">{{ title }}</span> /
            {{ step.title }}
          </div>
          <slot :name="`form.${step.name}`" v-bind:step="index + 1" />
          <div class="d-flex justify-end mt-4">
            <v-btn
              v-if="index + 1 > 1"
              @click="currentStep = index"
              class="mr-10"
              text
            >
              <translate>Back</translate>
            </v-btn>
            <v-btn
              color="primary"
              @click="goToNextStep(index + 1, index + 2)"
              large
            >
              <translate>Next</translate>
            </v-btn>
          </div>
        </v-stepper-content>
        <v-stepper-content :step="steps.length + 1" class="flex-grow-0">
          <div class="text-center text-h3"><translate>Summary</translate></div>
          <creation-summary
            :sections="summarySections"
            @modify-step="(val) => (currentStep = val)"
          >
            <template v-for="(_, slot) of $scopedSlots" v-slot:[slot]="scope">
              <slot :name="slot" v-bind="scope" />
            </template>
          </creation-summary>
          <div class="d-flex justify-center mt-8">
            <v-btn color="primary" @click="create" large :loading="working">
              <translate>Confirm and create</translate>
            </v-btn>
          </div>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
    <ConfirmDialog ref="confirm" @agree="emit('close')" />
  </div>
</template>

<script setup>
import ConfirmDialog from './ConfirmDialog'
//import CreationSummary from '@/components/tools/CreationSummary'
import { ref } from 'vue'
import { useGettext } from 'vue3-gettext'

const props = defineProps({
  title: String,
  steps: Array,
  summarySections: Array,
  getVFormRef: Function,
  formGetter: Function,
  validateObject: Function,
})

const currentStep = ref(1)
const working = ref(false)
const confirm = ref()

const emit = defineEmits(['close', 'create'])

const { $gettext } = useGettext()

async function close(withConfirm) {
  if (withConfirm) {
    confirm.value.open(
      $gettext('Warning'),
      $gettext(
        "If you close this form now, your modifications won't be saved. Do you confirm?"
      ),
      {
        color: 'warning',
        agreeLabel: $gettext('Yes'),
        cancelLabel: $gettext('No'),
      }
    )
  }
}
async function goToNextStep(current, next) {
  const vform = props.getVFormRef(current)
  if (vform !== undefined) {
    const { valid } = await vform.value.validate()
    if (!valid) {
      return
    }
    try {
      await props.validateObject()
    } catch (error) {
      observer.setErrors(error.response.data)
      return
    }
  }
  currentStep.value = next
}

working.value = true
emit('create')
</script>

<style lang="scss">
.inner {
  background-color: #fff;
}
.v-stepper {
  width: 100%;
  overflow: auto;

  &__content {
    width: 60%;
  }

  &__items {
    overflow-y: auto;
  }

  &__wrapper {
    padding: 0 10px;
  }
}
</style>
