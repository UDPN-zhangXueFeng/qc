<template>
    <div class="point-page">
        <div class="image-grid">
            <!-- 已上传的图片列表 -->
            <div v-for="(image, index) in imageList" :key="index" class="image-item">
                <img :src="image.url" alt="点位图" />
                <div class="image-overlay">
                    <div class="action-buttons">
                        <el-button type="primary" circle @click="reupload(index)">
                            <el-icon>
                                <Upload />
                            </el-icon>
                        </el-button>
                        <el-button type="danger" circle @click="removeImage(index)">
                            <el-icon>
                                <Delete />
                            </el-icon>
                        </el-button>
                    </div>
                </div>
                <div class="image-title" @click="startEdit(index)">
                    <span v-if="!image.isEditing">{{ image.title || '点击编辑名称' }}</span>
                    <el-input v-else v-model="image.title" size="small" @blur="finishEdit(index)"
                        @keyup.enter="finishEdit(index)" v-focus />
                </div>
            </div>

            <!-- 上传按钮 -->
            <div class="upload-box" @click="triggerUpload" v-if="imageList.length < maxImages">
                <el-icon>
                    <Plus />
                </el-icon>
                <span>点击上传点位图</span>
                <input type="file" ref="fileInput" accept="image/*" style="display: none" @change="handleFileUpload" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { Plus, Upload, Delete } from '@element-plus/icons-vue';
import request from '@/utils/request';

interface ImageItem {
    url: string;
    title: string;
    isEditing: boolean;
}

// 自定义指令：自动聚焦
const vFocus = {
    mounted: (el: HTMLElement) => {
        el.querySelector('input')?.focus();
    }
};

const props = defineProps({
    trustDetail: {
        type: Object,
        required: true
    },
    orderId: {
        type: String,
        required: true
    }
});

const fileInput = ref<HTMLInputElement | null>(null);
const imageList = ref<ImageItem[]>([]);
const maxImages = 10;

const triggerUpload = () => {
    fileInput.value?.click();
};

// 获取点位图列表
const fetchPicList = async () => {
  try {
    const response = await request({
      url: '/lipu/flow/order/pic_list',
      method: 'GET',
      params: {
        orderId: props.orderId
      }
    });
    console.log(response);
    return;
    
    // 假设返回的数据格式为 { list: Array<{ url: string, title: string }> }
    if (response.data?.list) {
      imageList.value = response.data.list.map((item: any) => ({
        url: item.url,
        title: item.title || '',
        isEditing: false
      }));
    }
  } catch (error) {
    ElMessage.error('获取点位图列表失败');
    console.error('获取点位图列表失败:', error);
  }
};

// 上传图片到服务器
const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('orderId', props.orderId);

  try {
    const response = await request({
      url: '/lipu/flow/order/upload_pic',
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      data: formData
    });

    if (response.data?.url) {
      imageList.value.push({
        url: response.data.url,
        title: '',
        isEditing: false
      });
      ElMessage.success('上传成功');
    }
  } catch (error) {
    ElMessage.error('上传失败');
    console.error('上传失败:', error);
  }
};

// 更新点位名称
const updatePicTitle = async (index: number) => {
  try {
    await request({
      url: '/lipu/flow/order/update_pic_title',
      method: 'POST',
      data: {
        orderId: props.orderId,
        picUrl: imageList.value[index].url,
        title: imageList.value[index].title
      }
    });
  } catch (error) {
    ElMessage.error('更新名称失败');
    console.error('更新名称失败:', error);
  }
};

// 删除点位图
const deletePic = async (index: number) => {
  try {
    await request({
      url: '/lipu/flow/order/delete_pic',
      method: 'POST',
      data: {
        orderId: props.orderId,
        picUrl: imageList.value[index].url
      }
    });
    imageList.value.splice(index, 1);
    ElMessage.success('删除成功');
  } catch (error) {
    ElMessage.error('删除失败');
    console.error('删除失败:', error);
  }
};

// 修改 handleFileUpload 方法
const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (!file) return;
  
  if (!file.type.startsWith('image/')) {
    ElMessage.error('请上传图片文件');
    return;
  }
  
  if (file.size > 5 * 1024 * 1024) {
    ElMessage.error('图片大小不能超过5MB');
    return;
  }

  await uploadImage(file);
  
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

// 修改 removeImage 方法
const removeImage = async (index: number) => {
  await deletePic(index);
};

// 修改 finishEdit 方法
const finishEdit = async (index: number) => {
  imageList.value[index].isEditing = false;
  if (!imageList.value[index].title.trim()) {
    imageList.value[index].title = '点位' + (index + 1);
  }
  await updatePicTitle(index);
};

// 组件挂载时获取数据
onMounted(() => {
  fetchPicList();
});

const reupload = (index: number) => {
    const currentIndex = index;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event) => {
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith('image/')) {
            ElMessage.error('请上传图片文件');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            imageList.value[currentIndex].url = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    };
    input.click();
};

const startEdit = (index: number) => {
    imageList.value[index].isEditing = true;
};
</script>

<style scoped>
.point-page {
    padding: 20px;
}

.image-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
    padding: 20px;
}

.image-item {
    position: relative;
    aspect-ratio: 1;
    background: #f5f7fa;
    border-radius: 8px;
    overflow: hidden;
}

.image-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.image-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    transition: opacity 0.3s;
}

.image-item:hover .image-overlay {
    opacity: 1;
}

.action-buttons {
    display: flex;
    gap: 10px;
}

.image-title {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 8px;
    background: rgba(0, 0, 0, 0.6);
    color: white;
    text-align: center;
    font-size: 14px;
    cursor: pointer;
}

.image-title:hover {
    background: rgba(0, 0, 0, 0.7);
}

.image-title .el-input {
    width: 90%;
    margin: 0 auto;
}

:deep(.el-input__wrapper) {
    background: transparent;
    box-shadow: none !important;
}

:deep(.el-input__inner) {
    color: white;
    text-align: center;
    height: 24px;
    padding: 0 8px;
}

.upload-box {
    aspect-ratio: 1;
    border: 2px dashed #dcdfe6;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: border-color 0.3s;
    background: #fff;
}

.upload-box:hover {
    border-color: #409eff;
}

.upload-box .el-icon {
    font-size: 28px;
    color: #8c939d;
    margin-bottom: 10px;
}

.upload-box span {
    color: #8c939d;
    font-size: 14px;
}
</style>