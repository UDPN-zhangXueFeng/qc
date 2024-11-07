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
        <el-form-item v-for="field in searchFields" :key="getFieldKey(field)" :label="field.label" class="min-w-[200px]">
          <component
            :is="field.component"
            :model-value="getFieldValue(field.prop)"
            @update:model-value="updateFieldValue(field.prop, $event)"
            v-bind="field.props || {}"
          >
            <!-- 添加这个模板来处理 el-select 的选项 -->
            <template v-if="field.component === 'el-select' && field.props && field.props.options">
              <el-option
                v-for="option in field.props.options"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </template>
          </component>
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
                  <el-dropdown-item 
                    v-for="action in (typeof rowActions === 'function' ? rowActions(scope.row) : rowActions)" 
                    :key="action.name" 
                    @click="action.handler(scope.row)"
                  >
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
import type { PropType } from 'vue'
import { ElMessage } from 'element-plus'
import { ArrowDown } from '@element-plus/icons-vue'

interface SearchField {
  prop: string | string[]
  label: string
  component: string
  props?: Record<string, any>
}

interface TableColumn {
  prop: string
  label: string
  slot?: string
  [key: string]: any
}

interface Action {
  name: string
  label: string
  type?: string
  handler: (row?: any) => void
}

interface FetchDataParams {
  page: number
  limit: number
  [key: string]: any
}

interface FetchDataResult {
  data: any[]
  total: number
}

const props = defineProps({
  searchTitle: { type: String, default: '搜索条件' },
  listTitle: { type: String, default: '数据列表' },
  searchFields: { 
    type: Array as PropType<SearchField[]>, 
    default: () => [] 
  },
  tableColumns: { type: Array as () => TableColumn[], default: () => [] },
  headerActions: { type: Array as () => Action[], default: () => [] },
  rowActions: { 
    type: [Array, Function] as PropType<Action[] | ((row: any) => Action[])>, 
    default: () => [] 
  },
  showIndex: { type: Boolean, default: true },
  showActions: { type: Boolean, default: true },
  actionsWidth: { type: String, default: '150' },
  showPagination: { type: Boolean, default: true },
  fetchData: { 
    type: Function as PropType<(params: FetchDataParams) => Promise<FetchDataResult>>, 
    required: true 
  }
})

const emit = defineEmits<{
  (e: 'search', form: Record<string, any>): void
  (e: 'reset'): void
  (e: 'pageChange', page: number): void
}>()

const searchForm = reactive<Record<string, string | string[]>>({})
const tableData = ref<any[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

onMounted(() => {
  initSearchForm()
  loadData()
})

const initSearchForm = () => {
  props.searchFields.forEach((field: SearchField) => {
    if (Array.isArray(field.prop)) {
      field.prop.forEach(prop => {
        searchForm[prop] = ''
      })
    } else {
      searchForm[field.prop] = ''
    }
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

const handlePageChange = (page: number) => {
  currentPage.value = page
  emit('pageChange', page)
  loadData()
}

const loadData = async () => {
  try {
    if (props.fetchData) {
      const searchParams = Object.entries(searchForm).reduce((acc, [key, value]) => {
        if (Array.isArray(value)) {
          // 对于数组类型的值（如多选字段），直接使用数组
          acc[key] = value
        } else if (value !== '') {
          // 对于非空的非数组值，直接添加到参数中
          acc[key] = value
        }
        return acc
      }, {} as Record<string, any>)

      const { data, total: totalCount } = await props.fetchData({
        ...searchParams,
        page: currentPage.value,
        limit: pageSize.value
      })
      tableData.value = data
      total.value = totalCount
    }
  } catch (error) {
    console.error('Failed to fetch data:', error)
    ElMessage.error('Failed to load data')
  }
}

const getFieldKey = (field: SearchField): string => {
  return Array.isArray(field.prop) ? field.prop.join('_') : field.prop
}

const getFieldValue = (prop: string | string[]): any => {
  if (Array.isArray(prop)) {
    return prop.map(p => searchForm[p])
  }
  return searchForm[prop]
}

const updateFieldValue = (prop: string | string[], value: any): void => {
  if (Array.isArray(prop)) {
    prop.forEach((p, index) => {
      searchForm[p] = Array.isArray(value) ? value[index] : value
    })
  } else {
    searchForm[prop] = value
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
