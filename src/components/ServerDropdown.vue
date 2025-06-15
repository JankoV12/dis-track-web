<script setup lang="ts">
import { defineProps, computed, ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import router from '@/router'

interface Server {
  id: string
  name: string
  icon: string | null
  owner: boolean
}

const props = defineProps<{ servers: Server[] }>()

const route = useRoute()

const selectedId = ref<string | null>(null)

onMounted(() => {
  const fromRoute = route.params.guildId as string | undefined
  if (fromRoute) {
    selectedId.value = fromRoute
    localStorage.setItem('selected_server', fromRoute)
  } else {
    const stored = localStorage.getItem('selected_server')
    selectedId.value = stored
  }
})

watch(
  () => route.params.guildId,
  newId => {
    if (typeof newId === 'string') {
      selectedId.value = newId
      localStorage.setItem('selected_server', newId)
    }
  }
)

const selectedServer = computed(() => {
  return props.servers.find(s => s.id === selectedId.value) || null
})

function openServer(id: string) {
  selectedId.value = id
  localStorage.setItem('selected_server', id)
  router.push(`/player/${id}`)
}
</script>

<template>
  <details class="server-dropdown relative">
    <summary class="cursor-pointer flex items-center select-none">
      <span class="mr-2">{{ selectedServer ? selectedServer.name : 'Servers' }}</span>
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
