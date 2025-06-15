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

function logout() {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('refresh_token');
  isLoggedIn.value = false;
  window.location.href = '/';
}

function updateLoggedIn(val: boolean) {
  isLoggedIn.value = val
}
</script>

<template>
  <header>
    <nav class="flex justify-between items-center w-full">
      <div class="flex">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </div>
      <div class="flex" v-if="!isLoggedIn">
        <RouterLink to="/login">Login</RouterLink>
      </div>
      <div class="flex" v-else>
        <RouterLink to="/userInfo">User Info</RouterLink>
        <button class="logout" @click="logout">Log Out</button>
      </div>
    </nav>
  </header>

  <RouterView v-slot="{ Component }">
    <component
      :is="Component"
      :isLoggedIn="isLoggedIn"
      @update:isLoggedIn="updateLoggedIn"
    />
  </RouterView>
</template>

<style scoped>
.logout{
  color: red;
}

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
