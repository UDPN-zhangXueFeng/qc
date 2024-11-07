<template>
    <div class="task-edit">
        <el-card class="mb-4">
            <template #header>
                <div class="card-header">
                    <span>编辑任务</span>
                </div>
            </template>

            <el-form ref="formRef" :model="formData" :rules="rules" label-width="120px">
                <el-form-item label="任务名称" prop="task_name" required>
                    <el-input v-model="formData.task_name" placeholder="请输入任务名称" />
                </el-form-item>

                <el-form-item label="任务编号" prop="task_number" required>
                    <el-input v-model="formData.task_number" disabled />
                </el-form-item>

                <el-form-item label="检测周期" prop="test_period" required>
                    <el-select v-model="formData.test_period" placeholder="请选择检测周期">
                        <el-option label="周检" value="周检"></el-option>
                        <el-option label="月检" value="月检"></el-option>
                        <el-option label="季检" value="季检"></el-option>
                        <el-option label="半年检" value="半年检"></el-option>
                        <el-option label="年检" value="年检"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="有关科室" prop="task_related_office" required>
                    <el-checkbox-group v-model="formData.task_related_office">
                        <el-checkbox label="采样室"></el-checkbox>
                        <el-checkbox label="质控室"></el-checkbox>
                        <el-checkbox label="分析室"></el-checkbox>
                        <el-checkbox label="业务报告室"></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>

                <el-form-item label="采样地点" prop="task_address" required>
                    <el-input v-model="formData.task_address" placeholder="请输入采样地点" />
                </el-form-item>

                <el-form-item label="任务备注" prop="task_note">
                    <el-input v-model="formData.task_note" type="textarea" :rows="4" placeholder="请输入任务备注"></el-input>
                </el-form-item>
            </el-form>
        </el-card>

        <!-- 检测参数表格 -->
        <el-card class="mb-4">
            <template #header>
                <div class="card-header">
                    <span>检测参数</span>
                </div>
            </template>
            <el-table :data="tableData" border style="width: 100%">
                <el-table-column type="index" label="序号" width="60"></el-table-column>
                <el-table-column prop="sample_category" label="样品类别"></el-table-column>
                <el-table-column prop="point_name" label="点位名称"></el-table-column>
                <el-table-column prop="point_number" label="点位编码"></el-table-column>
                <el-table-column prop="test_parms" label="检测参数"></el-table-column>
                <el-table-column prop="test_period" label="检测周期"></el-table-column>
                <el-table-column prop="test_frequency" label="检测频次"></el-table-column>
                <el-table-column prop="test_days" label="检测天数"></el-table-column>
                <el-table-column prop="sampling_basis_number" label="采样依据"></el-table-column>
                <el-table-column prop="test_method_number" label="检测依据"></el-table-column>
                <el-table-column prop="execute_method_number" label="分析依据"></el-table-column>
                <el-table-column prop="limit_value" label="限值"></el-table-column>
                <el-table-column prop="sampling_params_note" label="备注"></el-table-column>
            </el-table>
        </el-card>

        <div class="fixed-bottom">
            <div class="button-container">
                <el-button @click="handleCancel">取消</el-button>
                <el-button type="primary" @click="handleSubmit">提交</el-button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'
import request from '@/utils/request'

const route = useRoute()
const router = useRouter()
const formRef = ref<FormInstance>()
const tableData = ref<TableItem[]>([])

interface TableItem {
    id: number | string
    [key: string]: any
}

interface FormData {
    task_name: string
    task_number: string
    test_period: string
    task_related_office: string[]
    task_address: string
    task_note: string
    order_id?: string
    orderparams_ids?: string
}

const formData = ref<FormData>({
    task_name: '',
    task_number: '',
    test_period: '',
    task_related_office: [],
    task_address: '',
    task_note: '',
})

const rules = {
    task_name: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
    task_related_office: [{ type: 'array', required: true, message: '请至少选择一个相关科室', trigger: 'change' }],
    task_address: [{ required: true, message: '请输入采样地点', trigger: 'blur' }],
    test_period: [{ required: true, message: '请选择检测周期', trigger: 'change' }],
}

// 获取任务详情
const fetchTaskDetail = async () => {
    try {
        const response: any = await request({
            url: `/lipu/flow/task/get_single_task`,
            method: 'GET',
            params: {
                task_id: route.params.id
            }
        })

        if (response.code === 1 && response.data) {
            // 从 response.data.order 中获取表单数据
            const orderData = response.data.order
            formData.value = {
                task_name: orderData.task_name,
                task_number: orderData.task_number,
                test_period: orderData.test_period,
                task_related_office: orderData.task_related_office.split(','),
                task_address: orderData.task_address || '',
                task_note: orderData.task_note || '',
                order_id: orderData.order_id,
                orderparams_ids: orderData.orderparams_ids
            }

            // 设置检测参数表格数据
            if (response.data.test_params) {
                tableData.value = response.data.test_params
            }
        } else {
            // ElMessage.error(response.msg || '获取任务详情失败')
        }
    } catch (error) {
        console.error('获取任务详情失败:', error)
        // ElMessage.error('获取任务详情失败')
    }
}

// 提交表单
const handleSubmit = async () => {
    if (!formRef.value) return

    await formRef.value.validate(async (valid: boolean) => {
        if (valid) {
            const formDataToSubmit = new FormData()

            // 添加必要的字段
            formDataToSubmit.append('task_id', route.params.id as string)
            formDataToSubmit.append('order_id', formData.value.order_id || '')
            formDataToSubmit.append('test_period', formData.value.test_period)
            formDataToSubmit.append('task_name', formData.value.task_name)
            formDataToSubmit.append('task_number', formData.value.task_number)
            formDataToSubmit.append('task_address', formData.value.task_address)
            formDataToSubmit.append('task_note', formData.value.task_note || '')
            
            // 处理数组类型的字段
            formDataToSubmit.append('task_related_office', formData.value.task_related_office.join(','))
            
            // 处理检测参数IDs
            const paramIds = tableData.value.map(item => item.id).join(',')
            formDataToSubmit.append('orderparams_ids', paramIds)

            try {
                const response: any = await request({
                    url: '/lipu/flow/task/edit_task',
                    method: 'POST',
                    data: formDataToSubmit,
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })

                if (response.code === 1) {
                    ElMessage.success('编辑成功')
                    router.push('/task-list')
                } else {
                    // ElMessage.error(response.msg || '保存失败')
                }
            } catch (error) {
                console.error('保存失败:', error)
                // ElMessage.error('保存失败')
            }
        }
    })
}

const handleCancel = () => {
    router.back()
}

onMounted(() => {
    fetchTaskDetail()
})
</script>

<style scoped>
.task-edit {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    padding-bottom: 60px;
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
</style>