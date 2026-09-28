<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import Icon from '@/components/AppIcon.vue'
import { useSession } from '@/composables/useSession'
const { user, servers, loading, error, load } = useSession()
onMounted(() => {
  void load()
})
</script>
<template>
  <main class="page">
    <div class="page-heading">
      <div>
        <p class="eyebrow">PICK YOUR ROOM</p>
        <h1>Your servers</h1>
        <p class="muted">
          {{
            user
              ? `Hey ${user.username}. Where are we listening?`
              : 'Connect Discord to find your shared listening rooms.'
          }}
        </p>
      </div>
      <button class="button secondary" @click="load(true)" :disabled="loading">
        <Icon name="refresh" :size="17" />Refresh
      </button>
    </div>
    <div v-if="error" class="alert error" role="alert">{{ error }}</div>
    <div v-if="loading" class="server-grid">
      <div v-for="n in 3" :key="n" class="skeleton server-skeleton" />
    </div>
    <div v-else-if="!user" class="empty-state panel">
      <Icon name="headphones" :size="40" />
      <h2>Your music starts here.</h2>
      <p>Sign in to see servers you share with Dis Track.</p>
      <RouterLink class="button primary" to="/login">Connect Discord</RouterLink>
    </div>
    <div v-else-if="!servers.length" class="empty-state panel">
      <Icon name="grid" :size="40" />
      <h2>No shared servers yet</h2>
      <p>Invite the bot to a Discord server, then refresh this page.</p>
      <RouterLink class="button primary" to="/invite">Invite the bot</RouterLink>
    </div>
    <div v-else class="server-grid">
      <RouterLink
        v-for="server in servers"
        :key="server.id"
        :to="`/player/${server.id}`"
        class="server-card"
        ><img v-if="server.icon" :src="server.icon" alt="" /><span v-else class="server-monogram">{{
          server.name.slice(0, 2)
        }}</span
        ><span class="eyebrow">DISCORD SERVER</span>
        <h2>{{ server.name }}</h2>
        <span class="server-open">Open player<Icon name="arrow" :size="20" /></span
      ></RouterLink>
    </div>
  </main>
</template>
