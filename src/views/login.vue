<template>
    <!-- 登录页面的模板内容 -->
  <button @click="goToTrustList">Go to Trust List</button>
</template>
  
<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import request from '@/utils/request';
import {
  useRouter
} from 'vue-router';

export default defineComponent({
  name: 'Login',
  setup() {
    const router = useRouter();

    const login = async () => {
      const formData = new FormData();
      formData.append('username', 'admin');
      formData.append('password', 'admin123456');
      formData.append('__token__', '');
  
      try {
        const response = await request({
          method: 'post',
          url: '/index/login',
          headers: {
            'User-Agent': 'Apifox/1.0.0 (https://apifox.com)',
          },
          data: formData,
        });
        console.log(JSON.stringify(response));
      } catch (error) {
        console.error('Login error:', error);
      }
    };
  
    const goToTrustList = () => {
      router.push('/trust-list');
    };

    onMounted(() => {
      login();
    });
  
    return {
      goToTrustList, // Add this line to expose the method
    };
  },
});
</script>
  
<style scoped>
/* 样式内容 */
</style>
