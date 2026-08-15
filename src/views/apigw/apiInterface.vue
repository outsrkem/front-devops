<template>
    <div class="settings-container border_red" style="min-width: 1200px">
        <el-card class="box-card">
            <div class="clearfix my_refresh" style="display: flex; justify-content: space-between; align-items: center">
                <el-space>
                    <el-select v-model="selectedGroupId" placeholder="选择分组筛选" style="width: 260px" @change="handleGroupChange" popper-max-height="600px">
                        <el-option label="全部分组" value="all" />
                        <el-option v-for="item in groupList" :key="item.id" :label="item.name" :value="item.id" />
                    </el-select>
                    <el-button type="primary" @click="openCreateDialog">新建</el-button>
                    <el-button text bg type="primary" @click="batchOffline">下线</el-button>
                    <el-button text bg type="primary" @click="batchPublish">发布</el-button>
                </el-space>
                <div>
                    <el-button type="primary" :icon="Refresh" @click="onRefresh" :loading="loading">刷新</el-button>
                </div>
            </div>
            <MyTable :data="apiInterfaceList" :columns="columns" v-loading="loading">
                <template #method="{ row }">
                    {{ row.method || "-" }}
                </template>
                <template #req_uri="{ row }">
                    {{ row.req_uri }}
                </template>
                <template #backend_uri="{ row }">
                    {{ row.backend_uri || "-" }}
                </template>
                <template #auth="{ row }">
                    {{ row.auth || "-" }}
                </template>
                <template #mode="{ row }">
                    {{ row.mode || "-" }}
                </template>
                <template #status="{ row }">
                    <span class="status-item">
                        <span class="dot" :class="row.status === 1 ? 'dot-green' : 'dot-red'"></span>
                        {{ row.status === 1 ? "启用" : "禁用" }}
                    </span>
                </template>
                <template #publish="{ row }">
                    <span class="status-item">
                        <span class="dot" :class="getPublishDotClass(row.publish)"></span>
                        {{ getPublishText(row.publish) }}
                    </span>
                </template>
                <template #create_time="{ row }">
                    {{ formatDate(row.create_time) }}
                </template>
                <template #operate="{ row }">
                    <el-button link type="primary" v-if="row.publish !== 2" @click="handlePublish(row)">发布</el-button>
                    <el-button link type="primary" v-if="row.publish === 2" @click="handleOffline(row)">下线</el-button>
                    <el-button link type="primary" @click="openEditDialog(row)">编辑</el-button>
                    <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
                </template>
            </MyTable>
            <Pagination :pageTotal="pageTotal" :pageSize="pageSize" @CurrentChange="onCurrentChange" @SizeChange="onSizeChange" />
        </el-card>

        <!-- 新建/编辑弹窗 -->
        <el-dialog v-model="dialogVisible" :title="dialogTitle" width="700px" @close="resetForm">
            <el-form ref="formRef" :model="formData" label-width="120px">
                <el-form-item label="接口名称" prop="name">
                    <el-input v-model="formData.name" placeholder="请输入接口名称"></el-input>
                </el-form-item>
                <el-form-item label="请求协议" prop="protocol">
                    <el-select v-model="formData.protocol">
                        <el-option label="HTTP" value="HTTP"></el-option>
                        <el-option label="HTTPS" value="HTTPS"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="请求方法" prop="method">
                    <el-select v-model="formData.method">
                        <el-option label="HEAD" value="HEAD"></el-option>
                        <el-option label="GET" value="GET"></el-option>
                        <el-option label="POST" value="POST"></el-option>
                        <el-option label="PUT" value="PUT"></el-option>
                        <el-option label="DELETE" value="DELETE"></el-option>
                        <el-option label="PATCH" value="PATCH"></el-option>
                        <el-option label="OPTIONS" value="OPTIONS"></el-option>
                        <el-option label="Any" value="Any"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="请求URI" prop="req_uri">
                    <el-input v-model="formData.req_uri"></el-input>
                </el-form-item>
                <el-form-item label="后端URI" prop="backend_uri">
                    <el-input v-model="formData.backend_uri" placeholder="/"></el-input>
                </el-form-item>
                <el-form-item label="认证方式" prop="auth">
                    <el-select v-model="formData.auth">
                        <el-option label="UIAS" value="UIAS"></el-option>
                        <el-option label="TOKEN" value="TOKEN"></el-option>
                        <el-option label="NONE" value="NONE"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="匹配模式" prop="mode">
                    <el-select v-model="formData.mode">
                        <el-option label="前缀匹配" value="PREFIX"></el-option>
                        <el-option label="精确匹配" value="EXACT"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="负载通道" prop="lc_id">
                    <el-select v-model="formData.lc_id" placeholder="请选择负载通道" style="width: 100%">
                        <el-option v-for="item in lcList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="限流值" prop="rate_limit">
                    <el-input-number v-model="formData.rate_limit" :min="0"></el-input-number>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submitForm" :loading="submitLoading">确定</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import MyTable from "../../components/MyTable/MyTable.vue";
