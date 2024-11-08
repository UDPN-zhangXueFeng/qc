<template>
  <div class="trust-form mx-auto">
    <el-card class="mb-4 mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <span class="text-lg font-medium">编辑技术方案</span>
        </div>
      </template>

      <div class="mb-4 space-x-2">
        <el-button type="primary" @click="downloadTemplate">下载导入模版</el-button>
        <el-button type="primary" @click="openFileUpload">导入</el-button>
        <input type="file" ref="fileInput" style="display: none;" @change="handleFileUpload" />
      </div>

      <el-table :data="tableData" border style="width: 100%">
        <el-table-column type="index" label="序号" width="60" fixed></el-table-column>
        <el-table-column label="操作" width="140" fixed>
          <template #default="{ row, $index }">
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
      <div class=" mx-auto py-4 px-6 flex justify-end space-x-4">
        <el-button @click="backStepOne">返回上一步</el-button>
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter, useRoute } from "vue-router";
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
const route = useRoute();
const tableData = ref<TableRow[]>([]);
const fileInput = ref<HTMLInputElement | null>(null);

const downloadTemplate = async () => {
  try {
    const response = await request({
      url: '/lipu/flow/orderparams/template_download',
      method: 'GET',
      responseType: 'blob'
    });
    
    const blob = new Blob([response.data]);
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = '委托单-技术方案导入模板.xlsx';
    
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    ElMessage.success('模板下载成功');
  } catch (error) {
    console.error('下载模板失败:', error);
    ElMessage.error('下载模板失败');
  }
};

const backStepOne = () => {
  router.push(`/trust-edit/${route.params.id}`);
};

const deleteRow = (index: number) => {
  tableData.value.splice(index, 1);
};

const cancel = () => {
  ElMessageBox.confirm("确定要取消编辑吗？未保存的修改将会丢失。", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      router.push("/trust-list");
    })
    .catch(() => {
      // 用户取消操作
    });
};

const save = async () => {
  try {
    // 这里可以添加保存逻辑，如果需要的话
    ElMessage.success("编辑成功");
    router.push("/trust-list");
  } catch (error) {
    console.error("保存失败:", error);
    // ElMessage.error("保存失败");
  }
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
      
      const importFormData = new FormData();
      importFormData.append('order_id', route.params.id as string);
      importFormData.append('file_path', filePath);

      const importResponse: any = await request({
        method: 'POST',
        url: '/lipu/flow/order/testparams_import',
        data: importFormData,
      });

      if (importResponse.code === 1) {
        ElMessage.success("文件导入成功");
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

  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

const fetchTableData = async () => {
  try {
    const response: any = await request({
      method: 'GET',
      url: `/lipu/flow/order/import_test_params?order_id=${route.params.id}`,
    });

    if (response.code === 1 && response.data && Array.isArray(response.data.list)) {
      tableData.value = response.data.list;
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
  /* max-width: 1000px; */
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
  /* max-width: 1000px; */
  margin: 0 auto;
  padding: 16px;
  display: flex;
  justify-content: flex-end;
  gap: 16px;
}
</style> 