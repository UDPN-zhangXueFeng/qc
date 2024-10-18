<template>
  <div class="qc-create-page">
    <div class="task-detail" v-if="taskDetail">
      <el-card class="mb-4">
        <template #header>
          <div class="card-header">
            <span>下发质控通知单</span>
          </div>
        </template>

        <el-descriptions :column="4" border>
          <el-descriptions-item label="关联任务单号">{{
            taskDetail.task_number || route.params.taskId
          }}</el-descriptions-item>
          <el-descriptions-item label="关联委托单号">{{
            taskDetail.order_number
          }}</el-descriptions-item>
          <el-descriptions-item label="项目名称">{{
            taskDetail.project_name
          }}</el-descriptions-item>
          <el-descriptions-item label="有关科室">{{
            taskDetail.task_related_office
          }}</el-descriptions-item>
          <el-descriptions-item label="采样地点">{{
            taskDetail.sampling_address
          }}</el-descriptions-item>
          <el-descriptions-item label="完成时间">{{
            taskDetail.deadline
          }}</el-descriptions-item>
        </el-descriptions>
      </el-card>

      <el-card class="mb-4">
        <template #header>
          <div class="card-header">
            <span>通知信息填写</span>
          </div>
        </template>
        <el-form
          ref="noticeFormRef"
          :model="noticeForm"
          :rules="rules"
          label-width="120px"
        >
          <el-form-item label="质控通知单号" prop="notice_number" required>
            <el-input
              v-model="noticeForm.notice_number"
              placeholder="请输入质控通知单号"
            ></el-input>
          </el-form-item>
          <el-form-item label="有关科室" prop="related_offices" required>
            <el-checkbox-group v-model="noticeForm.related_offices">
              <el-checkbox label="原控室"></el-checkbox>
              <el-checkbox label="采样室"></el-checkbox>
              <el-checkbox label="分析室"></el-checkbox>
              <el-checkbox label="业务报告室"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </el-card>

      <el-card class="mb-4">
        <template #header>
          <div class="card-header">
            <span>采样</span>
            <el-button type="primary" @click="addSamplingItem">添加</el-button>
          </div>
        </template>
        <el-table :data="samplingItems" border style="width: 100%">
          <el-table-column
            type="index"
            label="序号"
            width="50"
          ></el-table-column>
          <el-table-column label="操作" width="100">
            <template #default="scope">
              <el-button type="text" @click="editSamplingItem(scope.row)"
                >编辑</el-button
              >
              <el-button type="text" @click="deleteSamplingItem(scope.$index)"
                >删除</el-button
              >
            </template>
          </el-table-column>
          <el-table-column
            prop="sample_category"
            label="样品类别"
          ></el-table-column>
          <el-table-column
            prop="test_params"
            label="检测参数"
          ></el-table-column>
          <el-table-column prop="quality_control" label="质控措施">
            <template #default="scope">
              <div class="flex items-center">
                <el-input
                  v-model="scope.row.qualityControlValue"
                  placeholder="请输入数值"
                  style="width: 30%; margin-right: 10px;"
                >
   
                </el-input>
                <el-select
                  v-model="scope.row.quality_control"
                  placeholder="请选择"
                  @change="handleQualityControlChange(scope.row)"
                  style="width: 50%;"
                >
                  <el-option
                    label="现场平行样/批"
                    value="现场平行样/批"
                  ></el-option>
                  <el-option
                    label="全程序空白样/批"
                    value="全程序空白样/批"
                  ></el-option>
                  <el-option
                    label="现场空白样/批"
                    value="现场空白样/批"
                  ></el-option>
                  <el-option
                    label="运输空白样/批"
                    value="运输空白样/批"
                  ></el-option>
                  <el-option
                    label="密码样/批"
                    value="密码样/批"
                  ></el-option>
                  <el-option
                    label="加标样/批"
                    value="加标样/批"
                  ></el-option>
                  <el-option label="自定义" value="custom"></el-option>
                  <el-option
                    v-for="option in dynamicOptions"
                    :key="option"
                    :label="option"
                    :value="option"
                  ></el-option>
                </el-select>

              </div>
              <el-input
                class="mt-3"
                v-if="scope.row.quality_control === 'custom'"
                v-model="scope.row.customOption"
                placeholder="请输入自定义选项"
                @keyup.enter="addCustomOption(scope.row)"
              >
                <template #append>
                  <el-button @click="addCustomOption(scope.row)">添加</el-button>
                </template>
              </el-input>
            </template>
          </el-table-column>
          <el-table-column prop="note" label="备注">
            <template #default="scope">
              <el-input
                v-model="scope.row.note"
                placeholder="请输入备注"
              ></el-input>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <el-card>
        <template #header>
          <div class="card-header">
            <span>分析</span>
            <el-button type="primary" @click="addAnalysisItem">添加</el-button>
          </div>
        </template>
        <el-table :data="analysisItems" border style="width: 100%">
          <el-table-column
            type="index"
            label="序号"
            width="50"
          ></el-table-column>
          <el-table-column label="操作" width="100">
            <template #default="scope">
              <el-button type="text" @click="editAnalysisItem(scope.row)"
                >编辑</el-button
              >
              <el-button type="text" @click="deleteAnalysisItem(scope.$index)"
                >删除</el-button
              >
            </template>
          </el-table-column>
          <el-table-column
            prop="sample_category"
            label="样品类别"
          ></el-table-column>
          <el-table-column
            prop="test_params"
            label="检测参数"
          ></el-table-column>
          <el-table-column prop="quality_control" label="质控措施">
            <template #default="scope">
              <el-input
                v-model="scope.row.quality_control"
                placeholder="请输入质控措施"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="note" label="备注">
            <template #default="scope">
              <el-input
                v-model="scope.row.note"
                placeholder="请输入备注"
              ></el-input>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    <SlidingPanel 
      v-model="panelVisible"
      :taskId="route.params.taskId as string"
      @confirm="handlePanelConfirm"
    />
    <SlidingPanel 
      v-model="panelVisible1"
      :taskId="route.params.taskId as string"
      @confirm="handlePanelConfirm1"
    />
    <div class="fixed-bottom">
      <div class="button-container">
        <el-button @click="goBack">取消</el-button>
        <el-button @click="saveNotice">保存</el-button>
        <el-button type="primary" @click="downloadNotice">下发</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import type { FormInstance } from "element-plus";
