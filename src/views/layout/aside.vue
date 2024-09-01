<template>
    <!--
        el-menu-item 的 index 不能重复，确保唯一即可
        route 是开启路由模式
    -->
    <div class="el-aside">
        <el-menu :default-active="activePath" router unique-opened>
            <!-- @click="onSaveNavState(subItem.path)" 用于保存当前展开的菜单 -->
            <el-menu-item index="/" @click="onSaveNavState('/')">
                <i class="el-icon-house"></i><span>首页</span>
            </el-menu-item>
            <el-menu-item index="/service" @click="onSaveNavState('/service')">
                <i class="el-icon-menu"></i><span>Service</span>
            </el-menu-item>
            <el-menu-item index="/actions" @click="onSaveNavState('/actions')">
                <i class="el-icon-menu"></i><span>Actions</span>
            </el-menu-item>
            <el-menu-item index="/policies" @click="onSaveNavState('/policies')">
                <i class="el-icon-menu"></i><span>Policies</span>
            </el-menu-item>
            <el-menu-item index="/roles" @click="onSaveNavState('/roles')">
                <i class="el-icon-menu"></i><span>Roles</span>
            </el-menu-item>
        </el-menu>
    </div>
</template>

<script>
// import globalBus from '@/utils/global-bus'

export default {
  name: 'AppAside',
  components: {},
  props: {},
  data() {
    return {
      activePath: '',
      menusList: []
    }
  },
  computed: {},
  watch: {},
  created() {
    this.activePath = window.sessionStorage.getItem('active-path') || '/'
  },
  mounted() {},
  methods: {
    // 保存菜单激活状态
    onSaveNavState(activePath) {
      this.activePath = activePath
      window.sessionStorage.setItem('active-path', activePath)
    }
  }
}
</script>

<style scoped lang="less">
    .el-aside {
        background-color: #ffffff;
        .el-menu {
            border-right: none;
        }
    }
</style>
