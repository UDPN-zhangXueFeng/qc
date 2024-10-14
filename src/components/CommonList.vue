<template>
  <div class="p-6 space-y-6">
    <!-- 搜索栏 Card -->
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>{{ searchTitle }}</span>
        </div>
      </template>
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item v-for="field in searchFields" :key="field.prop" :label="field.label">
          <component :is="field.component" v-model="searchForm[field.prop]" v-bind="field.props"></component>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 列表栏 Card -->
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>{{ listTitle }}</span>
          <div class="card-header-actions">
            <el-button v-for="action in headerActions" :key="action.name" :type="action.type" @click="action.handler">
              {{ action.label }}
            </el-button>
          </div>
        </div>
      </template>
      
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column v-if="showIndex" type="index" label="序号" width="50"></el-table-column>
        <el-table-column v-if="showActions" label="操作" :width="actionsWidth">
          <template #default="scope">
            <el-dropdown>
              <el-button type="primary" size="small">
                操作<el-icon class="el-icon--right"><arrow-down /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item v-for="action in rowActions" :key="action.name" @click="action.handler(scope.row)">
                    {{ action.label }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
        <el-table-column v-for="column in tableColumns" :key="column.prop" v-bind="column">
          <template v-if="column.slot" #default="scope">
            <slot :name="column.slot" :row="scope.row"></slot>
          </template>
        </el-table-column>
      </el-table>

      <div class="mt-4 flex justify-end">
        <el-pagination
          v-if="showPagination"
          :current-page="currentPage"
          :page-size="pageSize"
          :total="total"
          @current-change="handlePageChange"
          layout="total, prev, pager, next"
        ></el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { ArrowDown } from '@element-plus/icons-vue'

const props = defineProps({
  searchTitle: { type: String, default: '搜索条件' },
  listTitle: { type: String, default: '数据列表' },
  searchFields: { type: Array, default: () => [] },
  tableColumns: { type: Array, default: () => [] },
  headerActions: { type: Array, default: () => [] },
  rowActions: { type: Array, default: () => [] },
  showIndex: { type: Boolean, default: true },
  showActions: { type: Boolean, default: true },
  actionsWidth: { type: String, default: '150' },
  showPagination: { type: Boolean, default: true },
  fetchData: { type: Function, required: true }
})

const emit = defineEmits(['search', 'reset', 'pageChange'])

const searchForm = reactive({})
const tableData = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

onMounted(() => {
  initSearchForm()
  loadData()
})

const initSearchForm = () => {
  props.searchFields.forEach(field => {
    searchForm[field.prop] = ''
  })
}

const handleSearch = () => {
  currentPage.value = 1
  emit('search', searchForm)
  loadData()
}

const resetSearch = () => {
  initSearchForm()
  emit('reset')
  loadData()
}

const handlePageChange = (page) => {
  currentPage.value = page
  emit('pageChange', page)
  loadData()
}

const loadData = async () => {
  try {
    const { data, total: totalCount } = await props.fetchData({
      ...searchForm,
      page: currentPage.value,
      limit: pageSize.value
    })
    tableData.value = data
    total.value = totalCount
  } catch (error) {
    console.error('Failed to fetch data:', error)
    ElMessage.error('Failed to load data')
  }
}

watch(() => props.searchFields, initSearchForm, { immediate: true })
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header-actions {
  display: flex;
  gap: 10px;
}
</style>