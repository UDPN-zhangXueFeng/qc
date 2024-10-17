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
        <el-table-column type="index" label="序号" width="60" fixed></el-table-column>
        <el-table-column label="操作" width="140" fixed>
          <template #default="{ row, $index }">
            <el-button type="primary" size="small" @click="editRow(row)" text>编辑</el-button>
            <el-button type="danger" size="small" @click="deleteRow($index)" text>删除</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="sample_category" label="样品类别" width="100"></el-table-column>
        <el-table-column prop="point_name" label="点位名称" width="100"></el-table-column>
        <el-table-column prop="point_number" label="点位编码" width="100"></el-table-column>
        <el-table-column prop="test_parms" label="检测参数" width="100"></el-table-column>
        <el-table-column prop="test_frequency" label="检测频次" width="100"></el-table-column>
        <el-table-column prop="test_period" label="检测周期" width="100"></el-table-column>
        <el-table-column prop="test_days" label="检测天数" width="100"></el-table-column>
        <el-table-column prop="sampling_basis_number" label="采样依据" width="120"></el-table-column>
        <el-table-column prop="test_method_number" label="检测依据" width="120"></el-table-column>
        <el-table-column prop="execute_method_number" label="执行依据" width="120"></el-table-column>
        <el-table-column prop="limit_value" label="限值" width="100"></el-table-column>
        <el-table-column prop="sampling_params_note" label="备注"></el-table-column>
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
import { ref, reactive,onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import request from "@/utils/request";

interface TableRow {
  id: number;
  sample_category: string;
  point_name: string;
  point_number: string;
  test_parms: string;
  test_frequency: string;
  test_period: string;
  test_days: string;
  sampling_basis_number: string;
  test_method_number: string;
  execute_method_number: string;
  limit_value: string;
  sampling_params_note: string;
}

const router = useRouter();
const tableData = ref<TableRow[]>([]);

const fileInput = ref<HTMLInputElement | null>(null);

const addRow = () => {
  tableData.value.push(reactive<TableRow>({
    id: 0,
    sample_category: "",
    point_name: "",
    point_number: "",
    test_parms: "",
    test_frequency: "",
    test_period: "",
    test_days: "",
    sampling_basis_number: "",
    test_method_number: "",
    execute_method_number: "",
    limit_value: "",
    sampling_params_note: "",
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
    const uploadResponse: any = await request({
      method: 'POST',
      url: '/lipu/flow/order/testparams_upload',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    if (uploadResponse.code === 1) {
      const filePath = uploadResponse.file_path;
      
      // 第二步：调用导入接口
      const importFormData = new FormData();
      importFormData.append('order_id', localStorage.getItem('order_id') || '');
      importFormData.append('file_path', filePath);

      const importResponse: any = await request({
        method: 'POST',
        url: '/lipu/flow/order/testparams_import',
        data: importFormData,
      });

      if (importResponse.code === 1) {
        ElMessage.success("文件导入成功");
        // 导入成功后，调用接口获取最新的表格数据
        await fetchTableData();
      } else {
        ElMessage.error(importResponse.msg || "导入失败");
      }
    } else {
      ElMessage.error(uploadResponse.msg || "上传失败");
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

const fetchTableData = async () => {
  try {
    const response: any = await request({
      method: 'GET',
      url: `/lipu/flow/order/import_test_params?order_id=${localStorage.getItem('order_id') || ''}`,
    });

    if (response.code === 1 && response.data && Array.isArray(response.data.list)) {
      tableData.value = response.data.list;
    } else {
      ElMessage.error(response.msg || "获取数据失败");
    }
  } catch (error) {
    console.error("Error fetching table data:", error);
    ElMessage.error("获取表格数据失败");
  }
};

onMounted(() => {
  fetchTableData();
});
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
