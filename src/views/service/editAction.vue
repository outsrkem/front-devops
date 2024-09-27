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
export default {
    name: "EditAction",
    props: {
        vdata: Object,
    },
    data() {
        return {
            dialogVisible: false,
            actionText: null,
        };
    },
    methods: {
        openEditActionDialog() {
            this.actionText = "";
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
                this.actionText = JSON.stringify(this.vdata, null, 4);
                console.log(this.vdata); // 现在可以安全地使用vdata了
            }
        },
        onSubmit() {
            this.$notify({ title: "暂不支持", duration: 5000, type: "error" });
        },
    },
    created() {
        // console.log(this.vdata);
        this.actionText = this.vdata;
    },
};
</script>

<style scoped lang="less"></style>
