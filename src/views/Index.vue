<script setup lang="ts">
import {ref, h, onBeforeMount} from 'vue';
import {Tabs, TabPane, Breadcrumb, BreadcrumbItem, Space, Avatar, Dropdown, message} from 'ant-design-vue';
import {generateRoutes} from "@/router";
import router from "@/router";
import {getInitData} from "@/api/core/site.ts";
import {getSiteInfo, setSiteInfo} from "@/utils/tools.ts";
import Icon from "@/components/Icon.vue";
import {getUserInfoApi, logoutApi, setUserInfo, userInfo} from "@/api/core/auth.ts";

// 主题
const menuSelectedKeys = ref(<any>[]);
const storeName = ref<string>();
const menus: any = ref([]);
const menuItems: any = ref([]);
const currentRoute: any = ref({});
const showIndexContainer = ref(false);

// 选项卡，最后一个选项卡不允许关闭
const setTabs = () => {
  localStorage.setItem('tabs', JSON.stringify(tabs.value));
}
const getTabs = () => {
  let temp = JSON.parse(localStorage.getItem('tabs') || '[]');
  if (temp.length == 0) {
    // 默认添加一个选项卡
    temp.push({
      key: defaultPageKey,
      tab: '分析页',
      path: defaultPage
    });
  }
  return temp;
}

const defaultPage = '/dashboard/analysis';
const defaultPageKey = '2';
const tabs = ref(getTabs());
const getCurrentRoute = () => {
  const route = location.pathname;
  if (routeMap.value[route] == undefined) {
    return {route: defaultPage, key: defaultPageKey};
  } else {
    return {route: location.pathname, key: routeMap.value[location.pathname]?.id};
  }
}

// 当前激活选中的选项卡key
const activeTabKey = ref('');
// 当前激活选中的菜单key
const activeMenuKey = ref('');
// 面包屑映射
const breadcrumbMap = ref(<Record<string, any>>{});
// 菜单映射
const menuMap = ref(<Record<string, any>>{});
// 路由映射
const routeMap = ref(<Record<string, any>>{});
// 生成面包屑映射
const generateBreadcrumbMap = (items?: any[], map?: any[]): void => {
  if (!items) return;

  items.forEach(item => {
        if (map) {
          breadcrumbMap.value[item.id] = [...map];
        }
        breadcrumbMap.value[item.id].push({title: item?.meta?.title, icon: item?.meta?.icon, path: item.path});
        routeMap.value[item.path] = item;
        menuMap.value[item.id] = item;
        // breadcrumbMap.value[item.id] = map;
        generateBreadcrumbMap(item.children, breadcrumbMap.value[item.id]);
      }
  );
};
onBeforeMount(async () => {
  // 生成路由并返回菜单
  menus.value = await generateRoutes();

  // menus.value = await getAllMenus();
  // 显示容器
  showIndexContainer.value = true;
  // 生成面包屑映射，路由id->面包屑数组
  generateBreadcrumbMap(menus.value as any, []);
  // 生成树形结构的菜单
  menuItems.value = ref(generateItems(menus.value as any));
  // 获取当前路由
  currentRoute.value = getCurrentRoute();

  // 跳转路由
  router.push(currentRoute.value.route);
  // 设置激活的菜单项和选项卡
  activeTabKey.value = currentRoute.value.key;
  activeMenuKey.value = currentRoute.value.key;
});

// 生成树形结构的菜单
const generateItems = (items?: any[]): any[] => {
  if (!items) return [];

  return items.map(item => ({
        key: item.id,
        path: item.path,
        redirect: item.redirect,
        // icon: item?.meta?.icon,
        icon: () => item?.meta?.icon ? h(Icon, {icon: item?.meta?.icon}) : null,
        disabled: item?.disabled,
        label: item?.meta?.title,
        title: item?.meta?.title,
        children: item?.children?.length > 0 ? generateItems(item.children) : undefined
      }
  ));
};

