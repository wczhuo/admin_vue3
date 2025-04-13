<script setup lang="ts">
import {h, ref, useTemplateRef} from 'vue';
import {Spin, Form, FormItem, Input} from 'ant-design-vue';

const componentsMap: { [key: string]: any } = {
  'Input': Input
};

const formState = ref(<Record<string, any>>{});
const formApi = useTemplateRef('from');

interface FormSchema {
  label?: string;
  fieldName?: string | undefined | any;
  component?: string;
  componentProps?: object;
}

const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  schema: {
    type: Array<FormSchema>,
    default: () => ([]),
  },
  commonConfig: {
    type: Object,
    default: () => ({
      formItemClass: 'col-span-1',
      wrapperCol: { span: 16 },
      labelCol: { span: 8 }
    }),
  },
  wrapperClass: {
    type: String,
    default: 'grid-cols-2',
  },
  wrapperCol: {
    type: Object,
    default: { span: 16 },
  },
  labelCol: {
    type: Object,
    default: { span: 6 },
  }
});

const formItemClass = (item: any, __index: any) => {
  return item?.formItemClass ? item?.formItemClass : props.commonConfig.formItemClass;
}
const formItemRules = (__item: any, __index: any) => {
  return [];
}
const formItemComponent = (item: any, __index: any) => {
  // return '123123';
  // 文本用span控件
  return h(componentsMap[item.component]);
}
const formItemLabelCol = (item: any, __index: any) => {
  return item?.labelCol ? item?.labelCol : props.commonConfig.labelCol;
}
const formItemWrapperCol = (item: any, __index: any) => {
  return item?.wrapperCol ? item?.wrapperCol : props.commonConfig.wrapperCol;
}
const setValues = (values: any) => {
  formState.value = values;
}
const setFieldValue = (field: any, value: any) => {
  formState.value[field] = value;
}
const resetForm = () => {

}
defineExpose({setValues, resetForm, setFieldValue, formApi});
</script>

<template>
  <div class="form-container">
    <Spin :spinning="loading">
      <Form ref="form" :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol" :class="wrapperClass" class="grid">
          <template v-for="(item, index) in schema">
            <FormItem :class="formItemClass(item, index)" :rules="formItemRules(item, index)" :label="(item as any).label" :label-col="formItemLabelCol(item, index)" :wrapper-col="formItemWrapperCol(item, index)">
<!--              <component :is="formItemComponent(item, index)"/>-->
              <!-- 动态渲染组件 -->
              <component
                  :is="formItemComponent(item, index)"
                  v-model:value="formState[item.fieldName]"
                  v-bind="item.componentProps"
              />
            </FormItem>
        </template>
      </Form>
    </Spin>
  </div>
</template>

<style scoped>

</style>