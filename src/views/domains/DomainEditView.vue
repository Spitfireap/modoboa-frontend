<template>
  <div>
    <span class="text-h4">{{ $gettext('Edit domain') }}</span>
    <div class="mt-4" />
    <DomainEditForm />
  </div>
</template>

<script setup lang="js">
import { useGettext } from 'vue3-gettext'
import DomainEditForm from '@/components/domains/DomainEditForm'

const { $gettext } = useGettext()
</script>
