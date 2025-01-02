<template>
  <el-container>
    <el-header>
      <el-select v-model="selectedRange" @change="fetchData" placeholder="选择时间范围">
        <el-option label="近12个月" value="12"></el-option>
        <el-option label="近24个月" value="24"></el-option>
        <el-option label="近36个月" value="36"></el-option>
      </el-select>
    </el-header>

    <el-main>
      <el-tabs v-model="activeTab">
        <el-tab-pane label="表格" name="table">
          <el-table :data="tableData" border>
            <el-table-column prop="field" label="指标" width="200"></el-table-column>
            <el-table-column v-for="(month, index) in months" :key="index" :label="month" :prop="month">
              <template #default="{ row }">{{ row[month] }}</template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="饼图" name="pie">
          <div id="pie-chart" style="height: 400px"></div>
        </el-tab-pane>

        <el-tab-pane label="柱状图" name="bar">
          <div id="bar-chart" style="height: 400px"></div>
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </el-container>
</template>

<script>
import * as echarts from 'echarts';
import axios from 'axios';
import { BASE_URL } from '@/config';

export default {
  data() {
    return {
      selectedRange: 12, // 默认12个月
      activeTab: 'table',
      months: [],
      tableData: [],
      rawData: [],
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    // 获取时间范围，传入的范围是以月为单位
    getTimeRange(range) {
      const endDate = new Date(2024, 11, 1); // 默认到2024年11月
      const startDate = new Date(endDate);
      startDate.setMonth(endDate.getMonth() - range + 1);

      const format = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`;
      return {
        startTime: format(startDate),
        endTime: format(endDate),
      };
    },

    // 发起请求获取数据
    fetchData() {
      const { startTime, endTime } = this.getTimeRange(this.selectedRange);
      const requestData = {
        startTime,
        endTime,
      };

      axios
          .post(`${BASE_URL}/trade/search`, requestData, {
            headers: {
              'Content-Type': 'application/json',
            },
          })
          .then((response) => {
            if (response.data.success) {
              this.rawData = response.data.data;
              this.processData();
            } else {
              this.$message.error('数据加载失败');
            }
          })
          .catch(() => {
            this.$message.error('请求错误');
          });
    },

    // 数据处理逻辑，按月份倒序排列并处理每一列数据
    processData() {
      // 按照月份倒序排列
      this.rawData.sort((a, b) => {
        const [yearA, monthA] = a['月份和年份'].split('-').map(Number);
        const [yearB, monthB] = b['月份和年份'].split('-').map(Number);
        return yearB - yearA || monthB - monthA; // 先按年份排序，再按月份排序
      });

      // 获取倒序的月份
      this.months = this.rawData.map((item) => {
        const [year, month] = item['月份和年份'].split('-');
        return `${year}年${parseInt(month)}月`;
      });

      // 定义指标字段
      const keysOrder = [
        '餐饮收入当期值(亿元)',
        '餐饮收入累计值(亿元)',
        '餐饮收入同比增长(%)',
        '餐饮收入累计增长(%)',
        '限上单位餐饮收入当期值(亿元)',
        '限上单位餐饮收入累计值(亿元)',
        '限上单位餐饮收入同比增长(%)',
        '限上单位餐饮收入累计增长(%)',
        '商品零售当期值(亿元)',
        '商品零售累计值(亿元)',
        '商品零售同比增长(%)',
        '商品零售累计增长(%)',
        '限上单位商品零售类值当期值(亿元)',
        '限上单位商品零售类值累计值(亿元)',
        '限上单位商品零售类值同比增长(%)',
        '限上单位商品零售类值累计增长(%)',
      ];

      // 处理表格数据
      this.tableData = keysOrder.map((key) => {
        const row = { field: key };
        this.rawData.forEach((item, index) => {
          // 确保数据是有效的，如果没有数据就填充 '-'
          row[this.months[index]] = item[key] !== undefined ? item[key] : '-';
        });
        return row;
      });

      // 更新图表
      this.updateCharts();
    },

    // 更新图表（饼图和柱状图）
    updateCharts() {
      if (this.activeTab === 'pie') {
        this.renderPieChart();
      } else if (this.activeTab === 'bar') {
        this.renderBarChart();
      }
    },

    // 渲染饼图
    renderPieChart() {
      const chart = echarts.init(document.getElementById('pie-chart'));
      const data = this.rawData.map((item) => ({
        name: item['月份和年份'],
        value: item['餐饮收入累计值(亿元)'] || 0,
      }));
      chart.setOption({
        tooltip: { trigger: 'item' },
        series: [
          {
            type: 'pie',
            data,
          },
        ],
      });
    },

    // 渲染柱状图
    renderBarChart() {
      const chart = echarts.init(document.getElementById('bar-chart'));
      const xData = this.months;
      const yData = this.rawData.map((item) => item['商品零售累计值(亿元)'] || 0);

      chart.setOption({
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: xData },
        yAxis: { type: 'value' },
        series: [
          {
            type: 'bar',
            data: yData,
          },
        ],
      });
    },
  },
};
</script>

<style>
#pie-chart, #bar-chart {
  width: 100%;
}
</style>
