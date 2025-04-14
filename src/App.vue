<script setup lang="ts">
import {ref} from 'vue';
import {theme, ConfigProvider} from 'ant-design-vue';
import {VxeUI} from "vxe-table";

const {darkAlgorithm, defaultAlgorithm} = theme;
const isDark = ref(true); // 通过状态控制暗黑模式

// 切换为默认主题
// VxeUI.setTheme('light')
// 切换为暗黑主题
VxeUI.setTheme('dark');
</script>

<template>
  <!-- 全局容器 -->
  <div>
    <ConfigProvider :theme="{ algorithm: isDark ? darkAlgorithm : defaultAlgorithm }">
      <!-- 动态渲染当前路由组件 -->
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component"/>
        </transition>
      </router-view>
    </ConfigProvider>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
