<template>
    <div class="settings-container" style="min-width: 1200px">
        <el-card class="box-card">
            <div class="clearfix my_refresh">
                <div>
                    <el-row class="box-card-header">
                        <el-button size="small" type="primary" style="margin-left: 10px" @click="dialogVisible = true">创建服务</el-button>
                    </el-row>
                </div>
                <!--刷新按钮-->
                <el-row>
                    <el-button size="small" type="primary" @click="onRefresh" style="margin-left: 10px">刷新</el-button>
                </el-row>
                <!--/刷新按钮-->
            </div>
            <!--内容开始-->
            <el-table
                :data="serviceList"
                style="width: 100%"
                v-loading="loading"
                element-loading-text="加载中"
                element-loading-spinner="el-icon-loading"
            >
                <el-table-column label="Name">
                    <template #default="scope">
                        <el-tooltip class="box-item" effect="dark" :content="scope.row.id" placement="right">
                            <el-button link type="primary" @click="onSelectService(scope.row.id)">{{ scope.row.name }}</el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column prop="title" label="Title" />
                <el-table-column label="Create Time">
                    <template #default="scope">{{ formatDate(scope.row.create_time) }}</template>
                </el-table-column>
                <el-table-column label="Operate">
                    <template #default="scope">
                        <el-button link type="primary" @click="onDeleteService(scope.row)">Delete</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <el-dialog v-model="dialogVisible" title="创建服务" width="500" :close-on-click-modal="false" draggable destroy-on-close>
            <el-form size="small" :model="serviceform" label-width="auto" style="width: 100%">
                <el-form-item label="Name">
                    <el-input v-model="serviceform.name" />
                </el-form-item>
                <el-form-item label="Title">
                    <el-input v-model="serviceform.title" />
                </el-form-item>
            </el-form>
            <div style="display: flex; justify-content: flex-end; align-items: center; margin-top: 18px">
                <el-button size="small" @click="dialogVisible = false">取消</el-button>
                <el-button size="small" type="primary" @click="onSubmit">确定</el-button>
            </div>
        </el-dialog>

        <el-dialog v-model="deleteDialog" title="删除服务" width="900" :close-on-click-modal="false" draggable destroy-on-close>
            <el-table :data="deleteServiceData" style="width: 100%">
                <el-table-column prop="name" label="Name" />
                <el-table-column prop="title" label="Title" />
            </el-table>
            <div style="display: flex; justify-content: flex-end; align-items: center; margin-top: 18px">
                <div style="display: flex; flex-grow: 1; justify-content: flex-end">
                    <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis">如果您确定要删除，请输入服务ID</div>
                </div>

                <el-input style="margin-left: 18px" size="small" v-model="deletion" placeholder="示例：715ffadad0d64f968b6d96939f4e605c" />
            </div>
            <div style="display: flex; justify-content: flex-end; align-items: center; margin-top: 18px">
                <el-button size="small" @click="deleteDialog = false">取消</el-button>
                <el-button size="small" type="primary" @click="onSubmitDelete">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { formatTime } from "@/utils/date.js";
import { getService, CreateService, DeleteService } from "../../api";

export default {
    name: "ServiceIndex",
    data() {
        return {
            breadcrumb: ["首页", "权限管理"],
            serviceList: [],
            loading: true,
            timeoutId: null,
            dialogVisible: false,
            serviceform: {
                name: "",
                title: "",
            },
            deleteDialog: false,
            deleteServiceData: null,
            deletion: "",
            deletesid: "",
        };
    },
    methods: {
        GetService: async function () {
            try {
                const res = await getService();
                this.serviceList = res.payload.items;
                this.loading = false;
            } catch (err) {
                this.serviceList = [];
                this.loading = false;
            }
        },
        loadCreateService: function (data) {
            CreateService(data)
                .then(() => {
                    this.$notify({ title: "创建成功", duration: 2000, type: "success" });
                    this.dialogVisible = false;
                    this.onRefresh();
                })
                .catch((err) => {
                    let msg = err.data;
                    this.$notify({ title: "创建失败", duration: 5000, message: msg, type: "error" });
                });
        },
        loadDeleteService: function (data) {
            DeleteService(data)
                .then(() => {
                    this.$notify({ title: "删除成功", duration: 2000, type: "success" });
                    this.deleteDialog = false;
                    this.onRefresh();
                })
                .catch((err) => {
                    let msg = err.data;
                    this.$notify({ title: "删除失败", duration: 5000, message: msg, type: "error" });
                });
        },
        formatDate(time) {
            return formatTime(time);
        },
        onSelectService(sid) {
            this.$router.push({ path: `/service/${sid}/settings` });
        },
        onRefresh() {
            // this.loading = true;
            // this.GetService();

            this.loading = true;
            clearTimeout(this.timeoutId);
            this.timeoutId = setTimeout(() => {
                this.GetService(this.pageSize, this.page);
            }, 650);
        },
        onSubmit() {
            // 创建服务
            const data = {
                service: this.serviceform,
            };
            // console.log(data);
            this.loadCreateService(data);
        },
        onDeleteService(val) {
            this.deletesid = val.id;
            this.deletion = "";
            this.deleteServiceData = [];
            this.deleteServiceData.push(val);
            this.deleteDialog = true;
        },
        onSubmitDelete() {
            if (this.deletion === this.deletesid) {
                let body = { service: { ids: this.deletesid } };
                this.loadDeleteService(body);
            } else {
                this.$notify({ title: "请完整输入正确的服务ID", duration: 5000, type: "error" });
                return;
            }
        },
    },
    created() {
        this.GetService();
    },
};
</script>

<style scoped lang="less">
.my_refresh {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>
