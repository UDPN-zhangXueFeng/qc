<template>
  <div class="trust-detail" v-if="trustDetail">
    <el-card class="mb-4">
      <template #header>
        <div class="card-header">
          <span>委托单详情</span>
          <div>
            <el-button @click="goBack">返回</el-button>
            <!-- <el-button @click="printDetail">打印</el-button> -->
            <el-button @click="downloadDetail">下载</el-button>
            <el-button @click="deleteDetail">删除</el-button>
            <el-button @click="editDetail">编辑</el-button>
            <el-button type="primary" @click="openReviewDialog">审核</el-button>
          </div>
        </div>
      </template>

      <el-descriptions :column="4" border>
        <el-descriptions-item label="委托单号">{{ trustDetail.order_number }}</el-descriptions-item>
        <el-descriptions-item label="项目名称">{{ trustDetail.project_name }}</el-descriptions-item>
        <el-descriptions-item label="采样地址">{{ trustDetail.sampling_address }}</el-descriptions-item>
        <el-descriptions-item label="是否分包">{{ trustDetail.is_subcontract }}</el-descriptions-item>
        <el-descriptions-item label="检测类别">{{ trustDetail.test_category }}</el-descriptions-item>
        <el-descriptions-item label="完成时间">{{ trustDetail.deadline }}</el-descriptions-item>
        <el-descriptions-item label="委托时间">{{ trustDetail.createtime }}</el-descriptions-item>
        <el-descriptions-item label="制单人">{{ trustDetail.createdby }}</el-descriptions-item>
        <el-descriptions-item label="制单时间">{{ trustDetail.createtime }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="trustDetail.status === '1' ? 'warning' : 'success'">
            {{ trustDetail.status === '1' ? '待审核' : '已审核' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="项目备注">{{ trustDetail.project_note }}</el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card class="mb-4">
      <template #header>
        <div class="card-header">
          <span>委托方信息</span>
          <el-button type="text" @click="toggleClientInfo">
            {{ showClientInfo ? "收起" : "展开" }}
          </el-button>
        </div>
      </template>
      <el-collapse-transition>
        <div v-show="showClientInfo">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="单位名称">{{ trustDetail.client_company_name }}</el-descriptions-item>
            <el-descriptions-item label="单位地址">{{ trustDetail.client_company_address }}</el-descriptions-item>
            <el-descriptions-item label="联系人">{{ trustDetail.client_contact_person }}</el-descriptions-item>
            <el-descriptions-item label="联系人电话">{{ trustDetail.client_contact_tel }}</el-descriptions-item>
            <el-descriptions-item label="邮箱">{{ trustDetail.client_email }}</el-descriptions-item>
          </el-descriptions>
        </div>
      </el-collapse-transition>
    </el-card>

    <el-card class="mb-4">
      <template #header>
        <div class="card-header">
          <span>受理方信息</span>
        </div>
      </template>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="受理人">{{ trustDetail.handled_by }}</el-descriptions-item>
        <el-descriptions-item label="受理人电话">{{ trustDetail.handled_by_tel }}</el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card>
      <template #header>
        <div class="card-header">
          <span>检测参数</span>
        </div>
      </template>
      <el-table :data="testParams" border style="width: 100%">
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="sample_category" label="样品类别"></el-table-column>
        <el-table-column prop="point_name" label="点位名称"></el-table-column>
        <el-table-column prop="point_number" label="点位编码"></el-table-column>
        <el-table-column prop="test_parms" label="检测参数"></el-table-column>
        <el-table-column prop="test_frequency" label="检测频次"></el-table-column>
        <el-table-column prop="test_period" label="检测周期"></el-table-column>
        <el-table-column prop="test_days" label="检测天数"></el-table-column>
        <el-table-column prop="sampling_basis" label="采样依��"></el-table-column>
        <el-table-column prop="test_method" label="检测依据"></el-table-column>
        <el-table-column prop="execute_method" label="执行依据"></el-table-column>
        <el-table-column prop="limit_value" label="限值"></el-table-column>
        <el-table-column prop="sampling_params_note" label="备注"></el-table-column>
      </el-table>
    </el-card>

    <ReviewDialog
      ref="reviewDialogRef"
      :order-id="trustDetail.id"
      @close="handleReviewClose"
      @success="handleReviewSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import request from "@/utils/request";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import ReviewDialog from '@/components/ReviewDialog.vue';

const router = useRouter();
const route = useRoute();

const trustDetail = ref(null);
const showClientInfo = ref(true);
const testParams = ref([]);
const reviewDialogRef = ref(null);

const fetchTrustDetail = async () => {
  try {
    const id = route.params.id;
    const response = await request.get(`lipu/flow/order/get_single_order`, {
      params: {
        order_id: id
      }
    });
    if (response.code === 1) {
      trustDetail.value = response.data.order;
      testParams.value = response.data.test_params;
    } else {
      console.error('Error fetching trust detail:', response.message);
      // 这里可以添加错误处理，比如显示一个错误消息
    }
  } catch (error) {
    console.error('Error fetching trust detail:', error);
    // 这里可以添加错误处理，比如显示一个错误消息
  }
};

onMounted(() => {
  fetchTrustDetail();
});

const printDetail = () => {
  // 实现打印功能
};

const downloadDetail = async () => {
  try {
    const element = document.body; // 或者使用更具体的元素，如 document.querySelector('.trust-detail')
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
    pdf.save('trust-detail.pdf');
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

const openReviewDialog = () => {
  reviewDialogRef.value.open();
};

const handleReviewClose = () => {
  // 可以在这里处理关闭弹窗后的逻辑
};

const handleReviewSuccess = () => {
  // 审核成功后刷新数据
  fetchTrustDetail();
};

const goBack = () => {
  router.push('/');
};

const toggleClientInfo = () => {
  showClientInfo.value = !showClientInfo.value;
};
</script>

<style scoped>
.trust-detail {
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
</style>
