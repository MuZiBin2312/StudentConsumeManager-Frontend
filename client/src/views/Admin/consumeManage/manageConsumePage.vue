<template>
  <div>
    <el-container>
      <el-main>
        <!-- 筛选条件 -->
        <el-row :gutter="20" style="margin-bottom: 20px;">
          <el-col :span="4">
            <el-select v-model="filters.paymentType" placeholder="支付方式">
              <el-option
                  v-for="(item, index) in paymentOptions"
                  :key="index"
                  :label="item"
                  :value="item"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-select v-model="filters.consumptionType" placeholder="类别">
              <el-option
                  v-for="(item, index) in consumptionOptions"
                  :key="index"
                  :label="item"
                  :value="item"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-select v-model="filters.location" placeholder="位置">
              <el-option
                  v-for="(item, index) in locationOptions"
                  :key="index"
                  :label="item"
                  :value="item"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-input v-model="filters.name" placeholder="商品名"></el-input>
          </el-col>
        </el-row>

        <el-row :gutter="20" style="margin-bottom: 20px;">
          <el-col :span="4">
            <el-input v-model="filters.recordId" placeholder="编号"></el-input>
          </el-col>
          <el-col :span="4">
            <el-input v-model="filters.studentId" placeholder="消费者ID"></el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="applyFilters">筛选</el-button>
            <el-button type="warning" @click="resetFilters" style="margin-left: 10px;">重置</el-button>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="2">
            <el-button type="primary" @click="fetchConsumeData">刷新数据</el-button>
          </el-col>
          <el-col :span="2">
            <el-button type="success" @click="openAddDialog">新增记录</el-button>
          </el-col>
          <el-col :span="2">
            <el-button type="info">
              <el-upload
                  action=""
                  :http-request="handleFileUpload"
                  :show-file-list="false"
                  accept=".csv"
              >
                <span>批量导入</span>
              </el-upload>
            </el-button>
          </el-col>
          <el-col :span="2">
            <el-button
                type="danger"
                @click="batchDelete"
                :disabled="!selectedRows.length"
            >
              批量删除
            </el-button>
          </el-col>
        </el-row>

        <el-table
            :data="currentPageData"
            style="width: 100%"
            @selection-change="handleSelectionChange"
            ref="consumeTable"
        >
          <el-table-column type="selection" width="55"></el-table-column>
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
        <!-- 分页组件 -->
        <!-- 分页组件居中 -->
        <div style="display: flex; justify-content: center; margin-top: 20px;">
          <el-pagination
              background
              layout="prev, pager, next"
              :total="consumeList.length"
              :page-size="pageSize"
              :current-page.sync="currentPage"
              @current-change="handlePageChange"
          />
        </div>
      </el-main>
    </el-container>

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
import axios from "axios";
import { BASE_URL } from "@/config";

export default {
  data() {
    return {
      consumeList: [], // 全部数据
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
      paymentOptions: [],
      consumptionOptions: [],
      locationOptions: [],
      filters: {
        paymentType: "",
        consumptionType: "",
        location: "",
        name: "",
        recordId: "",
        studentId: "",
      },
      selectedRows: [],
      currentPage: 1,
      pageSize: 10,
    };
  },
  computed: {
    // 计算当前页的数据
    currentPageData() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = this.currentPage * this.pageSize;
      return this.consumeList.slice(start, end);
    },
  },
  methods: {
    fetchConsumeData() {
      const userType = sessionStorage.getItem("type");
      const userId = sessionStorage.getItem("id");

      axios.get(`${BASE_URL}/record/all`).then((response) => {
        const allRecords = response.data.data;

        this.paymentOptions = [...new Set(allRecords.map(record => record.paymentType))];
        this.consumptionOptions = [...new Set(allRecords.map(record => record.consumptionType))];
        this.locationOptions = [...new Set(allRecords.map(record => record.location))];

        let filteredRecords = allRecords;
        if (userType === 'student') {
          filteredRecords = allRecords.filter(record => record.studentId === userId);
        }

        this.consumeList = filteredRecords.filter(record => {
          return (
              (!this.filters.paymentType || record.paymentType === this.filters.paymentType) &&
              (!this.filters.consumptionType || record.consumptionType === this.filters.consumptionType) &&
              (!this.filters.location || record.location === this.filters.location) &&
              (!this.filters.name || record.name.includes(this.filters.name)) &&
              (!this.filters.recordId || record.recordId.toString().includes(this.filters.recordId)) &&
              (!this.filters.studentId || record.studentId.toString().includes(this.filters.studentId))
          );
        });
      });
    },
    applyFilters() {
      this.fetchConsumeData();
    },
    resetFilters() {
      this.filters = {
        paymentType: "",
        consumptionType: "",
        location: "",
        name: "",
        recordId: "",
        studentId: "",
      };
      this.fetchConsumeData();
    },
    openAddDialog() {
      this.isEdit = false;
      this.form = {
        recordId: null,
        name: "",
        amount: null,
        consumptionType: "",
        time: this.getCurrentTime(),
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
          this.$message.success("记录更新成功");
          this.dialogVisible = false;
          this.fetchConsumeData();
        });
      } else {
        axios.post(`${BASE_URL}/record/addRecord`, this.form).then(() => {
          this.$message.success("记录添加成功");
          this.dialogVisible = false;
          this.fetchConsumeData();
        });
      }
    },
    deleteConsume(record) {
      axios.delete(`${BASE_URL}/record/delete/${record.recordId}`).then(() => {
        this.$message.success("记录删除成功");
        this.fetchConsumeData();
      });
    },
    batchDelete() {
      const ids = this.selectedRows.map((row) => row.recordId);
      axios.delete(`${BASE_URL}/record/batchDelete`, { data: ids }).then(() => {
        this.$message.success("批量删除成功");
        this.fetchConsumeData();
      });
    },
    handleSelectionChange(selection) {
      this.selectedRows = selection;
    },
    handleFileUpload({ file }) {
      const formData = new FormData();
      formData.append("file", file);
      axios.post(`${BASE_URL}/record/import`, formData).then(() => {
        this.$message.success("批量导入成功");
        this.fetchConsumeData();
      }).catch(() => {
        this.$message.error("批量导入失败");
      });
    },
    getCurrentTime() {
      const now = new Date();
      return now.toISOString().slice(0, 19).replace("T", " ");
    },
    // 分页切换处理函数
    handlePageChange(page) {
      this.currentPage = page;
    },
  },
  mounted() {
    this.fetchConsumeData();
  },
};
</script>
