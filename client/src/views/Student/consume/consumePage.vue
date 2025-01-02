<template>
  <div>
    <!-- 根据角色展示不同的按钮或导航 -->
    <router-link v-if="isAdmin" to="/consume/manage">管理消费记录</router-link>
    <!-- 子路由页面 -->
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  computed: {
    isAdmin() {
      return sessionStorage.getItem("type") === 'admin';
    }
  }
}
</script>
