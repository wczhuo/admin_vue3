<script setup lang="ts">
import {useTemplateRef, ref} from 'vue';
import {Form, FormItem, Input, Button, message, Spin} from 'ant-design-vue';
import {loginApi} from "@/api/core/auth.ts";
import router from "@/router";
import SlideVerify from "@/components/SlideVerify.vue";
import {getInitData} from "@/api/core/site.ts";
import {getSiteInfo, setSiteInfo} from "@/utils/tools.ts";

const formLogin: any = useTemplateRef('formLogin');

const loading = ref(false);
const verifySuccess = ref(import.meta.env.DEV);
const verifyWarning = ref(false);

// 获取站点基础信息
const siteInfo = ref<any>(getSiteInfo());
getInitData().then((data: any) => {
  console.log('data', data);
  // loading.value = false;
  siteInfo.value = data?.result;
  setSiteInfo(data?.result);
});

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
  if (!verifySuccess.value) {
    verifyWarning.value = true;
    return;
  }
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
    router.push('/');
    // router.push('/index');
  } else {
    message.error(result?.message);
  }
}

const slideVerifySuccess = () => {
  verifySuccess.value = true;
}
</script>

<template>
  <Spin :spinning="loading">
    <div class="login-container">
      <Form ref="formLogin" class="login-form flex-column" :model="formState" :rules="rules" @finish="handleLogin">
        <FormItem name="username" class="row">
          <Input class="input" v-model:value="formState.username" placeholder="用户名"/>
        </FormItem>

        <FormItem name="password" class="row">
          <Input.Password class="input" v-model:value="formState.password" placeholder="密码"/>
        </FormItem>

        <FormItem name="captcha" class="row">
          <!--        <Input v-model:value="formState.captcha" placeholder="验证码"/>-->
          <SlideVerify class="slide-verify" :warning="verifyWarning" :on-success="slideVerifySuccess"></SlideVerify>
        </FormItem>

        <FormItem class="action-box mt-40">
          <Button type="primary" html-type="submit" class="btn-login">登录</Button>
        </FormItem>
      </Form>
    </div>
  </Spin>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  text-align: center;
  justify-items: center;
  align-content: center;

  .login-form {
    width: 300px;

    .row {
      height: 40px;
      line-height: 40px;

      .input {
        height: 40px;
        line-height: 40px;
      }
    }

    .btn-login {
      width: 100%;
    }
  }
}
</style>