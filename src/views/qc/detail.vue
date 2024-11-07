<template>
  <div class="task-detail" v-if="taskDetail">
    <el-card class="mb-4">
      <template #header>
        <div class="card-header">
          <span>质控单详情</span>
          <div>
            <!-- <el-button @click="printDetail">打印</el-button> -->
            <el-button @click="downloadDetail">下载</el-button>
          </div>
        </div>
      </template>

      <el-descriptions :column="4" border>
        <el-descriptions-item label="质控单号">{{ taskDetail.qc_info.qc_number }}</el-descriptions-item>
        <el-descriptions-item label="关联任务单号">{{ taskDetail.task_info.task_number }}</el-descriptions-item>
        <el-descriptions-item label="关联委托单号">{{ taskDetail.order_info.order_number }}</el-descriptions-item>
        <el-descriptions-item label="项目名称">{{ taskDetail.order_info.project_name }}</el-descriptions-item>
        <el-descriptions-item label="有关科室">{{ taskDetail.qc_info.qc_related_office }}</el-descriptions-item>
        <el-descriptions-item label="采样地点">{{ taskDetail.order_info.sampling_address }}</el-descriptions-item>
        <el-descriptions-item label="完成时间">{{ taskDetail.task_info.finish_time }}</el-descriptions-item>
        <el-descriptions-item label="制单人">{{ taskDetail.task_info.createdby }}</el-descriptions-item>
        <el-descriptions-item label="制单时间">{{ taskDetail.qc_info.createtime }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getStatusType(taskDetail.qc_info.status)">{{ getStatusText(taskDetail.qc_info.status) }}</el-tag>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card class="mb-4">
      <template #header>
        <div class="card-header">
          <span>采样</span>
        </div>
      </template>
      <el-table :data="taskDetail.qcsamplingmethod_info" border style="width: 100%">
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="sample_category" label="样品类别"></el-table-column>
        <el-table-column prop="test_params" label="检测参数"></el-table-column>
        <el-table-column label="质控措施">
          <template #default="scope">
            {{ scope.row.sampling_qc_method_a }} 
            <!-- {{ scope.row.sampling_qc_method_b }} -->
          </template>
        </el-table-column>
        <el-table-column prop="sampling_qc_note" label="备注"></el-table-column>
      </el-table>
    </el-card>

    <el-card>
      <template #header>
        <div class="card-header">
          <span>分析</span>
        </div>
      </template>
      <el-table :data="taskDetail.qcanalysismethod_info" border style="width: 100%">
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="sample_category" label="样品类别"></el-table-column>
        <el-table-column prop="analysis_params" label="检测参数"></el-table-column>
        <el-table-column prop="analysis_qc_method" label="质控措施"></el-table-column>
        <el-table-column prop="analysis_qc_note" label="备注"></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ElMessage } from 'element-plus';
import request from "@/utils/request";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const router = useRouter();
const route = useRoute();

const taskDetail:any = ref(null);

const fetchTaskDetail = async () => {
  try {
    const id = route.params.id;
    const response:any = await request.get(`lipu/flow/qc/get_single_qc`, {
      params: { qc_id: id }
    });
    if (response.code === 1) {
      taskDetail.value = response.data;
    } else {
      ElMessage.error('获取质控单详情失败');
    }
  } catch (error) {
    console.error('Error fetching qc detail:', error);
    ElMessage.error('获取质控单详情失败');
  }
};

onMounted(() => {
  fetchTaskDetail();
});

const getStatusType = (status: any) => {
  const statusMap:any = {
    '1': 'warning',
    '2': 'success',
    '3': 'info'
  }
  return statusMap[status] || 'info'
}

const getStatusText = (status: any) => {
  const statusMap:any = {
    '1': '待下发',
    '2': '已下发',
    '3': '已取消'
  }
  return statusMap[status] || '未知状态'
}

const printDetail = () => {
  window.print();
};

const downloadDetail = async () => {
  try {
    const element:any = document.querySelector('.task-detail');
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
    pdf.save('qc-detail.pdf');
  } catch (error) {
    console.error('Error generating PDF:', error);
    ElMessage.error('生成PDF失败');
  }
};

</script>

<style scoped>
.task-detail {
  /* max-width: 1200px; */
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

@media print {
  .el-button {
    display: none;
  }
}
</style>
