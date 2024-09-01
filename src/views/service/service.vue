<template>
  <div class="settings-container">
    <el-card class="box-card">
      <div class="clearfix my_refresh">
        <div>
          <el-row class="box-card-header">
            <el-button size="small" type="primary" style="margin-left: 10px" @click="onRefresh()">创建服务</el-button>
            <el-button size="small" type="primary" style="margin-left: 10px" @click="onRefresh()">删除服务</el-button>
          </el-row>
        </div>
        <!--刷新按钮-->
        <el-row>
          <el-button size="small" type="primary" @click="onRefresh" style="margin-left: 10px">刷新</el-button>
        </el-row>
        <!--/刷新按钮-->
      </div>
      <!--内容开始-->
      <el-table :data="serviceList" style="width: 100%" v-loading="loading" element-loading-text="加载中"
        element-loading-spinner="el-icon-loading">
        <!-- <el-table-column type="selection" width="55" :selectable="selected"/> -->
        <el-table-column prop="id" label="ID" min-width="100"/>
        <el-table-column label="Name">
            <template #default="scope">
                <el-button link type="primary" @click="onSelectService(scope.row.id)">{{ scope.row.name }}</el-button>
            </template>
        </el-table-column>
        <el-table-column prop="title" label="Title"/>
        <el-table-column label="Create Time">
            <template #default="scope">{{ formatDate(scope.row.create_time) }}</template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
      
<script>
import { formatTime } from '@/utils/date.js'
import { getService } from '../../api'

export default {
  name: 'ServiceIndex',
  data() {
        return {
            breadcrumb: ['首页', '权限管理'],
            serviceList: [],
            loading: true,
        }
    },
    methods: {
        GetService: async function () {
            try {
                const res = await getService()
                this.serviceList = res.payload.items
                this.loading = false
            } catch (err) {
                this.serviceList = []
                this.loading = false
            }
        },
        formatDate(time) {
            return formatTime(time)
        },
        onSelectService(sid) {
            this.$router.push(`${this.$route.path}?sid=${sid}`)
        },
        onRefresh() {
            this.loading = true
            this.GetService()
        },
    },
    created() {
        this.GetService()
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
      
