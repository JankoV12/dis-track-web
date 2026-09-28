import { ref } from 'vue'
import api from '@/api'
export interface Server {
  id: string
  name: string
  icon: string | null
  owner: boolean
}
interface User {
  id: string
  username: string
  avatar: string | null
}
const user = ref<User | null>(null)
const servers = ref<Server[]>([])
const loading = ref(false)
const error = ref('')
let pending: Promise<void> | null = null
async function load(force = false): Promise<void> {
  if (pending) return pending
  const token = localStorage.getItem('auth_token')
  if (!token) {
    user.value = null
    servers.value = []
    return
  }
  if (user.value && !force) return
  pending = (async () => {
    loading.value = true
    error.value = ''
    try {
      const headers = { Authorization: `Bearer ${token}` }
      const [profile, guilds, botGuilds] = await Promise.all([
        api.get('https://discord.com/api/v10/users/@me', { headers }),
        api.get<Server[]>('https://discord.com/api/v10/users/@me/guilds', { headers }),
        api.get<Server[]>('/api/bot/guilds'),
      ])
      const d = profile.data
      user.value = {
        id: d.id,
        username: d.global_name || d.username,
        avatar: d.avatar ? `https://cdn.discordapp.com/avatars/${d.id}/${d.avatar}.png` : null,
      }
      const botIds = new Set(botGuilds.data.map((g) => g.id))
      servers.value = guilds.data
        .filter((g) => botIds.has(g.id))
        .map((g) => ({
          ...g,
          icon: g.icon ? `https://cdn.discordapp.com/icons/${g.id}/${g.icon}.png` : null,
        }))
    } catch (e: unknown) {
      const status = (e as { response?: { status?: number } }).response?.status
      if (status === 401) {
        logout()
        error.value = 'Your Discord session expired. Sign in again.'
      } else error.value = 'Could not load your Discord servers. Please try again.'
    } finally {
      loading.value = false
    }
  })()
  try {
    await pending
  } finally {
    pending = null
  }
}
function logout() {
  localStorage.removeItem('auth_token')
  localStorage.removeItem('refresh_token')
  user.value = null
  servers.value = []
}
export function useSession() {
  return { user, servers, loading, error, load, logout }
}
