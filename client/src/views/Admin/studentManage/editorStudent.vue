<template>
  <div>
    <el-form style="width: 60%" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="学生姓名" prop="sname">
        <el-input v-model="ruleForm.sname" :value="ruleForm.sname"></el-input>
      </el-form-item>
      <el-form-item label="初始密码" prop="password">
        <el-input v-model="ruleForm.password" :value="ruleForm.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
        <el-button @click="test">test</el-button>
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
      },
      rules: {
        sname: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
        ],
      },
    };
  },
  created() {
    if (this.$route.query.sid === undefined) {
      this.ruleForm.sid = 1;
    } else {
      this.ruleForm.sid = this.$route.query.sid;
    }
    axios.get(`${BASE_URL}/student/findById/${this.ruleForm.sid}`).then((resp) => {
      Object.assign(this.ruleForm, resp.data); // 合并数据
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