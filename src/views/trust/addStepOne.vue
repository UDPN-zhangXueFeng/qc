<template>
  <div class="trust-form">
    <el-steps :active="1" finish-status="success" simple>
      <el-step title="填写基本信息" />
      <el-step title="添加检测参数" />
      <el-step title="提交结果" />
    </el-steps>

    <el-form :model="form" :rules="rules" ref="formRef" label-width="120px" class="mt-4 pb-20">
      <el-card class="mb-4">
        <template #header>
          <div class="card-header">
            <span>填写基本信息</span>
            <!-- <el-button text>折叠</el-button> -->
          </div>
        </template>

        <el-form-item label="委托单号" prop="trustNumber" required>
          <el-input v-model="form.trustNumber" class="w-64" placeholder="后续单号">
            <!-- <template #prepend>LPWT</template> -->
          </el-input>
        </el-form-item>

        <el-form-item label="项目/单位" prop="projectType" required class="flex items-center">
          <div class="flex items-center space-x-4 flex-grow">
            <el-radio-group v-model="form.projectType" class="flex-shrink-0">
              <el-radio label="project">项目名称</el-radio>
              <el-radio label="unit">受检单位名称</el-radio>
            </el-radio-group>
            <el-input v-if="form.projectType === 'project'" v-model="form.projectName" class="flex-grow"
              placeholder="请输入项目名称" />
            <el-input v-if="form.projectType === 'unit'" v-model="form.unitName" class="flex-grow"
              placeholder="请输入受检单位名称" />
          </div>
        </el-form-item>

        <el-form-item label="采样/送样" prop="sampleType" required class="flex items-center">
          <div class="flex items-center space-x-4 flex-grow">
            <el-radio-group v-model="form.sampleType" class="flex-shrink-0">
              <el-radio label="sampling">采样（点位名称）</el-radio>
              <el-radio label="delivery">送样（来样名称）</el-radio>
            </el-radio-group>
            <el-input v-if="form.sampleType === 'sampling'" v-model="form.sampleAddress" class="flex-grow"
              placeholder="请输入采样地址" />
            <el-date-picker v-if="form.sampleType === 'delivery'" v-model="form.deliveryTime" type="date"
              placeholder="请选择送样时间" class="w-64" />
          </div>
        </el-form-item>

        <el-form-item label="是否分包" prop="isSubcontract" required>
          <el-radio-group v-model="form.isSubcontract">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="检测类别" prop="testType" required>
          <el-radio-group v-model="form.testType">
            <el-radio label="采样检测">采样检测</el-radio>
            <el-radio label="现状监测">现状监测</el-radio>
            <el-radio label="自行监测">自行监测</el-radio>
            <el-radio label="委托监测">委托监测</el-radio>
            <el-radio label="其他">其他</el-radio>
          </el-radio-group>
          <el-input v-if="form.testType === 'other'" v-model="form.otherTestType" class="w-64 ml-2" placeholder="请输入" />
        </el-form-item>

        <el-form-item label="完成时间" prop="completionTime" required>
          <el-date-picker v-model="form.completionTime" type="date" placeholder="请选择" />
        </el-form-item>

        <el-form-item label="委托时间">
          <el-date-picker v-model="form.entrustmentTime" type="date" placeholder="默认今天" :disabled="false" />
        </el-form-item>

        <el-form-item label="项目备注">
          <el-input v-model="form.projectNote" type="textarea" :rows="3" placeholder="请输入" />
        </el-form-item>
      </el-card>

      <el-card class="mb-4">
        <template #header>
          <div class="card-header">
            <span>委托方信息</span>
            <!-- <el-button text>折叠</el-button> -->
          </div>
        </template>

        <div class="flex flex-wrap -mx-2">
          <el-form-item label="单位名称" class="w-full sm:w-1/2 md:w-1/3 px-2 mb-4">
            <el-input v-model="form.clientCompany" placeholder="请输入" />
          </el-form-item>

          <el-form-item label="单位地址" class="w-full sm:w-1/2 md:w-1/3 px-2 mb-4">
            <el-input v-model="form.clientAddress" placeholder="请输入" />
          </el-form-item>

          <el-form-item label="联系人" class="w-full sm:w-1/2 md:w-1/3 px-2 mb-4">
            <el-input v-model="form.clientContact" placeholder="请输入" />
          </el-form-item>

          <el-form-item label="联系人电话" prop="clientPhone" class="w-full sm:w-1/2 md:w-1/3 px-2 mb-4">
            <el-input v-model="form.clientPhone" placeholder="请输入" />
          </el-form-item>

          <el-form-item label="邮箱" prop="clientEmail" class="w-full sm:w-1/2 md:w-1/3 px-2 mb-4">
            <el-input v-model="form.clientEmail" placeholder="请输入" />
          </el-form-item>
        </div>
      </el-card>

      <el-card>
        <template #header>
          <div class="card-header">
            <span>受理方信息</span>
          </div>
        </template>
        <div class="flex flex-wrap -mx-2">
          <el-form-item label="受理人" class="w-full sm:w-1/2 px-2 mb-4">
            <el-input v-model="form.handlerName" placeholder="请输入" />
          </el-form-item>

          <el-form-item label="受理人电话" prop="handlerPhone" class="w-full sm:w-1/2 px-2 mb-4">
            <el-input v-model="form.handlerPhone" placeholder="请输入" />
          </el-form-item>
        </div>
      </el-card>
      <!-- 
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
      </el-form-item> -->
    </el-form>

    <div class="fixed-bottom">
      <div class="button-container">
        <el-button @click="cancel">取消</el-button>
        <el-button @click="saveAsDraft">保存为草稿</el-button>
        <el-button type="primary" @click="submitForm">下一步</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter, useRoute } from "vue-router"; // 导入 useRouter
