<script setup lang="ts">
import Form from '@/components/Form.vue';

const schema: any = [
  {
    fieldName: 'id',
    label: 'ID',
    component: 'Input',
    // ifDetail: false,
    dependencies: {
      show: false,
      triggerFields: ['id'],
    },
  },
  {
    fieldName: 'name',
    label: '名称',
    rules: 'required',
    component: 'Input',
    slot: (row: any) => {
      return row.name;
    },
    // wrapperCol: {span: 8},
    // labelCol: {span: 4}
  },
  {
    fieldName: 'slot',
    label: '插槽',
    component: 'Select',
    slots: { default: 'ACTION' },
  },
  {
    fieldName: 'type',
    label: '类型',
    component: 'Select',
    slot: (row: any) => {
      return row.name;
    },
    componentProps: {
      allowClear: true,
      options: [
        // 状态:invalid=已过期,ing=进行中,finish=已成团,finish-fictitious=虚拟成团
        { label: '满减', value: 'full_reduce' },
        { label: '已成团', value: 'invalid' },
        { label: '解散&退款', value: 'invalid' },
        // { label: '禁用', value: 'invalid' },
      ],
    },
    // wrapperCol: {span: 8},
    // labelCol: {span: 4}
  },
  {
    fieldName: 'title',
    label: '标题',
    component: 'Input',
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
  <Form :schema="schema">
    <template #ACTION>123123</template>
  </Form>
</template>

<style scoped>

</style>