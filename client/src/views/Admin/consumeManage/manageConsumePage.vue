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
        <el-form-item label="消费编号" >
          <span>{{ form.recordId }}</span>
        </el-form-item>
        <el-form-item label="商品名">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="价格">
          <el-input v-model.number="form.amount"></el-input>
        </el-form-item>
        <el-form-item label="类别">
          <el-input v-model="form.consumptionType"></el-input>
        </el-form-item>
        <el-form-item label="时间">
          <el-input v-model="form.time"></el-input>
        </el-form-item>
        <el-form-item label="支付方式">
          <el-input v-model="form.paymentType"></el-input>
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

export default {
  data() {
    return {
      consumeList: [],
      dialogVisible: false,
      form: {
        recordId:'',
        name: '',
        amount: null,
        consumptionType: '',
        time: '',
        paymentType:'',
        location:'',
        consumerID:null,
      },
      isEdit: false,
    };
  },
  methods: {
    fetchConsumeData() {
      axios.get('http://192.168.76.30:10085/record/all').then((response) => {
        console.log(sessionStorage.getItem('id'));
        this.consumeList = response.data.data;
        
        
      });
    },
    openAddDialog() {
      this.isEdit = false;
      this.form = { recordId: null}; // 重置表单
      this.dialogVisible = true;
    },
    openEditDialog(row) {
      this.isEdit = true;
      this.form = { ...row };
      this.dialogVisible = true;
    },
    saveConsume() {
      this.form.studentId = sessionStorage.getItem('id');
      console.log(this.form);
      
      if (this.isEdit) {

        axios.put(`http://192.168.76.30:10085/record/${this.form.recordId}`, this.form).then(() => {
          this.$message.success('记录更新成功');
          this.dialogVisible = false;
          this.fetchConsumeData();
        });
      } else {
        axios.post('http://192.168.76.30:10085/record/addRecord', this.form).then(() => {
          this.$message.success('记录添加成功');
          this.dialogVisible = false;
          this.fetchConsumeData();
        });
      }
    },
    deleteConsume(recordId) {
      console.log(recordId);
      
      axios.delete(`http://192.168.76.30:10085/record/delete/${recordId.recordId}`).then(() => {
        this.$message.success('记录删除成功');
        this.fetchConsumeData();
      });
    },
  },
  mounted() {
    this.fetchConsumeData();
  },
};
</script>
