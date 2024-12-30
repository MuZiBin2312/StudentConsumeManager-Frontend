<template>
  <div>
    <el-form style="width: 60%" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <!-- 学生姓名 -->
      <el-form-item label="学生姓名" prop="sname">
        <el-input v-model="ruleForm.sname"></el-input>
      </el-form-item>
      <!-- 初始密码 -->
      <el-form-item label="初始密码" prop="password">
        <el-input type="password" v-model="ruleForm.password"></el-input>
      </el-form-item>
      <!-- 学院 -->
      <el-form-item label="学院" prop="college">
        <el-input v-model="ruleForm.college"></el-input>
      </el-form-item>
      <!-- 民族 -->
      <el-form-item label="民族" prop="ethnicity">
        <el-input v-model="ruleForm.ethnicity"></el-input>
      </el-form-item>
      <!-- 身份证号 -->
      <el-form-item label="身份证号" prop="idNumber">
        <el-input v-model="ruleForm.idNumber"></el-input>
      </el-form-item>
      <!-- 政治面貌 -->
      <el-form-item label="政治面貌" prop="politicalStatus">
        <el-input v-model="ruleForm.politicalStatus"></el-input>
      </el-form-item>
      <!-- 年级 -->
      <el-form-item label="年级" prop="grade">
        <el-input v-model="ruleForm.grade"></el-input>
      </el-form-item>
      <!-- 专业 -->
      <el-form-item label="专业" prop="subject">
        <el-input v-model="ruleForm.subject"></el-input>
      </el-form-item>
      <!-- 校区 -->
      <el-form-item label="校区" prop="campus">
        <el-input v-model="ruleForm.campus"></el-input>
      </el-form-item>
      <!-- 提交与重置按钮 -->
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
        <el-button @click="test">测试</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { BASE_URL } from "@/config";
import axios from "axios";

export default {
  data() {
    return {
      ruleForm: {
        sid: null,
        sname: null,
        password: null,
        college: null,
        ethnicity: null,
        idNumber: null,
        politicalStatus: null,
        grade: null,
        subject: null,
        campus: null,
      },
      rules: {
        sname: [
          { required: true, message: '请输入学生姓名', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入初始密码', trigger: 'blur' },
        ],
        college: [
          { required: true, message: '请输入学院', trigger: 'blur' },
        ],
        ethnicity: [
          { required: true, message: '请输入民族', trigger: 'blur' },
        ],
        idNumber: [
          { required: true, message: '请输入身份证号', trigger: 'blur' },
        ],
        politicalStatus: [
          { required: true, message: '请输入政治面貌', trigger: 'blur' },
        ],
        grade: [
          { required: true, message: '请输入年级', trigger: 'blur' },
        ],
        subject: [
          { required: true, message: '请输入专业', trigger: 'blur' },
        ],
        campus: [
          { required: true, message: '请输入校区', trigger: 'blur' },
        ],
      },
    };
  },
  created() {
    // 获取学生 ID
    if (this.$route.query.sid === undefined) {
      this.ruleForm.sid = 1;
    } else {
      this.ruleForm.sid = this.$route.query.sid;
    }
    // 根据 ID 获取学生信息
    axios.get(`${BASE_URL}/student/findById/${this.ruleForm.sid}`).then((resp) => {
      Object.assign(this.ruleForm, resp.data); // 合并返回的数据
    });
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log("当前表单数据：", this.ruleForm);
          axios.post(`${BASE_URL}/student/updateStudent`, this.ruleForm)
              .then((resp) => {
                if (resp.data === true) {
                  this.$message({
                    showClose: true,
                    message: '编辑成功',
                    type: 'success',
                  });
                  this.$router.push("/studentList");
                } else {
                  this.$message.error('编辑失败，请检查数据库');
                }
              })
              .catch((error) => {
                console.error("请求失败：", error);
                this.$message.error('请求失败，请检查网络或联系管理员');
              });
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    test() {
      console.log("当前表单数据：", this.ruleForm);
    },
  },
};
</script>