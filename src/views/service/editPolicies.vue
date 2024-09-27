<template>
    <div>
        <el-dialog v-model="dialogVisible" title="修改系统策略" width="500" :close-on-click-modal="false" draggable destroy-on-close>
            <el-input v-model="dataText" style="width: 100%" :rows="20" type="textarea" />
            <div style="display: flex; justify-content: flex-end; align-items: center; margin-top: 18px">
                <el-button size="small" @click="dialogVisible = false">取消</el-button>
                <el-button size="small" type="primary" @click="onSubmit">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { EditPolicy } from "../../api";
export default {
    name: "EditPolicies",
    props: {
        vdata: Object,
    },
    data() {
        return {
            dialogVisible: false,
            dataText: null,
            policy_id: "",
        };
    },
    methods: {
        loadEditPolicy: function (data) {
            const paths = { sid: this.$route.params.sid };
            EditPolicy(paths, data)
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
        openEditPoliciesDialog() {
            this.dataText = "";
            this.dialogVisible = true;
            this.processVdata();
            // 使用缩进让JSON更易于阅读
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
                let tmp = JSON.parse(JSON.stringify(this.vdata));
                delete tmp.id;
                delete tmp.create_time;
                delete tmp.update_time;
                delete tmp.system;
                this.dataText = JSON.stringify(tmp, null, 4);
            }
        },
        onSubmit() {
            this.policy_id = this.vdata.id;

            let data = {
                policy_id: this.policy_id,
                policy: JSON.parse(this.dataText),
            };
            this.loadEditPolicy(data);
            // this.$notify({ title: "暂不支持", duration: 5000, type: "error" });
        },
    },
    created() {
        // console.log(this.vdata);
        this.actionText = this.vdata;
    },
};
</script>

<style scoped lang="less"></style>
