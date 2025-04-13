<script setup lang="ts">
import Form from '@/components/Form.vue';
const schema: any = [
  {
    fieldName: 'id',
    label: 'ID',
    component: 'Input',
  },
  {
    fieldName: 'name',
    label: 'name',
    component: 'Input',
    slot: (row: any)=>{
      return row.name;
    },
    wrapperCol: { span: 8 },
    labelCol: { span: 4 }
  },
  {
    fieldName: 'title',
    label: 'title',
    component: 'Input',
    slot: '',
  },
];
</script>

<template>
<Form :schema="schema"></Form>
</template>

<style scoped>

</style>