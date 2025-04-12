<script setup lang="ts">
import {ref} from 'vue';
import {Menu, Tabs, TabPane, Button} from 'ant-design-vue';
import type {MenuTheme} from 'ant-design-vue';
import router from "@/router";
import {menus} from "@/router";

const theme = ref<MenuTheme>('dark');
const selectedKeys = ref(['1']);
const openKeys = ref(['sub1']);
// 选项卡，最后一个选项卡不允许关闭
const tabs = ref(<any>[]);
const activeKey = ref('');
const generateItems = (items?: any[]): any[] => {
  if (!items) return [];

  return items.map(item => ({
        key: item.id,
        path: item.path,
        redirect: item.redirect,
        // icon: item?.meta?.icon,
        disabled: item?.disabled,
        label: item?.meta?.title,
        title: item?.meta?.title,
        children: item?.children?.length > 0 ? generateItems(item.children) : undefined
      }
  ));
};

console.log('menus', menus);
console.log('menus', menus?.result);
const items = ref(generateItems(menus?.result as any));
console.log('items', items);

const handleTabChange = (tab: any) => {
  console.log('tab', tab);
  router.push(tab);
}
const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userInfo');
  router.push('/login');
}

const handleMenuItem = (item: any) => {
  console.log('handleMenuItem', item, tabs.value);
  // 路由跳转
  router.push(item.item.path);
  //
  let find = false;
  tabs.value.forEach((tab: any) => {
    if (tab.key == item.item.path) {
      console.log('find item', tab.key, item.item.key);
      find = true;
    }
  });
  console.log('find', find);
  if (!find) {
    tabs.value.push({
      key: item.item.path,
      tab: item.item.title
    });
  }
  activeKey.value = item.item.path;
  console.log('item.item.path activeKey', item.item.path);
  // 路由跳转
  router.push(item.item.path);
}
</script>

<template>
  <div class="index-container flex-row">
    <div class="left-sidebar flex-column">
      <div class="header">
        公司logo
        公司名称
      </div>
      <div class="menu">
        <Menu
            v-model:openKeys="openKeys"
            v-model:selectedKeys="selectedKeys"
            style="width: 100%;"
            mode="inline"
            :theme="theme"
            :items="items"
            @click="handleMenuItem"
        />
      </div>
    </div>
    <div class="right-container flex-column">
      <div class="header">
        用户信息 门店信息
        <Button @click="logout">退出登录</Button>
      </div>
      <div class="content">
        <div class="tab-box">
          <Tabs @change="handleTabChange" v-model:activeKey="activeKey">
            <TabPane v-for="item in tabs" :key="item.key" :tab="item.tab">
            </TabPane>
          </Tabs>
        </div>
        <div class="router-view">
          <router-view/>
        </div>
      </div>
    </div>
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

.index-container {
  width: 100%;
  height: 100vh;
}

.left-sidebar {
  width: 300px;
  height: 100vh;
  overflow-y: auto;
  scrollbar-gutter: stable;
  scrollbar-color: #000B16 #001427;
  background-color: #001427;

  .header {
    height: 120px;
  }

  .menu {
    height: calc(100vh - 120px);
  }

  .ant-menu-sub {
    background: transparent !important;
  }
}

.ant-menu-dark.ant-menu-inline .ant-menu-sub.ant-menu-inline {
  background: transparent !important;
}

/* 全局样式文件中添加 */
.ant-menu-inline::-webkit-scrollbar {
  width: 6px; /* 滚动条宽度 */
  background: #f5f5f5; /* 轨道背景 */
}

.ant-menu-inline::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.3); /* 滑块颜色 */
  border-radius: 3px;
}

.right-container {
  width: calc(100% - 300px);
}
</style>
