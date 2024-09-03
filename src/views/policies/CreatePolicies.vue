<template>
    <el-dialog
        :model-value="dialogVisible"
        title="创建系统策略"
        width="500"
        :before-close="handleBeforeClose"
    >
    <el-input
        :v-model="textarea"
        :autosize="{ minRows: 20, maxRows: 20 }"
        type="textarea"
        :placeholder="example"
    />
    <template #footer>
        <el-form class="my_form" ref="form" :model="actionForm" label-width="auto" size="mini">
            <el-form-item class="my_Button" size="small">
                <el-button>清 空</el-button>
                <el-button>取 消</el-button>
                <el-button type="primary">提 交</el-button>
            </el-form-item>
        </el-form>
    </template>
  </el-dialog>
</template>

<script>
export default {
    name: 'CreatePolicies',
    data() {
        return {
            dialogVisible: false,
            textarea: {},
            example: "请输入json格式策略数据",
        }
    },
    methods: {
        openCreatePoliciesDialog() {
            console.log("点击了按钮+++++++++")
            console.log(this.dialogVisible)
            this.dialogVisible = true
            console.log(this.dialogVisible)
        },
        onSubmit() {
        },
        handleBeforeClose() {
            this.dialogVisible = false
        }
    }
}
</script>

<style scoped lang="less">
.my_form {
  padding-right: 50px;
  padding-left: 10px;
}
    .my_Button {
        text-align: right;
    }

</style>
