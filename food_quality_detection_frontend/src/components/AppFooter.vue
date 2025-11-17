<template>
  <footer class="footer card" role="contentinfo">
    <div class="content">
      <p>© {{ new Date().getFullYear() }} Food Quality Detection</p>
      <p class="muted">Ocean Professional theme • Built with Vue 3 + Vite</p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  margin-top: 2rem;
  padding: 1rem;
}
.content {
  display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: .5rem;
}
.muted { color: #6b7280; font-size: .9rem; }
</style>
