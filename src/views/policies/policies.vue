<template>
    <div class="settings-container">
      <el-card class="box-card">
        <div class="clearfix my_refresh">
          <div>
            <el-row class="box-card-header">
              <el-button size="small" type="primary" style="margin-left: 10px" @click="onOpenCreatePolicies()">创建系统策略</el-button>
              <el-button size="small" type="primary" style="margin-left: 10px" @click="onRefresh()">删 除</el-button>
            </el-row>
          </div>
          <!--刷新按钮-->
          <el-row>
            <el-button size="small" type="primary" @click="onRefresh" style="margin-left: 10px">刷新</el-button>
          </el-row>
          <!--/刷新按钮-->
        </div>
        <!--内容开始-->
        <el-table :data="serviceList" style="width: 100%" v-loading="loading" element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading">
          <el-table-column prop="id" label="ID"/>
          <el-table-column prop="name" label="Name"/>
          <el-table-column prop="description" label="Description"/>
          <el-table-column label="Operate" min-width="100">
            <template #default="scope">
                <el-button link type="primary" @click="onSelectService(scope.row.id)">Edit</el-button>
                <el-button link type="primary" @click="onSelectService(scope.row.id)">Delete</el-button>
            </template>
        </el-table-column>
        </el-table>
        <!--分页开始-->
        <Pagination :pageTotal="pageTotal"  :pageSize="pageSize"
            @CurrentChange="onCurrentChange" @SizeChange="onSizeChange">
        </Pagination>
        <!--分页结束-->
      </el-card>
      <CreatePolicies ref="CreatePolicies"></CreatePolicies>
    </div>
</template>

<script>
import Pagination from "@/components/pagination/pagination";
import CreatePolicies from "./CreatePolicies.vue"
import { GetPolicies } from '../../api'

export default {
    name: 'PoliciesIndex',
    components: {
        Pagination,
        CreatePolicies
    },
    data() {
        return {
            breadcrumb: ['首页', '权限管理'],
            serviceList: [],
            loading: true,
            pageTotal: 0,
            pageSize: 10,
            page: 1
        }
    },
    methods: {
        LoadGetPolicies: async function (page_size, page) {
            const params = { page_size: page_size, page: page }
            const sid = this.$route.query.sid
            const res = await GetPolicies(params, {"sid": sid})
            this.serviceList = res.payload.items
            this.pageTotal = res.payload.page_info.total
            this.loading = false
        },
        onOpenCreatePolicies() {
            this.$refs.CreatePolicies.openCreatePoliciesDialog()
            console.log("点击了按钮")
        },
        onSelectService() {
            console.log("点击了按钮")
        },
        onRefresh() {
            this.loading = true
            this.LoadGetPolicies(this.pageSize, this.page)
        },
        onCurrentChange(page) {
            this.page = page
            this.LoadGetPolicies(this.pageSize, page)
        },
        onSizeChange(pageSize) {
            this.pageSize = pageSize
            this.LoadGetPolicies(pageSize, 1)
        },
    },
    created() {
        this.LoadGetPolicies(this.pageSize, this.page)
    }
}
</script>

<style scoped lang="less">
    .my_refresh {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
</style>
