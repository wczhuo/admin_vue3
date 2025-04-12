<script setup lang="ts">
import Form from '@/components/Form.vue';
const schema: any = [
  {
    fieldName: 'id',
    label: 'ID',
    component: 'Input',
  },
];
</script>

<template>
<Form :schema="schema"></Form>
</template>

<style scoped>

</style>