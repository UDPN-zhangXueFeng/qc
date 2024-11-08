<template>
  <CommonList ref="commonListRef" :search-title="'委托单搜索'" :list-title="'委托单列表'" :search-fields="searchFields" :table-columns="tableColumns"
    :header-actions="headerActions" :row-actions="rowActions" :fetch-data="fetchData" @search="onSearch"
    @reset="onReset" @pageChange="onPageChange">
    <template #status="{ row }">
      <el-tag :type="getStatusType(row.status)">{{
        row.status === '-1' ? "草稿" : row.status === '1' ? "待审批" : row.status === '2' ? "已通过" : row.status === '3' ?
          "已驳回" : row.status === '4' ? "已撤回" : "--"
        }}</el-tag>
    </template>
  </CommonList>
  <ReviewDialog ref="reviewDialogRef" :order-id="currentOrderId || ''" @close="() => { }" @success="handleReviewSuccess" />
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import CommonList from "@/components/CommonList.vue";
import request from "@/utils/request"; // 确保路径正确
import * as XLSX from "xlsx";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import ReviewDialog from "@/components/ReviewDialog.vue";

const router = useRouter();

const searchFields: any[] = [
  {
    prop: "order_number",
    label: "委托单号",
    component: "el-input",
    props: { placeholder: "委托单号" },
  },
  {
    prop: "project_name",
    // prop: "search",
    label: "项目名称",
    component: "el-input",
    props: { placeholder: "项目名称" },
  },
  {
    prop: "client_company_name",
    label: "单位名称",
    component: "el-input",
    props: { placeholder: "单位名称" },
  },
  {
    prop: "sampling_or_delivery",
    label: "采样/送样",
    component: "el-select",
    props: {
      placeholder: "请选择采样/送样",
      options: [
        { value: "送样", label: "送样" },
        { value: "采样", label: "采样" }
      ]
    },
  },
  {
    prop: "is_subcontract",
    label: "是否分包",
    component: "el-select",
    props: {
      placeholder: "请选择是否分包",
      options: [
        { value: "是", label: "是" },
        { value: "否", label: "否" }
      ]
    },
  },
  {
    prop: "status",
    label: "状态",
    component: "el-select",
    props: {
      placeholder: "请选择状态",
      options: [
        { value: "-1", label: "草稿" },
        { value: "1", label: "待审批" },
        { value: "2", label: "已通过" },
        { value: "3", label: "已驳回" },
        { value: "4", label: "已撤回" },
      ]
    },
  },
  {
    prop: ["start_time", "end_time"],
    label: "创建时间",
    component: "el-date-picker",
    props: {
      type: "daterange",
      rangeSeparator: "至",
      startPlaceholder: "开始时间",
      endPlaceholder: "结束时间",
      valueFormat: "YYYY-MM-DD",
    },
  },
];

const tableColumns = [
  {
    prop: "order_number", label: "委托单号", width: "180", formatter: (row: any) => {
      return row.order_number === null ? "--" : row.order_number
    }
  },
  { prop: "project_name", label: "项目名称", width: "180" },
  { prop: "sampling_or_delivery_text", label: "采样/送样", width: "120" },
  { prop: "is_subcontract_text", label: "是否分包", width: "100" },
  { prop: "deadline", label: "完成时间", width: "180" },
  { prop: "createtime", label: "委托时间", width: "180" },
  {
    prop: "status", label: "状态", width: "100", slot: "status", formatter: (row: any) => {
      return row.status === null ? "--" : row.status_text
    }
  },
  { prop: "createdby", label: "制单人", width: "120" },
  { prop: "createtime", label: "制单时间", width: "" },
];

const searchForm = reactive({});
const tableData = ref([]);
const total = ref(0);

// 将 currentParams 的类型定义修改为更具体的类型
const currentParams = ref<{
  page?: number;
  [key: string]: any;
}>({});

const fetchData = async (params: any) => {
  try {
    // 保存当前的查询参数
    currentParams.value = params;
    
    const response:any = await request({
      url: "lipu/flow/order/order_list",
      method: "GET",
      params: params,
    });
    
    if (response.code === 1) {  // 确保API返回成功
      tableData.value = response.data.list;
      total.value = response.data.count;
      return {
        data: response.data.list,
        total: response.data.count,
      };
    } else {
      // ElMessage.error(response.msg || '获取数据失败');
      return { data: [], total: 0 };
    }
  } catch (error) {
    console.error("获取委托单列表失败:", error);
    // ElMessage.error('获取数据失败');
    return { data: [], total: 0 };
  }
};

const onSearch = (formData: any) => {
  console.log("Search:", formData);
  // 更新当前参数
  Object.assign(currentParams.value, formData);
};

const onReset = () => {
  console.log("Reset search form");
};

const onPageChange = (page: any) => {
  console.log("Page changed:", page);
};

