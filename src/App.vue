<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import { ref, onMounted } from 'vue';

const isLoggedIn = ref(false);

onMounted(() => {
  isLoggedIn.value = localStorage.getItem('auth_token') !== null;
});

window.addEventListener('storage', (e) => {
  if (e.key === 'auth_token') {
    isLoggedIn.value = e.newValue !== null;
  }
});
</script>

<template>
  <header>
    <nav class="flex justify-between items-center w-full">
      <div class="flex">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </div>
      <div class="flex">
        <RouterLink v-if="!isLoggedIn" to="/login">Login</RouterLink>
        <RouterLink v-else to="/userInfo">User Info</RouterLink>
      </div>
    </nav>
  </header>

  <RouterView :isLoggedIn="isLoggedIn" />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
  display: flex;
}

nav {
  width: 100%;
  font-size: 22px;
  text-align: center;
  margin-top: 2rem;
  border: grey solid 2px;
  border-radius: 16px;
  padding: 1rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}
</style>
