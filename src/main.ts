import {createApp} from 'vue'
import './style.css'
import App from './App.vue'
import router, {generateRoutes} from './router'
import '@/assets/scss/global.scss';
// import 'iconify-icon';
import {Icon} from '@iconify/vue';
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'    // 引入默认样式

// import Antd from 'ant-design-vue';

// ...
import VxeUI from 'vxe-pc-ui'
import 'vxe-pc-ui/lib/style.css'
import VxeUITable from 'vxe-table'
import 'vxe-table/lib/style.css'
// 需要安装指定版本的ant-design-vue,版本必须跟plugin-render-antd一致,否则无法使用
// import VxeUIPluginRenderAntd from '@vxe-ui/plugin-render-antd'
// import '@vxe-ui/plugin-render-antd/dist/style.css'
// ...

// VxeUI.use(VxeUIPluginRenderAntd, {
//     prefixCls: 'Antd'
// });

// 加载动态路由，如果刷新的页面是动态路由，例如：http://localhost:3000/dashboard/workbench
// 如果不在这里加载路由，则会提示找不到路由
await generateRoutes();

const app = createApp(App);

app.component('iconify-icon', Icon);

app.use(ElementPlus);
// app.use(Antd);
app.config.devtools = true; // 强制启用 DevTools

app.use(router).use(VxeUI).use(VxeUITable).mount('#app');
