<script setup lang="ts">
const inviteLink =
  'https://discord.com/oauth2/authorize?client_id=1371932098851639357'
</script>

<template>
  <main class="invite-container">
    <div class="invite-box">
      <img
        src="/Discord-Symbol-Blurple.png"
        alt="Discord Logo"
        class="discord-logo"
      />
      <h1>Invite Dis Bot</h1>
      <p>Add the bot to your server and start listening together!</p>
      <a
        :href="inviteLink"
        class="invite-button"
        target="_blank"
        rel="noopener"
      >
        Invite Bot
      </a>
    </div>
  </main>
</template>

<style scoped>
.invite-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.invite-box {
  background: #23272a;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.4);
  text-align: center;
  max-width: 400px;
  width: 90%;
}

.discord-logo {
  width: 80px;
  margin-bottom: 20px;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

h1 {
  color: #fff;
  font-size: 2em;
  margin-bottom: 10px;
}

p {
  color: #b9bbbe;
  font-size: 1.2em;
  margin-bottom: 30px;
}

.invite-button {
  background-color: #5865f2;
  color: white;
  border: none;
  padding: 12px 20px;
  font-size: 1em;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  text-decoration: none;
  display: inline-block;
}

.invite-button:hover {
  background-color: #4752c4;
}
</style>
