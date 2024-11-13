<template>
  <div class="trust-detail" v-if="trustDetail">
    <el-card class="mb-4">
      <template #header>
        <div class="card-header">
          <span></span>
          <div>
            <el-button @click="goBack">返回</el-button>
            <!-- <el-button @click="printDetail">打印</el-button> -->
            <el-button @click="downloadDetail">下载</el-button>
            <el-button @click="deleteDetail"    v-if="trustDetail.status === '-1' || trustDetail.status === '3'">删除</el-button>
            <el-button @click="editDetail"    v-if="trustDetail.status === '-1' || trustDetail.status === '3'">编辑</el-button>
            
            <el-button type="primary" v-if="trustDetail.status !== '-1'" @click="openReviewDialog"  :disabled="trustDetail.status === '2'">
              {{ trustDetail.status === '2' ? '已审核' : '审核' }}
            </el-button>
          </div>
        </div>
      </template>
      <el-tabs v-model="activeTab" class="demo-tabs">
        <el-tab-pane label="委托单详情" name="details">
          <el-descriptions :column="4" border class="mb-4">
            <el-descriptions-item label="委托单号">{{
              trustDetail.order_number
            }}</el-descriptions-item>
            <el-descriptions-item label="项目名称">{{
              trustDetail.project_name
            }}</el-descriptions-item>
            <el-descriptions-item label="采样地址">{{
              trustDetail.sampling_address
            }}</el-descriptions-item>
            <el-descriptions-item label="是否分包">{{
              trustDetail.is_subcontract
            }}</el-descriptions-item>
            <el-descriptions-item label="检测类别">{{
              trustDetail.test_category
            }}</el-descriptions-item>
            <el-descriptions-item label="完成时间">{{
              trustDetail.deadline
            }}</el-descriptions-item>
            <el-descriptions-item label="委托时间">{{
              trustDetail.wttime
            }}</el-descriptions-item>
            <el-descriptions-item label="制单人">{{
              trustDetail.createdby
            }}</el-descriptions-item>
            <el-descriptions-item label="制单时间">{{
              trustDetail.createtime
            }}</el-descriptions-item>
            <el-descriptions-item label="状态">
              <el-tag
                :type="trustDetail.status === '1' ? 'warning' : trustDetail.status === '2' ? 'success' : trustDetail.status === '3' ? 'danger' : trustDetail.status === '4' ? 'info' : 'info'">
                {{ trustDetail.status === '-1' ? "草稿" : trustDetail.status === '1' ? "待审批" : trustDetail.status === '2'
                  ?
                  "已通过" : trustDetail.status ===
                    '3' ?
                    "已驳回" : trustDetail.status === '4' ? "已撤回" : "--" }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="项目备注">{{
              trustDetail.project_note
            }}</el-descriptions-item>
          </el-descriptions>
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
                  <el-descriptions-item label="单位名称">{{
                    trustDetail.client_company_name
                    }}</el-descriptions-item>
                  <el-descriptions-item label="单位地址">{{
                    trustDetail.client_company_address
                    }}</el-descriptions-item>
                  <el-descriptions-item label="联系人">{{
                    trustDetail.client_contact_person
                    }}</el-descriptions-item>
                  <el-descriptions-item label="联系人电话">{{
                    trustDetail.client_contact_tel
                    }}</el-descriptions-item>
                  <el-descriptions-item label="邮箱">{{
                    trustDetail.client_email
                    }}</el-descriptions-item>
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
              <el-descriptions-item label="受理人">{{
                trustDetail.handled_by
                }}</el-descriptions-item>
              <el-descriptions-item label="受理人电话">{{
                trustDetail.handled_by_tel
                }}</el-descriptions-item>
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
              <el-table-column prop="sampling_basis" label="采样依据"></el-table-column>
              <el-table-column prop="test_method" label="检测依据"></el-table-column>
              <el-table-column prop="execute_method" label="执行依据"></el-table-column>
              <el-table-column prop="limit_value" label="限值"></el-table-column>
              <el-table-column prop="sampling_params_note" label="备注"></el-table-column>
            </el-table>
          </el-card>
        </el-tab-pane>
        <el-tab-pane label="点位图" name="point">
          <point-page :trust-detail="trustDetail" :order-id="route.params.id" />
        </el-tab-pane>
      </el-tabs>
    </el-card>



    <ReviewDialog ref="reviewDialogRef" :order-id="trustDetail.id" @close="handleReviewClose"
      @success="handleReviewSuccess" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import request from "@/utils/request";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import ReviewDialog from "@/components/ReviewDialog.vue";
import PointPage from './PointPage.vue';
import { ElMessage, ElMessageBox } from "element-plus";

const router = useRouter();
const route = useRoute();
const activeTab = ref('details');  // 新增 tab 控制变量

interface TrustDetail {
  id: string;
  order_number: string;
  project_name: string;
  sampling_address: string;
  is_subcontract: string;
  test_category: string;
  deadline: string;
  createtime: string;
  createdby: string;
  status: string;
  project_note: string;
  client_company_name: string;
  client_company_address: string;
  client_contact_person: string;
  client_contact_tel: string;
  client_email: string;
  handled_by: string;
  handled_by_tel: string;
  wttime: string;
}

const trustDetail = ref<TrustDetail | null>(null);
const showClientInfo = ref(true);
const testParams = ref([]);
const reviewDialogRef = ref(null);

const fetchTrustDetail = async () => {
  try {
    const id = route.params.id;
    const response = await request.get(`lipu/flow/order/get_single_order`, {
      params: {
        order_id: id,
      },
    });
    if (response.code === 1) {
      trustDetail.value = response.data.order;
      testParams.value = response.data.test_params;
    } else {
      console.error("Error fetching trust detail:", response.message);
      // 这里可以添加错误处理，比如显示一个错误消息
    }
  } catch (error) {
    console.error("Error fetching trust detail:", error);
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
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("trust-detail.pdf");
  } catch (error) {
    console.error("Error generating PDF:", error);
    // 这里可以添加错误处理，比如显示一个错误消息
  }
};

const deleteDetail = async () => {
  // 实现删除功能
  try {
    await ElMessageBox.confirm('确定要删除该委托单吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    // const id = route.params.id;
    const formData = new FormData()
    formData.append('order_id', route.params.id as string)

    const response: any = await request({
      url: 'lipu/flow/order/del_order',
      method: 'POST',
      data: formData
    })

    if (response.code === 1) {
      ElMessage.success('删除成功')
      // 直接调用 CommonList 组件的 loadData 方法
      router.push(`/trust-list`)
    } else {
      ElMessage.error(response.msg || '删除失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }
};

const editDetail = () => {
  // 实现编辑功能
  router.push(`/trust-edit/${route.params.id}`);
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
  router.push("/");
};

const toggleClientInfo = () => {
  showClientInfo.value = !showClientInfo.value;
};
</script>
<style scoped>
.trust-detail {
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
</style>
