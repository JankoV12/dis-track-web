<!-- src/App.vue -->
<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>

  <nav>
    <RouterLink to="/" class="navbar-base">
      <h1>Home</h1>
    </RouterLink>
    <RouterLink to="/login" class="navbar-base">
      <h1>Login</h1>
    </RouterLink>
  </nav>

  <div class="router-container" >
    <RouterView />
  </div>
</template>

<style lang="css">

nav {
 display: flex;
 align-items: center;
 gap: 1rem;
 background-color: #282828;
 padding: 1rem;
}

nav .navbar-base {
  display: inline-block;
  color: #fff;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: background-color 0.2s;
}

nav .navbar-base:hover {
  background-color: rgba(255,255,255,0.1);
}

nav .navbar-base.router-link-active {
  background-color: rgba(255,255,255,0.2);
}

.router-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100%;
}

.router-container main {
  width: 100%;
  text-align: center;
}


@media (min-width: 1024px) {
  .router-container {
    grid-column: 1 / -1;
  }
}

</style>
