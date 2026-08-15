<template>
    <div class="settings-container border_red" style="min-width: 1200px">
        <el-card class="box-card">
            <div class="clearfix my_refresh">
                <el-row>
                    <el-button type="primary" @click="handleAdd">新增通道</el-button>
                    <el-button type="primary" :icon="Refresh" @click="onRefresh" :loading="loading" style="margin-left: 10px">刷新</el-button>
                </el-row>
            </div>
            <MyTable :data="channelList" :columns="columns" v-loading="loading">
                <template #name="{ row }">
                    <el-tooltip class="box-item" effect="dark" :content="row.id" placement="right">
                        <el-button link type="primary" @click="onSelectChannel(row.id)">{{ row.name }}</el-button>
                    </el-tooltip>
                </template>
                <template #backend="{ row }">
                    {{ row.backend || "-" }}
                </template>
                <template #timeout="{ row }"> {{ row.timeout }} ms </template>
                <template #hcinterval="{ row }"> {{ row.hcinterval }} ms </template>
                <template #status="{ row }">
                    <el-tag :type="row.status === 1 ? 'success' : 'danger'">
                        {{ row.status === 1 ? "正常" : "异常" }}
                    </el-tag>
                </template>
                <template #create_time="{ row }">
                    {{ formatDate(row.create_time) }}
                </template>
                <template #operate="{ row }">
                    <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
                    <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
                </template>
            </MyTable>
            <Pagination :pageTotal="pageTotal" :pageSize="pageSize" @CurrentChange="onCurrentChange" @SizeChange="onSizeChange" />
        </el-card>

        <!-- 新增/编辑弹窗 -->
        <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑通道' : '新增通道'" width="620px" @close="resetForm">
            <el-form :model="formData" label-width="140px" ref="formRef">
                <el-form-item label="通道名称" prop="name">
                    <el-input v-model="formData.name" placeholder="请输入通道名称" />
                </el-form-item>
                <el-form-item label="后端地址" prop="backend">
                    <el-input v-model="formData.backend" placeholder="示例：10.10.10.16:28180 或 api.vm.com:8080" />
                </el-form-item>
                <el-form-item label="超时时间(ms)" prop="timeout">
                    <el-input-number v-model="formData.timeout" :min="0" style="width: 100%" />
                </el-form-item>
                <el-form-item label="健康检查间隔(ms)" prop="hcinterval">
                    <el-input-number v-model="formData.hcinterval" :min="0" style="width: 100%" />
                </el-form-item>
                <el-form-item label="运行状态" prop="status">
                    <el-radio-group v-model="formData.status">
                        <el-radio :label="1">启用</el-radio>
                        <el-radio :label="0">停用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="后端CA证书">
                    <el-select v-model="formData.ca_cert.id" placeholder="不选择则不绑定证书" style="width: 100%" clearable>
                        <el-option v-for="item in caCertList" :key="item.id" :value="item.name">
                            <span style="float: left">{{ item.name }}</span>
                            <span style="float: right; color: var(--el-text-color-secondary); font-size: 13px">
                                {{ item.cert?.CN || "-" }}
                            </span>
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submitForm" :loading="submitLoading">保存</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import MyTable from "../../components/MyTable/MyTable.vue";
import { Refresh } from "@element-plus/icons-vue";
import Pagination from "@/components/pagination/pagination.vue";
import { formatTime } from "@/utils/date.js";
import { ListLoadChannel, CreateLoadChannel, UpdateLoadChannel, DeleteLoadChannel, ListlcCa } from "../../api/apigw.js";
import { withDelay, convertToLimitOffset } from "../../utils/common.js";
import { ElMessage, ElMessageBox } from "element-plus";

