<template>
    <div class="qc-edit-page">
        <div class="task-detail" v-if="taskDetail">
            <el-card class="mb-4">
                <template #header>
                    <div class="card-header">
                        <span>编辑质控通知单</span>
                    </div>
                </template>

                <el-descriptions :column="4" border>
                    <el-descriptions-item label="关联任务单号">{{
                        taskDetail.task_number
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
                <el-form ref="noticeFormRef" :model="noticeForm" :rules="rules" label-width="120px">
                    <el-form-item label="质控通知单号" prop="notice_number" required>
                        <el-input v-model="noticeForm.notice_number" placeholder="请输入质控通知单号"></el-input>
                    </el-form-item>
                    <el-form-item label="有关科室" prop="related_offices" required>
                        <el-checkbox-group v-model="noticeForm.related_offices">
                            <el-checkbox label="质控室"></el-checkbox>
                            <el-checkbox label="采样室"></el-checkbox>
                            <el-checkbox label="分析室"></el-checkbox>
                            <el-checkbox label="业务报告室"></el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-form>
            </el-card>

            <!-- 采样表格部分与create页面相同 -->
            <el-card class="mb-4">
                <template #header>
                    <div class="card-header">
                        <span>采样</span>
                        <el-button type="primary" @click="addSamplingItem">添加</el-button>
                    </div>
                </template>
                <el-table :data="samplingItems" border style="width: 100%">
                    <el-table-column type="index" label="序号" width="50"></el-table-column>
                    <el-table-column label="操作" width="100">
                        <template #default="scope">
                            <el-button type="text" @click="editSamplingItem(scope.row)">编辑</el-button>
                            <el-button type="text" @click="deleteSamplingItem(scope.$index)">删除</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column prop="sample_category" label="样品类别"></el-table-column>
                    <el-table-column prop="test_params" label="检测参数"></el-table-column>
                    <el-table-column prop="quality_control" label="质控措施">
                        <template #default="scope">
                            <div class="flex items-center">
                                <el-input v-model="scope.row.qualityControlValue" placeholder="请输入数值"
                                    style="width: 30%; margin-right: 10px;">
                                </el-input>
                                <el-select v-model="scope.row.quality_control" placeholder="请选择"
                                    @change="handleQualityControlChange(scope.row)" style="width: 50%;">
                                    <el-option label="现场平行样/批" value="现场平行样/批"></el-option>
                                    <el-option label="全程序空白样/批" value="全程序空白样/批"></el-option>
                                    <el-option label="现场空白样/批" value="现场空白样/批"></el-option>
                                    <el-option label="运输空白样/批" value="运输空白��/批"></el-option>
                                    <el-option label="密码样/批" value="密码样/批"></el-option>
                                    <el-option label="加标样/批" value="加标样/批"></el-option>
                                    <el-option label="自定义" value="custom"></el-option>
                                    <el-option v-for="option in dynamicOptions" :key="option" :label="option"
                                        :value="option"></el-option>
                                </el-select>
                            </div>
                            <el-input class="mt-3" v-if="scope.row.quality_control === 'custom'"
                                v-model="scope.row.customOption" placeholder="请输入自定义选项"
                                @keyup.enter="addCustomOption(scope.row)">
                                <template #append>
                                    <el-button @click="addCustomOption(scope.row)">添加</el-button>
                                </template>
                            </el-input>
                        </template>
                    </el-table-column>
                    <el-table-column prop="note" label="备注">
                        <template #default="scope">
                            <el-input v-model="scope.row.note" placeholder="请输入备注"></el-input>
                        </template>
                    </el-table-column>
                </el-table>
            </el-card>

            <!-- 分析表格部分与create页面相同 -->
            <el-card>
                <template #header>
                    <div class="card-header">
                        <span>分析</span>
                        <el-button type="primary" @click="addAnalysisItem">添加</el-button>
                    </div>
                </template>
                <el-table :data="analysisItems" border style="width: 100%">
                    <el-table-column type="index" label="序号" width="50"></el-table-column>
                    <el-table-column label="操作" width="100">
                        <template #default="scope">
                            <el-button type="text" @click="editAnalysisItem(scope.row)">编辑</el-button>
                            <el-button type="text" @click="deleteAnalysisItem(scope.$index)">删除</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column prop="sample_category" label="样品类别"></el-table-column>
                    <el-table-column prop="test_params" label="检测参数"></el-table-column>
                    <el-table-column prop="quality_control" label="质控措施">
                        <template #default="scope">
                            <el-input v-model="scope.row.quality_control" placeholder="请输入质控措施"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column prop="note" label="备注">
                        <template #default="scope">
                            <el-input v-model="scope.row.note" placeholder="请输入备注"></el-input>
                        </template>
                    </el-table-column>
                </el-table>
            </el-card>
        </div>

        <SlidingPanel v-model="panelVisible" :taskId="route.params.taskId as string" @confirm="handlePanelConfirm" />
        <SlidingPanel v-model="panelVisible1" :taskId="route.params.taskId as string" @confirm="handlePanelConfirm1" />

        <div class="fixed-bottom">
            <div class="button-container">
                <el-button @click="goBack">取消</el-button>
                <el-button @click="saveNotice">提交</el-button>
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
import SlidingPanel from '@/components/SlidingPanel.vue';

const router = useRouter();
const route = useRoute();

// 初始化数据
const taskDetail = ref<any>(null);
const noticeForm = ref({
    notice_number: "",
    related_offices: [],
});
const samplingItems = ref([]);
const analysisItems = ref([]);
const panelVisible = ref(false);
const panelVisible1 = ref(false);

// 动态选项
const dynamicOptions = ref<string[]>([]);

// 处理质控措施变化
const handleQualityControlChange = (row: any) => {
    if (row.quality_control === 'custom') {
        row.customOption = ''; // 清空自定义输入
    }
};

// 添加自定义选项
const addCustomOption = (row: any) => {
    if (row.customOption && !dynamicOptions.value.includes(row.customOption)) {
        dynamicOptions.value.push(row.customOption);
        row.quality_control = row.customOption;
        row.customOption = ''; // 清空输入框
    }
};

// 添加采样项目
const addSamplingItem = () => {
    panelVisible.value = true;
};

// 编辑采样项目
const editSamplingItem = (item: any) => {
    // 实现编辑逻辑
};

// 删除采样项目
const deleteSamplingItem = (index: number) => {
    samplingItems.value.splice(index, 1);
};

// 添加分析项目
const addAnalysisItem = () => {
    panelVisible1.value = true;
};

// 编辑分析项目
const editAnalysisItem = (item: any) => {
    // 实现编辑逻辑
};

// 删除分析项目
const deleteAnalysisItem = (index: number) => {
    analysisItems.value.splice(index, 1);
};

// 处理面板确认
const handlePanelConfirm = (data: any) => {
    data.selectedItems.forEach((item: any) => {
        const newItem = {
            sample_category_id: data.selectedCategoryId,
            sample_category: item.sample_category,
            test_params: item.test_params,
            quality_control: "",
            qualityControlValue: "",
            note: ""
        };
        samplingItems.value.push(newItem);
    });
};

const handlePanelConfirm1 = (data: any) => {
    data.selectedItems.forEach((item: any) => {
        const newItem = {
            sample_category_id: data.selectedCategoryId,
            sample_category: item.sample_category,
            test_params: item.test_params,
            quality_control: "",
            note: ""
        };
        analysisItems.value.push({ ...newItem });
    });
};

// 返回上一页
const goBack = () => {
    router.go(-1);
};

// 保存通知
const saveNotice = async () => {
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
                formData.append('qc_id', route.params.id as string);
                formData.append('order_id', route.params.orderId as string);
                formData.append('task_id', route.params.taskId as string);
                formData.append('qc_number', noticeForm.value.notice_number);
                formData.append('qc_related_office', noticeForm.value.related_offices.join(','));

                // 处理采样方法数据
                const qcsamplingmethod = samplingItems.value.map((item: any) => ({
                    sample_category_id: item.sample_category_id,
                    sample_category: item.sample_category,
                    test_params: Array.isArray(item.test_params) ? item.test_params.join(',') : item.test_params,
                    sampling_qc_method_a: item.qualityControlValue + item.quality_control,
                    sampling_qc_method_b: item.qualityControlValue + item.quality_control, // 可能需要根据实际情况调整
                    sampling_qc_note: item.note || ''
                }));
                formData.append('qcsamplingmethod', JSON.stringify(qcsamplingmethod));

                // 处理分析方法数据
                const qcanalysismethod = analysisItems.value.map((item: any) => ({
                    sample_category_id: item.sample_category_id,
                    sample_category: item.sample_category,
                    analysis_params: Array.isArray(item.test_params) ? item.test_params.join(',') : item.test_params,
                    analysis_qc_method: item.quality_control,
                    analysis_qc_note: item.note || ''
                }));
                formData.append('qcanalysismethod', JSON.stringify(qcanalysismethod));

                const response: any = await request({
                    url: 'lipu/flow/qc/edit_qc',
                    method: 'POST',
                    data: formData,
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                if (response.code === 1) {
                    ElMessage.success("修改成功");
                    router.push('/qc-list');
                } else {
                    //   ElMessage.error(response.msg || "保存失败");
                }
            } catch (error) {
                console.error("Error saving notice:", error);
                // ElMessage.error("保存失败");
            }
        } else {
            console.log('Validation failed:', fields);
        }
    });
};

