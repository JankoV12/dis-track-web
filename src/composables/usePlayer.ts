import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/api'
import { useSession } from './useSession'
export interface Track {
  url: string
  title: string
  artist: string
  requester: string
  thumbnail?: string
  duration?: string
}
export interface QueueTrack {
  id: string
  position: number
  url: string
  title: string | null
  author: string | null
  requester: string | null
  thumbnail: string | null
  duration: string | null
  metadataPending: boolean
}
export function usePlayer() {
  const route = useRoute()
  const session = useSession()
  const guildId = computed(() => String(route.params.guildId || ''))
  const serverName = computed(
    () => session.servers.value.find((s) => s.id === guildId.value)?.name || 'Discord server',
  )
  const current = ref<Track | null>(null)
  const tracks = ref<QueueTrack[]>([])
  const count = ref(0)
  const filteredCount = ref(0)
  const page = ref(0)
  const pageSize = 50
  const search = ref('')
  const query = ref('')
  const state = ref('idle')
  const connected = ref(false)
  const loading = ref(true)
  const refreshing = ref(false)
  const busy = ref('')
  const error = ref('')
  const notice = ref('')
  const newUrl = ref('')
  const lastUpdated = ref<Date | null>(null)
  const pages = computed(() => Math.max(1, Math.ceil(filteredCount.value / pageSize)))
  let controller: AbortController | undefined
  let timer: ReturnType<typeof setInterval> | undefined
  let debounce: ReturnType<typeof setTimeout> | undefined
  let disposed = false
  function errorText(e: unknown) {
    const d = (e as { response?: { data?: { message?: string; error?: string } } }).response?.data
    return d?.message || d?.error || 'The request failed. Please try again.'
  }
  async function refresh() {
    controller?.abort()
    const active = new AbortController()
    controller = active
    refreshing.value = true
    const gid = guildId.value
    const results = await Promise.allSettled([
      api.get<Track>(`/api/now-playing/${gid}`, { signal: active.signal }),
      api.get(`/api/queue/${gid}`, {
        signal: active.signal,
        params: { offset: page.value * pageSize, limit: pageSize, search: query.value },
      }),
      api.get('/api/status', { signal: active.signal }),
    ])
    if (disposed || active.signal.aborted || gid !== guildId.value) return
    let failed = false
    const [playing, queue, status] = results
    if (playing.status === 'fulfilled') current.value = playing.value.data
    else if (playing.reason?.response?.status === 404) current.value = null
    else failed = true
    if (queue.status === 'fulfilled') {
      tracks.value = queue.value.data.tracks
      count.value = queue.value.data.count
      filteredCount.value = queue.value.data.filteredCount
      if (page.value >= pages.value) page.value = pages.value - 1
    } else failed = true
    if (status.status === 'fulfilled') {
      state.value = status.value.data.player.status[gid] || 'idle'
      connected.value = status.value.data.player.connections.includes(gid)
    } else failed = true
    if (failed) error.value = 'Live updates are unavailable. Showing the last received data.'
    else {
      if (error.value.startsWith('Live updates')) error.value = ''
      lastUpdated.value = new Date()
    }
    loading.value = false
    refreshing.value = false
  }
  async function control(action: string) {
    if (busy.value) return
    busy.value = action
    error.value = ''
    notice.value = ''
    try {
      const response = await api.post(`/api/controls/${guildId.value}/${action}`)
      notice.value = response.data.message || 'Playback updated.'
      if (action === 'shuffle') page.value = 0
      await refresh()
    } catch (e) {
      error.value = errorText(e)
    } finally {
      busy.value = ''
    }
  }
  async function addTrack() {
    if (!newUrl.value.trim() || busy.value) return
    await session.load()
    if (!session.user.value) {
      error.value = 'Sign in with Discord before adding music.'
      return
    }
    busy.value = 'add'
    error.value = ''
    notice.value = ''
    try {
      const response = await api.post(
        `/api/queue/${guildId.value}/add`,
        {
          url: newUrl.value.trim(),
          requester: session.user.value.username,
          requesterUId: session.user.value.id,
        },
        { timeout: 180000 },
      )
      newUrl.value = ''
      notice.value = response.data.message || 'Added to queue.'
      await refresh()
    } catch (e) {
      error.value = errorText(e)
    } finally {
      busy.value = ''
    }
  }
  watch(search, (value) => {
    clearTimeout(debounce)
    debounce = setTimeout(() => {
      query.value = value
      page.value = 0
      void refresh()
    }, 300)
  })
  watch(page, () => {
    void refresh()
  })
  onMounted(() => {
    void refresh()
    void session.load()
    timer = setInterval(() => {
      if (!document.hidden && !refreshing.value) void refresh()
    }, 5000)
  })
  onUnmounted(() => {
    disposed = true
    controller?.abort()
    clearInterval(timer)
    clearTimeout(debounce)
  })
  return {
    current,
    tracks,
    count,
    filteredCount,
    page,
    pages,
    pageSize,
    search,
    state,
    connected,
    loading,
    refreshing,
    busy,
    error,
    notice,
    newUrl,
    lastUpdated,
    serverName,
    refresh,
    control,
    addTrack,
  }
}
