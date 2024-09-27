<template>
    <el-card>
        <el-tabs v-model="activeName" @tab-change="onPaneChange">
            <el-tab-pane label="Actions" name="atcions">
                <div>
                    <ActionsIndex></ActionsIndex>
                </div>
            </el-tab-pane>
            <el-tab-pane label="Policies" name="policies">
                <div>
                    <PoliciesIndex></PoliciesIndex>
                </div>
                <div></div>
            </el-tab-pane>
        </el-tabs>
    </el-card>
</template>

<script>
import ActionsIndex from "./actions.vue";
import PoliciesIndex from "./policies.vue";
export default {
    name: "SettingsIndex",
    components: { ActionsIndex, PoliciesIndex },
    data() {
        return {
            activeName: "atcions",
        };
    },
    methods: {
        onPaneChange(val) {
            this.$router.push({ query: { ...this.$route.query, p: val } });
        },
    },
    created() {
        const tabPane = this.$route.query.p;
        if (tabPane) {
            this.activeName = tabPane;
        }
        // console.log(this.$route.params.sid);
    },
};
</script>

<style scoped lang="less"></style>
