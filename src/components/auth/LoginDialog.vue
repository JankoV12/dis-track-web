<script setup lang="ts">
import api from '@/api'
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
    const r = await api.post('/api/login', {
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
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.login-box {
  background: #23272a;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.4);
  text-align: center;
  max-width: 400px;
  width: 90%;
}

.discord-logo {
  width: 80px;
  margin-bottom: 20px;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

h1 {
  color: #fff;
  font-size: 2em;
  margin-bottom: 10px;
}

p {
  color: #b9bbbe;
  font-size: 1.2em;
  margin-bottom: 30px;
}

.login-button {
  background-color: #5865f2;
  color: white;
  border: none;
  padding: 12px 20px;
  font-size: 1em;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.login-button:hover {
  background-color: #4752c4;
}
</style>
