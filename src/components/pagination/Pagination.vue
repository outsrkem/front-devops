<template>
  <div class="el-pagination">
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
      :current-page="currentPage" :page-sizes="[5, 10, 15, 25, 50]"
      layout="total, sizes, prev, pager, next, jumper" :total="pageTotal"
    />
  </div>
</template>

<script>
export default {
  name: 'PaginationIndex',
  props: {
    pageTotal: { type: Number, default: 0 },
    pageSize: { type: Number, default: 10 }
  },
  data() {
    return {
      currentPage: 1,
      pageSizeTemp: 10
    }
  },
  methods: {
    handleSizeChange(pageSize) {
      this.pageSizeTemp = pageSize
      this.$emit('SizeChange', pageSize)
    },
    handleCurrentChange(currentPage) {
      const pageSize = this.pageSizeTemp
      this.$emit('CurrentChange', currentPage, pageSize)
    }
  }
}
</script>

<style scoped>
.el-pagination {
  padding-top: 10px;
  padding-bottom: 0;
}
</style>