export default {
    name: "LoadChannelIndex",
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
            channelList: [],
            loading: true,
            page: 1,
            pageSize: 10,
            pageTotal: 0,
            // CA证书下拉选项
            caCertList: [],
            // 弹窗控制
            dialogVisible: false,
            isEdit: false,
            submitLoading: false,
            formRef: null,
            // 表单数据 适配后端请求体结构
            formData: {
                id: "",
                name: "",
                backend: "",
                timeout: 3000,
                hcinterval: 5000,
                status: 1,
                ca_cert: {
                    id: "",
                },
            },
            columns: [
                { label: "Name", slot: "name" },
                { label: "Backend地址", slot: "backend" },
                { label: "超时时间", slot: "timeout" },
                { label: "健康检查间隔", slot: "hcinterval" },
                { label: "状态", slot: "status" },
                { label: "创建时间", slot: "create_time" },
                { label: "操作", slot: "operate" },
            ],
        };
    },
    methods: {
        async LoadChannelList(pageSize, page) {
            this.loading = true;
            const params = convertToLimitOffset(page, pageSize);
            try {
                const res = await withDelay(() => ListLoadChannel(params));
                this.channelList = res.payload.items;
                this.pageTotal = res.payload.page_info.total;
            } catch (err) {
                this.channelList = [];
            } finally {
                this.loading = false;
            }
        },
        // 加载CA证书下拉列表
        async loadCaCertOptions() {
            try {
                const res = await ListlcCa();
                this.caCertList = res.payload.items || [];
            } catch {
                this.caCertList = [];
            }
        },
        formatDate(time) {
            return formatTime(time);
        },
        onSelectChannel(cid) {
            this.$router.push({ path: `/apigw/channel/${cid}` });
        },
        onRefresh() {
            this.LoadChannelList(this.pageSize, this.page);
        },
        onCurrentChange(page) {
            this.page = page;
            this.LoadChannelList(this.pageSize, page);
        },
        onSizeChange(pageSize) {
            this.pageSize = pageSize;
            this.page = 1;
            this.LoadChannelList(pageSize, 1);
        },
        // 打开新增弹窗
        handleAdd() {
            this.isEdit = false;
            this.resetForm();
            this.dialogVisible = true;
        },
        // 打开编辑弹窗
        handleEdit(row) {
            this.isEdit = true;
            this.formData = JSON.parse(JSON.stringify(row));
            this.dialogVisible = true;
        },
        // 删除通道
        handleDelete(row) {
            ElMessageBox.confirm(`确定删除通道【${row.name}】？`, "提示", {
                type: "warning",
            })
                .then(async () => {
                    await DeleteLoadChannel(row.id);
                    ElMessage.success("删除成功");
                    this.onRefresh();
                })
                .catch(() => {});
        },
        // 重置表单
        resetForm() {
            this.formData = {
                id: "",
                name: "",
                backend: "",
                timeout: 3000,
                hcinterval: 5000,
                status: 1,
                ca_cert: {
                    id: "",
                },
            };
            this.formRef?.clearValidate();
        },
        // 提交表单
        async submitForm() {
            this.submitLoading = true;
            try {
                // 处理证书空值：空字符串转为null，适配后端要求
                const submitBody = { ...this.formData };
                if (!submitBody.ca_cert.id) {
                    submitBody.ca_cert = null;
                }
                if (this.isEdit) {
                    // 编辑更新
                    await UpdateLoadChannel(submitBody.id, submitBody);
                    ElMessage.success("编辑成功");
                } else {
                    // 创建：剔除通道id
                    const { id, ...createPayload } = submitBody;
                    await CreateLoadChannel(createPayload);
                    ElMessage.success("新增成功");
                }
                this.dialogVisible = false;
                this.onRefresh();
            } catch (err) {
                ElMessage.error(err?.message || "操作失败");
            } finally {
                this.submitLoading = false;
            }
        },
    },
    created() {
        this.$globalBus.emit("updateActivePath", "/apigw/channel");
        this.LoadChannelList(this.pageSize, this.page);
        // 页面初始化加载CA证书下拉数据
        this.loadCaCertOptions();
    },
};
</script>

<style scoped lang="less"></style>
