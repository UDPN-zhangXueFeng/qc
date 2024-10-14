import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import '../index.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'


const app = createApp(App)

// 分别使用 ElementPlus 和 router
app.use(ElementPlus, {
    locale: zhCn,
  })
app.use(router)

app.mount('#app')