import request from "@/utils/request";
import SlidingPanel from '@/components/SlidingPanel.vue'; // 请确保路径正确

const router = useRouter();
const route = useRoute();

const panelVisible = ref(false);
const panelVisible1 = ref(false);

const taskDetail: any = ref(null);
const noticeForm = ref({
  notice_number: "",
  related_offices: [],
});
const samplingItems:any = ref([]);
const analysisItems:any = ref([]);

const noticeFormRef = ref<FormInstance>();
const rules = {
  notice_number: [
    { required: true, message: '请输入质控通知单号', trigger: 'blur' }
  ],
  related_offices: [
    { type: 'array', required: true, message: '请选择至少一个有关科室', trigger: 'change' }
  ]
};

const fetchTaskDetail = async () => {
  try {
    const taskId = route.params.taskId;
    const orderId = route.params.orderId;
    const response: any = await request.get(`lipu/flow/task/get_single_task`, {
      params: {
        task_id: taskId,
        order_id: orderId,
      },
    });
    if (response.code === 1) {
      taskDetail.value = response.data.order;
    } else {
      ElMessage.error("获取任务详情失败");
    }
  } catch (error) {
    console.error("Error fetching task detail:", error);
    ElMessage.error("获取任务详情失败");
  }
};

onMounted(() => {
  fetchTaskDetail();
});

const addSamplingItem = () => {
  panelVisible.value = true;
};

const editSamplingItem = (item: any) => {
  // 实现编辑逻辑
};

const deleteSamplingItem = (index: any) => {
  samplingItems.value.splice(index, 1);
};

const addAnalysisItem = () => {
  panelVisible1.value = true;
};

const editAnalysisItem = (item: any) => {
  // 实现编辑逻辑
};

const deleteAnalysisItem = (index: any) => {
  analysisItems.value.splice(index, 1);
};

const saveNotice = async () => {
  try {
    // 实现保存逻辑
    ElMessage.success("保存成功");
  } catch (error) {
    console.error("Error saving notice:", error);
    ElMessage.error("保存失败");
  }
};

