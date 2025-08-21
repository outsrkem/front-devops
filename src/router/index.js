import { createRouter, createWebHashHistory } from "vue-router";
const NotFound = () => import("../views/404/index.vue");
const Layout = () => import("../views/layout/index.vue");
const Home = () => import("../views/home/index.vue");
const Service = () => import("../views/service/service.vue");
const Settings = () => import("../views/service/settings.vue");

const routes = [
    {
        path: "/",
        component: Layout,
        meta: { title: "devops" },
        children: [
            { meta: { title: "UIAS运维" }, path: "", name: "home", component: Home },
            { meta: { title: "UIAS运维 - 服务管理" }, path: "/service", name: "service", component: Service },
            { meta: { title: "UIAS运维 - 服务管理" }, path: "/service/:sid/settings", name: "Settings", component: Settings },
        ],
    },
    { meta: { title: "404 页面未找到" }, path: "/:pathMatch(.*)*", component: NotFound },
];

const router = createRouter({
    history: createWebHashHistory("/uias-devops/"),
    base: "/devops/",
    routes,
});

router.beforeEach((to, from, next) => {
    if (to.meta && to.meta.title) {
        document.title = to.meta.title;
    }
    next();
});

export default router;
