<template>
  <div>
    <el-container>
      <el-main>
        <!-- 筛选条件表单 -->
        <el-form :model="filters" inline label-width="120px">
          <el-form-item label="模块">
            <el-select v-model="filters.module" placeholder="选择模块" clearable>
              <el-option
                  v-for="module in filterOptions.modules"
                  :key="module"
                  :label="module"
                  :value="module"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="操作">
            <el-select v-model="filters.action" placeholder="选择操作" clearable>
              <el-option
                  v-for="action in filterOptions.actions"
                  :key="action"
                  :label="action"
                  :value="action"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="操作人">
            <el-select v-model="filters.operator" placeholder="选择操作人" clearable>
              <el-option
                  v-for="operator in filterOptions.operators"
                  :key="operator"
                  :label="operator"
                  :value="operator"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="请求 ID">
            <el-select v-model="filters.requestId" placeholder="选择请求 ID" clearable>
              <el-option
                  v-for="requestId in filterOptions.requestIds"
                  :key="requestId"
                  :label="requestId"
                  :value="requestId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="filters.status" placeholder="请选择状态" clearable>
              <el-option
                  v-for="status in filterOptions.statuses"
                  :key="status"
                  :label="status"
                  :value="status"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="开始时间">
            <el-date-picker
                v-model="filters.startTime"
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择开始时间"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间">
            <el-date-picker
                v-model="filters.endTime"
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择结束时间"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="fetchLogData">搜索</el-button>
            <el-button @click="resetFilters">重置</el-button>
          </el-form-item>
        </el-form>

        <!-- 日志数据表格 -->
        <el-table :data="logList" style="width: 100%; margin-top: 20px">
          <!-- 序号列 -->
          <el-table-column label="序号" width="60">
            <template slot-scope="scope">
              {{ calculateIndex(scope.$index) }}
            </template>
          </el-table-column>
          <el-table-column prop="module" label="模块"></el-table-column>
          <el-table-column prop="action" label="操作"></el-table-column>
          <el-table-column prop="operator" label="操作人"></el-table-column>
          <el-table-column prop="requestId" label="请求 ID"></el-table-column>
          <el-table-column prop="status" label="状态"></el-table-column>
          <el-table-column label="时间">
            <template slot="header">
              <div style="display: flex; align-items: center">
                时间
                <el-button
                    size="mini"
                    type="text"
                    @click="toggleSortOrder"
                    style="margin-left: 10px"
                >
                  {{ sortOrder === 'desc' ? '最新 → 最早' : '最早 → 最新' }}
                </el-button>
              </div>
            </template>
            <template slot-scope="scope">
              {{ formatTimestamp(scope.row.timestamp) }}
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页组件 -->
        <div style="display: flex; justify-content: center; margin-top: 20px">
          <el-pagination
              background
              layout="prev, pager, next, jumper, total"
              :total="pagination.total"
              :page-size="pagination.pageSize"
              :current-page="pagination.currentPage"
              @current-change="handlePageChange"
          />
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import axios from "axios";
import { BASE_URL } from "@/config";

export default {
  data() {
    return {
      logList: [],
      allLogs: [],
      filters: {
        module: null,
        action: null,
        operator: null,
        requestId: null,
        status: null,
        startTime: null,
        endTime: null,
      },
      filterOptions: {
        modules: [],
        actions: [],
        operators: [],
        requestIds: [],
        statuses: [],
      },
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
      sortOrder: "desc", // 排序顺序：'desc' 或 'asc'
    };
  },
  methods: {
    fetchLogData() {
      const requestData = {
        module: this.filters.module,
        action: this.filters.action,
        operator: this.filters.operator,
        requestId: this.filters.requestId,
        status: this.filters.status,
        startTime: this.filters.startTime,
        endTime: this.filters.endTime,
        page: this.pagination.currentPage,
        size: this.pagination.pageSize,
      };

      axios
          .post(`${BASE_URL}/log/search`, requestData)
          .then((response) => {
            if (response.data && response.data.data) {
              this.allLogs = response.data.data;
              this.sortLogs(); // 加载数据后默认排序
              this.extractFilterOptions();
              this.pagination.total = this.allLogs.length;
              this.updateLogList();
            } else {
              this.$message.error("未获取到日志数据");
            }
          })
          .catch(() => {
            this.$message.error("获取日志数据失败");
          });
    },
    sortLogs() {
      this.allLogs.sort((a, b) => {
        const timeA = new Date(a.timestamp).getTime();
        const timeB = new Date(b.timestamp).getTime();
        return this.sortOrder === "desc" ? timeB - timeA : timeA - timeB;
      });
      this.updateLogList(); // 更新当前页数据
    },
    toggleSortOrder() {
      this.sortOrder = this.sortOrder === "desc" ? "asc" : "desc";
      this.sortLogs();
    },
    extractFilterOptions() {
      const uniqueValues = (key) =>
          [...new Set(this.allLogs.map((log) => log[key]))].filter((item) => item);

      this.filterOptions.modules = uniqueValues("module");
      this.filterOptions.actions = uniqueValues("action");
      this.filterOptions.operators = uniqueValues("operator");
      this.filterOptions.requestIds = uniqueValues("requestId");
      this.filterOptions.statuses = uniqueValues("status");
    },
    resetFilters() {
      this.filters = {
        module: null,
        action: null,
        operator: null,
        requestId: null,
        status: null,
        startTime: null,
        endTime: null,
      };
      this.fetchLogData();
    },
    formatTimestamp(timestamp) {
      if (!timestamp) return "";
      const date = new Date(timestamp);
      return date.toLocaleString("zh-CN", { hour12: false });
    },
    updateLogList() {
      const start = (this.pagination.currentPage - 1) * this.pagination.pageSize;
      const end = start + this.pagination.pageSize;
      this.logList = this.allLogs.slice(start, end);
    },
    handlePageChange(page) {
      this.pagination.currentPage = page;
      this.updateLogList();
    },
    calculateIndex(index) {
      return (this.pagination.currentPage - 1) * this.pagination.pageSize + index + 1;
    },
  },
  mounted() {
    this.fetchLogData();
  },
};
</script>

<style>
.el-form {
  margin-bottom: 20px;
}
</style>