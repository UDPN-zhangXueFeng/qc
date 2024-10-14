<template>
    <el-drawer
      v-model="visible"
      :title="title"
      :size="width"
      :direction="direction"
      :before-close="handleClose"
    >
      <div class="sliding-panel-content">
        <el-form :model="form" label-width="100px">
          <el-form-item label="样品类别">
            <el-select v-model="form.category" placeholder="请选择样品类别">
              <el-option label="水和废水" value="water"></el-option>
              <!-- 添加更多选项 -->
            </el-select>
          </el-form-item>
          
          <el-form-item label="检测参数">
            <el-checkbox-group v-model="form.parameters">
              <el-checkbox label="PH">PH</el-checkbox>
              <el-checkbox label="电导率">电导率</el-checkbox>
              <el-checkbox label="水温">水温</el-checkbox>
              <el-checkbox label="流量">流量</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
        
        <el-table :data="tableData" style="width: 100%">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="id" label="序号" width="80"></el-table-column>
          <el-table-column prop="category" label="类别"></el-table-column>
          <el-table-column prop="parameters" label="检测参数">
            <template #default="scope">
              <el-checkbox-group v-model="scope.row.parameters">
                <el-checkbox v-for="param in parameters" :key="param" :label="param"></el-checkbox>
              </el-checkbox-group>
            </template>
          </el-table-column>
        </el-table>
        
        <el-pagination
          :current-page="currentPage"
          :page-size="pageSize"
          :total="total"
          layout="prev, pager, next, jumper"
          @current-change="handlePageChange"
        ></el-pagination>
      </div>
      <template #footer>
        <div class="sliding-panel-footer">
          <el-button @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="handleConfirm">确认添加</el-button>
        </div>
      </template>
    </el-drawer>
  </template>
  
  <script setup lang="ts">
  import { ref, reactive, watch } from 'vue';
  
  const props = defineProps({
    modelValue: Boolean,
    title: {
      type: String,
      default: '添加采样'
    },
    width: {
      type: String,
      default: '50%'
    },
    direction: {
      type: String,
      default: 'rtl'
    }
  });
  
  const emit = defineEmits(['update:modelValue', 'confirm', 'cancel']);
  
  const visible = ref(props.modelValue);
  const form = reactive({
    category: '',
    parameters: []
  });
  
  const tableData = ref([
    { id: 1, category: '水和废水', parameters: ['PH', '电导率'] },
    { id: 2, category: '水和废水', parameters: ['水温', '流量'] },
  ]);
  
  const currentPage = ref(1);
  const pageSize = ref(10);
  const total = ref(100);
  const parameters = ['PH', '电导率', '水温', '流量'];
  
  watch(() => props.modelValue, (newVal) => {
    visible.value = newVal;
  });
  
  watch(visible, (newVal) => {
    emit('update:modelValue', newVal);
  });
  
  const handleClose = (done: () => void) => {
    handleCancel();
    done();
  };
  
  const handleCancel = () => {
    visible.value = false;
    emit('cancel');
    resetForm();
  };
  
  const handleConfirm = () => {
    visible.value = false;
    emit('confirm', { form: form, selectedItems: getSelectedItems() });
    resetForm();
  };
  
  const handlePageChange = (page: number) => {
    currentPage.value = page;
    // 这里可以添加加载新页面数据的逻辑
  };
  
  const resetForm = () => {
    form.category = '';
    form.parameters = [];
  };
  
  const getSelectedItems = () => {
    // 实现获取选中项的逻辑
    return tableData.value.filter((item: any) => item.selected);
  };
  </script>
  
  <style scoped>
  .sliding-panel-content {
    padding: 20px;
  }
  .sliding-panel-footer {
    text-align: right;
  }
  </style>