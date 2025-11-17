<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'

const route = useRoute()
const current = computed(() => route.name)
</script>

<template>
  <header class="nav-wrapper" role="banner">
    <nav class="nav card" aria-label="Main navigation">
      <div class="brand">
        <span class="logo" aria-hidden="true">🍽️</span>
        <RouterLink class="brand-link" to="/" aria-label="Food Quality Home">Food Quality</RouterLink>
      </div>
      <ul class="links" role="menubar" aria-label="Primary">
        <li role="none">
          <RouterLink role="menuitem" :aria-current="current==='home' ? 'page' : undefined" to="/">Home</RouterLink>
        </li>
        <li role="none">
          <RouterLink role="menuitem" :aria-current="current==='settings' ? 'page' : undefined" to="/settings">Settings</RouterLink>
        </li>
      </ul>
    </nav>
  </header>
</template>

<style scoped>
.nav-wrapper { position: sticky; top: 0; z-index: 40; padding: 1rem 0; backdrop-filter: saturate(120%) blur(6px); }
.nav {
  display: flex; align-items: center; justify-content: space-between;
  padding: .75rem 1rem;
}
.brand { display: inline-flex; align-items: center; gap: .5rem; }
.logo { font-size: 1.35rem; }
.brand-link { font-weight: 700; color: var(--color-text-strong); text-decoration: none; }
.links { list-style: none; display: flex; gap: .5rem; margin: 0; padding: 0; }
.links a {
  text-decoration: none; color: var(--color-text);
  padding: .5rem .75rem; border-radius: var(--radius-sm);
}
.links a[aria-current="page"] { background: rgba(37,99,235,.12); color: var(--color-primary); font-weight: 600; }
.links a:focus-visible { outline: 3px solid rgba(37,99,235,0.4); outline-offset: 2px; border-radius: var(--radius-sm); }
</style>
