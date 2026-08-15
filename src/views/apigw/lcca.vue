<template>
    <div class="settings-container border_red" style="min-width: 1200px">
        <el-card class="box-card">
            <div class="clearfix my_refresh">
                <el-row>
                    <el-button type="primary" @click="handleAdd">新增CA证书</el-button>
                    <el-button type="primary" :icon="Refresh" @click="onRefresh" :loading="loading" style="margin-left: 10px">刷新</el-button>
                </el-row>
            </div>
            <MyTable :data="caList" :columns="columns" v-loading="loading">
                <template #name="{ row }">
                    <el-tooltip class="box-item" effect="dark" :content="row.id" placement="right">
                        <el-button link type="primary" @click="onSelectCa(row.id)">{{ row.name }}</el-button>
                    </el-tooltip>
                </template>
                <template #cn="{ row }">
                    {{ row.cert?.CN || "-" }}
                </template>
                <template #not_before="{ row }">
                    {{ formatDate(row.cert?.not_before) }}
                </template>
                <template #not_after="{ row }">
                    {{ formatDate(row.cert?.not_after) }}
                </template>
                <template #remain_days="{ row }">
                    <el-tag :type="getRemainDayType(row.cert?.not_after)">
                        {{ getRemainDays(row.cert?.not_after) }}
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

        <!-- 新增/编辑证书弹窗 -->
        <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑CA证书' : '新增CA证书'" width="720px" @close="resetForm">
            <el-form :model="formData" label-width="110px" ref="formRef">
                <el-form-item label="证书名称" prop="name">
                    <el-input v-model="formData.name" placeholder="请输入证书名称" />
                </el-form-item>
                <el-form-item label="证书内容" prop="pemText">
                    <el-input
                        v-model="formData.pemText"
                        type="textarea"
                        :rows="12"
                        placeholder="-----BEGIN CERTIFICATE-----
xxxxxxxxxxxx
-----END CERTIFICATE-----" />
                    <el-alert v-if="isEdit" type="warning" style="margin-top: 8px" :closable="false">
                        编辑时若清空证书内容，仅更新证书名称；填入内容则同时更新证书
                    </el-alert>
                    <el-alert v-else type="info" style="margin-top: 8px" :closable="false"> 粘贴完整PEM证书 </el-alert>
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
import { ListlcCa, CreatelcCa, UpdatelcCa, DeletelcCa } from "../../api/apigw.js";
import { withDelay, convertToLimitOffset } from "../../utils/common.js";
import { ElMessage, ElMessageBox } from "element-plus";

export default {
    name: "LoadChannelCaIndex",
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
            caList: [],
            loading: true,
            page: 1,
            pageSize: 10,
            pageTotal: 0,
            dialogVisible: false,
            isEdit: false,
            submitLoading: false,
            formRef: null,
            formData: {
                id: "",
                name: "",
                pemText: "",
            },
            columns: [
                { label: "证书名称", slot: "name" },
                { label: "证书CN", slot: "cn" },
                { label: "生效时间", slot: "not_before" },
                { label: "失效时间", slot: "not_after" },
                { label: "剩余有效天数", slot: "remain_days" },
                { label: "创建时间", slot: "create_time" },
                { label: "操作", slot: "operate" },
            ],
        };
    },
    methods: {
        async LoadCaList(pageSize, page) {
            this.loading = true;
            const params = convertToLimitOffset(page, pageSize);
            try {
                const res = await withDelay(() => ListlcCa(params));
                this.caList = res.payload.items;
                this.pageTotal = res.payload.page_info.total;
            } catch (err) {
                this.caList = [];
            } finally {
                this.loading = false;
            }
        },
        formatDate(time) {
            if (!time) return "-";
            return formatTime(time);
        },
        getRemainDays(timestamp) {
            if (!timestamp) return "-";
            const now = Date.now();
            const diffMs = timestamp - now;
            if (diffMs <= 0) return "已过期";
            const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            return `${days} 天`;
        },
        getRemainDayType(timestamp) {
            if (!timestamp) return "info";
            const now = Date.now();
            const diffMs = timestamp - now;
            if (diffMs <= 0) return "danger";
            const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            return days <= 30 ? "warning" : "success";
        },
        onSelectCa(cid) {
            this.$router.push({ path: `/apigw/lcca/${cid}` });
        },
        onRefresh() {
            this.LoadCaList(this.pageSize, this.page);
        },
        onCurrentChange(page) {
            this.page = page;
            this.LoadCaList(this.pageSize, page);
        },
        onSizeChange(pageSize) {
            this.pageSize = pageSize;
            this.page = 1;
            this.LoadCaList(pageSize, 1);
        },
        handleAdd() {
            this.isEdit = false;
            this.resetForm();
            this.dialogVisible = true;
        },
        handleEdit(row) {
            this.isEdit = true;
            this.formData.id = row.id;
            this.formData.name = row.name;
            if (row.cert?.content) {
                this.formData.pemText = decodeURIComponent(escape(atob(row.cert.content)));
            } else {
                this.formData.pemText = "";
            }
            this.dialogVisible = true;
        },
        handleDelete(row) {
            ElMessageBox.confirm(`确定删除证书【${row.name}】？`, "提示", { type: "warning" })
                .then(async () => {
                    await DeletelcCa(row.id);
                    ElMessage.success("删除成功");
                    this.onRefresh();
                })
                .catch(() => {});
        },
        resetForm() {
            this.formData = {
                id: "",
                name: "",
                pemText: "",
            };
            this.formRef?.clearValidate();
        },
        pemToBase64(pemStr) {
            const raw = pemStr.trim();
            return btoa(unescape(encodeURIComponent(raw)));
        },
        async submitForm() {
            // 新建：必须填写证书内容
            if (!this.isEdit) {
                if (!this.formData.pemText?.trim()) {
                    ElMessage.warning("新增证书需要填写PEM证书内容");
                    return;
                }
                const pemReg = /-----BEGIN CERTIFICATE-----[\s\S]*?-----END CERTIFICATE-----/;
                if (!pemReg.test(this.formData.pemText)) {
                    ElMessage.warning("请粘贴完整PEM证书，包含首尾标记");
                    return;
                }
            }

            this.submitLoading = true;
            try {
                const payload = {
                    name: this.formData.name,
                };
                // 编辑模式：文本框不为空才追加cert字段
                const pemVal = this.formData.pemText?.trim();
                if (pemVal) {
                    const pemReg = /-----BEGIN CERTIFICATE-----[\s\S]*?-----END CERTIFICATE-----/;
                    if (!pemReg.test(pemVal)) {
                        ElMessage.warning("请粘贴完整PEM证书，包含首尾标记");
                        this.submitLoading = false;
                        return;
                    }
                    const base64Content = this.pemToBase64(this.formData.pemText);
                    payload.cert = {
                        content: base64Content,
                    };
                }

                if (this.isEdit) {
                    await UpdatelcCa(this.formData.id, payload);
                    ElMessage.success("编辑成功");
                } else {
                    await CreatelcCa(payload);
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
        this.$globalBus.emit("updateActivePath", "/apigw/cert");
        this.LoadCaList(this.pageSize, this.page);
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
