<template>
  <v-list dense>
    <v-list-item
      v-for="(item, index) in items"
      :key="index"
      :value="item"
      @click="item.onClick(obj)"
    >
      <template #prepend>
        <v-icon :color="item.color" :icon="item.icon"></v-icon>
      </template>
      <v-list-item-title>{{ item.label }}</v-list-item-title>
    </v-list-item>
  </v-list>
</template>

<script setup>
defineProps({
  items: {
    type: Object,
    default: () => {},
  },
  obj: {
    type: Object,
    default: () => {},
  },
})
</script>
