<template>
  <div class="point-map-container">
    <el-upload
      class="upload-demo"
      action="#"
      :http-request="uploadPointMap"
      :show-file-list="false"
      accept="image/*"
    >
      <el-button type="primary">+ 新增点位图</el-button>
    </el-upload>
    <div class="point-map-grid">
      <div v-for="(image, index) in pointMapImages" :key="index" class="point-map-item">
        <el-image 
          :src="image.url" 
          :preview-src-list="[image.url]"
          fit="cover"
          class="point-map-image"
        >
          <template #error>
            <div class="image-slot">
              <el-icon><picture-filled /></el-icon>
            </div>
          </template>
        </el-image>
        <div class="point-map-overlay">
          <el-upload
            class="upload-demo"
            action="#"
            :http-request="(file) => reuploadPointMap(index, file)"
            :show-file-list="false"
            accept="image/*"
          >
            <el-button type="primary" icon="el-icon-upload">重新上传</el-button>
          </el-upload>
          <el-button type="danger" icon="el-icon-delete" @click="deletePointMap(index)">删除</el-button>
        </div>
        <span class="point-map-name">{{ image.name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import request from "@/utils/request";
import { ElMessage, ElMessageBox } from 'element-plus';
import { PictureFilled } from '@element-plus/icons-vue'

const props = defineProps({
  taskId: {
    type: String,
    required: true
  }
});

const pointMapImages = ref([]);

const uploadPointMap = async (options) => {
  try {
    const formData = new FormData();
    formData.append('file', options.file);
    formData.append('task_id', props.taskId);

    const response = await request.post('/api/point-maps', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    if (response.code === 1) {
      ElMessage.success('上传成功');
      await fetchPointMaps();
    } else {
      ElMessage.error(response.msg || '上传失败');
    }
  } catch (error) {
    console.error('Error uploading point map:', error);
    ElMessage.error('上传失败');
  }
};

const reuploadPointMap = async (index: number, options) => {
  try {
    const formData = new FormData();
    formData.append('file', options.file);
    formData.append('task_id', props.taskId);
    formData.append('image_id', pointMapImages.value[index].id);

    const response = await request.put('/api/point-maps', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    if (response.code === 1) {
      ElMessage.success('重新上传成功');
      await fetchPointMaps();
    } else {
      // ElMessage.error(response.msg || '重新上传失败');
    }
  } catch (error) {
    console.error('Error reuploading point map:', error);
    // ElMessage.error('重新上传失败');
  }
};

const deletePointMap = async (index: number) => {
  try {
    await ElMessageBox.confirm('确定要删除这张点位图吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });

    const response = await request.delete('/api/point-maps', {
      params: {
        task_id: props.taskId,
        image_id: pointMapImages.value[index].id
      }
    });

    if (response.code === 1) {
      ElMessage.success('删除成功');
      pointMapImages.value.splice(index, 1);
    } else {
      ElMessage.error(response.msg || '删除失败');
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('Error deleting point map:', error);
      // ElMessage.error('删除失败');
    }
  }
};

const fetchPointMaps = async () => {
  try {
    const response = await request.get('/api/point-maps', {
      params: { task_id: props.taskId }
    });

    if (response.code === 1) {
      pointMapImages.value = response.data;
    } else {
      // ElMessage.error(response.msg || '获取点位图失败');
    }
  } catch (error) {
    console.error('Error fetching point maps:', error);
    // ElMessage.error('获取点位图失败');
  }
};

onMounted(() => {
  fetchPointMaps();
});
</script>

<style scoped>
.point-map-container {
  padding: 20px;
}

.point-map-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.point-map-item {
  position: relative;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: hidden;
}

.point-map-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.point-map-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.point-map-item:hover .point-map-overlay {
  opacity: 1;
}

.point-map-overlay .el-button {
  margin: 5px 0;
}

.point-map-name {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 5px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  text-align: center;
  font-size: 14px;
}

.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #f5f7fa;
  color: #909399;
  font-size: 30px;
}

.upload-demo {
  margin-bottom: 20px;
}
</style>
