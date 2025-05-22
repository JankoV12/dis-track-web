<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>

  <nav
    class="fixed inset-x-0 top-0 flex flex-nowrap w-screen items-center justify-between bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 px-8 py-4 shadow-lg"
  >
    <!-- Left side -->
    <div class="flex items-center space-x-6">
      <RouterLink
        to="/"
        class="text-white font-semibold tracking-wide hover:text-yellow-300 transition-colors"
      >
        Home
      </RouterLink>
    </div>

    <!-- Right side -->
    <div class="flex items-center space-x-6">
      <RouterLink
        to="/login"
        class="text-white font-semibold tracking-wide hover:text-yellow-300 transition-colors"
      >
        Login
      </RouterLink>
    </div>
  </nav>

  <div class="router-container" >
    <RouterView />
  </div>
</template>

<style lang="css">
@import "tailwindcss/preflight";
@tailwind utilities;

.router-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  padding-top: 88px;
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
