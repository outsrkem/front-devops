<template>
    <div class="settings-container border_red" style="min-width: 1200px">
        <el-card class="box-card">
            <div class="clearfix my_refresh">
                <el-space>
                    <el-button type="primary" @click="openCreateDialog">新建API分组</el-button>
                </el-space>
                <el-space>
                    <el-button type="primary" :icon="Refresh" @click="onRefresh" :loading="loading">刷新</el-button>
                </el-space>
            </div>
            <MyTable :data="apiGroupList" :columns="columns" v-loading="loading">
                <template #name="{ row }">
                    <a :href="`/#/apigw/group/${row.id}`" target="_blank" class="link">{{ row.name }}</a>
                </template>
                <template #remark="{ row }">
                    {{ row.remark }}
                </template>
                <template #create_time="{ row }">
                    {{ formatDate(row.create_time) }}
                </template>
                <template #operate="{ row }">
                    <el-button link type="primary" @click="openEditDialog(row)">编辑</el-button>
                    <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
                </template>
            </MyTable>
            <Pagination :pageTotal="pageTotal" :pageSize="pageSize" @CurrentChange="onCurrentChange" @SizeChange="onSizeChange" />
        </el-card>

        <!-- 新建/编辑分组弹窗 -->
        <el-dialog v-model="dialogVisible" :title="dialogType === 'edit' ? '编辑API分组' : '新建API分组'" width="500px">
            <el-form :model="formData" :rules="formRules" ref="formRef" label-width="80px">
                <el-form-item label="分组名称" prop="name">
                    <el-input v-model="formData.name" placeholder="请输入分组名称" />
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="formData.remark" type="textarea" :rows="3" placeholder="请输入备注信息" />
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
import { ElNotification } from "element-plus";
import MyTable from "../../components/MyTable/MyTable.vue";
import { Refresh } from "@element-plus/icons-vue";
import Pagination from "@/components/pagination/pagination.vue";
import { formatTime } from "@/utils/date.js";
import { ListApiGroup, CreateGroup, DeleteGroup, UpdateGroup } from "../../api/apigw.js";
import { withDelay, convertToLimitOffset } from "../../utils/common.js";
export default {
    name: "ApiGroupIndex",
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
            apiGroupList: [],
            loading: true,
            page: 1,
            pageSize: 10,
            pageTotal: 0,
            columns: [
                { label: "Name", slot: "name" },
                { label: "Remark", slot: "remark" },
                { label: "Create Time", slot: "create_time" },
                { label: "Operate", slot: "operate" },
            ],
            // 弹窗相关
            dialogVisible: false,
            dialogType: "create", // create | edit
            submitLoading: false,
            editingId: null,
            formData: {
                name: "",
                remark: "",
            },
            formRules: {
                name: [
                    { required: true, message: "请输入分组名称", trigger: "blur" },
                    { min: 3, max: 20, message: "分组名称长度范围为 3-20 个字符", trigger: "blur" },
                ],
            },
        };
    },
    methods: {
        async LoadApiGroupList(pageSize, page) {
            this.loading = true;
            const params = convertToLimitOffset(page, pageSize);
            try {
                const res = await withDelay(() => ListApiGroup(params));
                this.apiGroupList = res.payload.items;
                this.pageTotal = res.payload.page_info.total;
            } catch (err) {
                this.apiGroupList = [];
            } finally {
                this.loading = false;
            }
        },
        formatDate(time) {
            return formatTime(time);
        },
        onSelectGroup(gid) {
            this.$router.push({ path: `/apigw/group/${gid}` });
        },
        onRefresh() {
            this.LoadApiGroupList(this.pageSize, this.page);
        },
        onCurrentChange(page) {
            this.page = page;
            this.LoadApiGroupList(this.pageSize, page);
        },
        onSizeChange(pageSize) {
            this.pageSize = pageSize;
            this.page = 1;
            this.LoadApiGroupList(pageSize, 1);
        },
        handleOperate(row) {
            console.log("当前分组", row);
        },
        // 统一提取后端错误信息
        getErrorMessage(err, defaultMsg = "操作失败") {
            console.log(err.data.metadata);
            return err?.data?.metadata?.message || err?.message || defaultMsg;
        },
        // 重置表单
        resetForm() {
            this.formData = {
                name: "",
                remark: "",
            };
            this.editingId = null;
            this.$nextTick(() => {
                this.$refs.formRef?.clearValidate();
            });
        },
        // 打开新建弹窗
        openCreateDialog() {
            this.dialogType = "create";
            this.resetForm();
            this.dialogVisible = true;
        },
        // 打开编辑弹窗，回填数据
        openEditDialog(row) {
            this.dialogType = "edit";
            this.editingId = row.id;
            this.formData = {
                name: row.name,
                remark: row.remark || "",
            };
            this.dialogVisible = true;
            this.$nextTick(() => {
                this.$refs.formRef?.clearValidate();
            });
        },
        // 提交（新建或编辑）
        async submitForm() {
            try {
                await this.$refs.formRef.validate();
            } catch {
                return;
            }
            this.submitLoading = true;
            try {
                if (this.dialogType === "edit") {
                    await UpdateGroup({ id: this.editingId }, this.formData);
                    ElNotification({
                        title: "成功",
                        message: "编辑分组成功",
                        type: "success",
                    });
                } else {
                    await CreateGroup(this.formData);
                    ElNotification({
                        title: "成功",
                        message: "新建分组成功",
                        type: "success",
                    });
                }
                this.dialogVisible = false;
                this.onRefresh();
            } catch (err) {
                console.error(err);
                ElNotification({
                    title: "失败",
                    message: this.getErrorMessage(err, "操作失败"),
                    type: "error",
                });
            } finally {
                this.submitLoading = false;
            }
        },
        // 删除分组
        async handleDelete(row) {
            try {
                await this.$confirm(`确定要删除分组「${row.name}」吗？`, "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                });
            } catch {
                return;
            }
            try {
                await DeleteGroup({ id: row.id });
                ElNotification({
                    title: "成功",
                    message: "删除成功",
                    type: "success",
                });
                // 删除后如果当前页没数据了，回退一页
                if (this.apiGroupList.length === 1 && this.page > 1) {
                    this.page -= 1;
                }
                this.onRefresh();
            } catch (err) {
                console.error(err);
                ElNotification({
                    title: "失败",
                    message: this.getErrorMessage(err, "删除失败"),
                    type: "error",
                });
            }
        },
    },
    created() {
        this.$globalBus.emit("updateActivePath", "/apigw/group");
        this.LoadApiGroupList(this.pageSize, this.page);
    },
};
</script>
<style scoped>
.link {
    color: #409eff; /* Element Plus primary原色 */
    text-decoration: none; /* 取消默认下划线 */
}
.link:hover {
    color: #66b1ff; /* el-link hover颜色 */
    text-decoration: none; /* hover依然不显示下划线 */
}
</style>
