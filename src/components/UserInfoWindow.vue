<script setup lang="ts">
interface User {
  id: string;
  username: string;
  tag: string;
  avatar: string;
  status?: "online" | "idle" | "dnd" | "offline";
  role?: string;
}

/**
 * Supply the component with an array of Discord‑like user objects.
 * All behaviour (fetching, filtering, real‑time status updates, etc.)
 * should be handled outside; this file focuses purely on layout + styles.
 */

defineProps<{
  users: User[];
}>();
</script>

<template>
  <div
    class="w-full max-w-md bg-zinc-800 text-white rounded-2xl shadow-xl overflow-hidden select-none"
  >
    <!-- ── Header / Toolbar ─────────────────────────────────────────────── -->
    <header class="flex items-center justify-between px-4 py-3 bg-zinc-900/80 backdrop-blur">
      <h2 class="text-lg font-semibold tracking-wide">Discord Users</h2>

      <!-- slot for optional toolbar actions (search, menu, etc.) -->
      <slot name="actions"></slot>
    </header>

    <!-- ── Users list ───────────────────────────────────────────────────── -->
    <ul class="divide-y divide-zinc-700 max-h-96 overflow-y-auto">
      <li
        v-for="user in users"
        :key="user.id"
        class="flex items-center gap-3 px-4 py-3 hover:bg-zinc-700/50 transition-colors"
      >
        <!-- Avatar + status ring -->
        <span class="relative">
          <img
            :src="user.avatar"
            :alt="`${user.username} avatar`"
            class="w-10 h-10 rounded-full object-cover"
          />
          <span
            v-if="user.status"
            :class="[
              'absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ring-2 ring-zinc-800',
              {
                'bg-green-500': user.status === 'online',
                'bg-amber-400': user.status === 'idle',
                'bg-red-500': user.status === 'dnd',
                'bg-zinc-500': user.status === 'offline',
              },
            ]"
          />
        </span>

        <!-- Username & discriminator tag -->
        <div class="flex-1 min-w-0">
          <p class="font-medium leading-none truncate">{{ user.username }}</p>
          <p class="text-xs text-zinc-400">{{ user.tag }}</p>
        </div>

        <!-- Role badge (optional) -->
        <span
          v-if="user.role"
          class="px-2 py-0.5 text-xs rounded-md bg-indigo-600/20 text-indigo-400 font-medium"
        >
          {{ user.role }}
        </span>
      </li>

      <!-- Empty‑state visual -->
      <li v-if="!users?.length" class="p-6 text-center text-zinc-500 text-sm">
        No users to display
      </li>
    </ul>
  </div>
</template>

<style scoped>
/* Slim, rounded scrollbar to fit the modern Discord aesthetic */
ul::-webkit-scrollbar {
  width: 6px;
}
ul::-webkit-scrollbar-track {
  background: transparent;
}
ul::-webkit-scrollbar-thumb {
  /* Fallback hex equivalent of Tailwind's zinc-600 to avoid theme issues */
  background: #52525b;
  border-radius: 9999px;
}
</style>
