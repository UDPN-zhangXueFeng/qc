<template>
  <div class="trust-form">
    <el-steps :active="1" finish-status="success" simple>
      <el-step title="填写基本信息" />
      <el-step title="添加检测参数" />
      <el-step title="提交结果" />
    </el-steps>

    <el-form
      :model="form"
      :rules="rules"
      ref="formRef"
      label-width="120px"
      class="mt-4 pb-20"
    >
      <el-card class="mb-4">
        <template #header>
          <div class="card-header">
            <span>填写基本信息</span>
            <!-- <el-button text>折叠</el-button> -->
          </div>
        </template>

        <el-form-item label="委托单号" prop="trustNumber" required>
          <el-input
            v-model="form.trustNumber"
            class="w-64"
            placeholder="后续单号"
          >
            <template #prepend>LPWT</template>
          </el-input>
        </el-form-item>

        <el-form-item
          label="项目/单位"
          prop="projectType"
          required
          class="flex items-center"
        >
          <div class="flex items-center space-x-4 flex-grow">
            <el-radio-group v-model="form.projectType" class="flex-shrink-0">
              <el-radio label="project">项目名称</el-radio>
              <el-radio label="unit">受检单位名称</el-radio>
            </el-radio-group>
            <el-input
              v-if="form.projectType === 'project'"
              v-model="form.projectName"
              class="flex-grow"
              placeholder="请输入项目名称"
            />
            <el-input
              v-if="form.projectType === 'unit'"
              v-model="form.unitName"
              class="flex-grow"
              placeholder="请输入受检单位名称"
            />
          </div>
        </el-form-item>

        <el-form-item
          label="采样/送样"
          prop="sampleType"
          required
          class="flex items-center"
        >
          <div class="flex items-center space-x-4 flex-grow">
            <el-radio-group v-model="form.sampleType" class="flex-shrink-0">
              <el-radio label="sampling">采样（点位名称）</el-radio>
              <el-radio label="delivery">送样（来样名称）</el-radio>
            </el-radio-group>
            <el-input
              v-if="form.sampleType === 'sampling'"
              v-model="form.sampleAddress"
              class="flex-grow"
              placeholder="请输入采样地址"
            />
            <el-date-picker
              v-if="form.sampleType === 'delivery'"
              v-model="form.deliveryTime"
              type="date"
              placeholder="请选择送样时间"
              class="w-64"
            />
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
          <el-input
            v-if="form.testType === 'other'"
            v-model="form.otherTestType"
            class="w-64 ml-2"
            placeholder="请输入"
          />
        </el-form-item>

        <el-form-item label="完成时间" prop="completionTime" required>
          <el-date-picker
            v-model="form.completionTime"
            type="date"
            placeholder="请选择"
          />
        </el-form-item>

        <el-form-item label="受托时间">
          <el-date-picker
            v-model="form.entrustmentTime"
            type="date"
            placeholder="默认今天"
            :disabled="false"
          />
        </el-form-item>

        <el-form-item label="项目备注">
          <el-input
            v-model="form.projectNote"
            type="textarea"
            :rows="3"
            placeholder="请输入"
          />
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
          <el-form-item
            label="单位名称"
            class="w-full sm:w-1/2 md:w-1/3 px-2 mb-4"
          >
            <el-input v-model="form.clientCompany" placeholder="请输入" />
          </el-form-item>

          <el-form-item
            label="单位地址"
            class="w-full sm:w-1/2 md:w-1/3 px-2 mb-4"
          >
            <el-input v-model="form.clientAddress" placeholder="请输入" />
          </el-form-item>

          <el-form-item
            label="联系人"
            class="w-full sm:w-1/2 md:w-1/3 px-2 mb-4"
          >
            <el-input v-model="form.clientContact" placeholder="请输入" />
          </el-form-item>

          <el-form-item
            label="联系人电话"
            prop="clientPhone"
            class="w-full sm:w-1/2 md:w-1/3 px-2 mb-4"
          >
            <el-input v-model="form.clientPhone" placeholder="请输入" />
          </el-form-item>

          <el-form-item
            label="邮箱"
            prop="clientEmail"
            class="w-full sm:w-1/2 md:w-1/3 px-2 mb-4"
          >
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

          <el-form-item
            label="受理人电话"
            prop="handlerPhone"
            class="w-full sm:w-1/2 px-2 mb-4"
          >
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
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router"; // 导入 useRouter
import request from "@/utils/request"; // 确保路径正确
import { formatDate } from "@/utils/dateUtils";

const router = useRouter(); // 获取 router 实例
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

const rules = {
  trustNumber: [{ required: true, message: "请输入委托单号", trigger: "blur" }],
  projectType: [
    { required: true, message: "请选择项目类型", trigger: "change" },
  ],
  sampleType: [
    { required: true, message: "请选择采样/送样类型", trigger: "change" },
  ],
  isSubcontract: [
    { required: true, message: "请选择是否分包", trigger: "change" },
  ],
  testType: [{ required: true, message: "请选择检测类别", trigger: "change" }],
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
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      // 用户确认后，返回上一页
    //   router.go(-1);
    router.push("/");
    })
    .catch(() => {
      // 用户取消操作，不做任何处理
    });
};

const saveAsDraft = () => {
  // 实现保存为草稿的逻辑
  console.log("保存为草稿");
  ElMessage.success("已保存为草稿");
};

const submitForm = () => {
  router.push("/trust-add-two");
  return;
  formRef.value.validate((valid) => {
    if (valid) {
      console.log("表单验证通过");

      console.log(form);
      // 创建一个新对象，包含 form 中的所有属性
      const formData = { ...form };
      sendDataToServer(formData);
    } else {
      console.log("表单验证失败");
      //   ElMessage.error('请正确填写必填项');
      return false;
    }
  });
};
const sendDataToServer = async (data) => {
  try {
    const result = await ElMessageBox.confirm("确定要提交吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });

    if (result === "confirm") {
      const params = {
        order_number: data.trustNumber,
        project_name: data.projectName,
        tested_company_name: data.unitName,
        sampling_or_delivery: data.sampleType === "sampling" ? "采样" : "送样",
        sampling_address: data.sampleAddress,
        delivery_sample_time: formatDate(data.deliveryTime),
        is_subcontract: data.isSubcontract ? "是" : "否",
        test_category: data.testType || data.otherTestType,
        deadline: formatDate(data.completionTime),
        project_note: data.projectNote,
        client_company_name: data.clientCompany,
        client_company_address: data.clientAddress,
        client_contact_person: data.clientContact,
        client_contact_tel: data.clientPhone,
        client_email: data.clientEmail,
        handled_by: data.handlerName,
        handled_by_tel: data.handlerPhone,
      };
      console.log("params", params);
      const response = await request.post("lipu/flow/order/order_add", params);

      console.log("数据发送成功：", response);
      if (response?.code === 1) {
        // 暂时保存
        localStorage.setItem("order_id", response.data.order_id);
        ElMessage.success("数据提交成功");
        router.push("/");
      } else {
        ElMessage.error("数据提交失败");
      }
    }
  } catch (error) {
    if (error !== "cancel") {
      console.error("发送数据时出错：", error);
      ElMessage.error("发送数据时出错");
    }
  }
};
</script>

<style scoped>
.trust-form {
  max-width: 1000px;
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
  max-width: 1000px;
  margin: 0 auto;
  padding: 16px;
  display: flex;
  justify-content: flex-end;
  gap: 16px;
}
</style>
