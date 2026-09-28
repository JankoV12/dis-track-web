<script setup lang="ts">
import Icon from '@/components/AppIcon.vue'
import { usePlayer } from '@/composables/usePlayer'
const {
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
} = usePlayer()
</script>
<template>
  <main class="page player-page">
    <div class="page-heading">
      <div>
        <p class="eyebrow">YOUR LISTENING ROOM</p>
        <h1>{{ serverName }}</h1>
        <p class="muted">Good music. Shared company.</p>
      </div>
      <div class="connection-chip">
        <span :class="['status-dot', { online: connected }]" />{{
          loading ? 'Connecting…' : connected ? 'Voice connected' : 'Not in voice'
        }}
      </div>
    </div>
    <div v-if="error" class="alert error" role="alert">
      {{ error }} <button @click="refresh" :disabled="refreshing">Retry</button>
    </div>
    <div v-if="notice" class="alert success" role="status">
      <Icon name="check" :size="17" />{{ notice }}
    </div>
    <div class="player-grid">
      <section class="now-card" aria-labelledby="now-title">
        <div class="card-label">
          <span id="now-title">NOW PLAYING</span
          ><span class="tiny-state">{{ loading ? 'Loading' : state }}</span>
        </div>
        <div class="cover">
          <img
            v-if="current?.thumbnail"
            :src="current.thumbnail"
            alt="Current track artwork"
            @error="($event.target as HTMLImageElement).style.display = 'none'"
          />
          <div v-else class="cover-placeholder"><Icon name="headphones" :size="80" /></div>
          <div class="cover-caption">DIS / TRACK</div>
        </div>
        <template v-if="loading"
          ><div class="skeleton title-skeleton" />
          <div class="skeleton subtitle-skeleton"
        /></template>
        <template v-else-if="current"
          ><h2 class="track-title">
            <a :href="current.url" target="_blank" rel="noopener noreferrer">{{ current.title }}</a>
          </h2>
          <p class="track-artist">{{ current.artist || 'Artist unavailable' }}</p>
          <p class="track-detail">
            {{
              current.duration && current.duration !== 'Unknown' ? current.duration + ' · ' : ''
            }}Added by {{ current.requester || 'a listener' }}
          </p></template
        >
        <template v-else
          ><h2 class="track-title">The room is yours.</h2>
          <p class="track-artist">Add something worth sharing.</p>
          <p class="track-detail">Join a Discord voice channel to start.</p></template
        >
        <div class="playback-controls">
          <button
            class="icon-button"
            title="Stop and clear queue"
            aria-label="Stop playback and clear queue"
            :disabled="!connected || !!busy"
            @click="control('stop')"
          >
            <Icon name="stop" /></button
          ><button
            class="play-button"
            :aria-label="state === 'paused' ? 'Resume playback' : 'Pause playback'"
            :disabled="!['playing', 'paused'].includes(state) || !!busy"
            @click="control(state === 'paused' ? 'resume' : 'pause')"
          >
            <Icon :name="state === 'paused' ? 'play' : 'pause'" :size="26" /></button
          ><button
            class="icon-button"
            title="Skip track"
            aria-label="Skip current track"
            :disabled="!current || !!busy"
            @click="control('skip')"
          >
            <Icon name="skip" />
          </button>
        </div>
        <p class="sync-label">
          {{
            refreshing
              ? 'Updating…'
              : lastUpdated
                ? 'Live · refreshes every 5 seconds'
                : 'Waiting for player data'
          }}
        </p>
      </section>
      <div class="queue-column">
        <section class="add-card">
          <div>
            <h2>Add to the mix</h2>
            <p class="muted">A track, an album, or the whole playlist.</p>
          </div>
          <form @submit.prevent="addTrack">
            <label class="sr-only" for="track-url">YouTube or Spotify link</label
            ><input
              id="track-url"
              v-model="newUrl"
              placeholder="Paste a YouTube or Spotify link"
              autocomplete="off"
              :disabled="busy === 'add'"
            /><button class="button primary" :disabled="!newUrl.trim() || !!busy">
              <Icon name="plus" :size="18" />{{ busy === 'add' ? 'Adding…' : 'Add music' }}
            </button>
          </form>
          <p class="form-hint">
            Join your server’s voice channel first. Playlist imports may take a moment.
          </p>
        </section>
        <section class="queue-card" aria-labelledby="queue-title" :aria-busy="loading">
          <div class="queue-heading">
            <div>
              <p class="eyebrow">COMING UP</p>
              <h2 id="queue-title">
                The queue <span class="count-badge">{{ loading ? '—' : count }}</span>
              </h2>
            </div>
            <button
              class="button secondary"
              :disabled="count < 2 || !!busy || loading"
              @click="control('shuffle')"
            >
              <Icon name="shuffle" :size="17" />{{ busy === 'shuffle' ? 'Shuffling…' : 'Shuffle' }}
            </button>
          </div>
          <div class="queue-search">
            <Icon name="search" :size="18" /><label class="sr-only" for="queue-search"
              >Search queue</label
            ><input
              id="queue-search"
              v-model="search"
              placeholder="Find a song, artist or listener…"
            /><button v-if="search" class="text-button" @click="search = ''">Clear</button>
          </div>
          <div v-if="loading" class="queue-loading" aria-label="Loading queue">
            <div v-for="i in 6" :key="i" class="skeleton queue-skeleton" />
          </div>
          <div v-else-if="!tracks.length" class="empty-state">
            <Icon :name="search ? 'search' : 'music'" :size="34" />
            <h3>{{ search ? 'No matching tracks' : 'A little quiet in here' }}</h3>
            <p>
              {{
                search
                  ? 'Try a different title, artist or link.'
                  : 'Add your first track or playlist above.'
              }}
            </p>
          </div>
          <div v-else class="queue-scroll">
            <table class="queue-table">
              <thead>
                <tr>
                  <th scope="col" class="position-cell">#</th>
                  <th scope="col">TRACK</th>
                  <th scope="col" class="requester-cell">ADDED BY</th>
                  <th scope="col" class="duration-cell">TIME</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="track in tracks" :key="track.id">
                  <td class="position-cell">{{ track.position }}</td>
                  <td>
                    <div class="queue-track">
                      <img v-if="track.thumbnail" :src="track.thumbnail" alt="" loading="lazy" />
                      <div v-else class="small-cover"><Icon name="music" :size="18" /></div>
                      <div class="queue-track-text">
                        <a
                          :href="track.url"
                          target="_blank"
                          rel="noopener noreferrer"
                          :title="track.title || track.url"
                          >{{
                            track.title ||
                            (track.metadataPending
                              ? 'Loading track details…'
                              : 'Track details unavailable')
                          }}</a
                        ><span>{{ track.author || track.url }}</span>
                      </div>
                    </div>
                  </td>
                  <td class="requester-cell">{{ track.requester || '—' }}</td>
                  <td class="duration-cell">{{ track.duration || '—' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="queue-footer">
            <span
              >{{ filteredCount ? page * pageSize + 1 : 0 }}–{{
                Math.min((page + 1) * pageSize, filteredCount)
              }}
              of {{ filteredCount }}{{ search ? ' matches' : ' tracks' }}</span
            >
            <div class="pagination">
              <button
                class="icon-button"
                aria-label="Previous page"
                :disabled="page === 0 || loading"
                @click="page--"
              >
                <Icon name="chevron" class="rotate" :size="17" /></button
              ><span>{{ page + 1 }} / {{ pages }}</span
              ><button
                class="icon-button"
                aria-label="Next page"
                :disabled="page + 1 >= pages || loading"
                @click="page++"
              >
                <Icon name="chevron" :size="17" />
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  </main>
</template>
