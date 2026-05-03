<template>
    <el-aside class="aside" style="width: auto">
        <el-menu :default-active="activePath" unique-opened>
            <el-menu-item index="/" @click="OnSwitchRoutes('/')">
                <el-icon><House /></el-icon>
                <template #title><span>首页</span></template>
            </el-menu-item>

            <el-menu-item index="/service" @click="OnSwitchRoutes('/service')">
                <el-icon><Tickets /></el-icon>
                <template #title><span>Service</span></template>
            </el-menu-item>
            <el-menu-item index="/3">
                <el-icon><Tickets /></el-icon>
                <template #title><span>账号管理</span></template>
            </el-menu-item>
            <el-menu-item index="/4">
                <el-icon><SetUp /></el-icon>
                <template #title><span>变更管理</span></template>
            </el-menu-item>
            <el-sub-menu index="fztd">
                <template #title>
                    <el-icon><Switch /></el-icon>
                    <span>APIGW</span>
                </template>
                <el-menu-item index="fztd-1">API分组</el-menu-item>
                <el-menu-item index="fztd-2">API管理</el-menu-item>
                <el-menu-item index="fztd-3">负载通道</el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="djgl">
                <template #title>
                    <el-icon><ChatLineSquare /></el-icon>
                    <span>订单管理</span>
                </template>
                <el-menu-item index="djgl-1">产品一览</el-menu-item>
                <el-menu-item index="djgl-2">购买管理</el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="fwyw">
                <template #title>
                    <el-icon><Memo /></el-icon>
                    <span>服务运维</span>
                </template>
                <el-menu-item index="fwyw-1">UIAS</el-menu-item>
                <el-menu-item index="fwyw-2">ATS</el-menu-item>
                <el-menu-item index="fwyw-3">DTWM</el-menu-item>
                <el-menu-item index="fwyw-4">SNMS</el-menu-item>
                <el-menu-item index="fwyw-5">Turtle</el-menu-item>
                <el-menu-item index="fwyw-6">Ledger</el-menu-item>
            </el-sub-menu>
        </el-menu>
    </el-aside>
</template>

<script>
export default {
    name: "AppAside",
    components: {},
    props: {},
    data() {
        return {
            activePath: "",
        };
    },
    computed: {},
    watch: {},
    mounted() {},
    methods: {
        saveActivePath(activePath) {
            this.activePath = activePath;
        },
        // 保存菜单激活状态
        OnSwitchRoutes(activePath) {
            this.$router.push({ path: activePath });
        },
    },
    created() {
        this.$globalBus.on("updateActivePath", (data) => {
            this.activePath = data || "/";
        });
    },
};
</script>

<style scoped lang="less">
.el-aside {
    background-color: #ffffff;
    .el-menu {
        border-right: none;
    }
}
</style>
