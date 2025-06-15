<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { ref, onMounted } from 'vue'
import axios from 'axios'
import ServerDropdown from '@/components/ServerDropdown.vue'

const isLoggedIn = ref(false)
interface Server {
  id: string
  name: string
  icon: string | null
  owner: boolean
}
const servers = ref<Server[]>([])

async function getServers(): Promise<Server[]> {
  const userServers = await axios
    .get<Server[]>('https://discord.com/api/v10/users/@me/guilds', {
      headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` },
    })
    .then((res) => {
      return res.data.map((guild) => ({
        id: guild.id,
        name: guild.name,
        icon: guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png` : null,
        owner: guild.owner,
      }))
    })
    .catch(() => {
      return []
    })

  const botServers = await axios
    .get<Server[]>('/api/bot/guilds')
    .then((res) => {
      return res.data.map((guild) => ({
        id: guild.id,
        name: guild.name,
        icon: guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png` : null,
        owner: guild.owner,
      }))
    })
    .catch(() => {
      return []
    })

  const sameServers: Server[] = []
  for (const server of userServers) {
    const botServer = botServers.find((s) => s.id === server.id)
    if (botServer) {
      sameServers.push({
        ...server,
        icon: server.icon || botServer.icon,
        owner: server.owner || botServer.owner,
      })
    }
  }
  return sameServers
}

onMounted(async () => {
  isLoggedIn.value = localStorage.getItem('auth_token') !== null
  if (isLoggedIn.value) {
    servers.value = await getServers()
  }
})

window.addEventListener('storage', (e) => {
  if (e.key === 'auth_token') {
    isLoggedIn.value = e.newValue !== null
    if (isLoggedIn.value) {
      getServers().then((s) => (servers.value = s))
    } else {
      servers.value = []
    }
  }
})

function logout() {
  localStorage.removeItem('auth_token')
  localStorage.removeItem('refresh_token')
  isLoggedIn.value = false
  servers.value = []
  window.location.href = '/'
}

function updateLoggedIn(val: boolean) {
  isLoggedIn.value = val
  if (isLoggedIn.value) {
    getServers().then((s) => (servers.value = s))
  } else {
    servers.value = []
  }
}
</script>

<template>
  <header class="bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700 text-white shadow-md">
    <nav class="container mx-auto flex justify-between items-center py-4 px-6">
      <div class="flex space-x-4 text-lg font-semibold">
        <RouterLink class="hover:text-gray-200" to="/">Home</RouterLink>
        <RouterLink class="hover:text-gray-200" to="/about">About</RouterLink>
      </div>
      <div v-if="!isLoggedIn">
        <RouterLink class="hover:text-gray-200" to="/login">Login</RouterLink>
      </div>
      <div class="flex items-center space-x-4" v-else>
        <ServerDropdown :servers="servers" />
        <RouterLink class="hover:text-gray-200" to="/userInfo">User Info</RouterLink>
        <button class="text-red-300 hover:text-red-400" @click="logout">Log Out</button>
      </div>
    </nav>
  </header>

  <RouterView v-slot="{ Component }">
    <component :is="Component" :isLoggedIn="isLoggedIn" @update:isLoggedIn="updateLoggedIn" />
  </RouterView>
</template>

<style scoped></style>
