<script setup lang="ts">
const env = {
  VITE_API_BASE: import.meta.env.VITE_API_BASE || '',
  VITE_BACKEND_URL: import.meta.env.VITE_BACKEND_URL || '',
  VITE_FRONTEND_URL: import.meta.env.VITE_FRONTEND_URL || '',
  VITE_WS_URL: import.meta.env.VITE_WS_URL || '',
  VITE_NODE_ENV: import.meta.env.VITE_NODE_ENV || '',
  VITE_NEXT_TELEMETRY_DISABLED: import.meta.env.VITE_NEXT_TELEMETRY_DISABLED || '',
  VITE_ENABLE_SOURCE_MAPS: import.meta.env.VITE_ENABLE_SOURCE_MAPS || '',
  VITE_PORT: import.meta.env.VITE_PORT || '',
  VITE_TRUST_PROXY: import.meta.env.VITE_TRUST_PROXY || '',
  VITE_LOG_LEVEL: import.meta.env.VITE_LOG_LEVEL || '',
  VITE_HEALTHCHECK_PATH: import.meta.env.VITE_HEALTHCHECK_PATH || '',
  VITE_FEATURE_FLAGS: import.meta.env.VITE_FEATURE_FLAGS || '',
  VITE_EXPERIMENTS_ENABLED: import.meta.env.VITE_EXPERIMENTS_ENABLED || ''
}
</script>

<template>
  <section class="card settings">
    <h2>Settings</h2>
    <p class="muted">Environment configuration (read-only). Update values via your deployment environment.</p>
    <div class="grid">
      <div v-for="(value, key) in env" :key="key" class="row">
        <label :for="String(key)">{{ key }}</label>
        <input class="input" :id="String(key)" type="text" :value="String(value)" readonly />
      </div>
    </div>
  </section>
</template>

<style scoped>
.settings { padding: 1rem; }
.muted { color: #6b7280; margin-top: .25rem; }
.grid { display: grid; gap: .5rem; margin-top: .5rem; }
.row { display: grid; gap: .25rem; }
label { font-weight: 600; color: var(--color-text-strong); }
input[readonly] { background: #f3f4f6; }
</style>
