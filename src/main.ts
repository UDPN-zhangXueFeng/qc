import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import '../index.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

// 导入亮色主题
import 'element-plus/theme-chalk/index.css'

// 设置 Element Plus 主题色
import './styles/element-theme.css'

const app = createApp(App)

app.use(ElementPlus, {
  locale: zhCn,
  size: 'default',
  zIndex: 3000,
})

app.use(router)

app.mount('#app')
