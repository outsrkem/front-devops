<template>
    <el-input v-model="userInfo" style="width: 1000px" :rows="12" type="textarea" disabled="true"/>
</template>
  
<script>
import { basicInfo } from '../../api'
export default {
    name: 'HomeIndex',
    components: {},
    props: {},
    data() {
      return {
        userInfo: {},
      }
    },
    methods: {
        GetbasicInfo: async function () {
            const res = await basicInfo()
            this.userInfo = JSON.stringify(res)
        }
    },
    created() {
        this.GetbasicInfo()
    },
}
</script>
  
<style scoped lang="less">
  div {
    height: 98%;
  }
</style>
  