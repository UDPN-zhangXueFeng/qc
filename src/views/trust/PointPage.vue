<template>
    <div class="point-page">
        <div class="image-grid">
            <!-- 已上传的图片列表 -->
            <div v-for="(image, index) in imageList" :key="index" class="image-item">
                <img :src="image.url" alt="点位图" />
                <div class="image-overlay">
                    <div class="action-buttons">
                        <el-button type="primary" circle @click="reupload(index, image.id)">
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
                <div class="image-title">
                    <span class="title-text">{{ image.title || '未命名点位' }}</span>
                </div>
            </div>

            <!-- 上传按钮 -->
            <div class="upload-box" @click="showAddDialog" v-if="imageList.length < maxImages">
                <el-icon>
                    <Plus />
                </el-icon>
                <span>点击上传点位图</span>
            </div>
        </div>

        <!-- 新增点位图弹窗 -->
        <el-dialog v-model="dialogVisible" title="新增点位图" width="400px" :close-on-click-modal="false"
            :close-on-press-escape="false">
            <div class="dialog-content">
                <el-form :model="formData" :rules="rules" ref="formRef" label-width="80px">
                    <el-form-item label="点位名称" prop="title">
                        <el-input v-model="formData.title" placeholder="请输入点位名称" />
                    </el-form-item>
                    <el-form-item label="点位图片" prop="imageUrl">
                        <div class="upload-area" @click="triggerUpload">
                            <div v-if="!formData.imageUrl" class="upload-placeholder">
                                <el-icon>
                                    <Upload />
                                </el-icon>
                                <span>重新上传</span>
                            </div>
                            <img v-else :src="formData.imageUrl" class="preview-image" />
                            <input type="file" ref="fileInput" accept="image/*" style="display: none"
                                @change="handleFileUpload" />
                        </div>
                    </el-form-item>
                </el-form>
            </div>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="cancelAdd">取消</el-button>
                    <el-button type="primary" @click="confirmAdd"
                        :disabled="!formData.imageUrl || !formData.title.trim()">
                        保存
                    </el-button>
                    <el-button type="primary" @click="saveAndContinue"
                        :disabled="!formData.imageUrl || !formData.title.trim()">
                        保存并继续
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { Plus, Upload, Delete } from "@element-plus/icons-vue";
import request from "@/utils/request";
import type { FormInstance } from "element-plus";

interface ImageItem {
    url: string;
    title: string;
    isEditing: boolean;
}

// 自定义指令：自动聚焦
const vFocus = {
    mounted: (el: HTMLElement) => {
        el.querySelector("input")?.focus();
    },
};

const props = defineProps({
    trustDetail: {
        type: Object,
        required: true,
    },
    orderId: {
        type: String,
        required: true,
    },
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
        const response: any = await request({
            url: "/lipu/flow/order/pic_list",
            method: "GET",
            params: {
                order_id: props.orderId,
            },
        });

        if (response.code === 1 && response.data) {
            imageList.value = response.data.map((item: any) => ({
                id: item.id,
                url: item.point_pic_url,
                title: item.point_name || "",
                isEditing: false,
            }));
        }
    } catch (error) {
        ElMessage.error("获取点位图列表失败");
        console.error("获取点位图列表失败:", error);
    }
};


// 更新点位名称
const updatePicTitle = async (index: number) => {
    try {
        await request({
            url: "/lipu/flow/order/update_pic_title",
            method: "POST",
            data: {
                order_id: props.orderId,
                point_id: "1",
                point_pic_url: imageList.value[index].url,
                point_name: imageList.value[index].title,
            },
        });
        ElMessage.success("更新成功");
    } catch (error) {
        ElMessage.error("更新名称失败");
        console.error("更新名称失败:", error);
    }
};

// 删除点位图
const deletePic = async (index: number) => {
    try {
        await request({
            url: "/lipu/flow/order/delete_pic",
            method: "POST",
            data: {
                order_id: props.orderId,
                point_id: "1",
                point_pic_url: imageList.value[index].url,
            },
        });
        imageList.value.splice(index, 1);
        ElMessage.success("删除成功");
    } catch (error) {
        ElMessage.error("删除失败");
        console.error("删除失败:", error);
    }
};

// 修改 handleFileUpload 方法
const handleFileUpload = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
        ElMessage.error("请上传图片文件");
        return;
    }

    if (file.size > 5 * 1024 * 1024) {
        ElMessage.error("图片大小不能超过5MB");
        return;
    }

    formData.value.file = file;
    const reader = new FileReader();
    reader.onload = (e) => {
        formData.value.imageUrl = e.target?.result as string;
    };
    reader.readAsDataURL(file);

    if (fileInput.value) {
        fileInput.value.value = "";
    }
};

