<template>
  <div class="new-task-assignment">
    <el-card class="mb-4">
      <template #header>
        <div class="card-header">
          <span>新增任务分派</span>
        </div>
      </template>

      <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
        <el-form-item label="关联委托单" prop="order_id" required>
          <el-select v-model="form.order_id" placeholder="请选择委托单">
            <el-option
              v-for="item in orderOptions"
              :key="item.id"
              :label="`${item.order_number || '无编号'} - ${item.project_name}`"
              :value="item.id.toString()"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="检测周期" prop="test_period" required>
          <el-select v-model="form.test_period" placeholder="请选择检测周期">
            <el-option label="周检" value="周检"></el-option>
            <el-option label="月检" value="月检"></el-option>
            <el-option label="季检" value="季检"></el-option>
            <el-option label="半年检" value="半年检"></el-option>
            <el-option label="年检" value="年检"></el-option>
          </el-select>
        </el-form-item>

        <!-- <el-form-item label="检测参数" prop="orderparams_ids" required>
          <el-select v-model="form.orderparams_ids" multiple placeholder="请选择检测参数">
            <el-option label="参数1" value="1"></el-option>
            <el-option label="参数2" value="2"></el-option>
            <el-option label="参数3" value="3"></el-option>
          </el-select>
        </el-form-item> -->

        <el-form-item label="任务名称" prop="task_name" required>
          <el-input v-model="form.task_name" placeholder="请输入任务名称"></el-input>
        </el-form-item>

        <el-form-item label="任务编号" prop="task_number" required>
          <el-input v-model="form.task_number" placeholder="请输入任务编号"></el-input>
        </el-form-item>

        <el-form-item label="有关科室" prop="task_related_office" required>
          <el-checkbox-group v-model="form.task_related_office">
            <el-checkbox label="采样室"></el-checkbox>
            <el-checkbox label="质控室"></el-checkbox>
            <el-checkbox label="分析室"></el-checkbox>
            <el-checkbox label="业务报告室"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="采样地点" prop="task_address" required>
          <el-input v-model="form.task_address" placeholder="请输入采样地点"></el-input>
        </el-form-item>

        <el-form-item label="任务备注" prop="task_note">
          <el-input v-model="form.task_note" type="textarea" :rows="4" placeholder="请输入任务备注"></el-input>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- Updated table -->
    <el-card class="mb-4">
      <template #header>
        <div class="card-header">
          <span>检测参数</span>
        </div>
      </template>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="sample_category" label="样品类别"></el-table-column>
        <el-table-column prop="point_name" label="点位名称"></el-table-column>
        <el-table-column prop="point_number" label="点位编码"></el-table-column>
        <el-table-column prop="test_parms" label="检测参数"></el-table-column>
        <el-table-column prop="test_period" label="检测周期"></el-table-column>
        <el-table-column prop="test_frequency" label="检测频次"></el-table-column>
        <el-table-column prop="test_days" label="检测天数"></el-table-column>
        <el-table-column prop="sampling_basis_number" label="采样依据"></el-table-column>
        <el-table-column prop="test_method_number" label="检测依据"></el-table-column>
        <el-table-column prop="execute_method_number" label="分析依据"></el-table-column>
        <el-table-column prop="limit_value" label="限值"></el-table-column>
        <el-table-column prop="sampling_params_note" label="备注"></el-table-column>
      </el-table>
    </el-card>

    <div class="fixed-bottom">
      <div class="button-container">
        <el-button @click="cancelForm">取消</el-button>
        <el-button type="primary" @click="submitForm">下发</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { useRouter,useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import request from "@/utils/request"; // 导入 request

const router = useRouter();
const route = useRoute();
const formRef = ref<FormInstance>();

const form = reactive({
  order_id: "",
  test_period: "",
  orderparams_ids: [],
  task_name: "",
  task_number: "",
  task_related_office: [],
  task_address: "",
  task_note: "",
});

const rules: FormRules = {
  order_id: [{ required: true, message: "请选择关联委托单", trigger: "change" }],
  test_period: [{ required: true, message: "请选择检测周期", trigger: "change" }],
  // orderparams_ids: [{ type: "array", required: true, message: "请选择检测参数", trigger: "change" }],
  task_name: [{ required: true, message: "请输入任务名称", trigger: "blur" }],
  task_number: [{ required: true, message: "请输入任务编号", trigger: "blur" }],
  task_related_office: [{ type: "array", required: true, message: "请至少选择一个相关科室", trigger: "change" }],
  task_address: [{ required: true, message: "请输入采样地点", trigger: "blur" }],
};

const orderOptions = ref([]);

const fetchOrderOptions = async () => {
  try {
    const response: any = await request({
      url: '/lipu/flow/task/comfir_qc',
      method: 'GET',
    });

    if (response.code === 1 && response.data && response.data.list) {
      orderOptions.value = response.data.list;
    } else {
      // ElMessage.error(response.msg || '获取委托单列表失败');
    }
  } catch (error) {
    console.error('获取委托单列表失败:', error);
    // ElMessage.error('获取委托单列表失败，请稍后重试');
  }
};

onMounted(() => {
  fetchOrderOptions();
});

const submitForm = async () => {
  if (!formRef.value) return;

  const formData = new FormData();

  Object.keys(form).forEach(key => {
    if (key === 'orderparams_ids') {
      // 特殊处理 orderparams_ids
      const allIds = tableData.value.map(row => row.id).join(',');
      formData.append(key, allIds);
    } else if (Array.isArray(form[key])) {
      formData.append(key, form[key].join(','));
    } else {
      formData.append(key, form[key]);
    }
  });

  await formRef.value.validate(async (valid, fields) => {
    if (valid) {
      try {
        const response: any = await request({
          url: '/lipu/flow/task/task_add',
          method: 'POST',
          data: formData,
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        if (response.code === 1) {
          ElMessage.success('任务下发成功');
          // router.push(`/task-detail/${response.data.task_id}`); // 提交成功后跳转到首页
          router.push(`/qc-create/${response.data.task_id}/${route.params.id}`);

        } else {
          // ElMessage.error(response.msg || '任务下发失败');
        }
      } catch (error) {
        console.error('提交失败:', error);
        // ElMessage.error('提交失败，请稍后重试');
      }
    } else {
      console.error("Form validation failed", fields);
    }
  });
};

const cancelForm = () => {
  router.go(-1);
};

const tableData = ref([]);

const fetchTaskTestParams = async (wtId: string, testPeriod: string) => {
  try {
    const response: any = await request({
      url: `/lipu/flow/task/get_task_test_params?wt_id=${wtId}&test_period=${testPeriod}`,
      method: 'GET',
    });

    if (response.code === 1 && response.data && response.data.list) {
      tableData.value = response.data.list;
    } else {
      // ElMessage.error(response.msg || '获取检测参数失败');
    }
  } catch (error) {
    console.error('获取检测参数失败:', error);
    // ElMessage.error('获取检测参数失败，请稍后重试');
  }
};

watch(() => [form.order_id, form.test_period], ([newOrderId, newTestPeriod]) => {
  if (newOrderId && newTestPeriod) {
    fetchTaskTestParams(newOrderId, newTestPeriod);
  }
});
</script>

<style scoped>
.new-task-assignment {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-tip {
  font-size: 12px;
  color: #909399;
  margin-left: 10px;
}

.mb-4 {
  margin-bottom: 20px;
}

.el-table {
  margin-top: 20px;
}

/* 为了防止内容被固定底部遮挡，给主内容添加底部内边距 */
.new-task-assignment {
  padding-bottom: 60px;
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
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px;
  display: flex;
  justify-content: flex-end;
  gap: 16px;
}
.fixed-bottom .el-button {
  margin-left: 10px;
}
</style>
