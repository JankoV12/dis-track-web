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
  <details class="server-dropdown relative">
    <summary class="cursor-pointer flex items-center select-none">
      <span class="mr-2">Servers</span>
      <svg
        class="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </summary>
    <ul
      class="absolute right-0 mt-2 bg-gray-800 text-white rounded shadow-lg max-h-64 overflow-y-auto z-10 w-48"
    >
      <li
        v-for="server in props.servers"
        :key="server.id"
        class="px-2 py-1 flex items-center hover:bg-gray-700 cursor-pointer"
        @click="openServer(server.id)"
      >
        <img
          :src="server.icon || '/default-server-icon.svg'"
          alt="server icon"
          class="w-6 h-6 rounded-full mr-2"
        />
        <span>{{ server.name }}</span>
      </li>
    </ul>
  </details>
</template>

<style scoped>
.server-dropdown > summary::-webkit-details-marker {
  display: none;
}
</style>
