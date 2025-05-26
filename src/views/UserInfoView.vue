<script setup lang=ts>
import { ref, onMounted } from 'vue'
import UserInfoWindow from '@/components/UserInfoWindow.vue'
import axios from 'axios'
import router from '@/router'

interface User {
  id: string
  username: string
  tag: string
  avatar: string
  status?: "online" | "idle" | "dnd" | "offline"
  role?: string
}

const currentUser = ref<User | null>(null)

onMounted(async () => {
  const token = localStorage.getItem('auth_token')
  if (!token) {
    router.push('/')
    return
  }
  try {
    const res = await axios.get('https://discord.com/api/v10/users/@me', {
      headers: { Authorization: `Bearer ${token}` }
    })
    const d = res.data
    currentUser.value = {
      id: d.id,
      username: d.username,
      tag: d.discriminator,
      avatar: `https://cdn.discordapp.com/avatars/${d.id}/${d.avatar}.png`,
      status: 'online',
      role: 'member'
    }
  } catch {
    router.push('/')
  }
})
</script>

<template>
  <main>
    <UserInfoWindow :user="currentUser" />
  </main>
</template>

<style scoped>
main {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>
