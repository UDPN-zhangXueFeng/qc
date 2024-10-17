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

const app = createApp(App)

// 使用 ElementPlus，设置中文语言和亮色主题
app.use(ElementPlus, {
  locale: zhCn,
  // 明确设置为亮色主题
  size: 'default',
  zIndex: 3000,
})

app.use(router)

app.mount('#app')
