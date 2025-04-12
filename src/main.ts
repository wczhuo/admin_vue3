import {createApp} from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import '@/assets/scss/global.scss';

const app = createApp(App)

app.use(router)

app.mount('#app')
