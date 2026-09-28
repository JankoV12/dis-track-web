<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'
import Icon from '@/components/AppIcon.vue'
import { useSession } from '@/composables/useSession'
const { user, servers, load, logout } = useSession()
const router = useRouter()
onMounted(() => {
  void load()
})
function signOut() {
  logout()
  void router.push('/')
}
async function signedIn() {
  await load(true)
  await router.push('/userInfo')
}
</script>
<template>
  <div class="app-shell">
    <aside class="sidebar">
      <RouterLink to="/" class="brand" aria-label="Dis Track home"
        ><span class="brand-icon"><Icon name="headphones" :size="23" /></span
        ><span>dis<span class="brand-slash">/</span>track</span></RouterLink
      >
      <p class="nav-caption">YOUR SPACE</p>
      <nav class="main-nav" aria-label="Main navigation">
        <RouterLink to="/"><Icon name="music" />Discover</RouterLink
        ><RouterLink to="/userInfo"><Icon name="grid" />Your servers</RouterLink
        ><RouterLink to="/invite"><Icon name="plus" />Invite the bot</RouterLink>
      </nav>
      <div v-if="servers.length" class="server-nav">
        <p class="nav-caption">LISTEN TOGETHER</p>
        <RouterLink v-for="server in servers" :key="server.id" :to="`/player/${server.id}`"
          ><img v-if="server.icon" :src="server.icon" alt="" /><span
            v-else
            class="server-initial"
            >{{ server.name.slice(0, 1) }}</span
          ><span>{{ server.name }}</span></RouterLink
        >
      </div>
      <div class="sidebar-bottom">
        <p class="sidebar-note">A soundtrack for<br />your corner of Discord.</p>
        <div v-if="user" class="account">
          <img v-if="user.avatar" :src="user.avatar" alt="" /><span v-else class="server-initial">{{
            user.username.slice(0, 1)
          }}</span>
          <div>
            <strong>{{ user.username }}</strong
            ><span>Connected to Discord</span>
          </div>
          <button class="icon-button" aria-label="Sign out" title="Sign out" @click="signOut">
            <Icon name="logout" :size="17" />
          </button>
        </div>
        <RouterLink v-else class="button primary" to="/login"
          >Connect Discord <Icon name="arrow" :size="18"
        /></RouterLink>
      </div>
    </aside>
    <div class="workspace">
      <div class="topline">
        <span><span class="status-dot online" /> MUSIC IS BETTER TOGETHER</span
        ><a href="https://discord.com" target="_blank" rel="noopener noreferrer">Open Discord ↗</a>
      </div>
      <RouterView v-slot="{ Component }"
        ><component
          :is="Component"
          :key="$route.path"
          :isLoggedIn="!!user"
          @update:isLoggedIn="signedIn"
      /></RouterView>
      <footer class="site-footer">
        <span>DIS / TRACK</span><span>Made for the moments between games.</span>
      </footer>
    </div>
  </div>
</template>