// 修改 removeImage 方法
const removeImage = async (index: number) => {
    await deletePic(index);
};

// 修改 finishEdit 方法
const finishEdit = async (index: number) => {
    if (!imageList.value[index].title.trim()) {
        imageList.value[index].title = "点位" + (index + 1);
    }
    await updatePicTitle(index);
};

// 组件挂载时获取数据
onMounted(() => {
    fetchPicList();
});

// 修改 reupload 方法
const reupload = async (index: number, id: string) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (event) => {
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            ElMessage.error("请上传图片文件");
            return;
        }

        // 创建 FormData 用于上传
        const uploadFormData = new FormData();
        uploadFormData.append("file", file);

        try {
            // 先上传图片
            const uploadResponse: any = await request({
                url: "/lipu/flow/order/upload",
                method: "POST",
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                data: uploadFormData,
            });

            if (uploadResponse?.src) {
                // 上传成功后更新点位图信息
                const updateResponse: any = await request({
                    url: "/lipu/flow/order/update_pic",
                    method: "POST",
                    data: {
                        id: id, // 使用当前图片的 id
                        point_pic_url: uploadResponse.src,
                    },
                });

                if (updateResponse.code === 1) {
                    // 更新本地显示的图片
                    imageList.value[index].url = uploadResponse.src;
                    ElMessage.success("更新成功");
                } else {
                    ElMessage.error(updateResponse.message || "更新失败");
                }
            }
        } catch (error) {
            ElMessage.error("上传失败");
            console.error("上传失败:", error);
        }
    };
    input.click();
};

const startEdit = (index: number) => {
    imageList.value[index].isEditing = true;
};

// 新增的响应式数据
const dialogVisible = ref(false);
const formData = ref({
    title: "",
    imageUrl: "",
    file: null as File | null,
});

const formRef = ref<FormInstance>();
const rules = {
    title: [
        { required: true, message: "请输入点位名称", trigger: "blur" },
        { min: 1, message: "点位名称不能为空", trigger: "blur" },
    ],
    imageUrl: [{ required: true, message: "请上传点位图片", trigger: "change" }],
};

// 显示新增弹窗
const showAddDialog = () => {
    dialogVisible.value = true;
    formData.value = {
        title: "",
        imageUrl: "",
        file: null,
    };
};

// 取消新增
const cancelAdd = () => {
    dialogVisible.value = false;
};

// 确认新增
const confirmAdd = async () => {
    if (!formRef.value) return;

    await formRef.value.validate(async (valid) => {
        if (valid) {
            if (!formData.value.file) return;

            // 先上传图片
            const uploadFormData = new FormData();
            uploadFormData.append("file", formData.value.file);

            try {
                const response: any = await request({
                    url: "/lipu/flow/order/upload",
                    method: "POST",
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    data: uploadFormData,
                });
                if (response?.src) {
                    // 上传成功后保存点位信息
                    const saveResponse: any = await request({
                        url: "/lipu/flow/order/save_pic",
                        method: "POST",
                        data: {
                            order_id: props.orderId,
                            point_id: "1", // 默认为1
                            point_pic_url: response.src,
                        },
                    });

                    if (saveResponse.code === 1) {
                        imageList.value.push({
                            url: response.src,
                            title: formData.value.title,
                            isEditing: false,
                        });
                        ElMessage.success("保存成功");
                        dialogVisible.value = false;
                    } else {
                        ElMessage.error(saveResponse.message || "保存失败");
                    }
                }
            } catch (error) {
                ElMessage.error("操作失败");
                console.error("操作失败:", error);
            }
        }
    });
};

// 保存并继续
const saveAndContinue = async () => {
    if (!formRef.value) return;

    await formRef.value.validate(async (valid) => {
        if (valid) {
            await confirmAdd();
            if (dialogVisible.value) {
                formData.value = {
                    title: "",
                    imageUrl: "",
                    file: null,
                };
            }
        }
    });
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
    text-align: center;
}

/* :deep(.el-input__wrapper) {
    background: transparent !important;
    box-shadow: none !important;
    padding: 0 8px !important;
}

:deep(.el-input__inner) {
    color: white !important;
    text-align: center !important;
    height: 24px !important;
    font-size: 14px !important;
}

:deep(.el-input__inner::placeholder) {
    color: rgba(255, 255, 255, 0.7) !important;
} */

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

.dialog-content {
    padding: 20px 0;
}

.upload-area {
    width: 200px;
    height: 200px;
    border: 2px dashed #dcdfe6;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.upload-area:hover {
    border-color: #409eff;
}

.upload-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #8c939d;
}

.upload-placeholder .el-icon {
    font-size: 28px;
    margin-bottom: 8px;
}

.preview-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
}

.title-text {
    color: white;
    font-size: 14px;
    padding: 4px 8px;
}
</style>
