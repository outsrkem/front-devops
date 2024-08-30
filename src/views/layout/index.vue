<template>
  <el-container class="layout-container">
    <el-aside class="aside" width="200px">
      <app-aside class="aside-menu" />
    </el-aside>
    <el-container>
      <el-header class="header">
        <div>
          <el-row class="box-card-header">
            <div style="padding-top: 15px">
              <!-- 面包屑导航，Breadcrumb -->
              <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item v-for="item in breadcrumb" :key="item.id">{{ item }}</el-breadcrumb-item>
              </el-breadcrumb>
            </div>
          </el-row>
        </div>

        <el-dropdown>
          <div class="avatar-wrap">
            <span>xxxxxxxxxxx</span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </div>
        </el-dropdown>
      </el-header>
      <el-main class="main">
        <!-- 子路由出口 -->
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import AppAside from './aside'

export default {
  name: 'LayoutIndex',
  components: {
    AppAside
  },
  props: {},
  data() {
    return {
      displayName: '', // 展示首行的名称
      userInfo: {}, // 当前登录用户信息
      breadcrumb: ['a', 'b', 'c'], // 面包屑导航
      actions: [],
      roles: [],
      atData: ''
    }
  },
  created() {}
}
</script>

<style scoped lang="less">
.layout-container {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}

.aside {
  background-color: #d3dce6;

  .aside-menu {
    height: 100%;
  }
}

.header {
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ccc;
  background-color: #ffffff;

  .avatar-wrap {
    display: flex;
    align-items: center;

    .avatar {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      margin-right: 10px;
    }
  }
}

.main {
  background-color: #e9eef3;
  padding-left: 20px;
  padding-top: 20px;
}
</style>
