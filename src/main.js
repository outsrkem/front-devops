import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import EventBusPlugin from "./utils/event-bus.js";
import ElementPlus from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import "element-plus/dist/index.css";

import vueCookies from "vue-cookies";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import "./styles/index.less";
const app = createApp(App);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component); // 注册所有 ElementPlus 图标
}

app.use(ElementPlus, { locale: zhCn });
app.use(router);
app.use(vueCookies);
app.use(EventBusPlugin);
app.mount("#app");
