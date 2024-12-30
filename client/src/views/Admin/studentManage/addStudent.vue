<template>
  <div>
    <el-form
        style="width: 60%; margin: 20px auto;"
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="120px"
        class="demo-ruleForm"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="学生ID" prop="sid">
            <el-input v-model="ruleForm.sid"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="学生姓名" prop="sname">
            <el-input v-model="ruleForm.sname"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="初始密码" prop="password">
            <el-input v-model="ruleForm.password" show-password></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="校区" prop="campus">
            <el-select v-model="ruleForm.campus" placeholder="请选择校区">
              <el-option label="南校区" value="南校区"></el-option>
              <el-option label="北校区" value="北校区"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="学院" prop="college">
            <el-select v-model="ruleForm.college" placeholder="请选择学院">
              <el-option
                  v-for="college in colleges"
                  :key="college"
                  :label="college"
                  :value="college"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="民族" prop="ethnicity">
            <el-select v-model="ruleForm.ethnicity" placeholder="请选择民族">
              <el-option
                  v-for="ethnicity in ethnicities"
                  :key="ethnicity"
                  :label="ethnicity"
                  :value="ethnicity"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="身份证号" prop="idNumber">
            <el-input v-model="ruleForm.idNumber"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="政治面貌" prop="politicalStatus">
            <el-select v-model="ruleForm.politicalStatus" placeholder="请选择政治面貌">
              <el-option label="党员" value="党员"></el-option>
              <el-option label="团员" value="团员"></el-option>
              <el-option label="群众" value="群众"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="年级" prop="grade">
            <el-select v-model="ruleForm.grade" placeholder="请选择年级">
              <el-option
                  v-for="year in years"
                  :key="year"
                  :label="`${year}级`"
                  :value="year"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="专业" prop="subject">
            <el-input v-model="ruleForm.subject"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item style="text-align: center;">
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
        college: null,
        ethnicity: null,
        idNumber: null,
        politicalStatus: null,
        grade: null,
        subject: null,
        campus: null,
      },
      rules: {
        sid: [{ required: true, message: "请输入学生ID", trigger: "blur" }],
        sname: [{ required: true, message: "请输入学生姓名", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        college: [{ required: true, message: "请选择学院", trigger: "change" }],
        ethnicity: [{ required: true, message: "请选择民族", trigger: "change" }],
        idNumber: [
          { required: true, message: "请输入身份证号", trigger: "blur" },
        ],
        politicalStatus: [
          { required: true, message: "请选择政治面貌", trigger: "change" },
        ],
        grade: [{ required: true, message: "请选择年级", trigger: "change" }],
        subject: [{ required: true, message: "请输入专业", trigger: "blur" }],
        campus: [{ required: true, message: "请选择校区", trigger: "change" }],
      },
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
        "生命科学学院",
      ],
      ethnicities: [
        "汉族", "蒙古族", "回族", "藏族", "维吾尔族", "苗族", "彝族", "壮族", "布依族", "朝鲜族",
        "满族", "侗族", "瑶族", "白族", "土家族", "哈尼族", "哈萨克族", "傣族", "黎族", "僳僳族",
        "佤族", "畲族", "高山族", "拉祜族", "水族", "东乡族", "纳西族", "景颇族", "柯尔克孜族",
        "土族", "达斡尔族", "仫佬族", "羌族", "布朗族", "撒拉族", "毛南族", "仡佬族", "锡伯族",
        "阿昌族", "普米族", "塔吉克族", "怒族", "乌孜别克族", "俄罗斯族", "鄂温克族", "德昂族",
        "保安族", "裕固族", "京族", "塔塔尔族", "独龙族", "鄂伦春族", "赫哲族", "门巴族",
        "珞巴族", "基诺族",
      ],
      years: ["2018", "2019", "2020", "2021", "2022", "2023", "2024"],
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const that = this;
          axios
              .post(`${BASE_URL}/student/addStudent`, this.ruleForm)
              .then((resp) => {
                if (resp.data === true) {
                  that.$message({
                    showClose: true,
                    message: "插入成功",
                    type: "success",
                  });
                  that.$router.push("/studentList");
                } else {
                  that.$message.error("插入失败，请检查数据库");
                }
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
      console.log(this.ruleForm);
    },
  },
};
</script>