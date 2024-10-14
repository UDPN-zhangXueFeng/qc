<template>
  <CommonList
    :searchTitle="'任务搜索'"
    :listTitle="'任务列表'"
    :searchFields="searchFields"
    :tableColumns="tableColumns"
    :headerActions="headerActions"
    :rowActions="rowActions"
    :fetchData="fetchData"
  >
    <!-- 自定义状态列的插槽 -->
    <template #status="{ row }">
      <el-tag :type="getStatusType(row.status_text)">{{ row.status_text }}</el-tag>
    </template>
  </CommonList>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import CommonList from '@/components/CommonList.vue'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'
import { useRouter } from "vue-router";
import * as XLSX from 'xlsx';

const router = useRouter();

const route = useRoute()
const defaultOrderId = ref(route.params.id as string || '')

const searchFields = [
  { prop: 'task_number', label: '任务编号', component: 'el-input' },
  { 
    prop: 'order_id', 
    label: '关联委托单号', 
    component: 'el-input',
    props: {
      modelValue: defaultOrderId.value,
      disabled: !!defaultOrderId.value
    }
  },
  { 
    prop: 'task_related_office', 
    label: '有关科室', 
    component: 'el-select',
    props: {
      placeholder: '请选择',
      clearable: true,
      multiple: true,
      options: [
        { value: '采样室', label: '采样室' },
        { value: '质检室', label: '质检室' },
        // 添加其他科室选项
      ]
    }
  },
  { 
    prop: 'status', 
    label: '状态', 
    component: 'el-select',
    props: {
      placeholder: '请选择',
      clearable: true,
      options: [
        { value: '1', label: '待接收' },
        { value: '2', label: '已接收' },
        { value: '3', label: '已取消' },
        // 添加其他状态选项
      ]
    }
  },
]

const tableColumns = [
  { prop: 'task_name', label: '任务名称', width: '180' },
  { prop: 'task_number', label: '任务编号', width: '180' },
  { prop: 'order_id', label: '关联委托单号', width: '180' },
  { prop: 'test_period_text', label: '检测周期', width: '120' },
  { prop: 'task_related_office', label: '有关科室', width: '180' },
  { prop: 'task_address', label: '采样地点', width: '180' },
  { prop: 'status_text', label: '状态', slot: 'status' },
  { prop: 'createdby', label: '制单人', width: '120' },
  { prop: 'createtime', label: '制单时间', width: '180' },
]
const handleAdd = () => {
  router.push(`/task-create/${defaultOrderId.value}`);
}

const handleExport = () => {
  try {
    // 使用当前表格中的数据
    const exportData = currentTableData.value.map(item => ({
      '任务名称': item.task_name,
      '任务编号': item.task_number,
      '关联委托单号': item.order_id,
      '检测周期': item.test_period_text,
      '有关科室': item.task_related_office,
      '采样地点': item.task_address,
      '状态': item.status_text,
      '制单人': item.createdby,
      '制单时间': item.createtime
    }))

    // 创建工作簿和工作表
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(exportData)

    // 将工作表添加到工作簿
    XLSX.utils.book_append_sheet(wb, ws, '任务列表')

    // 生成 Excel 文件并下载
    XLSX.writeFile(wb, '任务列表.xlsx')

    ElMessage.success('导出成功')
  } catch (error) {
    console.error('Export failed:', error)
    ElMessage.error('导出失败')
  }
}

const handlePrint = () => {
  // 实现打印逻辑
}

const handleView = (row) => {
  router.push(`/task-detail/${row.id}`);
}

const handleEdit = (row) => {
  // 实现编辑逻辑
}

const handleDelete = (row) => {
  // 实现删除逻辑
}

const headerActions = [
  { name: 'add', label: '新增', type: 'primary', handler: handleAdd },
  { name: 'export', label: '导出', handler: handleExport },
  { name: 'print', label: '打印', handler: handlePrint },
]

const handleQc = (row) => {
  router.push(`/qc-list/${row.id}/${row.order_id}`);
}

const handleCreateQc = (row) => {
  router.push(`/qc-create/${row.id}/${row.order_id}`);
}

const rowActions = [
  { name: 'view', label: '查看详情', handler: handleView },
  { name: 'qc', label: '查看质控单', handler: handleQc },
  { name: 'createQc', label: '创建质控单', handler: handleCreateQc },
  { name: 'edit', label: '编辑', handler: handleEdit },
  { name: 'delete', label: '删除', handler: handleDelete },
]

const fetchData = async (params) => {
  try {
    // 如果存在默认的 order_id，确保它被包含在请求参数中
    if (defaultOrderId.value) {
      params.order_id = defaultOrderId.value
    }

    const response = await request({
      url: '/lipu/flow/task/task_list',
      method: 'GET',
      params: params
    })
    
    // 更新当前表格数据
    currentTableData.value = response.data.data
    
    return {
      data: response.data.data,
      total: response.data.total
    }
  } catch (error) {
    console.error('Failed to fetch task list:', error)
    ElMessage.error('获取任务列表失败')
    return { data: [], total: 0 }
  }
}

const getStatusType = (status) => {
  const statusMap = {
    '待接收': 'warning',
    '已接收': 'success',
    '已取消': 'info'
  }
  return statusMap[status] || 'default'
}

// 在组件挂载时，如果有默认的 order_id，立即触发搜索
onMounted(() => {
  if (defaultOrderId.value) {
    fetchData({ order_id: defaultOrderId.value })
  }
})

const currentTableData = ref([])
</script>
