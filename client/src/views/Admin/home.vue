<template>
  <div>
    <el-container>
      <el-main>
        <h1>admin home</h1>
        <el-card style="width: 40%">
          <p><i class="el-icon-s-home" style="margin-right: 18px"></i>项目名：学生填报系统</p>
          <p><i class="el-icon-s-custom" style="margin-right: 18px"></i>开发人员：赵燚卓,杨艺釧,李嘉禾,段杰文,李渡诚</p>
          <p><i class="el-icon-location-outline" style="margin-right: 18px"></i>TCU</p>
          <p><i class="el-icon-chat-round" style="margin-right: 18px"></i>联系我们：xxxxx</p>
          <p><i class="el-icon-error" style="margin-right: 18px;"></i></p>
        </el-card>
        <logout></logout>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import Logout from "@/components/logout";
export default {
  name: "home",
  components: {Logout},
}
</script>

<style scoped>

</style>
