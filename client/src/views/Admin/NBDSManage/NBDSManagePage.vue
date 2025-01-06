<template>
  <el-container>
    <el-header>
      <div class="header-wrapper">
        <span class="header-title">国家统计局国内贸易社会消费零售总额月度数据</span>
      </div>
    </el-header>

    <!-- 自定义时间范围选择框 -->
    <el-dialog
        title="选择自定义时间范围"
        :visible.sync="customRangeVisible"
        width="400px"
    >
      <el-date-picker
          v-model="customRange"
          type="monthrange"
          start-placeholder="选择开始日期"
          end-placeholder="选择结束日期"
          :picker-options="pickerOptions"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="customRangeVisible = false">取消</el-button>
        <el-button type="primary" @click="applyCustomRange">确定</el-button>
      </div>
    </el-dialog>

    <el-main>
      <!-- 下拉菜单放置在表格上方，并右对齐 -->
      <div class="table-header">
        <el-select
            v-model="selectedRange"
            @change="handleRangeChange"
            placeholder="选择时间范围"
            class="time-range-select"
            style="width: 150px; margin-right: 20px;"
        >
          <el-option label="近12个月" value="12"></el-option>
          <el-option label="近24个月" value="24"></el-option>
          <el-option label="近36个月" value="36"></el-option>
          <el-option label="自定义" value="custom"></el-option>
        </el-select>
      </div>

      <!-- 分割线 -->
      <el-divider class="custom-divider"></el-divider>

      <!-- 显示表格 -->
      <div class="table-wrapper">
        <el-table
            :data="tableDataToDisplay"
            border
            style="width: 100%; table-layout: auto;"
        >
          <el-table-column
              prop="field"
              label="指标"
              width="200"
          ></el-table-column>
          <el-table-column
              v-for="(month, index) in months"
              :key="index"
              :label="month"
              :prop="month"
          >
            <template #default="{ row }">
              <div class="cell-content">{{ row[month] }}</div>
            </template>
          </el-table-column>
        </el-table>

        <!-- 折叠/展开按钮 -->
        <div class="expand-button" @click="expandForm">
          <el-button
              type="text"
              :icon="isFormExpanded ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
              class="expand-btn"
          />
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import axios from "axios";
import { BASE_URL } from "@/config";

export default {
  data() {
    return {
      selectedRange: "12", // 默认12个月
      customRangeVisible: false,
      customRange: [], // 自定义选择的时间范围
      months: [],
      tableData: [],
      tableDataToDisplay: [],
      rawData: [],
      isFormExpanded: false,
      defaultRows: 7,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
    };
  },
  mounted() {
    this.fetchData(); // 页面加载时自动获取数据
  },
  methods: {
    getTimeRange(range) {
      if (range === "custom" && this.customRange.length === 2) {
        const format = (date) =>
            `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-01`;
        return {
          startTime: format(this.customRange[0]),
          endTime: format(this.customRange[1]),
        };
      }
      const endDate = new Date(2024, 11, 1);
      const startDate = new Date(endDate);
      startDate.setMonth(endDate.getMonth() - range + 1);
      const format = (date) =>
          `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-01`;
      return { startTime: format(startDate), endTime: format(endDate) };
    },
    handleRangeChange(value) {
      if (value === "custom") {
        this.customRangeVisible = true;
      } else {
        this.fetchData();
      }
    },
    applyCustomRange() {
      if (this.customRange.length === 2) {
        this.selectedRange = "custom";
        this.fetchData(); // 使用自定义时间范围获取数据
        this.customRangeVisible = false;
      } else {
        this.$message.error("请选择有效的时间范围");
      }
    },
    fetchData() {
      const { startTime, endTime } = this.getTimeRange(this.selectedRange);
      const requestData = { startTime, endTime };

      axios
          .post(`${BASE_URL}/trade/search`, requestData, {
            headers: { "Content-Type": "application/json" },
          })
          .then((response) => {
            if (response.data.success) {
              this.rawData = response.data.data;
              this.processData();
            } else {
              this.$message.error("数据加载失败");
            }
          })
          .catch(() => {
            this.$message.error("请求错误");
          });
    },
    processData() {
      this.rawData.sort((a, b) => {
        const [yearA, monthA] = a["月份和年份"].split("-").map(Number);
        const [yearB, monthB] = b["月份和年份"].split("-").map(Number);
        return yearB - yearA || monthB - monthA;
      });

      this.months = this.rawData.map((item) => {
        const [year, month] = item["月份和年份"].split("-");
        return `${year}年${parseInt(month)}月`;
      });

      const keysOrder = [
        "餐饮收入当期值(亿元)",
        "餐饮收入累计值(亿元)",
        "餐饮收入同比增长(%)",
        "餐饮收入累计增长(%)",
        "限上单位餐饮收入当期值(亿元)",
        "限上单位餐饮收入累计值(亿元)",
        "限上单位餐饮收入同比增长(%)",
        "限上单位餐饮收入累计增长(%)",
        "商品零售当期值(亿元)",
        "商品零售累计值(亿元)",
        "商品零售同比增长(%)",
        "商品零售累计增长(%)",
        "限上单位商品零售类值当期值(亿元)",
        "限上单位商品零售类值累计值(亿元)",
        "限上单位商品零售类值同比增长(%)",
        "限上单位商品零售类值累计增长(%)",
      ];

      this.tableData = keysOrder.map((key) => {
        const row = { field: key };
        this.rawData.forEach((item, index) => {
          row[this.months[index]] = item[key] !== undefined ? item[key] : "-";
        });
        return row;
      });

      this.tableDataToDisplay = this.tableData.slice(0, this.defaultRows);
    },
    expandForm() {
      if (this.isFormExpanded) {
        this.tableDataToDisplay = this.tableData.slice(0, this.defaultRows);
      } else {
        this.tableDataToDisplay = [...this.tableData];
      }
      this.isFormExpanded = !this.isFormExpanded;
    },
  },
};
</script>

<style scoped>
.header-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-title {
  font-size: 18px;
  font-weight: bold;
  flex-grow: 1;
}

.time-range-select {
  width: 200px;
}

.table-wrapper {
  margin-top: 20px;
}

.el-table .cell-content {
  word-wrap: break-word;
  word-break: break-word;
  line-height: 1.2; /* 缩短高度 */
}

.table-header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 5px;
  width: 100%;
}

.custom-divider {
  margin-top: 5px;
  margin-bottom: 5px;
}

.expand-button {
  text-align: center;
  margin-top: 10px;
}

.expand-button .el-button {
  font-size: 20px;
  cursor: pointer;
}

.expand-button .el-button:hover {
  color: #409eff;
}

.expand-button .el-button:focus {
  outline: none;
}
</style>