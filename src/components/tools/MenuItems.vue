<template>
  <v-list dense>
    <v-list-item
      v-for="(item, index) in items"
      :key="index"
      @click="item.onClick(obj)"
    >
      <v-list-item-icon>
        <v-icon :color="item.color">{{ item.icon }}</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title>{{ item.label }}</v-list-item-title>
      </v-list-item-content>
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
