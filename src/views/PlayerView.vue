<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

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

async function loadUsername() {
  const token = localStorage.getItem('auth_token')
  if (!token) return
  try {
    const res = await axios.get('https://discord.com/api/v10/users/@me', {
      headers: { Authorization: `Bearer ${token}` },
    })
    username.value = res.data.username
  } catch (err) {
    console.error(err)
  }
}

async function loadData() {
  try {
    const res = await axios.get(`/api/now-playing/${guildId}`)
    currentTrack.value = res.data
  } catch {
    currentTrack.value = null
  }

  try {
    const q = await axios.get(`/api/queue/${guildId}`)
    queue.value = q.data.tracks || []
  } catch {
    queue.value = []
  }
}

async function pause() {
  await axios.post(`/api/controls/${guildId}/pause`)
  await loadData()
}
async function resume() {
  await axios.post(`/api/controls/${guildId}/resume`)
  await loadData()
}
async function skip() {
  await axios.post(`/api/controls/${guildId}/skip`)
  await loadData()
}
async function stop() {
  await axios.post(`/api/controls/${guildId}/stop`)
  await loadData()
}

async function addTrack() {
  if (!newUrl.value) {
    return
  }
  try {
    await axios.post(`/api/queue/${guildId}/add`, {
      url: newUrl.value,
      requester: username.value || undefined,
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
  <main class="player-window">
    <h2>Player Controls</h2>
    <div v-if="currentTrack" class="now-playing">
      <img :src="currentTrack.thumbnail" alt="thumbnail" class="thumb" />
      <div class="track-info">
        <h3>{{ currentTrack.title }}</h3>
        <p>{{ currentTrack.artist }}</p>
        <p class="requester">Requested by: {{ currentTrack.requester }}</p>
      </div>
    </div>
    <div v-else class="now-playing">No track playing</div>

    <div class="controls">
      <button @click="pause">Pause</button>
      <button @click="resume">Resume</button>
      <button @click="skip">Skip</button>
      <button @click="stop">Stop</button>
    </div>

    <form class="add-form" @submit.prevent="addTrack">
      <input
        v-model="newUrl"
        type="text"
        placeholder="Song or playlist URL"
      />
      <button type="submit">Add</button>
    </form>

    <div class="queue">
      <h4>Queue</h4>
      <ul>
        <li v-for="track in queue" :key="track.id">
          {{ track.title }} - {{ track.author }}
        </li>
      </ul>
    </div>
  </main>
</template>

<style scoped>
.player-window {
  padding: 2rem;
  color: #e0e0e0;
}

.now-playing {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.thumb {
  width: 64px;
  height: 64px;
  margin-right: 1rem;
}

.controls button {
  margin-right: 0.5rem;
  padding: 0.5rem 1rem;
  background: #2a2a2a;
  border: none;
  color: #e0e0e0;
  cursor: pointer;
}

.add-form {
  margin-top: 1rem;
  display: flex;
  gap: 0.5rem;
}

.add-form input {
  padding: 0.5rem;
  background: #2a2a2a;
  border: none;
  color: #e0e0e0;
}

.add-form button {
  padding: 0.5rem 1rem;
  background: #4caf50;
  border: none;
  color: #fff;
  cursor: pointer;
}

.queue ul {
  list-style: none;
  padding: 0;
}
</style>
