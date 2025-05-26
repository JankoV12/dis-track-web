<script setup lang="ts">
import axios from 'axios'
import { useRoute } from 'vue-router'
import router from '@/router'
import { defineEmits } from 'vue'

const route = useRoute()
const props = defineProps<{
  isLoggedIn: boolean;
}>()
const emit = defineEmits<{
  (e: 'update:isLoggedIn', value: boolean): void
}>()

if (route.query.code !== undefined) {
  login(route.query.code as string)
}

function dcAuth() {
  const redirectUri = `${window.location.protocol}//${window.location.host}${route.path}`
  window.location.href = `https://discord.com/oauth2/authorize?client_id=${import.meta.env.VITE_DISCORD_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=identify`
}

async function login(code: string) {
  const redirectUri = `${window.location.protocol}//${window.location.host}${route.path}`
  try {
    const r = await axios.post('https://discord.com/api/v10/oauth2/token', {
      client_id: import.meta.env.VITE_DISCORD_CLIENT_ID,
      client_secret: import.meta.env.VITE_DISCORD_CLIENT_SECRET,
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri
    }, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' }
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
  <main class="login-container">
    <div class="login-box">
      <img src="/Discord-Symbol-Blurple.png" alt="Discord Logo" class="discord-logo" />
      <h1>Welcome</h1>
      <p>Sign in with your Discord account to continue</p>
      <button @click="dcAuth" class="login-button">Login with Discord</button>
    </div>
  </main>
</template>

<style scoped>
/* ...styles unchanged... */
</style>