import { Refresh } from "@element-plus/icons-vue";
import Pagination from "@/components/pagination/pagination.vue";
import { formatTime } from "@/utils/date.js";
import { ListApiInterface, ApiLifecycle, ListApiGroup, ListLoadChannel } from "../../api/apigw.js";
import { CreateApiInterface, DeleteApiInterface, UpdateApiInterface } from "../../api/apigw.js";
import { withDelay, convertToLimitOffset } from "../../utils/common.js";
export default {
    name: "ApiInterfaceIndex",
    components: {
        MyTable,
        Pagination,
    },
    setup() {
        return {
            Refresh,
        };
    },
    data() {
        return {
            apiInterfaceList: [],
            groupList: [],
            lcList: [],
            selectedGroupId: "all",
            loading: true,
            page: 1,
            pageSize: 10,
            pageTotal: 0,
            //弹窗相关
            dialogVisible: false,
            dialogTitle: "新建接口",
            formRef: null,
            submitLoading: false,
            editRowId: "", //编辑时当前行ID
            formData: {
                name: "",
                protocol: "",
                method: "",
                req_uri: "",
                backend_uri: "",
                auth: "",
                mode: "",
                lc_id: "",
                rate_limit: 0,
            },
            columns: [
                { label: "接口名称", prop: "name" },
                { label: "请求方法", slot: "method" },
                { label: "URI", slot: "req_uri" },
                { label: "认证方式", slot: "auth" },
                { label: "匹配模式", slot: "mode" },
                { label: "状态", slot: "status" },
                { label: "发布状态", slot: "publish" },
                { label: "创建时间", slot: "create_time" },
                { label: "操作", slot: "operate" },
            ],
        };
    },
    methods: {
        async LoadGroupOptions() {
            try {
                const res = await ListApiGroup(convertToLimitOffset(1, 100));
                this.groupList = res.payload.items || [];
            } catch (err) {
                this.groupList = [];
            } finally {
                this.loading = false;
                this.LoadInterfaceList(this.pageSize, this.page);
            }
        },
        async LoadLcOptions() {
            try {
                // 调用新接口 ListLoadChannel
                const res = await ListLoadChannel(convertToLimitOffset(1, 100));
                // 只筛选状态1正常通道
                const allItems = res.payload.items || [];
                this.lcList = allItems.filter((item) => item.status === 1);
            } catch (err) {
                this.lcList = [];
            }
        },
        async LoadInterfaceList(pageSize, page) {
            this.loading = true;
            const params = convertToLimitOffset(page, pageSize);
            try {
                const res = await withDelay(() => ListApiInterface(params));
                this.apiInterfaceList = res.payload.items || [];
                this.pageTotal = res.payload.page_info.total;
            } catch (err) {
                this.apiInterfaceList = [];
                this.pageTotal = 0;
            } finally {
                this.loading = false;
            }
        },
        handleGroupChange() {
            this.page = 1;
            this.LoadInterfaceList(this.pageSize, this.page);
        },
        formatDate(time) {
            if (!time) return "-";
            return formatTime(time);
        },
        // 发布状态文字映射
        getPublishText(val) {
            const map = {
                0: "未发布",
                1: "测试中",
                2: "已发布",
                3: "已下线",
            };
            return map[val] || "-";
        },
        // 发布状态圆点class
        getPublishDotClass(val) {
            const map = {
                0: "dot-gray",
                1: "dot-orange",
                2: "dot-green",
                3: "dot-red",
            };
            return map[val] || "dot-gray";
        },
        onSelectInterface(iid) {
            this.$router.push({ path: `/apigw/interface/${iid}` });
        },
        onRefresh() {
            this.LoadInterfaceList(this.pageSize, this.page);
        },
        onCurrentChange(page) {
            this.page = page;
            this.LoadInterfaceList(this.pageSize, page);
        },
        onSizeChange(pageSize) {
            this.pageSize = pageSize;
            this.page = 1;
            this.LoadInterfaceList(pageSize, 1);
        },
        handlePublish(row) {
            this.$confirm("确认要发布该接口吗？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(async () => {
                    const paths = { groupId: row.group_id, id: row.id };
                    const data = { publish: 2 };
                    try {
                        await ApiLifecycle(paths, data);
                        this.$notify({ title: "发布成功", type: "success", duration: 2000 });
                        this.onRefresh();
                    } catch (err) {
                        this.$notify({ title: "发布失败", message: err?.data || err, type: "error", duration: 5000 });
                    }
                })
                .catch(() => {});
        },
        handleOffline(row) {
            this.$confirm("确认要下线该接口吗？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(async () => {
                    const paths = { groupId: row.group_id, id: row.id };
                    const data = { publish: 3 };
                    try {
                        await ApiLifecycle(paths, data);
                        this.$notify({ title: "下线成功", type: "success", duration: 2000 });
                        this.onRefresh();
                    } catch (err) {
                        this.$notify({ title: "下线失败", message: err?.data || err, type: "error", duration: 5000 });
                    }
                })
                .catch(() => {});
        },
        // 批量操作预留（你后续可扩展）
        batchPublish() {
            this.$message.info("批量发布待实现");
        },
        batchOffline() {
            this.$message.info("批量下线待实现");
        },

        // ========== 新建编辑弹窗 ==========
        openCreateDialog() {
            this.dialogTitle = "新建接口";
            this.editRowId = "";
            this.resetForm();
            this.dialogVisible = true;
        },
        openEditDialog(row) {
            this.dialogTitle = "编辑接口";
            this.editRowId = row.id;
            this.formData = {
                name: row.name,
                protocol: row.protocol,
                method: row.method,
                req_uri: row.req_uri,
                backend_uri: row.backend_uri,
                auth: row.auth,
                mode: row.mode,
                lc_id: row.lc_id,
                rate_limit: row.rate_limit ?? 0,
            };
            this.dialogVisible = true;
        },
        resetForm() {
            this.formData = {
                name: "",
                protocol: "",
                method: "",
                req_uri: "",
                backend_uri: "",
                auth: "",
                mode: "",
                lc_id: "",
                rate_limit: 0,
            };
            this.formRef?.clearValidate();
        },
        async submitForm() {
            this.submitLoading = true;
            try {
                if (!this.editRowId) {
                    // 新建
                    await CreateApiInterface(this.selectedGroupId, this.formData);
                    this.$notify({ title: "新建成功", type: "success" });
                } else {
                    // 编辑
                    await UpdateApiInterface(this.editRowId, this.formData);
                    this.$notify({ title: "编辑成功", type: "success" });
                }
                this.dialogVisible = false;
                this.onRefresh();
            } catch (err) {
                this.$notify({ title: "操作失败", message: err?.data || err, type: "error", duration: 5000 });
            } finally {
                this.submitLoading = false;
            }
        },

        // 删除
        handleDelete(row) {
            this.$confirm(`确认删除接口【${row.name}】？删除后无法恢复`, "警告", {
                type: "error",
            })
                .then(async () => {
                    await DeleteApiInterface(row.id);
                    this.$notify({ title: "删除成功", type: "success" });
                    this.onRefresh();
                })
                .catch(() => {});
        },
    },
    created() {
        this.$globalBus.emit("updateActivePath", "/apigw/apis");
        this.LoadGroupOptions();
        this.LoadLcOptions();
    },
};
</script>

<style scoped lang="less">
.status-item {
    gap: 6px;
    display: inline-flex;
    align-items: center;
}
.dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    display: inline-block;
}
.dot-green {
    background-color: #00b42a;
}
.dot-red {
    background-color: #f53f3f;
}
.dot-orange {
    background-color: #ff7d00;
}
.dot-gray {
    background-color: #86909c;
}
</style>
