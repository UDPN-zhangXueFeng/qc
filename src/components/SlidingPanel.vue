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
        <el-form-item label="样品类别" class="w-[250px]">
          <el-select v-model="form.category" placeholder="请选择样品类别">
            <el-option
              v-for="item in categoryOptions"
              :key="item.id"
              :label="item.sample_category"
              :value="item.sample_category"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
      
      <el-table :data="tableData" style="width: 100%" @selection-change="handleSelectionChange">
        <!-- <el-table-column type="selection" width="55"></el-table-column> -->
        <el-table-column prop="id" label="序号" width="80"></el-table-column>
        <el-table-column prop="category" label="类别"></el-table-column>
        <el-table-column label="检测参数">
          <template #default="scope">
            <div>
              <el-checkbox
                v-model="scope.row.allSelected"
                @change="handleSelectAll(scope.row)"
              >
                全选
              </el-checkbox>
              <el-checkbox-group 
                v-model="scope.row.selectedParameters"
                @change="handleParameterChange(scope.row)"
              >
                <el-checkbox 
                  v-for="param in scope.row.parameters" 
                  :key="param" 
                  :label="param"
                ></el-checkbox>
              </el-checkbox-group>
            </div>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- <el-pagination
        :current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        layout="prev, pager, next, jumper"
        @current-change="handlePageChange"
      ></el-pagination> -->
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
import { ref, reactive, watch, onMounted } from 'vue';
import request from '@/utils/request'; // 确保导入了request工具

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
  },
  taskId: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel']);

const visible = ref(props.modelValue);
const form = reactive({
  category: '',
});

const tableData:any = ref([]);

const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(100);
const parameters = ['PH', '电导率', '水温', '流量'];
const selectedRows = ref([]);

const categoryOptions = ref([]);

const fetchCategoryOptions = async () => {
  try {
    const response: any = await request({
      method: 'GET',
      url: '/lipu/flow/order/sample_category_list',
    });

    if (response.code === 1 && Array.isArray(response.data)) {
      categoryOptions.value = response.data;
      // 设置默认选中第一个选项
      if (categoryOptions.value.length > 0) {
        form.category = categoryOptions.value[0].sample_category;
      }
    } else {
      console.error('Failed to fetch category options:', response.msg);
    }
  } catch (error) {
    console.error('Error fetching category options:', error);
  }
};

const fetchTaskData = async () => {
  try {
    const formData = new FormData();
    formData.append('task_id', props.taskId);

    const response: any = await request({
      method: 'post',
      url: '/lipu/flow/qc/get_task_all_category_testparams',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    if (response.code === 1 && response.data && response.data.all_testparms) {
      tableData.value = Object.entries(response.data.all_testparms).map(([category, parameters], index) => ({
        id: index + 1,
        category,
        parameters,
        selectedParameters: []
      }));
    } else {
      console.error('Failed to fetch task data:', response.msg);
    }
  } catch (error) {
    console.error('Error fetching task data:', error);
  }
};

onMounted(() => {
  fetchCategoryOptions();
  fetchTaskData();
});

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
  const selectedItems = tableData.value
    .filter(item => item.selectedParameters.length > 0)
    .map(item => ({
      sample_category: item.category,
      test_params: item.selectedParameters
    }));

  // 找到当前选中的样品类别的 ID
  const selectedCategoryId = categoryOptions.value.find(
    option => option.sample_category === form.category
  )?.id;

  return {
    selectedItems,
    selectedCategoryId
  };
};

const handleSelectAll = (row: any) => {
  if (row.allSelected) {
    row.selectedParameters = [...row.parameters];
  } else {
    row.selectedParameters = [];
  }
};

const handleParameterChange = (row: any) => {
  row.allSelected = row.selectedParameters.length === row.parameters.length;
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
