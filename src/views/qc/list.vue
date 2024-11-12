<template>
  <CommonList
  ref="commonListRef"
    :searchTitle="'质控单搜索'"
    :listTitle="'质控单列表'"
    :searchFields="searchFields"
    :tableColumns="tableColumns"
    :headerActions="headerActions"
    :rowActions="rowActions"
    :fetchData="fetchData"
    :showIndex="true"
    :showActions="true"
  >
    <!-- 自定义状态列的插槽 -->
    <!-- // 1=待下发,2=已下发,3=已取消  -->
    <template #status="{ row }">
      <el-tag :type="getStatusType(row.status)">{{
        row.status === 1 ? '待下发' : row.status === 2 ? '已下发' : row.status === 3 ? '已取消' : '--'
      }}</el-tag>
    </template>
  </CommonList>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import CommonList from "@/components/CommonList.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import request from "@/utils/request";
import * as XLSX from "xlsx";

const router = useRouter();
const route = useRoute();
const commonListRef = ref();
const defaultOrderId = ref((route.params.id as string) || "");

const searchFields = computed(() => [
  { prop: "qc_sn", label: "质控通知单号", component: "el-input" },
  { prop: "wt_sn", label: "关联委托单号", component: "el-input" },
  { prop: "task_sn", label: "关联任务单号", component: "el-input" },
  {
    prop: "related_office",
    label: "有关科室",
    component: "el-select",
    props: {
      placeholder: "请选择",
      clearable: true,
      multiple: true,
      collapseTags: true,
      collapseTagsTooltip: true,
      options: [
        { value: "采样室", label: "采样室" },
        { value: "质控室", label: "质控室" },
        // 添加其他科室选项
      ],
    },
  },
  {
    prop: "status",
    label: "状态",
    component: "el-select",
    props: {
      placeholder: "请选择",
      clearable: true,
      options: [
        { value: "1", label: "待下发" },
        { value: "2", label: "已下发" },
        { value: "3", label: "已取消" },
      ],
    },
  },
]);

const tableColumns = [
  { prop: "qc_number", label: "质控通知单号", width: "250" },
  { prop: "order_number", label: "关联委托单号", width: "250" },
  { prop: "task_number", label: "关联任务单号", width: "250" },
  { prop: "qc_related_office", label: "有关科室", width: "120" },
  { prop: "status_text", label: "状态", slot: "status", width: "100" },
  { prop: "createdby", label: "制单人", width: "120" },
  { prop: "createtime", label: "制单时间", width: "" },
];

const handleExport = () => {
  // 实现导出逻辑
};

const handlePrint = () => {
  // 实现打印逻辑
};

const handleView = (row: any) => {
  router.push(`/qc-detail/${row.id}`);
};

const handleEdit = (row: any) => {
  router.push(`/qc-edit/${row.id}/${row.task_id}/${row.order_id}`);
};

const handleDelete = async (row: any) => {
  try {
    // 显示确认对话框
    await ElMessageBox.confirm('确认要删除这条质控单吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    // 准备表单数据
    const formData = new FormData()
    formData.append('qc_id', row.id)

    // 调用删除 API
    const response:any = await request({
      url: 'lipu/flow/qc/del_qc',
      method: 'POST',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    if (response.code === 1) {
      ElMessage.success('删除成功')
      commonListRef.value?.loadData()
      // 重新加载列表数据
      // setTimeout(() => {
      //   location.reload()
      // }, 1000)
    } else {
      // ElMessage.error(response.msg || '删除失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      // ElMessage.error('删除失败，请稍后重试')
    }
  }
}

const headerActions = [
  { name: "export", label: "导出", handler: handleExport },
];

const rowActions = computed(() => (row: any) => {
  const actions = [
    { name: "view", label: "查看详情", handler: handleView },
    // { name: "edit", label: "编辑", handler: handleEdit },
  ];

  // 只有待下发状态(status=1)可以编辑和删除
  if (row.status === 1) {
    actions.push(
      { name: "edit", label: "编辑", handler: handleEdit },
      { name: "delete", label: "删除", handler: handleDelete }
    );
  }

  return actions;
});

const currentTableData = ref([]);

const fetchData = async (params: any) => {
  try {
    if (defaultOrderId.value) {
      params.order_id = defaultOrderId.value;
    }

    if (params.related_office) {
      // 将 Proxy 对象转换为普通数组
      params.related_office = Array.from(params.related_office);
      // 或者使用展开运算符：
      // params.related_office = [...params.related_office];
    }

    const response = await request({
      url: "lipu/flow/qc/qc_list",
      method: "GET",
      params: params,
    });

    currentTableData.value = response.data.list;

    return {
      data: response.data.list,
      total: response.data.count,
    };
  } catch (error) {
    console.error("Failed to fetch task list:", error);
    // ElMessage.error("获取任务列表失败");
    return { data: [], total: 0 };
  }
};

const getStatusType = (status: any) => {
  const statusMap: Record<string, string> = {
    1: "warning",
    2: "success",
    3: "info",
  };
  return statusMap[status] || "default";
};

const handleReset = () => {
  defaultOrderId.value = '';
};

onMounted(() => {
  if (defaultOrderId.value) {
    fetchData({ order_id: defaultOrderId.value });
  }
});
</script>
