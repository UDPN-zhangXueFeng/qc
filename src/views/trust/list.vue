<template>
  <CommonList
    :search-title="'委托单搜索'"
    :list-title="'委托单列表'"
    :search-fields="searchFields"
    :table-columns="tableColumns"
    :header-actions="headerActions"
    :row-actions="rowActions"
    :fetch-data="fetchData"
    @search="onSearch"
    @reset="onReset"
    @pageChange="onPageChange"
  >
    <template #status="{ row }">
      <el-tag :type="getStatusType(row.status_text)">{{
        row.status_text
      }}</el-tag>
    </template>
  </CommonList>
  <ReviewDialog
    ref="reviewDialogRef"
    :order-id="currentOrderId || ''"
    @close="() => {}"
    @success="() => {}"
  />
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import CommonList from "@/components/CommonList.vue";
import request from "@/utils/request"; // 确保路径正确
import * as XLSX from "xlsx";
import { ElMessage } from "element-plus";
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
  { prop: "order_number", label: "委托单号", width: "180",formatter: (row:any) => {
    return row.order_number===null?"--":("LPWT"+row.order_number)
  } },
  { prop: "project_name", label: "项目名称", width: "180" },
  { prop: "sampling_or_delivery_text", label: "采样/送样", width: "120" },
  { prop: "is_subcontract_text", label: "是否分包", width: "100" },
  { prop: "deadline", label: "完成时间", width: "180" },
  { prop: "createtime", label: "委托时间", width: "180" },
  { prop: "status_text", label: "状态", width: "100", slot: "status" },
  { prop: "createdby", label: "制单人", width: "120" },
  { prop: "createtime", label: "制单时间", width: "180" },
];

const searchForm = reactive({});
const tableData = ref([]);
const total = ref(0);

const fetchData = async (params:any) => {
  try {
    const response = await request({
      url: "lipu/flow/order/order_list",
      method: "GET",
      params: params,
    });
    tableData.value = response.data.list;
    total.value = response.data.count;
    return {
      data: response.data.list,
      total: response.data.count,
    };
  } catch (error) {
    console.error("获取委托单列表失败:", error);
    return { data: [], total: 0 };
  }
};

const onSearch = (formData:any) => {
  console.log("Search:", formData);
};

const onReset = () => {
  console.log("Reset search form");
};

const onPageChange = (page:any) => {
  console.log("Page changed:", page);
};

const handleAdd = () => {
  console.log("Add new item");
  router.push("/trust-add-one");
};

const handleExport = async () => {
  try {
    if (tableData.value.length === 0) {
      ElMessage.warning("没有数据可以导出");
      return;
    }

    // 使用当前搜索条件和表格数据进行导出
    const excelData = tableData.value.map((item:any) => ({
      委托单号:"LPWT"+ item.order_number,
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

const handleApprove = (row:any) => {
  console.log("Approve:", row);
  currentOrderId.value = row.id;
  reviewDialogRef.value?.open();
};

const handleView = (row:any) => {
  router.push(`/trust-detail/${row.id}`);
};

const handleCopy = (row:any) => {
  console.log("Copy:", row);
};

const handleEdit = (row:any) => {
  console.log("Edit:", row);
};
const handleTask = (row:any) => {
  console.log("Task:", row);
  router.push(`/task-create/${row.id}`);
};

const handleTaskList = (row:any) => {
  router.push(`/task-list`);
};

const handleDelete = (row:any) => {
  console.log("Delete:", row);
};

const getStatusType = (status:any) => {
  switch (status) {
    case "2":
      return "success";
    case "3":
      return "danger";
    case "1":
      return "warning";
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

const rowActions = reactive([
  { name: "taskList", label: "查看任务", handler: handleTaskList },
  { name: "task", label: "创建任务", handler: handleTask },
  { name: "approve", label: "审批", handler: handleApprove },
  { name: "view", label: "查看详情", handler: handleView },
  { name: "copy", label: "复制", handler: handleCopy },
  { name: "edit", label: "编辑", handler: handleEdit },
  { name: "delete", label: "删除", handler: handleDelete },
]);
</script>

