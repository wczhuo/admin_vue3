import {createApp} from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import '@/assets/scss/global.scss';

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

const app = createApp(App);

app.use(router).use(VxeUI).use(VxeUITable).mount('#app');
