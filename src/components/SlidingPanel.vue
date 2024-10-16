<template>
  <el-drawer
    v-model="visible"
    :title="title"
    :size="width"
    :direction="direction"
    :before-close="handleClose"
  >
    <div class="sliding-panel-content">
      <el-form :inline="true" :model="form" class="demo-form-inline">
        <el-form-item label="样品类别">
          <el-select v-model="form.category" placeholder="请选择样品类别">
            <el-option label="水和废水" value="水和废水"></el-option>
            <!-- 添加更多选项 -->
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
      
      <el-table :data="tableData" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" label="序号" width="80"></el-table-column>
        <el-table-column prop="category" label="类别"></el-table-column>
        <el-table-column label="检测参数">
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
});

const tableData = ref([
  { id: 1, category: '水和废水', parameters: ['PH', '电导率'] },
  { id: 2, category: '水和废水', parameters: ['水温', '流量'] },
]);

const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(100);
const parameters = ['PH', '电导率', '水温', '流量'];
const selectedRows = ref([]);

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
  emit('confirm', getSelectedItems());
  resetForm();
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
  // 这里可以添加加载新页面数据的逻辑
};

const resetForm = () => {
  form.category = '';
};

const handleSearch = () => {
  // 实现搜索逻辑
  console.log('Searching for category:', form.category);
};

const handleSelectionChange = (selection: any[]) => {
  selectedRows.value = selection;
};

const getSelectedItems = () => {
  return selectedRows.value.map(item => ({
    sample_category: item.category,
    test_params: item.parameters
  }));
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
