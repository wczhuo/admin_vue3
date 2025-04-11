<script setup lang="ts">
import {useTemplateRef, ref} from 'vue';
import {Form, FormItem, Input, Button, message, Spin} from 'ant-design-vue';
import {loginApi} from "@/api/core/auth.ts";
import router from "@/router";

const formLogin: any = useTemplateRef('formLogin');

const loading = ref(false);

// 验证规则配置
const rules: any = {
  username: [
    {required: true, message: '用户名不能为空', trigger: 'blur'},
    {min: 3, max: 12, message: '长度3-12字符', trigger: 'blur'}
  ],
  password: [
    {required: true, message: '密码不能为空', trigger: 'blur'},
    // {pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, message: '至少8位含字母数字'}
  ],
  captcha: [
    {required: true, message: '验证码不能为空', trigger: 'blur'},
    {len: 4, message: '验证码必须4位', trigger: 'blur'}
  ]
};

// 表单数据对象
const formState = ref({
  username: 'admin',
  password: '123123',
  captcha: '1234'
});

const handleLogin = async () => {
// 手动触发表单验证
  await formLogin?.value.validate();
  loading.value = true;
  // message.success('验证通过');
  const result: any = await loginApi(formState.value);
  // console.log('result', result);
  loading.value = false;
  if (result?.result?.token) {
    message.success('登录成功');
    // 保存token和用户信息
    localStorage.setItem('token', result?.result?.token);
    localStorage.setItem('userInfo', JSON.stringify(result?.result));
    router.push('/index');
  } else {
    message.error(result?.result.error);
  }
}
</script>

<template>
  <Spin :spinning="loading">
    <Form ref="formLogin" class="login-form" :model="formState" :rules="rules" @finish="handleLogin">
      <FormItem label="用户名" name="username" colon>
        <Input v-model:value="formState.username"/>
      </FormItem>

      <FormItem label="密码" name="password" colon>
        <Input.Password v-model:value="formState.password"/>
      </FormItem>

      <FormItem label="验证码" name="captcha" colon>
        <Input v-model:value="formState.captcha"/>
      </FormItem>

      <FormItem>
        <Button type="primary" html-type="submit">登录</Button>
      </FormItem>
    </Form>
  </Spin>
</template>

<style scoped>

</style>