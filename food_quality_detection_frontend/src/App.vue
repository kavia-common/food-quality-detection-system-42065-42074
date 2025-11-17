<script setup lang="ts">
import { RouterView } from 'vue-router'
import TopNav from '@/components/TopNav.vue'
import AppFooter from '@/components/AppFooter.vue'
</script>

<template>
  <div class="app-shell">
    <TopNav />
    <main class="container" id="main-content">
      <RouterView />
    </main>
    <AppFooter />
  </div>
</template>

<style scoped>
.app-shell { min-height: 100vh; display: grid; grid-template-rows: auto 1fr auto; }
.container { width: 100%; max-width: 1040px; margin: 0 auto; padding: 1rem; }
</style>
