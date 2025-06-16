<script setup lang="ts">
const inviteLink = 'https://discord.com/oauth2/authorize?client_id=1371932098851639357'
</script>

<template>
  <main class="invite">
    <h1>Invite the bot to your server</h1>
    <a :href="inviteLink" class="invite-link" target="_blank" rel="noopener">Invite Link</a>
  </main>
</template>

<style scoped>
.invite {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  gap: 1rem;
}

.invite-link {
  color: #5865f2;
  font-size: 1.2em;
}
</style>
