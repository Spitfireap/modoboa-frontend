<template>
<v-card>
  <v-card-title>
    <span class="headline">{{ $gettext('Administered domains') }}</span>
  </v-card-title>
  <v-card-text>
    <v-row v-for="domain in account.domains" :key="domain">
      <v-col cols="12">{{ domain }}</v-col>
    </v-row>
  </v-card-text>
</v-card>
</template>

<script setup lang="js">
const props = defineProps({
  account: Object
})
</script>
