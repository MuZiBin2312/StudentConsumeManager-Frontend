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
            <el-select v-model="filters.consumptionType" placeholder="消费类别">
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

          <el-col :span="4">
            <el-switch
                v-model="filters.isFuzzySearch"
                active-text="模糊搜索"
                inactive-text="精准搜索"
            ></el-switch>
          </el-col>



        </el-row>

        <el-row :gutter="20" style="margin-bottom: 20px;">
          <el-col :span="4">
            <el-input v-model="filters.recordId" placeholder="编号"></el-input>
          </el-col>
          <el-col :span="4">
            <el-input v-model="filters.studentId" placeholder="学号"></el-input>
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
                  accept=".xlsx"
              >
                <span>批量导入</span>
              </el-upload>
            </el-button>
          </el-col>

          <el-col :span="2">
            <el-button type="info" @click="downloadTemplate">
              下载模板
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
          <el-table-column prop="recordId" label="编号" width="80">
            <template slot="header">
              <div style="display: flex; align-items: center">
                编号
                <el-button
                    size="mini"
                    type="text"
                    @click="toggleIndexSortOrder"
                    style="margin-left: 5px"
                >
                  {{ indexSortOrder === 'desc' ? '降序' : '升序' }}
                </el-button>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="商品名"></el-table-column>
          <el-table-column prop="amount" label="金额"></el-table-column>
          <el-table-column prop="consumptionType" label="消费类别"></el-table-column>
          <el-table-column prop="time" label="时间"></el-table-column>
          <el-table-column prop="paymentType" label="支付方式"></el-table-column>
          <el-table-column prop="location" label="位置"></el-table-column>
          <el-table-column prop="studentId" label="学号"></el-table-column>
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
          <!-- 输入页码并跳转 -->
          <el-input
              v-model.number="targetPage"
              placeholder="页码"
              style="width: 100px; margin-left: 10px;"
              size="small"
              type="number"
              :min="1"
              :max="totalPages"
          />
          <el-button
              type="primary"
              size="small"
              @click="jumpToPage"
              style="margin-left: 10px;"
          >
            跳转
          </el-button>

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
        <el-form-item label="金额">
          <el-input v-model.number="form.amount"></el-input>
        </el-form-item>
        <el-form-item label="消费类别">
          <el-select v-model="form.consumptionType" placeholder="请选择消费类别">
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
      indexSortOrder: "asc", // 默认升序
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
        isFuzzySearch: false, // 模糊查询开关
      },
      selectedRows: [],
      currentPage: 1,
      pageSize: 10,
      targetPage: null, // 目标页码
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.consumeList.length / this.pageSize); // 总页数
    },
    // 计算当前页的数据
    currentPageData() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = this.currentPage * this.pageSize;
      return this.consumeList.slice(start, end);
    },
  },
  methods: {
    downloadTemplate() {
      axios
          .get(`${BASE_URL}/record/exportExcel`, {
            responseType: "blob", // 指定返回数据类型为 Blob
          })
          .then((response) => {
            // 创建 Blob 对象并生成下载链接
            const blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            const url = window.URL.createObjectURL(blob);

            // 创建一个隐藏的链接并触发下载
            const link = document.createElement("a");
            link.href = url;
            link.download = "消费记录模板.xlsx"; // 设置下载文件名
            document.body.appendChild(link);
            link.click();

            // 清理链接和对象
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            // 提示用户下载成功
            this.$message.success("模板下载成功");
          })
          .catch((error) => {
            console.error(error);
            this.$message.error("模板下载失败，请重试");
          });
    },
    toggleIndexSortOrder() {
      this.indexSortOrder = this.indexSortOrder === "desc" ? "asc" : "desc";
      this.sortByIndex();
    },
    sortByIndex() {
      this.consumeList.sort((a, b) => {
        return this.indexSortOrder === "desc" ? b.recordId - a.recordId : a.recordId - b.recordId;
      });
    },
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
              (!this.filters.paymentType ||
                  (this.filters.isFuzzySearch
                      ? record.paymentType.includes(this.filters.paymentType)
                      : record.paymentType === this.filters.paymentType)) &&
              (!this.filters.consumptionType ||
                  (this.filters.isFuzzySearch
                      ? record.consumptionType.includes(this.filters.consumptionType)
                      : record.consumptionType === this.filters.consumptionType)) &&
              (!this.filters.location ||
                  (this.filters.isFuzzySearch
                      ? record.location.includes(this.filters.location)
                      : record.location === this.filters.location)) &&
              (!this.filters.name ||
                  (this.filters.isFuzzySearch
                      ? record.name.includes(this.filters.name)
                      : record.name === this.filters.name)) &&
              (!this.filters.recordId ||
                  (this.filters.isFuzzySearch
                      ? record.recordId.toString().includes(this.filters.recordId)
                      : record.recordId.toString() === this.filters.recordId)) &&
              (!this.filters.studentId ||
                  (this.filters.isFuzzySearch
                      ? record.studentId.toString().includes(this.filters.studentId)
                      : record.studentId.toString() === this.filters.studentId))
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
      this.$confirm(
          `确定要删除编号为 ${record.recordId} 的消费记录吗？`,
          "确认删除",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
      )
          .then(() => {
            axios
                .delete(`${BASE_URL}/record/delete/${record.recordId}`)
                .then(() => {
                  this.$message.success("记录删除成功");
                  this.fetchConsumeData();
                });
          })
          .catch(() => {
            this.$message.info("已取消删除");
          });
    },
    batchDelete() {
      const ids = this.selectedRows.map((row) => row.recordId);
      this.$confirm(
          `确定要删除选中的 ${ids.length} 条记录吗？`,
          "确认批量删除",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
      )
          .then(() => {
            axios
                .delete(`${BASE_URL}/record/batchDelete`, { data: ids })
                .then(() => {
                  this.$message.success("批量删除成功");
                  this.fetchConsumeData();
                });
          })
          .catch(() => {
            this.$message.info("已取消删除");
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
    jumpToPage() {
      if (this.targetPage && this.targetPage >= 1 && this.targetPage <= this.totalPages) {
        this.currentPage = this.targetPage;
      } else {
        this.$message.error("输入页码无效，已超出页码范围");
      }
    },
  },
  mounted() {
    this.fetchConsumeData();
  },
};
</script>
