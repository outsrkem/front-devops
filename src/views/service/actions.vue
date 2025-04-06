<template>
    <div>
        <div class="my_refresh">
            <div>
                <el-row>
                    <el-button size="small" type="primary" style="margin-left: 10px" @click="onCreateAction">创建Action</el-button>
                </el-row>
            </div>
            <el-row>
                <el-button size="small" type="primary" @click="onRefresh" style="margin-left: 10px">刷新</el-button>
            </el-row>
        </div>
        <el-table
            :data="serviceList"
            style="width: 100%"
            v-loading="loading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
        >
            <el-table-column prop="id" label="ID" width="100" />
            <el-table-column prop="actionInfo.name" label="Name" min-width="150" />
            <el-table-column prop="actionInfo.description" label="Description" min-width="150" />
            <el-table-column prop="actionInfo.group" label="Group" />
            <el-table-column label="Status">
                <template #default="scope">
                    <span class="status-dot" :class="scope.row.actionInfo.status" />
                    <span>{{ scope.row.actionInfo.status }}</span>
                </template>
            </el-table-column>
            <el-table-column label="Operate" min-width="100">
                <template #default="scope">
                    <el-button link type="primary" @click="onEditService(scope.row)">Edit</el-button>
                    <el-button link type="primary" @click="onDeleteAction(scope.row)">Delete</el-button>
                </template>
            </el-table-column>
        </el-table>
        <Pagination :pageTotal="pageTotal" :pageSize="pageSize" @CurrentChange="onCurrentChange" @SizeChange="onSizeChange"> </Pagination>

        <el-dialog v-model="dialogVisible" title="创建Action" width="500" :close-on-click-modal="false" draggable destroy-on-close>
            <el-input v-model="actionsText" style="width: 100%" :rows="20" type="textarea" :placeholder="placeholder" />
            <div style="display: flex; justify-content: flex-end; align-items: center; margin-top: 18px">
                <el-button size="small" @click="dialogVisible = false">取消</el-button>
                <el-button size="small" type="primary" @click="onSubmit">确定</el-button>
            </div>
        </el-dialog>

        <el-dialog v-model="deleteDialog" title="删除Action" width="800" :close-on-click-modal="false" draggable destroy-on-close>
            <el-table :data="deleteActionData" style="width: 100%">
                <el-table-column prop="id" label="ID" width="100" />
                <el-table-column prop="actionInfo.name" label="Name" width="320" />
                <el-table-column prop="actionInfo.group" label="Group" />
                <el-table-column label="Status">
                    <template #default="scope">
                        <span class="status-dot" :class="scope.row.actionInfo.status" />
                        <span>{{ scope.row.actionInfo.status }}</span>
                    </template>
                </el-table-column>
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

        <EditAction ref="EditActions" :vdata="editActionText" />
    </div>
</template>

<script>
import Pagination from "@/components/pagination/pagination.vue";
import EditAction from "./editAction.vue";
import { GetActions, CreateAction, DeleteAction } from "../../api";

export default {
    name: "ActionsIndex",
    components: { Pagination, EditAction },
    data() {
        return {
            breadcrumb: ["首页", "权限管理"],
            serviceList: [],
            loading: true,
            pageTotal: 0,
            pageSize: 10,
            page: 1,
            dialogVisible: false,
            placeholder:
                '[{"actionInfo":{"action":"uias:users:listAccount","actionGroup":"ListOnly","description":"查询用户列表","status":"enabled"}}]',
            actionsText: "",
            deleteDialog: false,
            deleteActionData: [],
            deletion: "",
            timeoutId: null,
            editActionText: null,
            notify: false,
            notification: null,
        };
    },
    methods: {
        LoadGetActions: async function (page_size, page) {
            const params = { page_size: page_size, page: page };
            const sid = this.$route.params.sid;
            const res = await GetActions(params, { sid: sid });
            this.serviceList = res.payload.items;
            this.pageTotal = res.payload.page_info.total;
            this.loading = false;
        },
        loadCreateAction: function (body) {
            const paths = { sid: this.$route.params.sid };
            CreateAction(paths, body)
                .then(() => {
                    this.$notify({ title: "创建成功", duration: 2000, type: "success" });
                    this.dialogVisible = false;
                    this.onRefresh();
                })
                .catch((err) => {
                    let msg = err;
                    if (this.notify === true) {
                        // 关闭迁前一个Notification通知
                        this.notification.close();
                    }
                    this.notify = true;
                    console.log(msg);
                    this.notification = this.$notify({ title: "创建失败", duration: 5000, message: msg, type: "error" });
                });
        },
        loadDeleteAction: function (data) {
            const paths = { sid: this.$route.params.sid };
            DeleteAction(paths, data)
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
        onSelectService() {
            console.log("点击了按钮");
        },
        onRefresh() {
            // 添加延时，优化视觉体验感
            this.loading = true;
            clearTimeout(this.timeoutId);
            this.timeoutId = setTimeout(() => {
                this.LoadGetActions(this.pageSize, this.page);
            }, 650);
        },
        onCurrentChange(page) {
            this.page = page;
            this.LoadGetActions(this.pageSize, page);
        },
        onSizeChange(pageSize) {
            this.pageSize = pageSize;
            this.LoadGetActions(pageSize, 1);
        },
        onCreateAction() {
            //打开创建action的框
            this.dialogVisible = true;
        },
        onSubmit() {
            // 提交action创建
            let body = { actions: JSON.parse(this.actionsText) };
            this.loadCreateAction(body);
        },
        onEditService(val) {
            this.editActionText = {};
            this.editActionText = val;
            this.$refs.EditActions.openEditActionDialog();
        },
        onDeleteAction(val) {
            this.deletion = "";
            this.deleteActionData = [];
            this.deleteDialog = true;
            this.deleteActionData.push(val);
        },
        onSubmitDelete() {
            // 发送请求
            if (this.deletion === "DELETE") {
                let action_id = [];
                this.deleteActionData.map((item) => {
                    action_id.push(item.id);
                });
                let body = { action: { ids: action_id } };
                this.loadDeleteAction(body);
            } else {
                this.$notify({ title: "请完整输入“DELETE”", duration: 5000, type: "error" });
                return;
            }
        },
    },
    created() {
        this.LoadGetActions(this.pageSize, this.page);
    },
};
</script>

<style scoped lang="less">
.status-dot {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-right: 7px;
    vertical-align: middle;
}
.enabled {
    background-color: #50d4ab;
}
.disabled {
    background-color: #ffb700;
}
</style>
