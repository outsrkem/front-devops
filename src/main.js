import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'
// 加载 引入vue-cookies。
import vueCookies from 'vue-cookies'

// 加载全局样式文件
import './styles/index.less'
const app = createApp(App)

// 使用element国际化
app.use(ElementPlus, {
    locale: zhCn,
})

app.use(router)
app.use(vueCookies)
app.mount('#app')
