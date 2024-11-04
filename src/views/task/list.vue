<template>
  <CommonList :searchTitle="'任务搜索'" :listTitle="'任务列表'" :searchFields="searchFields" :tableColumns="tableColumns"
    :headerActions="headerActions" :rowActions="rowActions" :fetchData="fetchData" @reset="handleReset">
    <!-- 自定义状态列的插槽 -->
    <!-- // 1=待接收,2=已接收,3=已拒绝,4=已取消,5=已完成 -->
    <template #status="{ row }">
      <el-tag :type="getStatusType(row.status)">{{ row.status === '1' ? '待接收' : row.status === '2' ?
        '已接收' : row.status === '3' ? '已拒绝' : row.status === '4' ? '已取消' : row.status === '5' ? '已完成' :
        '--' }}</el-tag>
    </template>
  </CommonList>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CommonList from '@/components/CommonList.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '@/utils/request'
import * as XLSX from 'xlsx';

const router = useRouter();

const route = useRoute()
const defaultOrderId = ref(route.params.id as string || '')

const searchFields = computed(() => [
  { prop: 'task_sn', label: '任务编号', component: 'el-input' },
  {
    prop: 'wt_sn',
    label: '关联委托单号',
    component: 'el-input',

  },
  {
    prop: 'related_office',
    label: '有关科室',
    component: 'el-select',
    props: {
      placeholder: '请选择',
      clearable: true,
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
        { value: '3', label: '已拒绝' },
        { value: '4', label: '已取消' },
        { value: '5', label: '已完成' },
        // 添加其他状态选项
      ]
    }
  },
])

const tableColumns = [
  { prop: 'task_name', label: '任务名称', width: '180' },
  { prop: 'task_number', label: '任务编号', width: '180' },
  { prop: 'order_number', label: '关联委托单号', width: '180' },
  { prop: 'test_period_text', label: '检测周期', width: '120' },
  { prop: 'task_related_office', label: '有关科室', width: '180' },
  { prop: 'task_address', label: '采样地点', width: '180' },
  { prop: 'status', label: '状态', slot: 'status', width: '120' },
  { prop: 'createdby', label: '制单人', width: '120' },
  { prop: 'createtime', label: '制单时间', width: '180' },
]
const handleAdd = () => {
  router.push(`/task-create/${defaultOrderId.value}`);
}

const handleExport = () => {
  try {
    // 使用当前表格中的数据
    const exportData = currentTableData.value.map((item: any) => ({
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

const handleView = (row: any) => {
  router.push(`/task-detail/${row.id}`);
}

const handleEdit = (row: any) => {
  router.push(`/task-edit/${row.id}`);
}

const handleDelete = async (row: any) => {
  if (!row.id) {
    ElMessage.error('任务ID不能为空')
    return
  }

  try {
    // 显示删除确认对话框
    await ElMessageBox.confirm(
      '此操作将永久删除该任务，是否继续?',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )

    // 调用删除API
    const response:any = await request({
      url: '/lipu/flow/task/del_task',
      method: 'post',
      data: {
        task_id: row.id
      }
    })

    // 处理响应
    if (response.code === 1) {
      ElMessage({
        type: 'success',
        message: '删除成功'
      })
      // 重新加载列表数据
      // await fetchData({})
      location.reload()
    } else {
      throw new Error(response.data.msg || '删除失败')
    }
  } catch (error: any) {
    // 用户取消删除操作，不显示错误提示
    if (error === 'cancel') {
      return
    }
    // 显示错误信息
    ElMessage({
      type: 'error',
      message: error.message || '删除失败，请稍后重试'
    })
  }
}

const headerActions = [
  { name: 'add', label: '新增', type: 'primary', handler: handleAdd },
  { name: 'export', label: '导出', handler: handleExport },
]

const handleQc = (row: any) => {
  router.push(`/qc-list`);
}

const handleCreateQc = (row: any) => {
  router.push(`/qc-create/${row.id}/${row.order_id}`);
}

const rowActions = [
  { name: 'view', label: '查看详情', handler: handleView },
  { name: 'qc', label: '查看质控单', handler: handleQc },
  { name: 'createQc', label: '创建质控单', handler: handleCreateQc },
  { name: 'edit', label: '编辑', handler: handleEdit },
  { name: 'delete', label: '删除', handler: handleDelete },
]

const fetchData = async (params: any) => {
  try {
    if (defaultOrderId.value) {
      params.order_id = defaultOrderId.value
    }

    const response = await request({
      url: '/lipu/flow/task/task_list',
      method: 'GET',
      params: params
    })

    currentTableData.value = response.data.data

    return {
      data: response.data.list,
      total: response.data.count
    }
  } catch (error) {
    console.error('Failed to fetch task list:', error)
    ElMessage.error('获取任务列表失败')
    return { data: [], total: 0 }
  }
}

const getStatusType = (status: any) => {
  const statusMap: Record<string, string> = {
    '1': 'warning',
    '2': 'success',
    '5': 'info'
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
const handleReset = () => {
  defaultOrderId.value = ''
}
</script>
