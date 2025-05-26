<script setup lang="ts">

import LoginDialog from "@/components/auth/LoginDialog.vue";
import router from '@/router'
import {watch } from 'vue';
import type { Ref } from 'vue';

const props = defineProps<{
  isLoggedIn: Ref<boolean>;
}>();
const isLoggedIn = props.isLoggedIn;

watch(isLoggedIn, (loggedIn) => {
  if (loggedIn) {
    router.push('/userInfo');
  } else {
    console.log('Logged out');
  }
}, { immediate: true });
</script>

<template>
<main>
  <LoginDialog :isLoggedIn="isLoggedIn" />
</main>
</template>

<style scoped>

</style>
