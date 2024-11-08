<template>
    <div class="trust-form">
        <el-form :model="form" :rules="rules" ref="formRef" label-width="120px" class="mt-4 pb-20">
            <el-card class="mb-4">
                <template #header>
                    <div class="card-header">
                        <span>编辑基本信息</span>
                    </div>
                </template>

                <el-form-item label="委托单号" prop="trustNumber" required>
                    <el-input v-model="form.trustNumber" class="w-64" placeholder="后续单号">
                    </el-input>
                </el-form-item>

                <el-form-item label="项目/单位" prop="projectType" required class="flex items-center">
                    <div class="flex items-center space-x-4 flex-grow">
                        <el-radio-group v-model="form.projectType" class="flex-shrink-0">
                            <el-radio label="project">项目名称</el-radio>
                            <el-radio label="unit">受检单位名称</el-radio>
                        </el-radio-group>
                        <el-input v-if="form.projectType === 'project'" v-model="form.projectName" class="flex-grow"
                            placeholder="请输入项目名" />
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
                    <el-input v-if="form.testType === '其他'" v-model="form.otherTestType" class="w-64 ml-2"
                        placeholder="请输入" />
                </el-form-item>

                <el-form-item label="完成时间" prop="completionTime" required>
                    <el-date-picker v-model="form.completionTime" type="date" placeholder="��选择" />
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

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter, useRoute } from "vue-router";
import request from "@/utils/request";
import { formatDate } from "@/utils/dateUtils";
import type { FormInstance } from 'element-plus'

const router = useRouter();
const route = useRoute();
const formRef = ref<FormInstance | null>(null);

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
    projectType: [{ required: true, message: "请选择项目类型", trigger: "change" }],
    sampleType: [{ required: true, message: "请选择采样/送样类型", trigger: "change" }],
    isSubcontract: [{ required: true, message: "请选择是否分包", trigger: "change" }],
    testType: [{ required: true, message: "请选择检测类别", trigger: "change" }],
    completionTime: [{ required: true, message: "请选择完成时间", trigger: "change" }],
    handlerPhone: [
        { required: true, message: "请输入受理人电话", trigger: "blur" },
        { pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号码", trigger: "blur" },
    ],
    clientEmail: [
        { required: true, message: "请输入邮箱地址", trigger: "blur" },
        { type: "email", message: "请输入正确的邮箱地址", trigger: ["blur", "change"] },
    ],
    clientPhone: [
        { required: true, message: "请输入联系人电话", trigger: "blur" },
        {
            pattern: /^(1[3-9]\d{9}|(?:(?:0\d{2,3}[-]?[1-9]\d{6,7})|(?:[48]00[-]?[1-9]\d{6})))$/,
            message: "请输入正确的电话号码",
            trigger: "blur",
        },
    ],
};
const saveAsDraft = async () => {
  if (!formRef.value) return;
  formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      console.log("表单验证通过");

      console.log(form);
      // 创建一个新对象，包含 form 中的所有属性
      // const formData = { ...form };
      try {
        // 从 localStorage 获取第一步保存的数据
        // const draftData = JSON.parse(localStorage.getItem('draft') || '{}');

        // 构建请求数据
        const formData = new FormData();

        // 添加第一步的表单数据
        // Object.entries(form).forEach(([key, value]) => {
        //   formData.append(key, value);
        // });
        formData.append('order_number', form.trustNumber);
        formData.append('project_name', form.projectName);
        formData.append('tested_company_name', form.unitName);
        formData.append('sampling_or_delivery', form.sampleType === "sampling" ? "采样" : "送样");
        formData.append('sampling_address', form.sampleAddress);
        formData.append('delivery_sample_time', formatDate(form.entrustmentTime));
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
        // 添加当前页面的技术方案数据
        // formData.append('test_params', JSON.stringify(tableData.value));
        console.log("formData", formData);
        // 发送保存草稿请求
        const response:any = await request({
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
          // ElMessage.error(response.msg || '保存失败');
        }
      } catch (error) {
        console.error('保存草稿失败:', error);
        // ElMessage.error('保存草稿失败');
      }
    } else {
      console.log("表单验证失败");
      return;
    }
  });

};

// 获取委托单详情
const fetchOrderDetail = async (orderId: string) => {
    try {
        const response: any = await request({
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
            form.entrustmentTime = data.createtime;
            form.projectNote = data.project_note;
            form.clientCompany = data.client_company_name;
            form.clientAddress = data.client_company_address;
            form.clientContact = data.client_contact_person;
            form.clientPhone = data.client_contact_tel;
            form.clientEmail = data.client_email;
            form.handlerName = data.handled_by;
            form.handlerPhone = data.handled_by_tel;
        } else {
            ElMessage.error(response.msg || '获取委托单详情失败');
        }
    } catch (error) {
        console.error("获取委托单详情失败:", error);
        ElMessage.error('获取委托单详情失败');
    }
};

onMounted(() => {
    const orderId = route.params.id as string;
    if (orderId) {
        fetchOrderDetail(orderId);
    }
});

const submitForm = () => {
    if (!formRef.value) return
    formRef.value.validate(async (valid: boolean) => {
        if (valid) {
            try {
                const formData = new FormData();
                formData.append('order_id', route.params.id as string);
                formData.append('order_number', form.trustNumber);
                formData.append('project_name', form.projectType === 'project' ? form.projectName : '');
                formData.append('tested_company_name', form.projectType === 'unit' ? form.unitName : '');
                formData.append('sampling_or_delivery', form.sampleType === 'sampling' ? '采样' : '送样');
                formData.append('sampling_address', form.sampleAddress);
                formData.append('delivery_sample_time', formatDate(form.entrustmentTime));
                formData.append('is_subcontract', form.isSubcontract ? '是' : '否');
                formData.append('test_category', form.testType === '其他' ? form.otherTestType : form.testType);
                formData.append('deadline', formatDate(form.completionTime));
                formData.append('project_note', form.projectNote);
                formData.append('client_company_name', form.clientCompany);
                formData.append('client_company_address', form.clientAddress);
                formData.append('client_contact_person', form.clientContact);
                formData.append('client_contact_tel', form.clientPhone);
                formData.append('client_email', form.clientEmail);
                formData.append('handled_by', form.handlerName);
                formData.append('handled_by_tel', form.handlerPhone);

                const response: any = await request.post("lipu/flow/order/edit_order", formData);

                if (response?.code === 1) {
                    //   ElMessage.success("保存成功");
                    router.push(`/trust-edit-two/${route.params.id}`);
                } else {
                    //   ElMessage.error(response?.msg || "保存失败");
                }
            } catch (error) {
                console.error("保存失败:", error);
                //   ElMessage.error("保存失败");
            }
        }
    });
};

const cancel = () => {
    router.push(`/trust-list`);
    return;
    ElMessageBox.confirm("确定要取消编辑吗？未保存的修改将会丢失。", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
    })
        .then(() => {
            router.go(-1);
        })
        .catch(() => {
            // 用户取消操作
        });
};
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