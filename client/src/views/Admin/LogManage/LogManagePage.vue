<template>
  <div>
    <el-container>
      <el-main>
        <!-- 筛选条件表单 -->
        <el-form :model="filters" inline label-width="120px">
          <el-form-item label="模块">
            <el-input v-model="filters.module" placeholder="模块"></el-input>
          </el-form-item>
          <el-form-item label="操作">
            <el-input v-model="filters.action" placeholder="操作"></el-input>
          </el-form-item>
          <el-form-item label="操作人">
            <el-input v-model="filters.operator" placeholder="操作人"></el-input>
          </el-form-item>
          <el-form-item label="请求 ID">
            <el-input v-model="filters.requestId" placeholder="请求 ID"></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="filters.status" placeholder="请选择状态">
              <el-option label="成功" value="成功"></el-option>
              <el-option label="失败" value="失败"></el-option>
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
          <el-table-column prop="module" label="模块"></el-table-column>
          <el-table-column prop="action" label="操作"></el-table-column>
          <el-table-column prop="operator" label="操作人"></el-table-column>
          <el-table-column prop="requestId" label="请求 ID"></el-table-column>
          <el-table-column prop="status" label="状态"></el-table-column>
          <el-table-column prop="timestamp" label="时间">
            <template slot-scope="scope">
              {{ formatTimestamp(scope.row.timestamp) }}
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页组件 -->
        <el-pagination
            style="margin-top: 20px"
            background
            layout="prev, pager, next, jumper, total"
            :total="pagination.total"
            :page-size="pagination.pageSize"
            :current-page="pagination.currentPage"
            @current-change="handlePageChange"
        />

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
      logList: [], // 日志列表数据
      allLogs: [], // 所有日志
      filters: {
        module: null,
        action: null,
        operator: null,
        status: null,
        startTime: null,
        endTime: null,
      },
      pagination: {
        currentPage: 1, // 当前页码
        pageSize: 10, // 每页条数
        total: 0, // 总数据条数
      },
    };
  },
  methods: {
    fetchLogData() {
      const requestData = {
        module: this.filters.module || null,
        action: this.filters.action || null,
        operator: this.filters.operator || null,
        status: this.filters.status || null,
        startTime: this.filters.startTime || null,
        endTime: this.filters.endTime || null,
        page: this.pagination.currentPage, // 当前页码
        size: this.pagination.pageSize, // 每页条数
      };

      axios
          .post(`${BASE_URL}/log/search`, requestData, {
            headers: {
              userid: "1",
              username: "1",
              "Content-Type": "application/json",
            },
          })
          .then((response) => {
            if (response.data && response.data.data) {
              // 全量数据保存并排序
              this.allLogs = response.data.data.sort(
                  (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
              );
              this.pagination.total = this.allLogs.length; // 更新总数
              this.updateLogList(); // 更新当前页数据
            } else {
              this.$message.error("未获取到日志数据");
            }
          })
          .catch((error) => {
            console.error(error);
            this.$message.error("获取日志数据失败");
          });
    },
    resetFilters() {
      this.filters = {
        module: "",
        action: "",
        operator: "",
        requestId: "",
        status: "",
        startTime: "",
        endTime: "",
      };
      this.currentPage = 1; // 重置为第一页
      this.fetchLogData();
    },
    formatTimestamp(timestamp) {
      if (!timestamp) return "";
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
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
