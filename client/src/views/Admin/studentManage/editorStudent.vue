<template>
  <div>
    <div
        style="
        width: 90%;
        margin: 50px auto;
        padding: 50px;
        border: 3px solid #dcdcdc;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
        border-radius: 15px;
        background-color: #ffffff;
      "
    >
      <h2 style="text-align: left; margin-bottom: 40px; font-size: 24px;">修改学生信息</h2>
      <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="120px"
          style="font-size: 16px;"
      >
        <div
            style="
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 30px 40px;
          "
        >
          <!-- 第一列 -->
          <el-form-item label="学生ID" prop="sid">
            <el-input
                v-model="ruleForm.sid"
                placeholder="请输入学生ID"
                style="width: 280px; height: 40px; font-size: 15px;"
                disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
                v-model="ruleForm.password"
                show-password
                placeholder="请输入密码"
                style="width: 280px; height: 40px; font-size: 15px;"
            ></el-input>
          </el-form-item>
          <!-- 第二列 -->
          <el-form-item label="姓名" prop="sname">
            <el-input
                v-model="ruleForm.sname"
                placeholder="请输入学生姓名"
                style="width: 280px; height: 40px; font-size: 15px;"
            ></el-input>
          </el-form-item>
          <el-form-item label="民族" prop="ethnicity">
            <el-select
                v-model="ruleForm.ethnicity"
                placeholder="请选择民族"
                style="width: 280px; height: 40px; font-size: 15px;"
            >
              <el-option
                  v-for="ethnicity in ethnicities"
                  :key="ethnicity"
                  :label="ethnicity"
                  :value="ethnicity"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- 第三列 -->
          <el-form-item label="身份证号" prop="idNumber">
            <el-input
                v-model="ruleForm.idNumber"
                placeholder="请输入身份证号"
                style="width: 280px; height: 40px; font-size: 15px;"
            ></el-input>
          </el-form-item>
          <el-form-item label="政治面貌" prop="politicalStatus">
            <el-select
                v-model="ruleForm.politicalStatus"
                placeholder="请选择政治面貌"
                style="width: 280px; height: 40px; font-size: 15px;"
            >
              <el-option label="党员" value="党员"></el-option>
              <el-option label="团员" value="团员"></el-option>
              <el-option label="群众" value="群众"></el-option>
            </el-select>
          </el-form-item>
          <!-- 第四列 -->
          <el-form-item label="校区" prop="campus">
            <el-select
                v-model="ruleForm.campus"
                placeholder="请选择校区"
                style="width: 280px; height: 40px; font-size: 15px;"
            >
              <el-option label="南校区" value="南校区"></el-option>
              <el-option label="北校区" value="北校区"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="学院" prop="college">
            <el-select
                v-model="ruleForm.college"
                placeholder="请选择学院"
                style="width: 280px; height: 40px; font-size: 15px;"
            >
              <el-option
                  v-for="college in colleges"
                  :key="college"
                  :label="college"
                  :value="college"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- 第五列 -->
          <el-form-item label="专业" prop="subject">
            <el-input
                v-model="ruleForm.subject"
                placeholder="请输入专业"
                style="width: 280px; height: 40px; font-size: 15px;"
            ></el-input>
          </el-form-item>
          <el-form-item label="年级" prop="grade">
            <el-select
                v-model="ruleForm.grade"
                placeholder="请选择年级"
                style="width: 260px; height: 40px; font-size: 15px;"
            >
              <el-option
                  v-for="year in years"
                  :key="year"
                  :label="`${year}级`"
                  :value="`${year}级`"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <!-- 按钮 -->
        <el-form-item style="text-align: center; margin-top: 40px; margin-left: -50px;">
          <el-button type="primary" @click="submitForm('ruleForm')" style="padding: 12px 30px;">
            提交
          </el-button>
          <el-button
              @click="resetForm('ruleForm')"
              style="padding: 12px 30px; margin-left: 30px;"
          >
            重置
          </el-button>
          <el-button @click="test" style="padding: 12px 30px; margin-left: 30px;">测试</el-button>
        </el-form-item>
      </el-form>
    </div>
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
      ethnicities: ["汉族", "蒙古族", "回族", "藏族", "维吾尔族", "苗族", "彝族", "壮族", "布依族", "朝鲜族",
        "满族", "侗族", "瑶族", "白族", "土家族", "哈尼族", "哈萨克族", "傣族", "黎族", "僳僳族",
        "佤族", "畲族", "高山族", "拉祜族", "水族", "东乡族", "纳西族", "景颇族", "柯尔克孜族",
        "土族", "达斡尔族", "仫佬族", "羌族", "布朗族", "撒拉族", "毛南族", "仡佬族", "锡伯族",
        "阿昌族", "普米族", "塔吉克族", "怒族", "乌孜别克族", "俄罗斯族", "鄂温克族", "德昂族",
        "保安族", "裕固族", "京族", "塔塔尔族", "独龙族", "鄂伦春族", "赫哲族", "门巴族",
        "珞巴族", "基诺族",],
      years: [2018, 2019, 2020, 2021, 2022, 2023, 2024],
      colleges: [
        "计算机学院",
        "软件学院",
        "法学院",
        "商学院",
        "文学与新闻传播学院",
        "外国语学院",
        "数学与统计学院",
        "物理与电子学院",
        "化学与材料学院",
        "生命科学学院",],
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
    if (this.$route.query.sid === undefined) {
      this.ruleForm.sid = 1;
    } else {
      this.ruleForm.sid = this.$route.query.sid;
    }

    axios.get(`${BASE_URL}/student/findById/${this.ruleForm.sid}`).then((resp) => {
      const studentData = resp.data;

      // 格式化年级
      if (studentData.grade && !studentData.grade.includes("级")) {
        studentData.grade += "级";
      }

      Object.assign(this.ruleForm, studentData);
    });
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
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
                this.$message.error('请求失败，请检查网络或服务器');
              });
        } else {
          console.log("校验失败");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    test() {
      console.log(this.ruleForm);
    },
  },
};
</script>