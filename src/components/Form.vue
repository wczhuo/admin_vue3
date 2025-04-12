<script setup lang="ts">
import {h} from 'vue';
import {Spin, Form, FormItem, Input} from 'ant-design-vue';

const componentsMap: { [key: string]: any } = {
  'Input': Input
};

const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  schema: {
    type: Array,
    default: () => ([]),
  },
  commonConfig: {
    type: Object,
    default: () => ({
      formItemClass: 'col-span-1'
    }),
  },
  wrapperClass: {
    type: String,
    default: 'grid-cols-1',
  }
});

const formItemClass = (item: any, __index: any) => {
  return item?.formItemClass ? item?.formItemClass : props.commonConfig.formItemClass;
}
const formItemRules = (__item: any, __index: any) => {
  return [];
}
const formItemComponent = (item: any, __index: any) => {
  return h(componentsMap[item.component]);
}
</script>

<template>
  <div class="form-container">
    <Spin :spinning="loading">
      <Form>
        <div :class="wrapperClass" v-for="(item, index) in schema">
          <div :class="formItemClass(item, index)">
            <FormItem :rules="formItemRules(item, index)" :label="(item as any).label">
              <component :is="formItemComponent(item, index)"/>
            </FormItem>
          </div>
        </div>
      </Form>
    </Spin>
  </div>
</template>

<style scoped>

</style>