<script setup lang="ts">

import LoginDialog from "@/components/auth/LoginDialog.vue";
import router from '@/router'

if(localStorage.getItem('auth_token') !== null) {
  router.push('/userInfo');
}
else{
  console.log('Logged out');
}
</script>

<template>
<main>
  <LoginDialog />
</main>
</template>

<style scoped>

</style>
