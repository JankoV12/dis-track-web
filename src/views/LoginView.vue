<script setup lang="ts">

import LoginDialog from "@/components/auth/LoginDialog.vue";
import router from '@/router'
import { watch, toRef } from 'vue';

const props = defineProps<{
  isLoggedIn: boolean;
}>();
const emit = defineEmits<{
  (e: 'update:isLoggedIn', value: boolean): void;
}>();
const isLoggedInRef = toRef(props, 'isLoggedIn');

watch(isLoggedInRef, (loggedIn) => {
  if (loggedIn) {
    router.push('/userInfo');
  } else {
    console.log('Logged out');
  }
}, { immediate: true });
</script>

<template>
<main>
  <LoginDialog
    :isLoggedIn="props.isLoggedIn"
    @update:isLoggedIn="val => emit('update:isLoggedIn', val)"
  />
</main>
</template>

<style scoped>

</style>
