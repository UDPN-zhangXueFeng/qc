<template>
    <el-card class="mb-4">
      <template #header>
        <div class="flex justify-between items-center">
          <span>{{ title }}</span>
          <el-button type="primary" @click="toggleCollapse">
            {{ isCollapsed ? '展开' : '折叠' }}
          </el-button>
        </div>
      </template>
      <div v-show="!isCollapsed">
        <slot></slot>
      </div>
    </el-card>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  
  const props = defineProps<{
    title: string;
  }>();
  
  const isCollapsed = ref(false);
  
  const toggleCollapse = () => {
    isCollapsed.value = !isCollapsed.value;
  };
  </script>