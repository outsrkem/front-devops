<template>
    <div>
        <el-card v-loading="loading">
            <div class="code-container">
                <pre class="codepre">{{ userInfo }}</pre>
            </div>
        </el-card>
    </div>
</template>

<script>
import { basicInfo } from "../../api";
import { withDelay } from "../../utils/common.js";
export default {
    name: "HomeIndex",
    components: {},
    props: {},
    data() {
        return {
            userInfo: "",
            loading: true,
        };
    },
    // withDelay(() => GetActions(params, { sid: sid }));
    methods: {
        GetbasicInfo: async function () {
            const res = await withDelay(() => basicInfo()).finally(() => {
                this.loading = false;
            });
            this.userInfo = JSON.stringify(res, null, 4);
        },
    },
    created() {
        this.$globalBus.emit("updateActivePath", "/");
        this.GetbasicInfo();
    },
};
</script>

<style scoped lang="less">
div {
    height: 98%;
}
/* 凭据展示格式 */
.codepre {
    box-sizing: border-box;
    /*以下样式是自动换行代码*/
    white-space: pre-wrap; /* css-3 */
    white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
    white-space: -pre-wrap; /* Opera 4-6 */
    white-space: -o-pre-wrap; /* Opera 7 */
    word-wrap: break-word; /* Internet Explorer 5.5+ */
    /*以上样式是自动换行代码，需要的加上，不需要的删除*/
    overflow: auto;
    font-family: "Menlo", "Monaco", "Consolas", "Courier New", monospace;
    font-size: 13px;
    padding: 1px;
    margin-top: 0px;
    margin-bottom: 0px;
    line-height: 1.2;
    color: #333333;
    word-break: break-all;
    word-wrap: break-word;
    border-radius: 4px;
    background-color: #f5f5f5;
}
.code-container {
    position: relative;
    overflow: auto;
    margin-top: 10px;
    border: 1px solid #ebeef5;
    border-radius: 4px;
    padding: 10px;
    background-color: #f5f5f5;
}
</style>