import request from "@/utils/request"; // 确保路径正确
import { formatDate } from "@/utils/dateUtils";

const router = useRouter(); // 获取 router 实例
const route = useRoute();
const formRef = ref(null);

const form = reactive({
  trustNumber: "",
  projectType: "project",
  projectName: "",
  unitName: "",
  sampleType: "sampling",
  sampleAddress: "",
  deliveryTime: new Date(),
  isSubcontract: false,
  testType: "采样检测",
  otherTestType: "",
  completionTime: new Date(),
  entrustmentTime: new Date(),
  projectNote: "",
  clientCompany: "",
  clientAddress: "",
  clientContact: "",
  clientPhone: "",
  clientEmail: "",
  handlerName: "",
  handlerPhone: "",
});

const checkTrustNumberUnique = async (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入委托单号'));
    return;
  }
  try {
    const response = await request({
      url: '/lipu/flow/order/has_order',
      method: 'GET',
      params: { type: 'order', sn: value }
    });

    if (response.code === 0) {
      // if (response.data.exists) {

      if (route.params.id) {
        callback();
      } else {
        callback(new Error('委托单号已存在'));
      }
      // } else {
      // callback();
      // }
    } else {
      // callback(new Error(response.msg || '验证失败'));
      callback();
    }
  } catch (error) {
    console.error('检查委托单号失败:', error);
    callback(new Error('验证失败，请重试'));
  }
};

const rules = {
  trustNumber: [
    { required: true, message: "请输入委托单号", trigger: "blur" },
    { validator: checkTrustNumberUnique, trigger: "blur" }
  ],
  projectType: [
    { required: true, message: "请选择项目类型", trigger: "change" },
  ],
  sampleType: [
    { required: true, message: "请选择采样/送样类型", trigger: "change" },
  ],
  isSubcontract: [
    { required: true, message: "请选择是否分包", trigger: "change" },
  ],
  testType: [{ required: true, message: "选择检测类别", trigger: "change" }],
  completionTime: [
    { required: true, message: "请选择完成时间", trigger: "change" },
  ],
  handlerPhone: [
    { required: true, message: "请输入受理人电话", trigger: "blur" },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: "请输入正确的手机号码",
      trigger: "blur",
    },
  ],
  clientEmail: [
    { required: true, message: "请输入邮箱地址", trigger: "blur" },
    {
      type: "email",
      message: "请输入正确的邮箱地址",
      trigger: ["blur", "change"],
    },
  ],
  clientPhone: [
    { required: true, message: "请输入联系人电话", trigger: "blur" },
    {
      pattern:
        /^(1[3-9]\d{9}|(?:(?:0\d{2,3}[-]?[1-9]\d{6,7})|(?:[48]00[-]?[1-9]\d{6})))$/,
      message: "请输入正确的电话号码",
      trigger: "blur",
    },
  ],
};

const cancel = () => {
  // 使用 ElMessageBox 来确认用户是否真的要取消
  ElMessageBox.confirm("确定要取消吗？未保存的内容将会丢失。", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取",
    type: "warning",
  })
    .then(() => {
      // 用户确认后，返回上一页
      //   router.go(-1);
      localStorage.removeItem("draft");
      // router.push("/");
      router.go(-1);
    })
    .catch(() => {
      // 用户取消操作，不做任何处理
    });
};


