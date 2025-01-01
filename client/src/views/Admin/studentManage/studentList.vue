<template>
  <div>
    <el-table
        :data="tableData"
        border
        stripe
        style="width: 100%"
        :header-cell-style="{ backgroundColor: '#f5f5f5', color: '#333', fontWeight: 'bold' }"
        :cell-style="{ whiteSpace: 'nowrap' }"
        :style="{ minWidth: '800px' }"
    >
      <!-- 序号列 -->
      <el-table-column
          fixed="left"
          label="序号"
          width="75"
          align="center"
      >
        <template slot-scope="scope">
          {{ (currentPage - 1) * pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>

      <!-- 学号 -->
      <el-table-column
          prop="sid"
          label="学号"
          width="115"
          fixed="left"
      />

      <!-- 姓名 -->
      <el-table-column
          prop="sname"
          label="姓名"
          width="115"
      />

      <!-- 密码 -->
      <el-table-column
          prop="password"
          label="密码"
          width="145"
      >
        <template slot-scope="scope">
          <span>
            {{ scope.row.passwordVisible ? scope.row.password : '●●●●●●' }}
          </span>
          <el-button
              @click="togglePasswordVisibility(scope.row)"
              type="text"
              icon="el-icon-view"
              style="margin-left: 10px; padding: 0; font-size: 14px;"
          />
        </template>
      </el-table-column>

      <!-- 学院 -->
      <el-table-column
          prop="college"
          label="学院"
          width="145"
      />

      <!-- 民族 -->
      <el-table-column
          prop="ethnicity"
          label="民族"
          width="95"
      />

      <!-- 身份证号 -->
      <el-table-column
          prop="idNumber"
          label="身份证号"
          width="175"
      />

      <!-- 政治面貌 -->
      <el-table-column
          prop="politicalStatus"
          label="政治面貌"
          width="115"
      />

      <!-- 年级 -->
      <el-table-column
          prop="grade"
          label="年级"
          width="95"
      />

      <!-- 专业 -->
      <el-table-column
          prop="subject"
          label="专业"
          width="145"
      />

      <!-- 校区 -->
      <el-table-column
          prop="campus"
          label="校区"
          width="115"
      />

      <!-- 操作 -->
      <el-table-column
          fixed="right"
          label="操作"
          width="145"
      >
        <template slot-scope="scope">
          <el-button
              @click="editor(scope.row)"
              type="primary"
              icon="el-icon-edit"
              size="mini"
              style="margin-right: 5px;"
          />
          <el-popconfirm
              confirm-button-text="删除"
              cancel-button-text="取消"
              icon="el-icon-warning"
              icon-color="red"
              title="删除后无法恢复，确认继续？"
              @confirm="deleteStudent(scope.row)"
          >
            <el-button
                slot="reference"
                type="danger"
                icon="el-icon-delete"
                size="mini"
            />
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <div style="display: flex; justify-content: right; margin-top: 20px;">
      <el-pagination
          background
          layout="prev, pager, next, jumper, total"
          :total="total"
          :page-size="pageSize"
          :current-page="currentPage"
          @current-change="changePage"
      />
    </div>
  </div>
</template>

<script>
import { BASE_URL } from "@/config";

export default {
  data() {
    return {
      tableData: null,
      pageSize: 10,
      total: null,
      currentPage: 1,
      ruleForm: null,
      tmpList: null,
    };
  },
  methods: {
    deleteStudent(row) {
      const that = this;
      axios
          .get(`${BASE_URL}/student/deleteById/` + row.sid)
          .then(function (resp) {
            if (resp.data === true) {
              that.$message({
                showClose: true,
                message: "删除成功",
                type: "success",
              });
              if (that.tmpList === null) {
                window.location.reload();
              } else {
                that.$router.push("/queryStudent");
              }
            } else {
              that.$message({
                showClose: true,
                message: "删除出错，请检查数据库连接",
                type: "error",
              });
            }
          })
          .catch(function () {
            that.$message({
              showClose: true,
              message: "删除失败，可能存在外键依赖",
              type: "error",
            });
          });
    },
    changePage(page) {
      this.currentPage = page;
      page -= 1;
      if (this.tmpList === null) {
        const that = this;
        axios
            .get(`${BASE_URL}/student/findByPage/${page}/${that.pageSize}`)
            .then(function (resp) {
              that.tableData = resp.data.map((item) => ({
                ...item,
                passwordVisible: false,
              }));
            });
      } else {
        const that = this;
        const start = page * that.pageSize,
            end = that.pageSize * (page + 1);
        const length = that.tmpList.length;
        const ans = end < length ? end : length;
        that.tableData = that.tmpList.slice(start, ans).map((item) => ({
          ...item,
          passwordVisible: false,
        }));
      }
    },
    editor(row) {
      this.$router.push({
        path: "/editorStudent",
        query: {
          sid: row.sid,
        },
      });
    },
    togglePasswordVisibility(row) {
      row.passwordVisible = !row.passwordVisible;
    },
  },
  created() {
    if (this.tmpList !== null) this.tmpList = null;
    const that = this;
    this.ruleForm = this.$route.query.ruleForm;
    if (
        this.$route.query.ruleForm === undefined ||
        (this.ruleForm.sid === null && this.ruleForm.sname === null)
    ) {
      axios.get(`${BASE_URL}/student/getLength`).then(function (resp) {
        that.total = resp.data;
      });
      axios
          .get(`${BASE_URL}/student/findByPage/0/${that.pageSize}`)
          .then(function (resp) {
            that.tableData = resp.data.map((item) => ({
              ...item,
              passwordVisible: false,
            }));
          });
    } else {
      axios
          .post(`${BASE_URL}/student/findBySearch`, this.ruleForm)
          .then(function (resp) {
            that.tmpList = resp.data;
            that.total = resp.data.length;
            const start = 0,
                end = that.pageSize;
            const length = that.tmpList.length;
            const ans = end < length ? end : length;
            that.tableData = that.tmpList.slice(start, ans).map((item) => ({
              ...item,
              passwordVisible: false,
            }));
          });
    }
  },
};
</script>