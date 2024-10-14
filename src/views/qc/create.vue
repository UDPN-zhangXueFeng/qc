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
        <el-form :model="noticeForm" label-width="120px">
          <el-form-item label="质控通知单号" required>
            <el-input
              v-model="noticeForm.notice_number"
              placeholder="请输入质控通知单号"
            ></el-input>
          </el-form-item>
          <el-form-item label="有关科室" required>
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
              <el-select
                v-model="scope.row.quality_control"
                placeholder="请选择"
              >
                <el-option
                  label="现场平行样/批"
                  value="现场平行样/批"
                ></el-option>
                <el-option
                  label="全程序空白样/批"
                  value="全程序空白样/批"
                ></el-option>
                <el-option label="密码样/批" value="密码样/批"></el-option>
                <el-option label="自定义" value="custom"></el-option>
              </el-select>
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
      @confirm="handleConfirm"
      @cancel="handleCancel"
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
import request from "@/utils/request";
import SlidingPanel from '@/components/SlidingPanel.vue'; // 请确保路径正确

const router = useRouter();
const route = useRoute();

const panelVisible = ref(false);

const taskDetail = ref(null);
const noticeForm = ref({
  notice_number: "",
  related_offices: [],
});
const samplingItems = ref([]);
const analysisItems = ref([]);

const fetchTaskDetail = async () => {
  try {
    const taskId = route.params.taskId;
    const orderId = route.params.orderId;
    const response = await request.get(`lipu/flow/task/get_single_task`, {
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
//   samplingItems.value.push({
//     sample_category: "",
//     test_params: "",
//     quality_control: "",
//     note: "",
//   });
};

const editSamplingItem = (item) => {
  // 实现编辑逻辑
};

const deleteSamplingItem = (index) => {
  samplingItems.value.splice(index, 1);
};

const addAnalysisItem = () => {
    panelVisible.value = true;
//   analysisItems.value.push({
//     sample_category: "",
//     test_params: "",
//     quality_control: "",
//     note: "",
//   });
};

const editAnalysisItem = (item) => {
  // 实现编辑逻辑
};

const deleteAnalysisItem = (index) => {
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

const downloadNotice = () => {
  // 实现下发逻辑
  ElMessage.success("下发成功");
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
