<template>
    <div>
        <div class="my_refresh">
            <div>
                <el-row>
                    <el-button size="small" type="primary" style="margin-left: 10px" @click="onOpenCreatePolicies()">创建系统策略</el-button>
                </el-row>
            </div>
            <el-row>
                <el-button size="small" type="primary" @click="onRefresh" style="margin-left: 10px">刷新</el-button>
            </el-row>
        </div>
        <!--内容开始-->
        <el-table
            :data="serviceList"
            style="width: 100%"
            v-loading="loading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
        >
            <el-table-column prop="id" label="ID" />
            <el-table-column prop="name" label="Name" />
            <el-table-column prop="description" label="Description" />
            <el-table-column label="Operate">
                <template #default="scope">
                    <el-button link type="primary" @click="onSelectService(scope.row)">Edit</el-button>
                    <el-button link type="primary" @click="onDeletePolicie(scope.row)">Delete</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--分页开始-->
        <Pagination :pageTotal="pageTotal" :pageSize="pageSize" @CurrentChange="onCurrentChange" @SizeChange="onSizeChange"> </Pagination>
        <!--分页结束-->
        <el-dialog v-model="dialogVisible" title="创建系统策略" width="500" :close-on-click-modal="false" draggable destroy-on-close>
            <el-input v-model="policiesText" style="width: 100%" :rows="20" type="textarea" :placeholder="placeholder" />
            <div style="display: flex; justify-content: flex-end; align-items: center; margin-top: 18px">
                <el-button size="small" @click="dialogVisible = false">取消</el-button>
                <el-button size="small" type="primary" @click="onSubmit">确定</el-button>
            </div>
        </el-dialog>

        <el-dialog v-model="deleteDialog" title="删除系统策略" width="900" :close-on-click-modal="false" draggable destroy-on-close>
            <el-table :data="deletePolicieData" style="width: 100%">
                <el-table-column prop="id" label="ID" />
                <el-table-column prop="name" label="Name" />
                <el-table-column prop="description" label="Description" />
            </el-table>
            <div style="display: flex; justify-content: flex-end; align-items: center; margin-top: 18px">
                <div style="display: flex; flex-grow: 1; justify-content: flex-end">
                    <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis">如果您确定要删除，请输入 DELETE</div>
                </div>

                <el-input style="margin-left: 18px" size="small" v-model="deletion" placeholder="DELETE" />
            </div>
            <div style="display: flex; justify-content: flex-end; align-items: center; margin-top: 18px">
                <el-button size="small" @click="deleteDialog = false">取消</el-button>
                <el-button size="small" type="primary" @click="onSubmitDelete">确定</el-button>
            </div>
        </el-dialog>
        <edit-policies ref="EditPolicies" :vdata="editPoliciesText"></edit-policies>
    </div>
</template>

<script>
import Pagination from "@/components/pagination/pagination.vue";
import EditPolicies from "./editPolicies.vue";
import { GetPolicies, CreatePolicy, DeletePolicy } from "../../api";

export default {
    name: "PoliciesIndex",
    components: {
        Pagination,
        EditPolicies,
    },
    data() {
        return {
            breadcrumb: ["首页", "权限管理"],
            serviceList: [],
            loading: true,
            pageTotal: 0,
            pageSize: 10,
            page: 1,
            timeoutId: null,
            dialogVisible: false,
            policiesText: "",
            placeholder: "",
            deletePolicieData: "",
            deleteDialog: false,
            deletion: "", // 删除确认的文本
            editPoliciesText: {},
        };
    },
    methods: {
        LoadGetPolicies: async function (page_size, page) {
            const params = { page_size: page_size, page: page };
            const sid = this.$route.params.sid;
            const res = await GetPolicies(params, { sid: sid });
            this.serviceList = res.payload.items;
            this.pageTotal = res.payload.page_info.total;
            this.loading = false;
        },
        loadDeletePolicy: function (data) {
            const paths = { sid: this.$route.params.sid };
            DeletePolicy(paths, data)
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
        loadCreatePolicy: function (body) {
            const paths = { sid: this.$route.params.sid };
            CreatePolicy(paths, body)
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
        onOpenCreatePolicies() {
            this.dialogVisible = true;
        },
        onSelectService(val) {
            this.editPoliciesText = {};
            this.editPoliciesText = val;
            this.$refs.EditPolicies.openEditPoliciesDialog();
        },
        onRefresh() {
            // this.loading = true;
            // this.LoadGetPolicies(this.pageSize, this.page);
            // // 添加延时，优化视觉体验感
            this.loading = true;
            clearTimeout(this.timeoutId);
            this.timeoutId = setTimeout(() => {
                this.LoadGetPolicies(this.pageSize, this.page);
            }, 650);
        },
        onSubmit() {
            // 发送请求创建策略
            let body = { policy: JSON.parse(this.policiesText) };
            this.loadCreatePolicy(body);
        },
        onDeletePolicie(val) {
            // 删除系统策略
            this.deletion = "";
            this.deletePolicieData = [];
            this.deletePolicieData.push(val);
            this.deleteDialog = true;
        },
        onSubmitDelete() {
            // 发送请求
            if (this.deletion === "DELETE") {
                let policie_id = "";
                this.deletePolicieData.map((item) => {
                    policie_id = item.id;
                });
                let body = { policy: { ids: policie_id } };
                this.loadDeletePolicy(body);
            } else {
                this.$notify({ title: "请完整输入“DELETE”", duration: 5000, type: "error" });
                return;
            }
        },
        onCurrentChange(page) {
            this.page = page;
            this.LoadGetPolicies(this.pageSize, page);
        },
        onSizeChange(pageSize) {
            this.pageSize = pageSize;
            this.LoadGetPolicies(pageSize, 1);
        },
    },
    created() {
        this.LoadGetPolicies(this.pageSize, this.page);
    },
};
</script>

<style scoped lang="less"></style>
