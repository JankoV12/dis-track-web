<script setup lang="ts">



import axios from 'axios';
import { useRoute } from 'vue-router'
import router from '@/router'
import type { Ref } from 'vue'
//import dot
//import { onMounted } from 'vue';

const route = useRoute();
//const env

const props = defineProps<{
  isLoggedIn: Ref<boolean>;
}>();
const isLoggedIn = props.isLoggedIn;

if(route.query.code !== undefined) {
  console.log(route.query.code);

  login(route.query.code as string);
}
else{
  console.log('Logged out');
}
console.log(`${window.location.protocol}//${window.location.host}${route.path}`);


function dcAuth() {
  const redirectUri = `${window.location.protocol}//${window.location.host}${route.path}`;
  window.location.href = `https://discord.com/oauth2/authorize?client_id=${import.meta.env.VITE_DISCORD_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=identify`;
}

async function login(code: string){
  const redirectUri = `${window.location.protocol}//${window.location.host}${route.path}`;
  try {
    console.log(encodeURIComponent(redirectUri));
    const r = await axios.post('https://discord.com/api/v10/oauth2/token', {
      'client_id': import.meta.env.VITE_DISCORD_CLIENT_ID,
      'client_secret': import.meta.env.VITE_DISCORD_CLIENT_SECRET,
      'grant_type': 'authorization_code',
      'code': code,
      'redirect_uri': redirectUri
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      }
    });
    if(r.status !== 200) {
      console.error(`${r.status} || ${r.statusText}`);
      return;
    }
    else{
      localStorage.setItem('auth_token', r.data.access_token);
      localStorage.setItem('refresh_token', r.data.refresh_token);
      isLoggedIn.value = true;
      router.push('/userInfo');
    }
  }
  catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error fetching token:', error.response?.data);
    } else {
      console.error('Unexpected error:', error);
    }
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

//background: #2c2f33;

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
  background-color: #5865F2;
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