const handleTabChange = (tab: any) => {
  tabs.value.forEach((item: any) => {
    if (item.key === tab) {
      // 切换路由
      router.push(item.path);
    }
  });
}
// 退出登录
const logout = () => {
  const hide = message.loading('退出登录中...', 0);
  logoutApi().then((__data: any) => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
  }).finally(() => {
    hide();
    router.push('/login');
  });
}
// 获取登录管理员信息
getUserInfoApi().then((data: any) => {
  setUserInfo(data?.result);
  storeName.value = data?.result?.currentStoreName;
});
const handleMenuItem = (item: any) => {
  const menuItem = menuMap.value[item];
  // return;
  // 查找tab选项卡是否已经打开
  let find = false;
  tabs.value.forEach((tab: any) => {
    if (tab.key == menuItem.id) {
      find = true;
    }
  });
  // 未打开
  if (!find) {
    tabs.value.push({
      key: menuItem.id,
      tab: menuItem.meta.title,
      path: menuItem.path,
    });
    setTabs();
  }
  // 设置激活的菜单项和选项卡
  activeTabKey.value = menuItem.id;
  activeMenuKey.value = menuItem.id;
  // 路由跳转
  router.push(menuItem.path);
}
// 获取站点基础信息
const siteInfo = ref<any>(getSiteInfo());
getInitData().then((data: any) => {
  siteInfo.value = data?.result;
  setSiteInfo(data?.result);
});
// 删除tab选项卡
const handleTabEdit = (val: any, option: any) => {
  if (option === 'remove') {
    tabs.value.forEach((tab: any, index: number) => {
      if (tab.key === val) {
        tabs.value.splice(index, 1);
        // 保存tabs
        setTabs();
        // 切换路由
        router.push(tabs.value[Math.max(index - 1, 0)].path);
        // 切换菜单激活项
        menuSelectedKeys.value = [tabs.value[Math.max(index - 1, 0)].key];
      }
    });
  }
}
const getPopupContainer = () => {
  return document.getElementsByClassName('user-box')[0] as HTMLElement;
}

const isCollapse = ref(false);
const isShowSideBar = ref(true);
const handleSideBarCollapse = () => {
  isShowSideBar.value = !isShowSideBar.value;
}
const handleOpen = () => {

}
const handleClose = () => {

}
const handleMenuCollapse = () => {
  isCollapse.value = !isCollapse.value;
}
</script>

<template>
  <div class="index-container flex-row" v-show="showIndexContainer">
    <div class="left-sidebar flex-column" :style="{flex: isCollapse ? '0 0 60px' : '0 0 224px'}"
         :class="{hiddenLeft: !isShowSideBar}">
      <div class="header flex-row">
        <img class="logo" :src="siteInfo.logo" alt="logo">
        <span class="title" v-if="!isCollapse">{{ siteInfo.name }}</span>
      </div>
      <div class="menu">
        <el-scrollbar>
          <!--          <Menu v-if="false"-->
          <!--                v-model:openKeys="menuOpenKeys"-->
          <!--                v-model:selectedKeys="menuSelectedKeys"-->
          <!--                style="width: 100%;"-->
          <!--                mode="inline"-->
          <!--                :theme="menuTheme"-->
          <!--                :items="menuItems.value"-->
          <!--                @click="handleMenuItem"-->
          <!--                :inlineIndent="16"-->
          <!--          />-->
          <el-menu
              default-active="2"
              class="el-menu-vertical-demo"
              :collapse="isCollapse"
              @open="handleOpen"
              @close="handleClose"
              :unique-opened="true"
              background-color="#1C1E23"
              text-color="white"
              @select="handleMenuItem"
          >
            <template v-for="(item) in menuItems.value">
              <template v-if="item?.children && item?.children.length > 0">
                <el-sub-menu :index="item.key">
                  <template #title>
                    <Component :is="item.icon"></Component>
                    <span>{{ item.title }}</span>
                  </template>
                  <el-menu-item :index="child.key" v-for="(child) in item.children">
                    <Component :is="child.icon"></Component>
                    <span>{{ child.title }}</span>
                  </el-menu-item>
                </el-sub-menu>
              </template>
              <template v-else>
                <el-menu-item :index="item.key">
                  <Component :is="item.icon"></Component>
                  <template #title>{{ item.title }}</template>
                </el-menu-item>
              </template>
            </template>
          </el-menu>
        </el-scrollbar>
      </div>
      <div class="footer">
        <div class="collapse-box" @click="handleMenuCollapse">
          <Icon class="collapse-icon" v-if="isCollapse" icon="lucide:chevrons-right"></Icon>
          <Icon class="collapse-icon" v-else icon="lucide:chevrons-left"></Icon>
        </div>
      </div>
    </div>
    <div class="right-container flex-column" :class="{expandRight: !isShowSideBar}">
      <div class="header flex-row">
        <div class="left">
          <Space :size="0">
            <div class="menu-switch-box" @click="handleSideBarCollapse">
              <Icon class="menu-switch" icon="lucide:menu"/>
            </div>
            <div class="refresh-box">
              <Icon class="refresh" icon="lucide:rotate-cw"/>
            </div>
            <div class="breadcrumb-box">
              <Breadcrumb>
                <template #separator>
                  <Icon icon="lucide:chevron-right"/>
                </template>
                <BreadcrumbItem v-for="item in breadcrumbMap[activeMenuKey]">
                  <Icon v-if="item.icon" :icon="item.icon"/>
                  {{ item.title }}
                </BreadcrumbItem>
              </Breadcrumb>
            </div>
          </Space>
        </div>
        <div class="right">
          <div class="store-box">
            {{ storeName }}
          </div>
          <div class="full-screen-box">
            <Icon class="full-screen-icon" icon="lucide:maximize" size="16px"/>
          </div>
          <div class="notice-box">
            <Icon class="bell-icon" icon="lucide:bell" size="16px"/>
            <div class="circle"></div>
          </div>
          <div class="user-box">
            <Dropdown class="user-dropdown" trigger="click" :getPopupContainer="getPopupContainer">
              <Avatar :src="userInfo()?.avatar"/>
              <template #overlay>
                <div class="user-menu">
                  <div class="user-menu-item" key="1">
                    <div class="flex-row">
                      <div class="avatar">
                        <Avatar :size="40" :src="userInfo()?.avatar"/>
                      </div>
                      <div class="info flex-column">
                        <div class="nickname">{{ userInfo()?.nickname }}</div>
                        <div class="email">{{ userInfo()?.email }}</div>
                      </div>
                    </div>
                  </div>
                  <div class="user-menu-item" key="3">
                    <Space :size="2">
                      <Icon class="icon" icon="lucide:lock-keyhole"></Icon>
                      锁定屏幕
                    </Space>
                  </div>
                  <div class="user-menu-item" key="5">
                    <Space :size="2">
                      <Icon class="icon" icon="bx:bxs-store"></Icon>
                      {{ storeName }}
                    </Space>
                  </div>
                  <div class="user-menu-item" key="7">
                    <Space :size="2">
                      <Icon class="icon" icon="ant-design:user-outlined"></Icon>
                      个人信息
                    </Space>
                  </div>
                  <div class="user-menu-item" key="9" @click="logout">
                    <Space :size="2">
                      <Icon class="icon" icon="lucide:log-out"></Icon>
                      退出登录
                    </Space>
                  </div>
                </div>
              </template>
            </Dropdown>
          </div>
        </div>
      </div>
      <div class="content">
        <div class="tab-box">
          <Tabs @change="handleTabChange" @edit="handleTabEdit" v-model:activeKey="activeTabKey" size="small"
                type="editable-card" hide-add :tabBarStyle="{paddingLeft: '10px', marginTop: '2px'}">
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
  display: flex;
  width: 100%;
  height: 100vh;
}

