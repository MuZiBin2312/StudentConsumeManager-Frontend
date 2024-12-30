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
      filters: {
        module: "用户管理",
        action: "添加用户",
        operator: "admin",
        requestId: "12345",
        status: "成功",
        startTime: "2024-12-28 00:00:00",
        endTime: "2024-12-29 23:59:59",
      },
      logList: [],
    };
  },
  methods: {
    fetchLogData() {
      const config = {
        method: "post",
        url: `${BASE_URL}/log/search`,
        headers: {
          userid: "1",
          username: "1",
          "Content-Type": "application/json",
        },
        data: this.filters,
      };

      axios(config)
          .then((response) => {
            this.logList = response.data.data || [];
          })
          .catch((error) => {
            this.$message.error("获取日志失败: " + error.message);
          });
    },
    resetFilters() {
      this.filters = {
        module: "用户管理",
        action: "添加用户",
        operator: "admin",
        requestId: "12345",
        status: "成功",
        startTime: "2024-12-28 00:00:00",
        endTime: "2024-12-29 23:59:59",
      };
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
