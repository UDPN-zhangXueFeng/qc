<template>
    <CommonList
      :searchTitle="'任务搜索'"
      :listTitle="'任务列表'"
      :searchFields="searchFields"
      :tableColumns="tableColumns"
      :headerActions="headerActions"
      :rowActions="rowActions"
      :fetchData="fetchData"
      :showIndex="true"
      :showActions="true"
    >
      <!-- 自定义状态列的插槽 -->
      <template #status="{ row }">
        <el-tag :type="getStatusType(row.status_text)">{{ row.status_text }}</el-tag>
      </template>
    </CommonList>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import CommonList from '@/components/CommonList.vue'
  import { ElMessage } from 'element-plus'
  import request from '@/utils/request'
  import * as XLSX from 'xlsx'
  
  const router = useRouter()
  const route = useRoute()
  const defaultOrderId = ref(route.params.id as string || '')
  
  const searchFields = [
    { prop: 'task_number', label: '原控通知单号', component: 'el-input' },
    { prop: 'order_id', label: '关联委托单号', component: 'el-input' },
    { prop: 'task_id', label: '关联任务单号', component: 'el-input' },
    { 
      prop: 'task_related_office', 
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
          { value: '3', label: '已取消' },
        ]
      }
    },
  ]
  
  const tableColumns = [
    { prop: 'task_number', label: '原控通知单号', width: '150' },
    { prop: 'order_id', label: '关联委托单号', width: '150' },
    { prop: 'task_id', label: '关联任务单号', width: '150' },
    { prop: 'task_related_office', label: '有关科室', width: '120' },
    { prop: 'status_text', label: '状态', slot: 'status', width: '100' },
    { prop: 'createdby', label: '制单人', width: '120' },
    { prop: 'createtime', label: '制单时间', width: '180' },
  ]
  
  const handleExport = () => {
    // 实现导出逻辑
  }
  
  const handlePrint = () => {
    // 实现打印逻辑
  }
  
  const handleView = (row) => {
    router.push(`/task-detail/${row.id}`)
  }
  
  const handleEdit = (row) => {
    // 实现编辑逻辑
  }
  
  const handleDelete = (row) => {
    // 实现删除逻辑
  }
  
  const headerActions = [
    { name: 'export', label: '导出', handler: handleExport },
    { name: 'print', label: '打印', handler: handlePrint },
  ]
  
  const rowActions = [
    { name: 'view', label: '查看详情', handler: handleView },
    { name: 'edit', label: '编辑', handler: handleEdit },
    { name: 'delete', label: '删除', handler: handleDelete },
  ]
  
  const currentTableData = ref([])
  
  const fetchData = async (params) => {
    try {
      const response = await request({
        url: 'lipu/flow/qc/qc_list',
        method: 'GET',
        params: params
      })
      
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
  
  onMounted(() => {
    if (defaultOrderId.value) {
      fetchData({ order_id: defaultOrderId.value })
    }
  })
  </script>