.left-sidebar {
  flex: 0 0 224px; /* 初始固定宽度 */
  height: 100vh;
  background-color: #1C1E23;
  border-right: 1px solid rgb(54, 54, 58);
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1),
  opacity 0.5s ease-out;
  overflow: hidden;

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
    height: calc(100vh - 80px);
    padding-top: 14px;
    overflow-y: auto;
    scrollbar-gutter: stable;
    scrollbar-color: #000B16 #1C1E23;

    .el-menu {
      border: none;
    }
  }

  .footer {
    height: 40px;

    .collapse-box {
      width: 30px;
      height: 30px;
      background-color: rgb(36, 36, 36);
      border-radius: 5px;
      margin-left: 15px;

      .collapse-icon {
        margin: 7px;
      }
    }
  }

  .ant-menu-sub {
    background: transparent !important;
  }
}

/* WebKit 样式 */
.menu::-webkit-scrollbar {
  width: 1px;
  background: transparent;
}

.menu::-webkit-scrollbar-thumb {
  background-color: transparent;
  border-radius: 4px;
  border: 2px solid transparent;
  background-clip: padding-box;
}

.menu:hover::-webkit-scrollbar-thumb {
  background-color: #888;
}

/* Firefox 样式 */
.menu {
  scrollbar-width: none;
  scrollbar-color: transparent transparent;
}

