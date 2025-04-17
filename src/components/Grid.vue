<script setup lang="ts">
import {ref} from 'vue'
import FormSearch from "@/components/FormSearch.vue";
import FormSchema from "@/components/FormSchema.vue";

const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  formConfig: {
    type: Object,
    default: () => ({
      formItemClass: 'col-span-1',
      wrapperCol: {span: 16},
      labelCol: {span: 8},
      showCollapseButton: false,
    }),
  },
  schema: {
    type: Array<FormSchema>,
    default: () => ([]),
  },
  commonConfig: {
    type: Object,
    default: () => ({
      formItemClass: 'col-span-1',
      wrapperCol: {span: 16},
      labelCol: {span: 8}
    }),
  },
  wrapperClass: {
    type: String,
    default: 'grid-cols-6 gap-x-4',
  },
  wrapperCol: {
    type: Object,
    default: {span: 16},
  },
  labelCol: {
    type: Object,
    default: {span: 6},
  }
});

interface RowVO {
  id: number
  name: string
  role: string
  sex: string
  age: number
  address: string
}

const tableData = ref<RowVO[]>([
  {id: 10001, name: 'Test1', role: 'Develop', sex: 'Man', age: 28, address: 'test abc'},
  {id: 10002, name: 'Test2', role: 'Test', sex: 'Women', age: 22, address: 'Guangzhou'},
  {id: 10003, name: 'Test3', role: 'PM', sex: 'Man', age: 32, address: 'Shanghai'},
  {id: 10004, name: 'Test4', role: 'Designer', sex: 'Women', age: 24, address: 'Shanghai'}
])

console.log('props.formConfig', props.formConfig);
</script>

<template>
  <div class="grid-container">
    <div class="form-container">
      <!--      :schema="schema" :class="wrapperClass"-->
      <FormSearch v-bind="props.formConfig"></FormSearch>
    </div>
    <div class="w-full divider"></div>
    <div class="table-container">
      <vxe-table :data="tableData">
        <vxe-column type="seq" width="70"></vxe-column>
        <vxe-column field="name" title="Name"></vxe-column>
        <vxe-column field="sex" title="Sex"></vxe-column>
        <vxe-column field="age" title="Age"></vxe-column>
      </vxe-table>
    </div>
  </div>
</template>

<style scoped>
.form-container {
  padding-top: 6px;
  padding-right: 12px;
}

.divider {
  height: 12px;
  background-color: rgb(20, 20, 20);
}

.table-container {
  padding: 8px;
}
</style>