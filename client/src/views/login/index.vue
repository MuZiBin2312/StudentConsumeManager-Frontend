<template>
  <div>
    <el-container>
      <el-header >
        <div style="text-align: center; font-size: 25px; font-weight: bolder">
          <i class="el-icon-s-home" style="margin-right: 25px"></i>
          学生填报系统
        </div>
      </el-header>
      <el-main>
        <el-card class="login-module">
          <div slot="header" class="clearfix">
            <span style="text-align: center; font-size: 20px; font-family: 'Microsoft YaHei'">
              <p><i class="el-icon-office-building" style="margin-right: 18px"></i>登录</p>
            </span>
          </div>
          <div>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
              <el-form-item label="用户 id" prop="id">
                <el-input v-model.number="ruleForm.id" prefix-icon="el-icon-lollipop"></el-input>
              </el-form-item>
              <el-form-item label="用户密码" prop="password">
                <el-input v-model="ruleForm.password" placeholder="请输入密码" show-password prefix-icon="el-icon-ice-cream-round"></el-input>
              </el-form-item>
              <el-form-item label="用户类型" prop="type">
                <el-radio-group v-model="ruleForm.type">
                  <el-radio label="student" value="student">学生</el-radio>
                  <el-radio label="teacher" value="teacher">老师</el-radio>
                  <el-radio label="admin" value="admin">admin</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">登 录</el-button>
                <el-button @click="resetForm('ruleForm')">重 置</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>

<style>
.login-module {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  width: 30%;
}
.el-header {
  background-color: #B3C0D1;
  color: #333;
  line-height: 60px;
}
</style>

<script>


import {BASE_URL} from "@/config";

export default {
  data() {
    return {
      ruleForm: {
        id: null,
        password: null,
        type: null,
      },
      rules: {
        id: [
          { required: true, message: '请输入用户 id', trigger: 'blur' },
          { type: 'number', message: '请输入数字', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
      }
    };
  },
  methods: {
    submitForm(formName) {

      const that = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let check = false
          let name = null
          let form = {tid: that.ruleForm.id, password: that.ruleForm.password, type: that.ruleForm.type}
          axios.get(`${BASE_URL}/info/getCurrentTerm`,{
            headers: {
              userid: form.tid, // 在 header 中加入 form.tid
              usertype: form.type
            }
          }).then(function (resp) {
            sessionStorage.setItem("currentTerm", resp.data)
          })

          axios.get(`${BASE_URL}/info/getForbidCourseSelection`,{
            headers: {
              userid: form.tid, // 在 header 中加入 form.tid
              usertype: form.type
            }}
            ).then(function (resp) {
            sessionStorage.setItem("ForbidCourseSelection", resp.data)
          })

          if (that.ruleForm.type === 'admin' || that.ruleForm.type === 'teacher') {
            let form = {tid: that.ruleForm.id, password: that.ruleForm.password, type: that.ruleForm.type}
            console.log(form)
            axios.post(`${BASE_URL}/teacher/login`, form,{ // 第三个参数是配置项
              headers: {
                userid: form.tid, // 在 header 中加入 form.tid
                usertype: form.type
              }
            }).then(function (resp) {
              console.log("教师登录验证信息：" + resp.data)
              check = resp.data
              if (check === true) {
                axios.get(`${BASE_URL}/teacher/findById/${that.ruleForm.id}`,{
                  headers: {
                    userid: form.tid, // 在 header 中加入 form.tid
                    usertype: form.type
                  }
                }).then(function (resp) {
                  console.log("登录页正在获取用户信息" + resp.data)
                  name = resp.data.tname

                  sessionStorage.clear()
                  sessionStorage.setItem("token", 'true')
                  sessionStorage.setItem("type", that.ruleForm.type)
                  sessionStorage.setItem("name", name)
                  sessionStorage.setItem("tid", resp.data.tid)
                  sessionStorage.setItem("id", resp.data.tid)

                  console.log('name: ' + name + ' ' + that.ruleForm.type + ' ' + resp.data.tid)

                  if (that.ruleForm.type === 'admin' && name === 'admin') {
                    that.$message({
                      showClose: true,
                      message: '登录成功，欢迎 ' + name + '!',
                      type: 'success'
                    });
                    that.$router.push('/admin')
                  }
                  else if(that.ruleForm.type === 'teacher' && name !== 'admin') {
                    that.$message({
                      showClose: true,
                      message: '登录成功，欢迎 ' + name + '!',
                      type: 'success'
                    });
                    that.$router.push('/teacher')
                  }
                  else {
                    that.$message({
                      showClose: true,
                      message: 'admin 登录失败，检查登录类型',
                      type: 'error'
                    });
                  }
                }).then(that.updateAxiosHeaders())
              }
              else {
                that.$message({
                  showClose: true,
                  message: '登录失败，检查账号密码',
                  type: 'error'
                });
              }
            })
          }
          else if (that.ruleForm.type === 'student') {
            let form = {sid: that.ruleForm.id, password: that.ruleForm.password,type: that.ruleForm.type}
            console.log(form)
            axios.post(`${BASE_URL}/student/login`, form,{ // 第三个参数是配置项
              headers: {
                userid: form.sid, // 在 header 中加入 form.tid
                usertype: form.type,
              }
            }).then(function (resp) {
              console.log("学生登录验证信息：" + resp.data)
              check = resp.data
              if (check === true) {
                axios.get(`${BASE_URL}/student/findById/${that.ruleForm.id}`,{
                  headers: {
                    userid: form.sid, // 在 header 中加入 form.tid
                    usertype: form.type

                  }
                }).then(function (resp) {
                  console.log("登录页正在获取用户信息" + resp.data)
                  name = resp.data.sname

                  sessionStorage.clear()
                  sessionStorage.setItem("token", 'true')
                  sessionStorage.setItem("type", that.ruleForm.type)
                  sessionStorage.setItem("name", name)
                  sessionStorage.setItem("sid", resp.data.sid)
                  sessionStorage.setItem("id", resp.data.sid)

                  that.$message({
                    showClose: true,
                    message: '登录成功，欢迎 ' + name + '!',
                    type: 'success'
                  });

                  console.log('正在跳转：' + '/' + that.ruleForm.type)

                  // 3. 路由跳转
                  that.$router.push({
                    path: '/' + that.ruleForm.type,
                    query: {}
                  })
                }).then(that.updateAxiosHeaders())
              }
              else {
                that.$message({
                  showClose: true,
                  message: '账号密码错误，请联系管理员',
                  type: 'error'
                });
              }
            })
          }
          else {
            console.log("! error type")
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    updateAxiosHeaders() {
      const userId = sessionStorage.getItem('id') || 'default_id'; // 默认值可根据实际需求设置
      const userType = sessionStorage.getItem('type') || 'default_type';
      console.log("更新 Axios 请求头: id=" + userId + ", type=" + userType);

      // 转换为字符串并设置默认请求头
      axios.defaults.headers.common['userid'] = String(userId);
      axios.defaults.headers.common['usertype'] = String(userType);
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  }
}
</script>

<style>
.login-module {
  /*width: 380px;*/
  /*height: 325px;*/
  margin-top: 60px;
  /*border: none;*/
  position: absolute;
  right: 500px;
  text-align: center;
  width: 30%;
}
.el-header {
  background-color: #B3C0D1;
  color: #333;
  line-height: 60px;
}
</style>