.menu:hover {
  scrollbar-color: #888 transparent;
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

/* 动画触发状态 */
.left-sidebar.hiddenLeft {
  flex-basis: 0;
  opacity: 0;
  margin-right: 0; /* 消除弹性盒间隙 */
}

.right-container.expandRight {
  margin-left: 0; /* 同步补偿左侧收缩 */
}

.right-container {
  flex: 1;
  width: calc(100% - 224px);
  padding-top: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 1, 1);

  .header {
    padding-left: 14px;
    border-bottom: 1px solid rgb(54, 54, 58);
    /*height: 56px;
    line-height: 56px;*/
    padding-bottom: 8px;

    .left {
      display: flex;
      flex: 1;
    }

    .right {
      display: flex;
      flex: 2;
      justify-content: flex-end;

      .user-box {
        padding-right: 12px;
        position: relative;
      }
    }
  }

  .content {
    .tab-box {
      height: 40px;
      line-height: 40px;
      /*padding-left: 10px;*/
    }
  }
}

/* 用户头像下拉菜单 */
.user-menu {
  background-color: rgb(36, 36, 36);
  height: 100%;
  width: 250px;
  border-radius: 5px;

  .user-menu-item {
    padding: 0 0 0 16px;
    cursor: pointer;
    text-align: left;
    display: flex;
    height: 50px;
    line-height: 50px;
    justify-content: flex-start;
    border-top: 1px solid rgb(54, 54, 58);

    .icon {
      margin-right: 10px;
    }
  }

  .user-menu-item:first-child {
    border: none;
    height: 60px;
    line-height: unset;

    .avatar {
      margin: 10px 10px 10px 0;
    }

    .info {
      margin-left: 6px;

      .nickname {
        height: 30px;
        margin-top: 8px;
      }

      .email {
        height: 30px;
        margin-top: -10px;
      }
    }
  }
}

/* 菜单按钮 */
.menu-switch-box {
  width: 30px;
  height: 30px;
  cursor: pointer;
  margin-right: 5px;

  .menu-switch {
    margin: 7px;
  }
}

.menu-switch-box:hover {
  background-color: rgb(54, 54, 58);
  border-radius: 5px; /* 关键属性：生成圆形 */
}

/* 刷新按钮 */
.refresh-box {
  width: 30px;
  height: 30px;
  cursor: pointer;
  margin-right: 5px;

  .refresh {
    margin: 7px;
  }
}

.refresh-box:hover {
  background-color: rgb(54, 54, 58);
  border-radius: 5px; /* 关键属性：生成圆形 */
}

/**/
.breadcrumb-box {
  margin-left: 8px;
}

/* 门店信息 */
.store-box {
  height: 30px;
  line-height: 30px;
  margin-right: 5px;
  cursor: pointer;
  padding: 0 12px;
}

.store-box:hover {
  background-color: rgb(54, 54, 58);
  border-radius: 15px; /* 关键属性：生成圆形 */
}

/* 全屏按钮 */
.full-screen-box {
  width: 30px;
  height: 30px;
  cursor: pointer;
  margin-right: 5px;

  .full-screen-icon {
    padding: 7px;
  }
}

.full-screen-box:hover {
  background-color: rgb(54, 54, 58);
  border-radius: 50%; /* 关键属性：生成圆形 */
}

/* 消息通知，铃铛摇晃动画 */
.notice-box {
  position: relative; /* 父容器需设置为相对定位 */
  /*padding-right: 4px;*/
  width: 30px;
  height: 30px;
  cursor: pointer;
  margin-right: 12px;

  .circle {
    position: absolute; /* 绝对定位 */
    top: -2px; /* 距离顶部距离 */
    right: 1px; /* 距离右侧距离 */

    width: 8px; /* 圆形直径 */
    height: 8px; /* 与宽度相等 */
    background: #007bff; /* 蓝色背景 */
    border-radius: 50%; /* 关键属性：生成圆形 */
  }
}

.notice-box:hover {
  background-color: rgb(54, 54, 58);
  border-radius: 50%; /* 关键属性：生成圆形 */
}

.bell-icon {
  cursor: pointer;
  /* 设置旋转中心点为顶部中心，模拟悬挂效果 */
  transform-origin: top center;
  transition: transform 0.3s ease;
  margin: 7px;
}

/* 悬停时触发动画 */
.bell-icon:hover {
  animation: shake 0.8s infinite;
}

/* 关键帧动画 */
@keyframes shake {
  0%, 100% {
    transform: rotateZ(0deg);
  }
  10% {
    transform: rotateZ(-12deg);
  }
  20% {
    transform: rotateZ(12deg);
  }
  28% {
    transform: rotateZ(-10deg);
  }
  36% {
    transform: rotateZ(10deg);
  }
  42% {
    transform: rotateZ(-8deg);
  }
  48% {
    transform: rotateZ(8deg);
  }
  52% {
    transform: rotateZ(-4deg);
  }
  56% {
    transform: rotateZ(4deg);
  }
}
</style>
