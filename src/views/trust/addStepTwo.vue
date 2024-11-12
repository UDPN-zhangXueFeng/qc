<template>
  <div class="trust-form mx-auto">
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
            <!-- <el-button type="primary" size="small" @click="editRow(row)" text>编辑</el-button> -->
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
        <el-button @click="saveAsDraft">保存为草稿</el-button>
        <!-- <el-button @click="saveAndCopy">提交并复制新增</el-button> -->
        <el-button type="primary" @click="nextStep">提交</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRoute, useRouter } from "vue-router";
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
  // tableData.value.splice(index, 1); return;
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

const downloadTemplate = async () => {
  try {
    const response = await request({
      url: '/lipu/flow/orderparams/template_download',
      method: 'GET',
      responseType: 'blob',  // 指定响应类型为blob
    });

    // 检查响应内容
    if (!response.data) {
      throw new Error('下载失败：未收到文件数据');
    }

    // 从响应头获取文件名，如果没有则使用默认文件名
    const filename = '委托单-技术方案导入模板.xlsx';

    // 直接使用响应数据创建 Blob，因为 response.data 已经是 Blob 类型
    const blob = response.data;
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = decodeURIComponent(filename);

    // 触发下载
    document.body.appendChild(downloadLink);
    downloadLink.click();

    // 清理
    URL.revokeObjectURL(downloadLink.href);
    document.body.removeChild(downloadLink);

    ElMessage.success('模板下载成功');
  } catch (error) {
    console.error('下载模板失败:', error);
    // ElMessage.error('下载模板失败');
  }
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

const saveAsDraft = async () => {
  try {
    // 从 localStorage 获取第一步保存的数据
    const draftData = JSON.parse(localStorage.getItem('draft') || '{}');

    // 构建请求数据
    const formData = new FormData();

    // 添加第一步的表单数据
    Object.entries(draftData).forEach(([key, value]) => {
      formData.append(key, value as string);
    });

    // 添加当前页面的技术方案数据
    // formData.append('test_params', JSON.stringify(tableData.value));
    console.log("formData", formData);
    // 发送保存草稿请求
    const response: any = await request({
      url: '/lipu/flow/order/order_add_cg',
      method: 'POST',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    if (response.code === 1) {
      ElMessage.success('草稿保存成功');
      router.push('/trust-list');
    } else {
      ElMessage.error(response.msg || '保存失败');
    }
  } catch (error) {
    console.error('保存草��失败:', error);
    // ElMessage.error('保存草稿失败');
  }
};

const saveAndCopy = () => {
  console.log("提交并复制新增");
  ElMessage.success("已提交并复制新增");
};

const nextStep = async () => {
  const id = route.params.id;
  const draftData = JSON.parse(localStorage.getItem('draft') || '{}');
  if (id) {
    // 构建请求数据
    const formData = new FormData();
    // 添加第一步的表单数据
    Object.entries(draftData).forEach(([key, value]) => {
      formData.append(key, value as string);
    });
    formData.append('order_id', route.params.id as string);
    await request.post("lipu/flow/order/edit_order", formData);
    localStorage.removeItem("draft");
    router.push(`/trust-add-three/${id}`);

  } else {
    if (tableData.value.length <= 0) {
      // 构建请求数据
      const formData = new FormData();
      // 添加第一步的表单数据
      Object.entries(draftData).forEach(([key, value]) => {
        formData.append(key, value as string);
      });
      const response: any = await request.post("lipu/flow/order/order_add", draftData);
      localStorage.removeItem("draft");
      router.push(`/trust-add-three/${response.data.order_id}`);
    } else {
      localStorage.removeItem("draft");
      router.push(`/trust-add-three/${localStorage.getItem("order_id")}`);
    }
  }

};

const openFileUpload = () => {
  fileInput.value?.click();
};
const upFiles = async (id: string, event: Event) => {
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
      importFormData.append('order_id', id);
      importFormData.append('file_path', filePath);

      const importResponse: any = await request({
        method: 'POST',
        url: '/lipu/flow/order/testparams_import',
        data: importFormData,
      });

      if (importResponse.code === 1) {
        ElMessage.success("文件导入成功");
        // 导入成功后，调用接口获取最新的表格数据
        await fetchTableData(id);
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
}

const handleFileUpload = async (event: Event) => {
  const or_id = route.params.id;
  const draftData = JSON.parse(localStorage.getItem('draft') || '{}');
  if (or_id) {
    // 构建请求数据
    const formData = new FormData();
    // 添加第一步的表单数据
    Object.entries(draftData).forEach(([key, value]) => {
      formData.append(key, value as string);
    });
    formData.append('order_id', route.params.id as string);
    await request.post("lipu/flow/order/edit_order", formData);
    upFiles(or_id as string, event);
  } else {
    // 构建请求数据
    const formData = new FormData();
    // 添加第一步的表单数据
    Object.entries(draftData).forEach(([key, value]) => {
      formData.append(key, value as string);
    });
    const response: any = await request.post("lipu/flow/order/order_add", draftData);
    if (response?.code === 1) {
      localStorage.setItem("order_id", response.data.order_id);
      upFiles(response.data.order_id, event);
    }
  }

};

const fetchTableData = async (id?: string) => {
  try {
    const response: any = await request({
      method: 'GET',
      url: `/lipu/flow/order/import_test_params?order_id=${id || route.params.id}`,
    });

    if (response.code === 1 && response.data && Array.isArray(response.data.list)) {
      tableData.value = response.data.list;
    }
  } catch (error) {
    console.error("Error fetching table data:", error);

  }
};

const backStepOne = () => {
  const id = route.params.id;
  router.push(`/trust-add-one${id ? `/${id}` : ''}`);
};

onMounted(() => {
  if (route.params.id) {
    fetchTableData();
  }
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
