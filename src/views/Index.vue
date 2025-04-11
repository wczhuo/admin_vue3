<script setup lang="ts">
import { h, ref } from 'vue';
// import HelloWorld from './components/HelloWorld.vue'
import {Menu} from 'ant-design-vue';
import {
  MailOutlined,
  CalendarOutlined,
  AppstoreOutlined,
  SettingOutlined,
} from '@ant-design/icons-vue';

import type { MenuTheme } from 'ant-design-vue';
const theme = ref<MenuTheme>('dark');
const selectedKeys = ref(['1']);
const openKeys = ref(['sub1']);
const items = ref([
  {
    key: '1',
    icon: () => h(MailOutlined),
    label: 'Navigation One',
    title: 'Navigation One',
  },
  {
    key: '2',
    icon: () => h(CalendarOutlined),
    label: 'Navigation Two',
    title: 'Navigation Two',
  },
  {
    key: 'sub1',
    icon: () => h(AppstoreOutlined),
    label: 'Navigation Three',
    title: 'Navigation Three',
    children: [
      {
        key: '3',
        label: 'Option 3',
        title: 'Option 3',
      },
      {
        key: '4',
        label: 'Option 4',
        title: 'Option 4',
      },
      {
        key: 'sub1-2',
        label: 'Submenu',
        title: 'Submenu',
        children: [
          {
            key: '5',
            label: 'Option 5',
            title: 'Option 5',
          },
          {
            key: '6',
            label: 'Option 6',
            title: 'Option 6',
          },
        ],
      },
    ],
  },
  {
    key: 'sub2',
    icon: () => h(SettingOutlined),
    label: 'Navigation Four',
    title: 'Navigation Four',
    children: [
      {
        key: '7',
        label: 'Option 7',
        title: 'Option 7',
      },
      {
        key: '8',
        label: 'Option 8',
        title: 'Option 8',
      },
      {
        key: '9',
        label: 'Option 9',
        title: 'Option 9',
      },
      {
        key: '10',
        label: 'Option 10',
        title: 'Option 10',
      },
    ],
  },
]);
const changeTheme = (checked: boolean) => {
  theme.value = checked ? 'dark' : 'light';
};
</script>

<template>
  <div>
    <nav>
      <Menu
          v-model:openKeys="openKeys"
          v-model:selectedKeys="selectedKeys"
          style="width: 256px"
          mode="inline"
          :theme="theme"
          :items="items"
      />
      <router-link to="/">Home</router-link>
      |
      <router-link to="/about">About</router-link>
    </nav>
    <router-view/>
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
