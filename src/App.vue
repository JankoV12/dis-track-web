<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import { ref, onMounted } from 'vue';
import api from '@/api';
import ServerDropdown from '@/components/ServerDropdown.vue';

const isLoggedIn = ref(false);
interface Server {
  id: string;
  name: string;
  icon: string | null;
  owner: boolean;
}
const servers = ref<Server[]>([]);

async function getServers(): Promise<Server[]> {
  const userServers = await api
    .get<Server[]>('https://discord.com/api/v10/users/@me/guilds', {
      headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` }
    })
    .then(res => {
      return res.data.map(guild => ({
        id: guild.id,
        name: guild.name,
        icon: guild.icon
          ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`
          : null,
        owner: guild.owner
      }));
    })
    .catch(() => {
      return [];
    });

  const botServers = await api
    .get<Server[]>('/api/bot/guilds')
    .then(res => {
      return res.data.map(guild => ({
        id: guild.id,
        name: guild.name,
        icon: guild.icon
          ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`
          : null,
        owner: guild.owner
      }));
    })
    .catch(() => {
      return [];
    });

  const sameServers: Server[] = [];
  for (const server of userServers) {
    const botServer = botServers.find(s => s.id === server.id);
    if (botServer) {
      sameServers.push({
        ...server,
        icon: server.icon || botServer.icon,
        owner: server.owner || botServer.owner
      });
    }
  }
  return sameServers;
}

onMounted(async () => {
  isLoggedIn.value = localStorage.getItem('auth_token') !== null;
  if (isLoggedIn.value) {
    servers.value = await getServers();
  }
});

window.addEventListener('storage', (e) => {
  if (e.key === 'auth_token') {
    isLoggedIn.value = e.newValue !== null;
    if (isLoggedIn.value) {
      getServers().then(s => (servers.value = s));
    } else {
      servers.value = [];
    }
  }
});

function logout() {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('refresh_token');
  isLoggedIn.value = false;
  servers.value = [];
  window.location.href = '/';
}

function updateLoggedIn(val: boolean) {
  isLoggedIn.value = val
  if (isLoggedIn.value) {
    getServers().then(s => (servers.value = s));
  } else {
    servers.value = [];
  }
}
</script>

<template>
  <header>
    <nav class="flex justify-between items-center w-full">
      <div class="flex">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <RouterLink to="/invite">Invite</RouterLink>
      </div>
      <div class="flex" v-if="!isLoggedIn">
        <RouterLink to="/login">Login</RouterLink>
      </div>
      <div class="flex items-center" v-else>
        <ServerDropdown :servers="servers" />
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