const handleAdd = () => {
  console.log("Add new item");
  localStorage.removeItem("draft");
  router.push("/trust-add-one");
};

const handleExport = async () => {
  try {
    if (tableData.value.length === 0) {
      ElMessage.warning("没有数据可以导出");
      return;
    }

    // 使用当前搜索条件和表格数据进行导出
    const excelData = tableData.value.map((item: any) => ({
      委托单号: item.order_number,
      项目名称: item.project_name,
      "采样/送样": item.sampling_or_delivery_text,
      是否分包: item.is_subcontract_text,
      完成时间: item.deadline,
      委托时间: item.createtime,
      状态: item.status_text,
      制单人: item.createdby,
      制单时间: item.createtime,
    }));

    // 创建工作簿和工作表
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);

    // 将工作表添加到工作簿
    XLSX.utils.book_append_sheet(wb, ws, "委托单列表");

    // 生成 Excel 文件并下载
    XLSX.writeFile(wb, "委托单列表.xlsx");

    ElMessage.success("导出成功");
  } catch (error) {
    console.error("导出失败:", error);
    ElMessage.error("导出失败");
  }
};

const handlePrint = () => {
  console.log("Print data");
};

const reviewDialogRef = ref<InstanceType<typeof ReviewDialog> | null>(null);
const currentOrderId = ref<number | string | null>(null);

const handleApprove = (row: any) => {
  console.log("Approve:", row);
  currentOrderId.value = row.id;
  reviewDialogRef.value?.open();
};

const handleView = (row: any) => {
  router.push(`/trust-detail/${row.id}`);
};

const handleCopy = (row: any) => {
  console.log("Copy:", row);
};

const handleEdit = (row: any) => {
  console.log("Edit:", row);
  router.push(`/trust-edit/${row.id}`);
};
const handleTask = (row: any) => {
  console.log("Task:", row);
  router.push(`/task-create/${row.id}`);
};

const handleTaskList = (row: any) => {
  router.push(`/task-list`);
};

const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm('确定要删除该委托单吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const formData = new FormData()
    formData.append('order_id', row.id)

    const response: any = await request({
      url: 'lipu/flow/order/del_order',
      method: 'POST',
      data: formData
    })

    if (response.code === 1) {
      ElMessage.success('删除成功')
      // 直接调用 CommonList 组件的 loadData 方法
      commonListRef.value?.loadData()
    } else {
      ElMessage.error(response.msg || '删除失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

const getStatusType = (status: string) => {
  switch (status) {
    case "1":
      return "warning";
    case "2":
      return "success";
    case "3":
      return "danger";
    case "4":
      return "info";
    case "-1":
      return "info";
    default:
      return "info";
  }
};

// 将 headerActions 和 rowActions 的定义移到这里
const headerActions = reactive([
  { name: "add", label: "新增", type: "primary", handler: handleAdd },
  { name: "export", label: "导出", type: "", handler: handleExport },
  // { name: "print", label: "打印", type: "", handler: handlePrint },
]);

// 将原来的 rowActions 定义修改为一个函数
const getRowActions = (row: any) => {
  const actions = [];

  // 查看任务按钮 - 所有状态都可以查看任务
  // actions.push({ name: "taskList", label: "查看任务", handler: handleTaskList });
  // actions.push({ name: "delete", label: "删除", handler: handleDelete });
  // 创建任务按钮 - 只有已通过的委托单可以创建任务
  if (row.status === '2') {
    // actions.push({ name: "task", label: "创建任务", handler: handleTask });
  }

  // 审批按钮 - 只有待审批状态可以审批
  if (row.status === '1') {
    actions.push({ name: "approve", label: "审核", handler: handleApprove });
  }

  // 查看详情按钮 - 所有状态都可以查看详情
  actions.push({ name: "view", label: "查看详情", handler: handleView });

  // 编辑按钮 - 只有草稿和已驳回状态可以编辑
  if (row.status === '-1' || row.status === '3') {
    actions.push({ name: "edit", label: "编辑", handler: handleEdit });
  }

  // 删除按钮 - 只有草稿和已驳回状态可以删除
  if (row.status === '-1' || row.status === '3') {
    actions.push({ name: "delete", label: "删除", handler: handleDelete });
  }

  return actions;
};

// 在 CommonList 组件中使用时，传递一个函数而不是固定的数组
const rowActions = getRowActions;

// 添加 handleSearch 方法
const handleSearch = () => {
  // 触发 CommonList 组件内部的搜索逻辑
  if (searchForm) {
    Object.assign(currentParams.value, searchForm);
  }
  // 重置到第一页
  if (currentParams.value.page) {
    currentParams.value.page = 1;
  }
};

// 添加 ref 引用
const commonListRef = ref();

const handleReviewSuccess = () => {
  // 刷新列表数据
  commonListRef.value?.loadData();
};
</script>
