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
