<script setup lang="ts">
import axios from 'axios'
import { useRoute } from 'vue-router'
import router from '@/router'

defineProps<{
  isLoggedIn: boolean
}>()

const route = useRoute()

const emit = defineEmits<{
  (e: 'update:isLoggedIn', value: boolean): void
}>()

if (route.query.code !== undefined) {
  login(route.query.code as string)
}

function dcAuth() {
  const redirectUri = `${window.location.protocol}//${window.location.host}${route.path}`
  window.location.href = `https://discord.com/oauth2/authorize?client_id=${import.meta.env.VITE_DISCORD_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=identify+guilds+guilds.members.read`
}

async function login(code: string) {
  const redirectUri = `${window.location.protocol}//${window.location.host}${route.path}`
  try {
    const r = await axios.post('/api/login', {
      code,
      redirectUri,
    })
    if (r.status === 200) {
      localStorage.setItem('auth_token', r.data.access_token)
      localStorage.setItem('refresh_token', r.data.refresh_token)
      emit('update:isLoggedIn', true)
      router.push('/userInfo')
    }
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <main
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-800 via-purple-800 to-indigo-900 p-4"
  >
    <div class="bg-gray-900 text-white rounded-xl shadow-xl p-10 w-full max-w-md text-center">
      <img src="/Discord-Symbol-Blurple.png" alt="Discord Logo" class="w-20 mx-auto mb-6" />
      <h1 class="text-2xl font-semibold mb-2">Welcome</h1>
      <p class="text-gray-300 mb-6">Sign in with your Discord account to continue</p>
      <button
        @click="dcAuth"
        class="bg-indigo-500 hover:bg-indigo-600 w-full py-2 rounded transition-colors"
      >
        Login with Discord
      </button>
    </div>
  </main>
</template>

<style scoped></style>
