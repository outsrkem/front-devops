import { createRouter, createWebHashHistory } from "vue-router";
const NotFound = () => import("../views/404/index.vue");
const Layout = () => import("../views/layout/index.vue");
const Home = () => import("../views/home/index.vue");
const Service = () => import("../views/service/service.vue");
const Settings = () => import("../views/service/settings.vue");
const ApiGroup = () => import("../views/apigw/group.vue");
const LoadChannel = () => import("../views/apigw/channel.vue");
const LcCert = () => import("../views/apigw/lcca.vue");
const ApiInterface = () => import("../views/apigw/apiInterface.vue");

const routes = [
    {
        path: "/",
        component: Layout,
        meta: { title: "SRE运维" },
        children: [
            { meta: { title: "SRE运维" }, path: "", name: "home", component: Home },
            { meta: { title: "SRE运维 - 服务管理" }, path: "/service", name: "service", component: Service },
            { meta: { title: "SRE运维 - 服务管理" }, path: "/service/:sid/settings", name: "Settings", component: Settings },
            { meta: { title: "SRE运维 - Api分组" }, path: "/apigw/group", name: "ApiGroup", component: ApiGroup },
            { meta: { title: "SRE运维 - 负载通道" }, path: "/apigw/channel", name: "LoadChannel", component: LoadChannel },
            { meta: { title: "SRE运维 - 负载通道" }, path: "/apigw/cert", name: "LcCert", component: LcCert },
            { meta: { title: "SRE运维 - 负载通道" }, path: "/apigw/apis", name: "ApiInterface", component: ApiInterface },
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
