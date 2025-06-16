<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/api'

interface TrackMetadata {
  url: string
  title: string
  artist: string
  duration: string
  requester: string
  thumbnail: string
}

interface QueueItem {
  id: number
  title: string
  author: string
  thumbnail: string
  duration: number
  url: string
}

const route = useRoute()
const guildId = route.params.guildId as string

const currentTrack = ref<TrackMetadata | null>(null)
const queue = ref<QueueItem[]>([])

const newUrl = ref('')
const username = ref('')
const userId = ref('')

async function loadUsername() {
  const token = localStorage.getItem('auth_token')
  if (!token) return
  try {
    const res = await api.get('https://discord.com/api/v10/users/@me', {
      headers: { Authorization: `Bearer ${token}` },
    })
    username.value = res.data.username
    userId.value = res.data.id
  } catch (err) {
    console.error(err)
  }
}

async function loadData() {
  try {
    const res = await api.get(`/api/now-playing/${guildId}`)
    currentTrack.value = res.data
  } catch {
    currentTrack.value = null
  }

  try {
    const q = await api.get(`/api/queue/${guildId}`)
    queue.value = q.data.tracks || []
  } catch {
    queue.value = []
  }
}

async function pause() {
  await api.post(`/api/controls/${guildId}/pause`)
  await loadData()
}
async function resume() {
  await api.post(`/api/controls/${guildId}/resume`)
  await loadData()
}
async function skip() {
  await api.post(`/api/controls/${guildId}/skip`)
  await loadData()
}
async function stop() {
  await api.post(`/api/controls/${guildId}/stop`)
  await loadData()
}

async function addTrack() {
  if (!newUrl.value) {
    return
  }
  try {
    await api.post(`/api/queue/${guildId}/add`, {
      url: newUrl.value,
      requester: username.value || undefined,
      requesterUId: userId.value || undefined,
    })
    newUrl.value = ''
    await loadData()
  } catch (err) {
    console.error(err)
  }
}

onMounted(() => {
  loadData()
  loadUsername()
})
</script>

<template>
  <main
    class="player-window space-y-6 mx-auto max-w-xl bg-gray-900 p-6 rounded-lg shadow-lg text-gray-200"
  >
    <h2 class="text-3xl font-bold text-center mb-2">Player Controls</h2>

    <div
      v-if="currentTrack"
      class="now-playing flex items-center bg-gray-800 rounded-lg p-4 shadow"
    >
      <img
        :src="currentTrack.thumbnail"
        alt="thumbnail"
        class="thumb w-16 h-16 rounded mr-4"
      />
      <div class="track-info">
        <h3 class="text-lg font-semibold">{{ currentTrack.title }}</h3>
        <p class="text-sm text-gray-300">{{ currentTrack.artist }}</p>
        <p class="requester text-xs text-gray-400">
          Requested by: {{ currentTrack.requester }}
        </p>
      </div>
    </div>
    <div
      v-else
      class="now-playing bg-gray-800 rounded p-4 text-center shadow"
    >
      No track playing
    </div>

    <div
      class="controls flex flex-wrap justify-center gap-4 bg-gray-800 p-4 rounded-lg shadow-md mx-auto w-fit"
    >
      <button
        class="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white"
        @click="pause"
      >
        Pause
      </button>
      <button
        class="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white"
        @click="resume"
      >
        Resume
      </button>
      <button
        class="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white"
        @click="skip"
      >
        Skip
      </button>
      <button
        class="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white"
        @click="stop"
      >
        Stop
      </button>
    </div>

    <form
      class="add-form flex gap-2 bg-gray-800 p-4 rounded-lg shadow-md"
      @submit.prevent="addTrack"
    >
      <input
        v-model="newUrl"
        type="text"
        placeholder="Song or playlist URL"
        class="flex-1 p-2 rounded bg-gray-700 text-gray-200 placeholder-gray-400"
      />
      <button
        type="submit"
        class="px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white"
      >
        Add
      </button>
    </form>

    <div class="queue mt-6 bg-gray-800 p-4 rounded-lg shadow">
      <h4 class="text-xl font-semibold mb-2">Queue</h4>
      <ul class="space-y-1">
        <li v-for="track in queue" :key="track.id">
          {{ track.title }} - {{ track.author }}
        </li>
      </ul>
    </div>
  </main>
</template>

<style scoped>

.thumb {
  width: 64px;
  height: 64px;
}

.queue ul {
  list-style: none;
  padding: 0;
}
</style>
