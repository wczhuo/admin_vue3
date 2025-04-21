<script setup lang="ts">
import {ref} from 'vue';
import {App, theme, ConfigProvider} from 'ant-design-vue';
import {VxeUI} from "vxe-table";

defineOptions({name: 'App'});

// ant-design-vue的主题
const {darkAlgorithm, defaultAlgorithm} = theme;
const isDark = ref(true); // 通过状态控制暗黑模式

// 切换为默认主题
// VxeUI.setTheme('light')
// 切换为暗黑主题
VxeUI.setTheme('dark');
</script>

<template>
  <!-- 全局容器 -->
  <ConfigProvider :theme="{ algorithm: isDark ? darkAlgorithm : defaultAlgorithm }">
    <App>
      <!-- 动态渲染当前路由组件 -->
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <KeepAlive>
            <component :is="Component"/>
          </KeepAlive>
        </transition>
      </router-view>
    </App>
  </ConfigProvider>
</template>

<style scoped>
</style>
