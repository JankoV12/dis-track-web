<script setup lang="ts">
import { defineProps } from 'vue'
import router from '@/router'

interface Server {
  id: string
  name: string
  icon: string | null
  owner: boolean
}

const props = defineProps<{ servers: Server[] }>()

function openServer(id: string) {
  router.push(`/player/${id}`)
}
</script>

<template>
  <aside class="server-list">
    <ul>
      <li
        v-for="server in props.servers"
        :key="server.id"
        class="server-item"
        @click="openServer(server.id)"
      >
        <div class="server-icon">
          <img v-if="server.icon" :src="server.icon" alt="server icon" />
        </div>
        <span class="server-name">{{ server.name }}</span>
      </li>
    </ul>
  </aside>
</template>

<style scoped>
.server-list {
  background-color: #1e1e1e;
  color: #e0e0e0;
  padding: 1rem;
  border-radius: 8px;
  width: 280px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}

.server-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 80vh;
  overflow-y: auto;
}

.server-item {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.2s, transform 0.1s ease;
  cursor: pointer;
  width: 100%;
}

.server-item:hover {
  background-color: #2a2a2a;
  transform: scale(1.02);
}

.server-icon {
  flex-shrink: 0;
  margin-right: 0.75rem;
}

.server-icon img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.server-name {
  font-weight: 600;
  font-size: 1rem;
  color: #e0e0e0;
}
</style>
