<template>
  <div class="trust-form max-w-5xl mx-auto">
    <el-steps :active="2" finish-status="success" simple class="mb-8">
      <el-step title="填写基本信息" />
      <el-step title="添加技术方案" />
      <el-step title="提交结果" />
    </el-steps>

    <el-card class="mb-4 mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <span class="text-lg font-medium">添加技术方案</span>
        </div>
      </template>

      <div class="mb-4 space-x-2">
        <el-button type="primary" @click="downloadTemplate">下载导入模版</el-button>
        <el-button type="primary" @click="openFileUpload">导入</el-button>
        <input type="file" ref="fileInput" style="display: none;" @change="handleFileUpload" />
        <!-- <el-button @click="importData">导入</el-button> -->
      </div>

      <el-table :data="tableData" border style="width: 100%">
        <el-table-column type="index" label="序号" width="50" fixed></el-table-column>
        <el-table-column label="操作" width="120" fixed>
          <template #default="{ row, $index }">
            <el-button type="primary" size="small" @click="editRow(row)" text>编辑</el-button>
            <el-button type="danger" size="small" @click="deleteRow($index)" text>删除</el-button>
          </template>
        </el-table-column>
        <el-table-column v-for="col in tableColumns" :key="col.prop" v-bind="col"></el-table-column>
      </el-table>
    </el-card>

    <div class="fixed bottom-0 left-0 right-0 bg-white shadow-md z-10">
      <div class="max-w-5xl mx-auto py-4 px-6 flex justify-end space-x-4">
        <el-button @click="cancel">取消</el-button>
        <el-button @click="saveAsDraft">保存为草稿</el-button>
        <el-button @click="saveAndCopy">提交并复制新增</el-button>
        <el-button type="primary" @click="nextStep">下一步</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import request from "@/utils/request";

interface TableRow {
  sampleType: string;
  pointName: string;
  pointCode: string;
  testItem: string;
  testCount: string;
  testPeriod: string;
  testDays: string;
  sampleMethod: string;
  testMethod: string;
  executiveStandard: string;
  limitValue: string;
  remark: string;
}

const router = useRouter();
const tableData = ref<TableRow[]>([]);

const tableColumns = [
  { prop: "sampleType", label: "样品类别" },
  { prop: "pointName", label: "点位名称" },
  { prop: "pointCode", label: "点位编码" },
  { prop: "testItem", label: "检测参数" },
  { prop: "testCount", label: "检测参数" },
  { prop: "testPeriod", label: "检测周期" },
  { prop: "testDays", label: "检测天数" },
  { prop: "sampleMethod", label: "采样依据" },
  { prop: "testMethod", label: "检测依据" },
  { prop: "executiveStandard", label: "执行依据" },
  { prop: "limitValue", label: "限值" },
  { prop: "remark", label: "备注" },
];

const fileInput = ref<HTMLInputElement | null>(null);

const addRow = () => {
  tableData.value.push(reactive<TableRow>({
    sampleType: "",
    pointName: "",
    pointCode: "",
    testItem: "",
    testCount: "",
    testPeriod: "",
    testDays: "",
    sampleMethod: "",
    testMethod: "",
    executiveStandard: "",
    limitValue: "",
    remark: "",
  }));
};

const editRow = (row: TableRow) => {
  ElMessageBox.prompt("编辑行", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    inputValue: JSON.stringify(row),
  })
    .then(({ value }) => {
      Object.assign(row, JSON.parse(value));
      ElMessage.success("编辑成功");
    })
    .catch(() => {
      ElMessage.info("取消编辑");
    });
};

const deleteRow = (index: number) => {
  ElMessageBox.confirm("确定要删除这行吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      tableData.value.splice(index, 1);
      ElMessage.success("删除成功");
    })
    .catch(() => {
      ElMessage.info("已取消删除");
    });
};

const downloadTemplate = () => {
  window.open("http://39.107.73.236:90/gBXIyMsJvW.php/lipu/flow/orderparams/template_download");
};

const importData = () => {
  ElMessage.success("数据导入成功");
};

const cancel = () => {
  ElMessageBox.confirm("确定要取消吗？未保存的内容将会丢失。", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      router.push("/");
    })
    .catch(() => {
      // 用户取消操作，不做任何处理
    });
};

const saveAsDraft = () => {
  console.log("保存为草稿");
  ElMessage.success("已保存为草稿");
};

const saveAndCopy = () => {
  console.log("提交并复制新增");
  ElMessage.success("已提交并复制新增");
};

const nextStep = () => {
  router.push("/trust-add-three");
};

const openFileUpload = () => {
  fileInput.value?.click();
};

const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (!file) {
    ElMessage.warning("请选择文件");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    // 第一步：上传文件
    const uploadResponse:any = await request({
      method: 'POST',
      url: '/lipu/flow/order/testparams_upload',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    if (uploadResponse.code === 1 ) {
      // 文件上传成功，获取 file_path

      const filePath = uploadResponse.file_path;
      
      // 第二步：调用导入接口
      const importFormData = new FormData();
      importFormData.append('order_id', localStorage.getItem('order_id') || '');
      importFormData.append('file_path', filePath);
      console.log(importFormData)
      const importResponse:any = await request({
        method: 'POST',
        url: '/lipu/flow/order/testparams_import',
        data: importFormData,
      });

      if (importResponse.code === 1) {
        ElMessage.success("文件导入成功");
        // 更新表格数据
        if (Array.isArray(importResponse.data)) {
          tableData.value = importResponse.data;
        }
      } else {
        ElMessage.error(importResponse.message || "导入失败");
      }
    } else {
      ElMessage.error(uploadResponse.message || "上传失败");
    }
  } catch (error) {
    console.error("Error during file upload and import:", error);
    ElMessage.error("文件上传和导入过程中出错");
  }

  // 清空文件输入，允许上传相同的文件
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};
</script>

<style scoped>
.trust-form {
  max-width: 1000px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.table-actions {
  margin-bottom: 20px;
}

.fixed-bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #fff;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.button-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 16px;
  display: flex;
  justify-content: flex-end;
  gap: 16px;
}
</style>
