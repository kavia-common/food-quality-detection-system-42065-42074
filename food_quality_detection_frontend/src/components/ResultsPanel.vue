<script setup lang="ts">
import type { AnalysisResult } from '@/services/api'
defineProps<{
  result: AnalysisResult | null
  loading?: boolean
  error?: string | null
}>()
</script>

<template>
  <section class="card results" aria-live="polite">
    <header class="header">
      <h3>Results</h3>
    </header>

    <div v-if="loading" class="state">
      <div class="spinner" aria-hidden="true"></div>
      <p>Analyzing image…</p>
    </div>

    <div v-else-if="error" class="state error">
      <p role="alert">Error: {{ error }}</p>
    </div>

    <div v-else-if="!result" class="state empty">
      <p>No analysis yet. Upload an image to see results.</p>
    </div>

    <div v-else class="content">
      <div class="summary">
        <div class="quality" :data-quality="result.quality">
          <span class="label">Predicted Quality</span>
          <span class="value">{{ result.quality }}</span>
        </div>
        <div class="confidence">
          <span class="label">Confidence</span>
          <div class="bar" role="progressbar" :aria-valuenow="Math.round(result.confidence*100)" aria-valuemin="0" aria-valuemax="100">
            <div class="fill" :style="{ width: (result.confidence*100).toFixed(0) + '%' }"></div>
          </div>
          <span class="percent">{{ (result.confidence*100).toFixed(0) }}%</span>
        </div>
      </div>
      <div class="indicators">
        <h4>Key Indicators</h4>
        <ul>
          <li v-for="(ind,i) in result.indicators" :key="i">
            <span class="name">{{ ind.name }}</span>
            <span class="spacer" aria-hidden="true"></span>
            <span class="val">{{ ind.value }}<span v-if="ind.unit">&nbsp;{{ ind.unit }}</span></span>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.results { padding: 1rem; }
.header { padding: .5rem .5rem 1rem; }
.state { display: grid; place-items: center; padding: 2rem; color: #6b7280; }
.state.error { color: var(--color-error); }
.content { display: grid; gap: 1rem; }
.summary {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}
@media (min-width: 640px) {
  .summary { grid-template-columns: 1fr 1fr; }
}
.quality { padding: 1rem; border-radius: var(--radius-sm); background: rgba(37,99,235,0.06); border: 1px solid var(--color-border); }
.quality[data-quality="Fresh"] { background: rgba(16,185,129,0.08); }
.quality[data-quality="Stale"] { background: rgba(245,158,11,0.10); }
.quality[data-quality="Spoiled"] { background: rgba(239,68,68,0.10); }
.label { display: block; color: #6b7280; font-size: .9rem; }
.value { display: block; font-size: 1.25rem; font-weight: 700; color: var(--color-text-strong); }
.confidence { padding: 1rem; border-radius: var(--radius-sm); border: 1px solid var(--color-border); background: var(--color-surface); }
.bar { height: 10px; background: #e5e7eb; border-radius: 999px; overflow: hidden; margin: .5rem 0; }
.fill { height: 100%; background: var(--color-primary); }
.percent { font-weight: 600; color: var(--color-text-strong); }
.indicators h4 { margin: .5rem 0; }
.indicators ul { list-style: none; margin: 0; padding: 0; display: grid; gap: .5rem; }
.indicators li {
  display: grid; grid-template-columns: 1fr auto; gap: .5rem;
  padding: .5rem .75rem; border: 1px solid var(--color-border); border-radius: var(--radius-sm);
  background: var(--color-surface);
}
.name { color: var(--color-text-strong); font-weight: 500; }
.spacer { flex: 1; border-bottom: 1px dotted rgba(0,0,0,0.15); align-self: center; margin: 0 .5rem; display: none; }
.val { font-variant-numeric: tabular-nums; }
@media (min-width: 640px) {
  .spacer { display: block; grid-column: 1 / -1; height: 0; }
}
.spinner {
  width: 28px; height: 28px; border-radius: 50%;
  border: 3px solid rgba(37,99,235,0.25); border-top-color: var(--color-primary);
  animation: spin 0.9s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>
