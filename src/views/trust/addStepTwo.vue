<template>
  <div class="trust-form">
    <el-steps :active="2" finish-status="success" simple>
      <el-step title="填写基本信息" />
      <el-step title="添加技术方案" />
      <el-step title="提交结果" />
    </el-steps>

    <el-card class="mb-4 mt-4">
      <template #header>
        <div class="card-header">
          <span>添加技术方案</span>
        </div>
      </template>

      <div class="table-actions">
        <el-button type="primary" @click="downloadTemplate"
          >下载导入模版</el-button
        >
        <el-button type="primary" @click="addRow">添加</el-button>
        <el-button @click="importData">导入</el-button>
      </div>

      <el-table :data="tableData" border style="width: 100%">
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column label="操作" width="100">
          <template #default="scope">
            <el-button type="text" size="small" @click="editRow(scope.row)"
              >编辑</el-button
            >
            <el-button type="text" size="small" @click="deleteRow(scope.$index)"
              >删除</el-button
            >
          </template>
        </el-table-column>
        <el-table-column prop="sampleType" label="样品类别"></el-table-column>
        <el-table-column prop="pointName" label="点位名称"></el-table-column>
        <el-table-column prop="pointCode" label="点位编码"></el-table-column>
        <el-table-column prop="testItem" label="检测参数"></el-table-column>
        <el-table-column prop="testCount" label="检测参数"></el-table-column>
        <el-table-column prop="testPeriod" label="检测周期"></el-table-column>
        <el-table-column prop="testDays" label="检测天数"></el-table-column>
        <el-table-column prop="sampleMethod" label="采样依据"></el-table-column>
        <el-table-column prop="testMethod" label="检测依据"></el-table-column>
        <el-table-column
          prop="executiveStandard"
          label="执行依据"
        ></el-table-column>
        <el-table-column prop="limitValue" label="限值"></el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
      </el-table>
    </el-card>

    <div class="fixed-bottom">
      <div class="button-container">
        <el-button @click="cancel">取消</el-button>
        <el-button @click="saveAsDraft">保存为草稿</el-button>
        <el-button @click="saveAsDraft">提交并复制新增</el-button>
        <el-button type="primary" @click="nextStep">下一步</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";

const router = useRouter();
const tableData = ref([]);

const addRow = () => {
  tableData.value.push({
    sampleType: "",
    pointName: "",
    pointCode: "",
    testItem: "",
    testCount: "",
    testPeriod: "",
    testDays: "",
    sampleMethod: "",
    testMethod: "",
    executiveStandard: "",
    limitValue: "",
    remark: "",
  });
};

const editRow = (row) => {
  // 实现编辑行的逻辑
  ElMessageBox.prompt("编辑行", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    inputValue: JSON.stringify(row),
  })
    .then(({ value }) => {
      Object.assign(row, JSON.parse(value));
      ElMessage({
        type: "success",
        message: "编辑成功",
      });
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "取消编辑",
      });
    });
};

const deleteRow = (index) => {
  ElMessageBox.confirm("确定要删除这行吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      tableData.value.splice(index, 1);
      ElMessage({
        type: "success",
        message: "删除成功",
      });
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "已取消删除",
      });
    });
};

const downloadTemplate = () => {
  // 实现下载模板的逻辑
  window.open(
    "http://39.107.73.236:90/gBXIyMsJvW.php/lipu/flow/orderparams/template_download"
  );
};

const importData = () => {
  // 实现导入数据的逻辑
  ElMessage.success("数据导入成功");
};

const cancel = () => {
  ElMessageBox.confirm("确定要取消吗？未保存的内容将会丢失。", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      router.push("/");
    })
    .catch(() => {
      // 用户取消操作，不做任何处理
    });
};

const saveAsDraft = () => {
  // 实现保存为草稿的逻辑
  console.log("保存为草稿");
  ElMessage.success("已保存为草稿");
};

const nextStep = () => {
  // 实现下一步的逻辑
  router.push("/trust-add-three");
};
</script>

<style scoped>
.trust-form {
  max-width: 1000px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.table-actions {
  margin-bottom: 20px;
}

.fixed-bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #fff;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.button-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 16px;
  display: flex;
  justify-content: flex-end;
  gap: 16px;
}
</style>
