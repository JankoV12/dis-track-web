<script setup lang="ts">
import type { PropType } from 'vue'

interface User {
  id: string
  username: string
  tag: string
  avatar: string
  status?: 'online' | 'idle' | 'dnd' | 'offline'
  role?: string
}

const { user } = defineProps({
  user: {
    type: Object as PropType<User | null>,
    default: null
  }
})
</script>

<template>
  <div class="user-info-container">
    <div v-if="!user" class="loading">Loading...</div>
    <div v-else class="user-card">
      <div class="avatar-wrapper">
        <img :src="user.avatar" alt="Avatar" class="avatar" />
        <span :class="['status-badge', user.status || 'offline']"></span>
      </div>

      <h2 class="username">
        {{ user.username }}<span class="tag">#{{ user.tag }}</span>
      </h2>

      <p class="id">ID: {{ user.id }}</p>

      <span v-if="user.role" class="role-pill">{{ user.role }}</span>
    </div>
  </div>
</template>

<style scoped>
.user-info-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
}

.user-card {
  background: linear-gradient(145deg, #2c2f33 0%, #23272a 100%);
  padding: 40px 32px;
  border-radius: 16px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.45);
  text-align: center;
  max-width: 380px;
  width: 100%;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.user-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.55);
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid #2c2f33;
  object-fit: cover;
}

.avatar-wrapper {
  position: relative;
  display: inline-block;
  margin-bottom: 20px;
}

.status-badge {
  position: absolute;
  bottom: 6px;
  right: 6px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 4px solid #2c2f33;
}

.status-badge.online  { background: #43b581; }
.status-badge.idle    { background: #faa61a; }
.status-badge.dnd     { background: #f04747; }
.status-badge.offline { background: #747f8d; }

.username {
  font-size: 1.6em;
  margin-bottom: 8px;
  font-weight: 600;
}

.tag {
  color: #b9bbbe;
  font-size: 0.65em;
  font-weight: 400;
  margin-left: 4px;
}

.id {
  color: #b9bbbe;
  margin-bottom: 16px;
  font-size: 0.9em;
}

.role-pill {
  display: inline-block;
  background: #7289da;
  padding: 6px 14px;
  border-radius: 9999px;
  font-size: 0.8em;
  font-weight: 500;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.loading {
  color: #b9bbbe;
  font-size: 1.2em;
}
</style>

