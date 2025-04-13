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
    rules: 'required',
    component: 'Input',
    slot: (row: any) => {
      return row.name;
    },
    wrapperCol: {span: 8},
    labelCol: {span: 4}
  },
  {
    fieldName: 'type',
    label: 'type',
    component: 'Input',
    slot: (row: any) => {
      return row.name;
    },
    wrapperCol: {span: 8},
    labelCol: {span: 4}
  },
  {
    fieldName: 'title',
    label: 'title',
    component: 'Input',
    slot: '',
    dependencies: {
      triggerFields: ['type'],
      required: (values: any) => {
        return (['full_reduce', 'full_discount', 'free_shipping'].indexOf(values.type) >= 0);
      },
      show: (values: any) => {
        return (['full_reduce', 'full_discount', 'free_shipping'].indexOf(values.type) >= 0);
      },
    },
  },

];
</script>

<template>
  <Form :schema="schema"></Form>
</template>

<style scoped>

</style>