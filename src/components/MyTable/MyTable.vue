<template>
    <div class="table-container">
        <!-- 表格主体 -->
        <table class="custom-table">
            <!-- 表头 -->
            <thead>
                <tr>
                    <th v-for="(column, index) in columns" :key="index">
                        <el-text>{{ column.label }}</el-text>
                    </th>
                </tr>
            </thead>

            <!-- 表体 -->
            <tbody>
                <tr v-for="(row, rowIndex) in data" :key="rowIndex" :style="getRowStyle(row, rowIndex)">
                    <td v-for="(column, colIndex) in columns" :key="colIndex">
                        <!-- 自定义插槽 -->
                        <template v-if="column.slot">
                            <el-text>
                                <slot :name="column.slot" :row="row" :index="rowIndex"></slot>
                            </el-text>
                        </template>
                        <!-- 默认渲染 -->
                        <template v-else>
                            <el-text>{{ getNestedValue(row, column.prop) }}</el-text>
                        </template>
                    </td>
                </tr>

                <!-- 空数据 -->
                <tr v-if="data.length === 0">
                    <td :colspan="columns.length" class="empty-row">
                        {{ emptyText }}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    name: "MyTable",
    props: {
        // 表格数据
        data: {
            type: Array,
            default: () => [],
        },
        // 列配置
        columns: {
            type: Array,
            required: true,
        },
        // 空数据提示
        emptyText: {
            type: String,
            default: "暂无数据",
        },
        // 行样式方法
        rowStyle: {
            type: Function,
            default: () => ({}),
        },
    },

    methods: {
        // 获取行样式
        getRowStyle(row, index) {
            return this.rowStyle(row, index) || {};
        },

        // 获取嵌套属性值 a.b.c
        getNestedValue(obj, path) {
            return path.split(".").reduce((current, key) => {
                return current && typeof current === "object" ? current[key] : "";
            }, obj);
        },
    },
};
</script>

<style scoped>
table {
    width: 100%;
    border-collapse: collapse;
}

th {
    font-weight: bold;
    white-space: nowrap;
}

th,
td {
    padding: 8px 12px;
    text-align: left;
    border: none;
    border-bottom: 1px solid #ddd;
}

tr:hover {
    background-color: #f5f7fa;
}

tr[style] {
    transition: background-color 0.2s, color 0.2s;
}

.empty-row {
    text-align: center;
    color: #9ca3af;
    padding: 32px;
}

tr[style*="color"] td :deep(.el-text),
tr[style*="color"] td :deep(.el-text__inner) {
    color: inherit !important;
}
</style>
