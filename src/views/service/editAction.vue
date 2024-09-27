<template>
    <div>
        <el-dialog v-model="dialogVisible" title="修改Action" width="500" :close-on-click-modal="false" draggable destroy-on-close>
            <el-input v-model="actionText" style="width: 100%" :rows="20" type="textarea" />
            <div style="display: flex; justify-content: flex-end; align-items: center; margin-top: 18px">
                <el-button size="small" @click="dialogVisible = false">取消</el-button>
                <el-button size="small" type="primary" @click="onSubmit">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { EditAction } from "../../api";
export default {
    name: "EditAction",
    props: {
        vdata: Object,
    },
    data() {
        return {
            dialogVisible: false,
            actionText: null,
            rawdata: {},
        };
    },
    methods: {
        loadEditAction: function (data) {
            const paths = { sid: this.$route.params.sid };
            EditAction(paths, data)
                .then(() => {
                    this.$notify({ title: "修改成功", duration: 2000, type: "success" });
                    this.$parent.onRefresh();
                    this.dialogVisible = false;
                })
                .catch((err) => {
                    let msg = err.data;
                    this.$notify({ title: "修改失败", duration: 5000, message: msg, type: "error" });
                });
        },
        openEditActionDialog() {
            this.actionText = "";
            this.dialogVisible = true;
            this.processVdata();
        },
        fetchVdata() {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(this.vdata); // 当vdata更新后，解析Promise
                }, 500); // 假设0.5秒后更新vdata，考虑优化
            });
        },
        processVdata: async function () {
            await this.fetchVdata(); // 等待fetchVdata完成（即vdata被更新）
            if (this.vdata !== null) {
                this.rawdata = this.vdata;
                this.actionText = JSON.stringify(this.vdata.actionInfo, null, 4);
            }
        },
        onSubmit() {
            const action_id = this.vdata.id;
            let actions = [];
            let action = {
                actionInfo: JSON.parse(this.actionText),
                id: action_id,
            };
            actions.push(action);
            let data = { actions: actions };
            this.loadEditAction(data);
        },
    },
    created() {
        this.actionText = this.vdata;
    },
};
</script>

<style scoped lang="less"></style>
