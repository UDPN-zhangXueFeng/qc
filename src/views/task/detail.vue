<template>
  <div class="task-detail" v-if="taskDetail">
    <el-card class="mb-4">
      <template #header>
        <div class="card-header">
          <div class="card-title">
            <el-tabs v-model="activeTab" class="detail-tabs">
              <el-tab-pane label="任务分派详情" name="details"></el-tab-pane>
              <el-tab-pane label="点位图" name="pointMap"></el-tab-pane>
            </el-tabs>
          </div>
          <div>
            <el-button @click="goBack">返回</el-button>
            <el-button @click="printDetail">打印</el-button>
            <el-button @click="downloadDetail">下载</el-button>
            <el-button @click="deleteDetail">删除</el-button>
            <el-button @click="editDetail">编辑</el-button>
          </div>
        </div>
      </template>

      <div v-if="activeTab === 'details'">
        <el-card class="mt-4">
          <template #header>
            <div class="card-header">
              <span>任务详情</span>
            </div>
          </template>
        <el-descriptions :column="4" border>
          <el-descriptions-item label="委托单号">{{ taskDetail.order.order_number }}</el-descriptions-item>
          <el-descriptions-item label="项目名称">{{ taskDetail.order.project_name }}</el-descriptions-item>
          <el-descriptions-item label="采样地址">{{ taskDetail.order.sampling_address }}</el-descriptions-item>
          <el-descriptions-item label="是否分包">{{ taskDetail.order.is_subcontract }}</el-descriptions-item>
          <el-descriptions-item label="检测类别">{{ taskDetail.order.test_category }}</el-descriptions-item>
          <el-descriptions-item label="完成时间">{{ taskDetail.order.deadline }}</el-descriptions-item>
          <el-descriptions-item label="委托时间">{{ taskDetail.order.createtime }}</el-descriptions-item>
          <el-descriptions-item label="制单人">{{ taskDetail.order.createdby }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="getStatusType(taskDetail.order.status)">
              {{ taskDetail.order.status === '1' ? '待审核' : '已审核' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="项目备注">{{ taskDetail.order.project_note }}</el-descriptions-item>
        </el-descriptions>
        </el-card>
        <el-card class="mt-4">
          <template #header>
            <div class="card-header">
              <span>检测参数</span>
            </div>
          </template>
          <el-table :data="taskDetail.test_params" border style="width: 100%">
            <el-table-column type="index" label="序号" width="50"></el-table-column>
            <el-table-column prop="sample_category" label="样品类别"></el-table-column>
            <el-table-column prop="point_name" label="点位名称"></el-table-column>
            <el-table-column prop="point_number" label="点位编码"></el-table-column>
            <el-table-column prop="test_parms" label="检测参数"></el-table-column>
            <el-table-column prop="test_frequency" label="检测频次"></el-table-column>
            <el-table-column prop="test_period" label="检测周期"></el-table-column>
            <el-table-column prop="test_days" label="检测天数"></el-table-column>
            <el-table-column prop="sampling_basis" label="采样依据"></el-table-column>
            <el-table-column prop="test_method" label="检测依据"></el-table-column>
            <el-table-column prop="execute_method" label="执行依据"></el-table-column>
            <el-table-column prop="limit_value" label="限值"></el-table-column>
            <el-table-column prop="sampling_params_note" label="备注"></el-table-column>
          </el-table>
        </el-card>
      </div>

      <PointMap v-else-if="activeTab === 'pointMap'" :taskId="taskDetail.task_id" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import request from "@/utils/request";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import PointMap from './point.vue';

const router = useRouter();
const route = useRoute();

const taskDetail = ref(null);
const activeTab = ref('details');

const fetchTaskDetail = async () => {
  try {
    const id = route.params.id;
    const response = await request.get(`lipu/flow/task/get_single_task`, {
      params: {
        task_id: id
      }
    });
    if (response.code === 1) {
      taskDetail.value = response.data;
    } else {
      console.error('Error fetching task detail:', response.message);
      // 这里可以添加错误处理，比如显示一个错误消息
    }
  } catch (error) {
    console.error('Error fetching task detail:', error);
    // 这里可以添加错误处理，比如显示一个错误消息
  }
};

onMounted(() => {
  fetchTaskDetail();
});

const getStatusType = (status) => {
  const statusMap = {
    '1': 'warning',
    '2': 'success'
  }
  return statusMap[status] || 'info'
}

const printDetail = () => {
  window.print();
};

const downloadDetail = async () => {
  try {
    const element = document.querySelector('.task-detail');
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('task-detail.pdf');
  } catch (error) {
    console.error('Error generating PDF:', error);
    // 这里可以添加错误处理，比如显示一个错误消息
  }
};

const deleteDetail = () => {
  // 实现删除功能
};

const editDetail = () => {
  // 实现编辑功能
};

const goBack = () => {
  router.go(-1);
};

</script>

<style scoped>
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

.detail-tabs {
  margin-top: 10px;
}

.mt-4 {
  margin-top: 20px;
}
</style>
