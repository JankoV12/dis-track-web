<script setup lang="ts">
import { RouterLink } from 'vue-router'
import Icon from '@/components/AppIcon.vue'
import { useSession } from '@/composables/useSession'
const { user } = useSession()
</script>
<template>
  <main class="page home-page">
    <p class="eyebrow">THE SOUND OF YOUR SERVER</p>
    <div class="hero-grid">
      <div>
        <h1>Same room.<br />Different tastes.<br /><span>One good queue.</span></h1>
        <p class="hero-copy">
          Bring your favorite tracks to Discord. Add a playlist, pass the controls, and find your
          next shared favorite.
        </p>
        <RouterLink :to="user ? '/userInfo' : '/login'" class="button primary large"
          >{{ user ? 'Choose your server' : 'Connect with Discord' }}<Icon name="arrow"
        /></RouterLink>
        <p class="form-hint">YouTube & Spotify links. Played together in voice.</p>
      </div>
      <div class="record-art" aria-hidden="true">
        <div class="record-disc">
          <div class="record-label">
            <Icon name="headphones" :size="48" /><span>DIS / TRACK</span><i />
          </div>
        </div>
        <span class="record-stamp">GOOD COMPANY.<br />GREAT SOUNDTRACK.</span>
      </div>
    </div>
    <div class="feature-grid">
      <article>
        <span>01 / ADD</span>
        <h2>One link. A whole mood.</h2>
        <p>Drop in a song, album or supported playlist and keep the room going.</p>
      </article>
      <article>
        <span>02 / MIX</span>
        <h2>Let the queue surprise you.</h2>
        <p>Shuffle upcoming tracks while the current song keeps playing.</p>
      </article>
      <article>
        <span>03 / SHARE</span>
        <h2>Stay in the conversation.</h2>
        <p>Control your server’s music from one place, on your phone or desktop.</p>
      </article>
    </div>
  </main>
</template>