const saveAsDraft = async () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        // 构建请求数据
        const formData = new FormData();
        formData.append('order_number', form.trustNumber);
        formData.append('project_name', form.projectName);
        formData.append('tested_company_name', form.unitName);
        formData.append('sampling_or_delivery', form.sampleType === "sampling" ? "采样" : "送样");
        formData.append('sampling_address', form.sampleAddress);
        formData.append('delivery_sample_time', formatDate(form.deliveryTime));
        formData.append('wttime', formatDate(form.entrustmentTime));
        formData.append('is_subcontract', form.isSubcontract ? "是" : "否");
        formData.append('test_category', form.testType || form.otherTestType);
        formData.append('deadline', formatDate(form.completionTime));
        formData.append('project_note', form.projectNote);
        formData.append('client_company_name', form.clientCompany);
        formData.append('client_company_address', form.clientAddress);
        formData.append('client_contact_person', form.clientContact);
        formData.append('client_contact_tel', form.clientPhone);
        formData.append('client_email', form.clientEmail);
        formData.append('handled_by', form.handlerName);
        formData.append('handled_by_tel', form.handlerPhone);
        // 发送保存草稿请求
        const response = await request({
          url: '/lipu/flow/order/order_add_cg',
          method: 'POST',
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        if (response.code === 1) {
          ElMessage.success('草稿保存成功');
          setTimeout(() => {
            router.push('/trust-list');
          }, 1000);
        } else {
          // console.log(response.msg);
          ElMessage.error(response.msg || '保存失败');
        }
      } catch (error) {
        console.error('保存草稿失败:', error);
        // ElMessage.error('保存草稿失败');
      }
    } else {
      console.log("表单验证失败");
      //   ElMessage.error('请正确填写必填项');
      return false;
    }
  });

};

const submitForm = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      console.log("表单验证通过");
      const formData = { ...form };
      const params = {
        order_number: formData.trustNumber,
        project_name: formData.projectName,
        tested_company_name: formData.unitName,
        sampling_or_delivery: formData.sampleType === "sampling" ? "采样" : "送样",
        sampling_address: formData.sampleAddress,
        delivery_sample_time: formatDate(formData.deliveryTime),
        wttime: formatDate(formData.entrustmentTime),
        is_subcontract: formData.isSubcontract ? "是" : "否",
        test_category: formData.testType || formData.otherTestType,
        deadline: formatDate(formData.completionTime),
        project_note: formData.projectNote,
        client_company_name: formData.clientCompany,
        client_company_address: formData.clientAddress,
        client_contact_person: formData.clientContact,
        client_contact_tel: formData.clientPhone,
        client_email: formData.clientEmail,
        handled_by: formData.handlerName,
        handled_by_tel: formData.handlerPhone,
      };
      localStorage.setItem("draft", JSON.stringify(params));
      const id = route.params.id;
      router.push(`/trust-add-two${id ? `/${id}` : ''}`);
    } else {
      console.log("表单验证失败");
      return false;
    }
  });


};


const fetchOrderDetail = async (orderId) => {
  try {
    const response = await request({
      url: `lipu/flow/order/get_single_order`,
      method: "GET",
      params: { order_id: orderId }
    });

    if (response.code === 1) {
      const data = response.data.order;
      form.trustNumber = data.order_number;
      form.projectName = data.project_name;
      form.projectType = data.project_name ? 'project' : 'unit';
      form.unitName = data.tested_company_name;
      form.sampleType = data.sampling_or_delivery === '采样' ? 'sampling' : 'delivery';
      form.sampleAddress = data.sampling_address;
      form.deliveryTime = data.delivery_sample_time;
      form.isSubcontract = data.is_subcontract === '是';
      form.testType = data.test_category;
      form.completionTime = data.deadline;
      form.entrustmentTime = data.wttime;
      form.projectNote = data.project_note;
      form.clientCompany = data.client_company_name;
      form.clientAddress = data.client_company_address;
      form.clientContact = data.client_contact_person;
      form.clientPhone = data.client_contact_tel;
      form.clientEmail = data.client_email;
      form.handlerName = data.handled_by;
      form.handlerPhone = data.handled_by_tel;
    }
  } catch (error) {
    console.error("获取委托单详情失败:", error);
  }
};
onMounted(() => {
  // 检查是否是带id
  const id = route.params.id;
  if (id) {
    fetchOrderDetail(id);
  } else {
    const draftData = JSON.parse(localStorage.getItem('draft') || '{}');
    if (Object.keys(draftData).length > 0) {
      form.trustNumber = draftData.order_number;
      form.projectName = draftData.project_name;
      form.projectType = draftData.project_name ? 'project' : 'unit';
      form.unitName = draftData.tested_company_name;
      form.sampleType = draftData.sampling_or_delivery === '采样' ? 'sampling' : 'delivery';
      form.sampleAddress = draftData.sampling_address;
      form.deliveryTime = draftData.delivery_sample_time;
      form.isSubcontract = draftData.is_subcontract === '是';
      form.testType = draftData.test_category;
      form.completionTime = draftData.deadline;
      form.entrustmentTime = draftData.wttime;
      form.projectNote = draftData.project_note;
      form.clientCompany = draftData.client_company_name;
      form.clientAddress = draftData.client_company_address;
      form.clientContact = draftData.client_contact_person;
      form.clientPhone = draftData.client_contact_tel;
      form.clientEmail = draftData.client_email;
      form.handlerName = draftData.handled_by;
      form.handlerPhone = draftData.handled_by_tel;
    }

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
