<script setup lang=ts>
import { ref, onMounted } from 'vue'
import ServerList from '@/components/ServerList.vue'
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

interface Server {
  id: string
  name: string
  icon: string | null
  owner: boolean
}

const currentUser = ref<User | null>(null)
const servers = ref<Server[]>([])

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
    return
  }
  servers.value = await getServers()
})

async function getServers(): Promise<Server[]> {
  const userServers = await axios.get<Server[]>('https://discord.com/api/v10/users/@me/guilds', {
    headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` }
  }).then(res => {
    return res.data.map(guild => ({
      id: guild.id,
      name: guild.name,
      icon: guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png` : null,
      owner: guild.owner,
    }))
  }).catch(() => { return [] })
  const botServers = await axios.get<Server[]>('https://discord.com/api/v10/users/@me/guilds', {
    headers: { Authorization: `Bot ${import.meta.env.VITE_DISCORD_BOT_TOKEN}` }
  }).then(res => {
    return res.data.map(guild => ({
      id: guild.id,
      name: guild.name,
      icon: guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png` : null,
      owner: guild.owner,
    }))
  }).catch(() => { return [] })
  const sameServers: Server[] = []
  for (const server of userServers) {
    const botServer = botServers.find(s => s.id === server.id)
    if (botServer) {
      sameServers.push({
        ...server,
        icon: server.icon || botServer.icon,
        owner: server.owner || botServer.owner
      })
    }
  }
  return sameServers;
}
</script>

<template>
  <main>
    <div class="user-info-container">
      <UserInfoWindow :user="currentUser" />
      <ServerList :servers="servers" />
    </div>
  </main>
</template>

<style scoped>
main {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  margin: 0;
  background-color: #121212;
  color: #e0e0e0;
}
.user-info-container {
  display: flex;
  flex-direction: row;
  gap: 2rem;
  align-items: flex-start;
  background: #1e1e1e;
  color: #e0e0e0;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}
</style>
