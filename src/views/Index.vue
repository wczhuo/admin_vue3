<script setup lang="ts">
import {ref} from 'vue';
import {Menu, Tabs, TabPane, Button, Breadcrumb, BreadcrumbItem, Space} from 'ant-design-vue';
import type {MenuTheme} from 'ant-design-vue';
import router from "@/router";
import {menus} from "@/router";
import {getInitData} from "@/api/core/site.ts";
import {getSiteInfo, setSiteInfo} from "@/utils/tools.ts";
import Icon from "@/components/Icon.vue";

const theme = ref<MenuTheme>('dark');
const selectedKeys = ref(['1']);
const openKeys = ref(['sub1']);
// 选项卡，最后一个选项卡不允许关闭
const tabs = ref(<any>[]);
const activeKey = ref('');
const activeMenuKey = ref('');
const breadcrumbMap = ref(<Record<string, any>>{});
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
// 生成面包屑映射
const generateBreadcrumbMap = (items?: any[], map?: any[]): void => {
  if (!items) return;

  items.forEach(item => {
        // map?.push({title: item?.meta?.title, icon: item?.meta?.icon});
        if (map) {
          breadcrumbMap.value[item.id] = [...map];
        }
        breadcrumbMap.value[item.id].push({title: item?.meta?.title, icon: item?.meta?.icon});
        // breadcrumbMap.value[item.id] = map;
        generateBreadcrumbMap(item.children, breadcrumbMap.value[item.id]);
      }
  );
};

generateBreadcrumbMap(menus?.result as any, []);
console.log('breadcrumbMap', breadcrumbMap);

// console.log('menus', menus);
// console.log('menus', menus?.result);
const items = ref(generateItems(menus?.result as any));
const defaultPage = '/dashboard/analysis';
// 默认添加一个选项卡
tabs.value.push({
  key: defaultPage,
  tab: '分析页'
});
router.push(defaultPage);
activeKey.value = defaultPage;
activeMenuKey.value = '2';
// console.log('items', items);

const handleTabChange = (tab: any) => {
  // console.log('tab', tab);
  router.push(tab);
}
const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userInfo');
  router.push('/login');
}

const handleMenuItem = (item: any) => {
  // console.log('handleMenuItem', item, tabs.value);
  // 路由跳转
  router.push(item.item.path);
  //
  let find = false;
  tabs.value.forEach((tab: any) => {
    if (tab.key == item.item.path) {
      // console.log('find item', tab.key, item.item.key);
      find = true;
    }
  });
  // console.log('find', find);
  if (!find) {
    tabs.value.push({
      key: item.item.path,
      tab: item.item.title
    });
  }
  activeKey.value = item.item.path;
  // console.log('item', item, item.item);
  activeMenuKey.value = item.key;
  // console.log('item.item.path activeKey', item.item.path);
  // 路由跳转
  router.push(item.item.path);
}
// 获取站点基础信息
const siteInfo = ref<any>(getSiteInfo());
getInitData().then((data: any) => {
  console.log('data', data);
  // loading.value = false;
  siteInfo.value = data?.result;
  setSiteInfo(data?.result);
});
</script>

<template>
  <div class="index-container flex-row">
    <div class="left-sidebar flex-column">
      <div class="header flex-row">
        <img class="logo" :src="siteInfo.logo" alt="logo">
        <span class="title">{{ siteInfo.name }}</span>
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
      <div class="header flex-row">
        <div class="left">
          <Space size="middle">
            <Icon class="menu-switch" icon="lucide:menu"/>
            <Icon class="refresh" icon="lucide:rotate-cw"/>
            <Breadcrumb>
              <BreadcrumbItem v-for="item in breadcrumbMap[activeMenuKey]">
                <Icon v-if="item.icon" :icon="item.icon"/>
                {{ item.title }}
              </BreadcrumbItem>
            </Breadcrumb>
          </Space>
        </div>
        <div class="right">
          <Space size="middle">
            门店信息 用户信息 用户下拉菜单
            <Button @click="logout">退出登录</Button>
          </Space>
        </div>
      </div>
      <div class="content">
        <div class="tab-box">
          <Tabs @change="handleTabChange" v-model:activeKey="activeKey" size="small" type="editable-card" hide-add>
            <TabPane v-for="item in tabs" :key="item.key" :tab="item.tab" :closable="tabs && tabs.length > 1">
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
  width: 240px;
  height: 100vh;
  overflow-y: auto;
  scrollbar-gutter: stable;
  scrollbar-color: #000B16 #1C1E23;
  background-color: #1C1E23;
  border-right: 1px solid rgb(54, 54, 58);

  .header {
    height: 40px;
    line-height: 40px;
    justify-content: center;
    padding-top: 5px;

    .logo {
      width: 40px;
      height: 40px;
      padding: 0;
      margin: 0 10px 0 0;
    }

    .title {
      font-size: 18px;
      font-weight: 600;
      color: #FFFFFF;
    }
  }

  .menu {
    height: calc(100vh - 40px);
    padding-top: 14px;
  }

  .ant-menu-sub {
    background: transparent !important;
  }
}

.ant-menu-item {
  background: #1C1E23 !important;
}

.ant-menu-item-only-child {
  background: #1C1E23 !important;
}

.ant-menu-dark {
  background: #1C1E23;
}

.ant-menu-dark.ant-menu-inline {
  background: #1C1E23;
}

.ant-menu-dark.ant-menu-inline {
  background: #1C1E23;
}

.ant-menu {
  background: #1C1E23 !important;
}

.ant-menu-sub.ant-menu-inline {
  background: #1C1E23;
}

.ant-menu-dark.ant-menu-inline {
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
  width: calc(100% - 240px);
  padding-top: 8px;

  .header {
    padding-left: 14px;

    .left {
      display: flex;
      flex: 1;
    }

    .right {
      display: flex;
      flex: 5;
      justify-content: flex-end;
    }
  }

  .content {
    .tab-box {
      height: 40px;
      line-height: 40px;


    }
  }
}
</style>
