<script setup lang="ts">
import {ref, onMounted} from 'vue';
import UserInfoWindow from '@/components/UserInfoWindow.vue';
import axios from 'axios';

interface User {
  id: string;
  username: string;
  tag: string;
  avatar: string;
  status?: "online" | "idle" | "dnd" | "offline";
  role?: string;
};

const users = ref<User[]>([]);

onMounted (async () => {
  try {
    const response = await axios.get('https://discord.com/api/v10/users/@me', {
      headers: {'Authorization': `Bearer ${localStorage.getItem('auth_token')}`}
    });
    if (response.status === 200) {
      const userData = response.data;
      users.value = [{
        id: userData.id,
        username: userData.username,
        tag: userData.discriminator,
        avatar: `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`,
        status: 'online', // Placeholder, as Discord API doesn't provide this in the /users/@me endpoint
        role: 'member' // Placeholder, as Discord API doesn't provide this in the /users/@me endpoint
      }];
    }
  }
  catch (error) {
    console.error('Error fetching users:', error);
  }
});

</script>

<template>
<main>
  <UserInfoWindow :users="users" />
</main>
</template>

<style scoped>

</style>
