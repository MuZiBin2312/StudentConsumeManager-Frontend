<template>
  <div>
    <el-container>
      <el-main>
        <el-button type="primary" @click="fetchConsumeData">刷新数据</el-button>
        <el-button type="success" @click="openAddDialog">新增记录</el-button>
        <el-table :data="consumeList" style="width: 100%">
          <el-table-column prop="recordId" label="编号" width="80"></el-table-column>
          <el-table-column prop="name" label="商品名"></el-table-column>
          <el-table-column prop="amount" label="价格"></el-table-column>
          <el-table-column prop="consumptionType" label="类别"></el-table-column>
          <el-table-column prop="time" label="时间"></el-table-column>
          <el-table-column prop="paymentType" label="支付方式"></el-table-column>
          <el-table-column prop="location" label="位置"></el-table-column>
          <el-table-column prop="studentId" label="消费者ID"></el-table-column>
          <el-table-column label="操作" width="180">
            <template #default="scope">
              <el-button size="mini" type="warning" @click="openEditDialog(scope.row)">编辑</el-button>
              <el-button size="mini" type="danger" @click="deleteConsume(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>

    <!-- 添加和编辑对话框 -->
    <el-dialog :visible.sync="dialogVisible" title="消费记录">
      <el-form :model="form">
        <el-form-item label="消费编号(自增)">
          <span>{{ form.recordId }}</span>
        </el-form-item>
        <el-form-item label="商品名">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="价格">
          <el-input v-model.number="form.amount"></el-input>
        </el-form-item>
        <el-form-item label="类别">
          <el-select v-model="form.consumptionType" placeholder="请选择类别">
            <el-option
              v-for="(item, index) in consumptionOptions"
              :key="index"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间">
          <el-date-picker
            v-model="form.time"
            type="datetime"
            format="yyyy-MM-DD HH:mm:ss"
            value-format="yyyy-MM-DD HH:mm:ss"
            placeholder="选择时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="支付方式">
          <el-select v-model="form.paymentType" placeholder="请选择支付方式">
            <el-option
              v-for="(item, index) in paymentOptions"
              :key="index"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="地点">
          <el-input v-model="form.location"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveConsume">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios';
import {BASE_URL} from "@/config";
export default {
  data() {
    return {
      consumeList: [],
      dialogVisible: false,
      form: {
        recordId: "",
        name: "",
        amount: null,
        consumptionType: "",
        time: "",
        paymentType: "",
        location: "",
        studentId: null,
      },
      isEdit: false,
      paymentOptions: ["校园卡", "微信", "支付宝", "现金", "银行卡", "其他", "test"], // 支付方式选项
      consumptionOptions: ["餐饮消费", "学习用品", "娱乐消费", "生活服务", "交通出行", "其他", "test"], // 消费类别选项
    };
  },
  methods: {
    fetchConsumeData() {
      console.log(sessionStorage.getItem('id'));
      axios.get(`${BASE_URL}/record/all`).then((response) => {
        console.log(sessionStorage.getItem('id'));
        this.consumeList = response.data.data;
                
        this.consumeList = response.data.data;
      });
    },
    openAddDialog() {
      this.isEdit = false;
      this.form = {
        recordId: null,
        name: "",
        amount: null,
        consumptionType: "",
        time: this.getCurrentTime(), // 默认当前时间
        paymentType: "",
        location: "",
      };
      this.dialogVisible = true;
    },
    openEditDialog(row) {
      this.isEdit = true;
      this.form = { ...row };
      this.dialogVisible = true;
    },
    saveConsume() {
      this.form.studentId = sessionStorage.getItem("id");
      if (this.isEdit) {

        axios.put(`${BASE_URL}/record/${this.form.recordId}`, this.form).then(() => {
          this.$message.success('记录更新成功');
          this.dialogVisible = false;
          this.fetchConsumeData();
        });
      } else {
        axios.post(`${BASE_URL}/record/addRecord`, this.form).then(() => {
          this.$message.success('记录添加成功');
          this.dialogVisible = false;
          this.fetchConsumeData();
        });
      }
    },
    deleteConsume(recordId) {
      console.log(recordId);
      
      axios.delete(`${BASE_URL}/record/delete/${recordId.recordId}`).then(() => {
        this.$message.success('记录删除成功');
        this.fetchConsumeData();
      });    },
    getCurrentTime() {
      const now = new Date();
      return now.toISOString().slice(0, 19).replace("T", " "); // 格式化为 yyyy-MM-dd HH:mm:ss
    },
  },
  mounted() {
    this.fetchConsumeData();
  },
};
</script>