// 添加表单验证规则
const rules = {
    notice_number: [
        { required: true, message: '请输入质控通知单号', trigger: 'blur' }
    ],
    related_offices: [
        { type: 'array', required: true, message: '请选择至少一个有关科室', trigger: 'change' }
    ]
};

// 添加表单引用
const noticeFormRef = ref<FormInstance>();

// 获取质控单详情
const fetchQcDetail = async () => {
    try {
        const response: any = await request({
            url: 'lipu/flow/qc/get_single_qc',
            method: 'GET',
            params: {
                qc_id: route.params.id
            }
        });

        if (response.code === 1) {
            const { data } = response;

            // 设置基本信息
            taskDetail.value = {
                task_number: data.task_info.task_number,
                order_number: data.order_info.order_number,
                project_name: data.order_info.project_name,
                task_related_office: data.task_info.task_related_office,
                sampling_address: data.order_info.sampling_address,
                deadline: data.order_info.deadline
            };

            // 设置通知表单数据
            noticeForm.value = {
                notice_number: data.qc_info.qc_number,
                related_offices: data.qc_info.qc_related_office.split(',')
            };

            // 设置采样项目
            samplingItems.value = data.qcsamplingmethod_info.map((item: any) => ({
                sample_category_id: item.sample_category_id,
                sample_category: item.sample_category,
                test_params: item.test_params.split(','),
                quality_control: item.sampling_qc_method_a,
                qualityControlValue: extractQualityControlValue(item.sampling_qc_method_a),
                note: item.sampling_qc_note
            }));

            // 设置分析项目
            analysisItems.value = data.qcanalysismethod_info.map((item: any) => ({
                sample_category_id: item.sample_category_id,
                sample_category: item.sample_category,
                test_params: item.analysis_params.split(','),
                quality_control: item.analysis_qc_method,
                note: item.analysis_qc_note
            }));
        }
    } catch (error) {
        console.error('获取质控单详情失败:', error);
        ElMessage.error('获取质控单详情失败');
    }
};

// 从质控措施中提取数值
const extractQualityControlValue = (method: string) => {
    const match = method.match(/^(\d+)/);
    return match ? match[1] : '';
};

onMounted(() => {
    fetchQcDetail();
});
</script>

<style scoped>
/* 样式与create页面相同 */
.qc-edit-page {
    position: relative;
    min-height: 100vh;
    padding-bottom: 60px;
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