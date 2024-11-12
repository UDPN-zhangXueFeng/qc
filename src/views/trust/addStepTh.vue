<template>
    <div class="trust-form">
      <el-steps :active="3" finish-status="success" simple>
        <el-step title="填写基本信息" />
        <el-step title="添加技术方案" />
        <el-step title="提交结果" />
      </el-steps>
  
      <el-card class="mb-4 mt-4">
        <div class="success-content">
          <el-icon class="success-icon" :size="64" color="#67C23A">
            <CircleCheckFilled />
          </el-icon>
          <h2 class="success-title">提交成功</h2>
          <p class="success-message">等待审批中...</p>
          <div class="success-actions">
            <el-button @click="backToList">返回委托单列表</el-button>
            <el-button type="primary" @click="viewDetails">查看详情</el-button>
          </div>
        </div>
      </el-card>
    </div>
  </template>
  
  <script setup lang="ts">
  import { CircleCheckFilled } from '@element-plus/icons-vue'
  import { useRouter,useRoute } from 'vue-router'
  
  const router = useRouter()
  const route = useRoute()
  const backToList = () => {
    // 实现返回委托单列表的逻辑
    router.push('/trust-list') // 假设列表页面的路由是 '/trust-list'
  }
  
  const viewDetails = () => {
    // 实现查看详情的逻辑
    const id = route.params.id
    router.push(`/trust-detail/${id}`) // 假设详情页面的路由是 '/trust-details'
  }
  </script>
  
  <style scoped>
  .trust-form {
    /* max-width: 1000px; */
    margin: 0 auto;
  }
  
  .success-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px 0;
  }
  
  .success-icon {
    margin-bottom: 20px;
  }
  
  .success-title {
    font-size: 24px;
    color: #67C23A;
    margin-bottom: 10px;
  }
  
  .success-message {
    font-size: 16px;
    color: #606266;
    margin-bottom: 30px;
  }
  
  .success-actions {
    display: flex;
    gap: 16px;
  }
  </style>