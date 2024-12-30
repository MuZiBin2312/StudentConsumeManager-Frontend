<template>
    <div>
      <h2>学生消费查询页面</h2>
      <el-form :inline="true" :model="queryForm" class="demo-form-inline">
        <el-form-item label="商品名">
          <el-input v-model="queryForm.cname" placeholder="请输入商品名"></el-input>
        </el-form-item>
        <el-form-item label="时间范围">
          <el-date-picker v-model="queryForm.timeRange" type="daterange" placeholder="选择日期范围"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchConsume">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="filteredData" style="width: 100%">
        <el-table-column prop="id" label="编号" width="80"></el-table-column>
        <el-table-column prop="cname" label="商品名"></el-table-column>
        <el-table-column prop="price" label="价格"></el-table-column>
        <el-table-column prop="category" label="类别"></el-table-column>
        <el-table-column prop="payWay" label="支付方式"></el-table-column>
        <el-table-column prop="location" label="地点"></el-table-column>
        <el-table-column prop="time" label="时间"></el-table-column>
      </el-table>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        queryForm: {
          cname: "",
          timeRange: [],
        },
        consumeData: [], // 消费记录
        filteredData: [], // 过滤后的记录
      };
    },
    methods: {
      searchConsume() {
        
      },
    },
    created() {
      // 模拟获取数据
      this.consumeData = [
        
      ];
      this.filteredData = this.consumeData; // 初始化显示所有数据
    },
  };
  </script>
  
  <style scoped>
  h2 {
    margin-bottom: 20px;
  }
  </style>
  