<template>
    <div>
        <el-input v-model="userInfo" style="width: 1000px" :rows="34" type="textarea" disabled />
    </div>
</template>

<script>
import { basicInfo } from "../../api";
export default {
    name: "HomeIndex",
    components: {},
    props: {},
    data() {
        return {
            userInfo: "",
        };
    },
    methods: {
        GetbasicInfo: async function () {
            const res = await basicInfo();
            this.userInfo = JSON.stringify(res, null, 4);
        },
    },
    created() {
        this.GetbasicInfo();
    },
};
</script>

<style scoped lang="less">
div {
    height: 98%;
}
</style>
