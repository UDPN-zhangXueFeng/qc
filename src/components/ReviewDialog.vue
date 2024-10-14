<template>
    <el-dialog
      title="审核"
      v-model="dialogVisible"
      width="50%"
      @close="handleClose"
    >
      <el-form :model="form" label-width="120px">
        <el-form-item label="审核结果">
          <el-radio-group v-model="form.result">
            <el-radio label="通过">通过</el-radio>
            <el-radio label="驳回">驳回</el-radio>
            <el-radio label="撤回">撤回</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审核意见">
          <el-input
            v-model="form.comment"
            type="textarea"
            :rows="4"
            placeholder="请输入审核意见"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { ElMessage } from 'element-plus';
  import request from '@/utils/request';
  import { useRouter, useRoute } from "vue-router";
  const router = useRouter();
  
  // 使用 defineProps 宏，不需要导入
  const props = defineProps<{
    orderId: number | string;
  }>();
  
  // 使用 defineEmits 宏，不需要导入
  const emit = defineEmits<{
    (e: 'close'): void
    (e: 'success'): void
  }>();
  
  const dialogVisible = ref(false);
  const form = ref({
    result: '',
    comment: ''
  });
  
  const open = () => {
    dialogVisible.value = true;
  };
  
  const handleClose = () => {
    dialogVisible.value = false;
    emit('close');
  };
  
  const handleSubmit = async () => {
    console.log(form.value);
    if (!form.value.result) {
      ElMessage.warning('请选择审核结果');
      return;
    }
  
    try {
      const response = await request.post('lipu/flow/order/audit', {
        order_id: props.orderId,
        operate: form.value.result,
        operate_note: form.value.comment
      });
  
      if (response.code === 1) {
        ElMessage.success('审核成功');
        emit('success');
        handleClose();
        router.push('/');
      } else {
        ElMessage.error(response.message || '审核失败');
      }
    } catch (error) {
      console.error('审核失败:', error);
      ElMessage.error('审核失败，请稍后重试');
    }
  };
  
  defineExpose({ open });
  </script>