const goBack = () => {
  router.go(-1);
};

const downloadNotice = async () => {
  if (!noticeFormRef.value) return;
  
  await noticeFormRef.value.validate(async (valid, fields) => {
    if (valid) {
      // 检查采样和分析表格是否有数据
      if (samplingItems.value.length === 0 && analysisItems.value.length === 0) {
        ElMessage.error("采样和分析表格至少需要填写一项");
        return;
      }

      try {
        const formData = new FormData();
        formData.append('order_id', route.params.orderId as string);
        formData.append('task_id',  route.params.taskId as string);
        formData.append('qc_number', noticeForm.value.notice_number);
        formData.append('qc_related_office', noticeForm.value.related_offices.join(','));
        
        const qcsamplingmethod = samplingItems.value.map((item: any) => ({
          sample_category_id:item.sample_category_id,
          sample_category: item.sample_category,
          test_params: Array.isArray(item.test_params) ? item.test_params.join(',') : item.test_params,
          sampling_qc_method_a: item.qualityControlValue+item.quality_control,
          sampling_qc_method_b: item.qualityControlValue+item.quality_control, // 这里可能需要根据实际情况调整
          sampling_qc_note: item.note
        }));
        formData.append('qcsamplingmethod', JSON.stringify(qcsamplingmethod));

        const qcanalysismethod = analysisItems.value.map((item: any) => ({
          sample_category_id:item.sample_category_id,
          sample_category: item.sample_category,
          analysis_params: Array.isArray(item.test_params) ? item.test_params.join(',') : item.test_params,
          analysis_qc_method: item.quality_control,
          analysis_qc_note: item.note
        }));
        formData.append('qcanalysismethod', JSON.stringify(qcanalysismethod));

        console.log('FormData:', Object.fromEntries(formData));

        const response: any = await request({
          method: 'post',
          url: 'lipu/flow/qc/qc_add',
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        console.log('Response:', response);
        
        if (response.code === 1) {
          ElMessage.success("下发成功");
          router.go(-1);
        } else {
          ElMessage.error(response.msg || "下发失败");
        }
      } catch (error) {
        console.error("Error downloading notice:", error);
        ElMessage.error("下发失败");
      }
    } else {
      console.log('Validation failed:', fields);
      ElMessage.error("表单验证失败，请检查输入");
    }
  });
};

const dynamicOptions = ref<string[]>([]);
const customOption = ref('');

const handleQualityControlChange = (row: any) => {
  if (row.quality_control === 'custom') {
    row.customOption = ''; // 清空自定义输入
  }
};

const addCustomOption = (row: any) => {
  if (row.customOption && !dynamicOptions.value.includes(row.customOption)) {
    dynamicOptions.value.push(row.customOption);
    row.quality_control = row.customOption;
    row.customOption = ''; // 清空输入框
  }
};

const handlePanelConfirm = (data: any) => {
  samplingItems.value = [];
  // 在这里处理选中的数据，添加到 samplingItems 和 analysisItems
  data.selectedItems.forEach((item: any) => {
    const newItem = {
      sample_category_id:data.selectedCategoryId,
      sample_category: item.sample_category,
      test_params: item.test_params,
      quality_control: "",
      qualityControlValue: "", // 新增字段
      note: ""
    };
    samplingItems.value.push(newItem);
  });
};
const handlePanelConfirm1 = (data: any) => {
  analysisItems.value = [];
  // 在这里处理选中的数据，添加到 samplingItems 和 analysisItems
  data.selectedItems.forEach((item: any) => {
    const newItem = {
      sample_category_id:data.selectedCategoryId,
      sample_category: item.sample_category,
      test_params: item.test_params,
      quality_control: "",
      // qualityControlValue: "", // 新增字段
      note: ""
    };
    analysisItems.value.push({ ...newItem });
  });
};
</script>

<style scoped>
.qc-create-page {
  position: relative;
  min-height: 100vh;
  padding-bottom: 60px; /* 为固定底部按钮留出空间 */
}

.task-detail {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mb-4 {
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
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px;
  display: flex;
  justify-content: flex-end;
  gap: 16px;
}
.fixed-bottom button {
  margin-left: 10px;
}
</style>
