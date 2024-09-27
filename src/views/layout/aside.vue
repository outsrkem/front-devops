<template>
    <!--
        el-menu-item 的 index 不能重复，确保唯一即可
        route 是开启路由模式,这里使用 this.$router.push 跳转，更灵活一些
    -->
    <div class="el-aside">
        <el-menu :default-active="activePath" unique-opened>
            <!-- @click="onSaveNavState(subItem.path)" 用于保存当前展开的菜单 -->
            <el-menu-item index="/" @click="OnSwitchRoutes('/')"> <i class="el-icon-house"></i><span>首页</span> </el-menu-item>
            <el-menu-item index="/service" @click="OnSwitchRoutes('/service')"> <i class="el-icon-menu"></i><span>Service</span> </el-menu-item>
        </el-menu>
    </div>
</template>

<script>
// import globalBus from '@/utils/global-bus'
export default {
    name: "AppAside",
    components: {},
    props: {},
    data() {
        return {
            activePath: "",
            menusList: [],
        };
    },
    computed: {},
    watch: {},
    created() {
        this.activePath = window.sessionStorage.getItem("active-path") || "/";
    },
    mounted() {},
    methods: {
        saveActivePath(activePath) {
            this.activePath = activePath;
            window.sessionStorage.setItem("active-path", activePath);
        },
        // 保存菜单激活状态
        OnSwitchRoutes(activePath) {
            /**
             * 获取所有：this.$route.query  => { user: '1' }
             * 获取单个：this.$route.query.sid
             */
            if (activePath === "/" || activePath === "/service") {
                if (activePath === "/") {
                    this.$router.push({ path: activePath });
                }
                if (activePath === "/service") {
                    this.$router.push({ path: activePath, query: { sid: this.$route.query.sid } });
                }
                this.saveActivePath(activePath);
            } else {
                const sid = this.$route.query.sid;
                if (sid != undefined) {
                    this.$router.push({ path: activePath, query: { sid: sid } });
                    this.saveActivePath(activePath);
                } else {
                    this.$notify({
                        duration: 2000,
                        title: "未选择服务",
                        message: "先在Service中点击Name列的名称选择一个Service",
                        type: "warning",
                        position: "top-left",
                        offset: 300,
                    });
                }
            }
        },
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
