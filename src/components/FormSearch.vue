<script setup lang="ts">
import {h, ref, useTemplateRef, watch} from 'vue';
import {Spin, Form, FormItem, Input, Select, Button} from 'ant-design-vue';

const componentsMap: { [key: string]: any } = {
  'Input': Input,
  'Select': Select,
};

const formState = ref(<Record<string, any>>{});
const rulesState = ref(<Record<string, any>>{});
const formApi: any = useTemplateRef('form');
const formCollapse = ref(false);
const showCollapseButton = ref(false);
const formCollapseIndexArr = ref(<any>[]);

interface Dependencies {
  triggerFields: Array<string>;
  required: boolean | Function;
  show: boolean | Function;
}

export interface FormSchema {
  label?: string;
  fieldName?: string | undefined | any;
  component?: string;
  componentProps?: object;
  rules?: string;
  dependencies?: Dependencies;
  slots?: Record<string, any>;
  defaultValue?: any;
}

// interface Slots{
//   default?: string;
// }

const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  collapse: { // 折叠更多表单
    type: Boolean,
    default: false,
  },
  showCollapseButton: { // 显示折叠更多按钮
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
      wrapperCol: {span: 16},
      labelCol: {span: 8}
    }),
  },
  wrapperClass: {
    type: String,
    default: 'grid-cols-4 gap-x-4',
  },
  wrapperCol: {
    type: Object,
    default: {span: 16},
  },
  labelCol: {
    type: Object,
    default: {span: 8},
  }
});

// 鉴定数据变化
watch(
    () => ({...formState.value}),
    (newState: any, oldState: any) => {
      // 更新rulesState
      console.log(`formState变化:`, oldState, ' → ', newState);
      props.schema.forEach(item => {
        let isChange = false;
        if (item?.dependencies?.triggerFields) {
          for (const field of item?.dependencies?.triggerFields) {
            if (isChange) {
              break;
            }
            isChange = newState[field] !== oldState[field];
            console.log(item.fieldName, 'isChange', isChange, field, oldState[field], newState[field]);
          }
          // item?.dependencies?.triggerFields.forEach(field => {
          //   if(isChange){
          //     break;
          //   }
          //   isChange = newState[field] !== oldState[field];
          //   console.log(item.fieldName, 'isChange', isChange, field, oldState[field], newState[field]);
          // });
        }
        console.log(item.fieldName, 'isChange', isChange);
        // 如果字段值发生了变化，则重新生成规格
        if (isChange) {
          rulesState.value[item.fieldName] = {
            message: item.rules == 'selectRequired' ? `请选择${item.label}` : `请输入${item.label}`,
            required: (item?.dependencies?.required instanceof Function) ? (item?.dependencies?.required(newState)) : (item?.dependencies?.required === true ? true : !!item.rules),
            show: (item?.dependencies?.show instanceof Function) ? (item?.dependencies?.show(newState)) : (item?.dependencies?.show !== false),
          };
        }
        console.log('rulesState', rulesState);
      });
    },
    {deep: true}
)

// 初始化rulesState
props.schema.forEach(item => {
  rulesState.value[item.fieldName] = {
    message: item.rules == 'selectRequired' ? `请选择${item.label}` : `请输入${item.label}`,
    // required: (item?.dependencies?.required instanceof Function) ? (item?.dependencies?.required(formState)) : (item?.dependencies?.required === true ? true : !!item.rules),
    required: false,
    show: (item?.dependencies?.show instanceof Function) ? (item?.dependencies?.show(formState)) : (item?.dependencies?.show !== false),
  };
  // 初始化默认值
  formState.value[item.fieldName] = item?.defaultValue ? item?.defaultValue : '';
});
// console.log('rulesState', rulesState);

formCollapse.value = props.collapse;
showCollapseButton.value = props.showCollapseButton;

const formItemClass = (item: any, __index: any) => {
  return item?.formItemClass ? item?.formItemClass : props.commonConfig.formItemClass;
}
// const formItemRules: any = (__item: any, __index: any) => {
//   return {
//     message: '12123',
//     required: true,
//   };
//   // computed无效
//   // return computed(() =>{
//   //   return {
//   //     message: '12123',
//   //     required: true,
//   //   };
//   // });
// }
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
  console.log('formApi', formApi, formApi.value);
  formApi.value.resetFields();
}
const onSubmit = () => {

}
const handleCollapse = () => {
  // 默认展示前三个空间
  formCollapse.value = !formCollapse.value;
  if (formCollapse.value) {
    for (let i = 4; i < props.schema.length; i++) {
      formCollapseIndexArr.value.push(i);
    }
  } else {
    formCollapseIndexArr.value = [];
  }
}
defineExpose({setValues, resetForm, setFieldValue, formApi});
</script>

<template>
  <div class="form-container">
    <Spin :spinning="loading">
      <Form ref="form" :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol" :class="wrapperClass"
            class="grid" :colon="false">
        <template v-for="(item, index) in schema">
          <FormItem v-show="rulesState[item.fieldName]?.show && (formCollapseIndexArr.indexOf(index) < 0)"
                    :class="formItemClass(item, index)"
                    :rules="rulesState[item.fieldName]" :label="(item as any).label"
                    :label-col="formItemLabelCol(item, index)" :wrapper-col="formItemWrapperCol(item, index)"
                    :name="item.fieldName">
            <!--              <component :is="formItemComponent(item, index)"/>-->
            <!-- 动态渲染组件 -->
            <slot v-if="item?.slots?.default" :name="item?.slots?.default"></slot>
            <component v-else
                       :is="formItemComponent(item, index)"
                       v-model:value="formState[item.fieldName]"
                       v-bind="item.componentProps"
            />
          </FormItem>
        </template>
        <div class="col-span-full w-full text-right pb-2 grid form-action">
          <Button type="primary" @click="onSubmit">查询</Button>
          <Button style="margin-left: 12px" @click="resetForm">重置</Button>
          <span v-if="showCollapseButton" style="margin-left: 12px" class="form-collapse" @click="handleCollapse">
            {{ formCollapse ? '收起' : '展开' }}
          </span>
        </div>
      </Form>
    </Spin>
  </div>
</template>

<style scoped>
.form-action {
  grid-column: -2 / -1;
  margin-left: auto;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  height: 32px;
  line-height: 32px;
  margin-bottom: 12px;

  .form-collapse {
    color: #1668dc;
  }
}
.ant-form-item {
  margin-bottom: 12px;
}
</style>