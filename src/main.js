import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import ElementPlus from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import "element-plus/dist/index.css";

import vueCookies from "vue-cookies";

import "./styles/index.less";
const app = createApp(App);

app.use(ElementPlus, {
    locale: zhCn,
});

app.use(router);
app.use(vueCookies);
app.mount("#app");
