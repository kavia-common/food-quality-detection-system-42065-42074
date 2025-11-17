<script setup lang="ts">
import { ref } from 'vue'

// Define props without assigning to a variable to avoid unused var lint error
defineProps<{
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'submit', payload: { correction?: 'Fresh'|'Stale'|'Spoiled'|''; notes: string }): void
}>()

const correction = ref<'' | 'Fresh' | 'Stale' | 'Spoiled'>('')
const notes = ref('')

function onSubmit(e: Event) {
  e.preventDefault()
  emit('submit', { correction: correction.value, notes: notes.value.trim() })
  notes.value = ''
}
</script>

<template>
  <form class="card form" @submit="onSubmit" aria-label="Feedback form for analysis result">
    <h3>Feedback</h3>
    <p class="muted">Help us improve by providing a correction or leaving a note.</p>
    <div class="row">
      <label for="correction">Correction</label>
      <select id="correction" class="input" v-model="correction" :disabled="disabled">
        <option value="">No correction</option>
        <option value="Fresh">Fresh</option>
        <option value="Stale">Stale</option>
        <option value="Spoiled">Spoiled</option>
      </select>
    </div>
    <div class="row">
      <label for="notes">Notes</label>
      <textarea id="notes" class="input" v-model="notes" rows="3" placeholder="Add any observations…" :disabled="disabled"></textarea>
    </div>
    <div class="actions">
      <button class="button" type="submit" :disabled="disabled">Submit Feedback</button>
    </div>
  </form>
</template>

<style scoped>
.form { padding: 1rem; display: grid; gap: .75rem; }
.muted { color: #6b7280; margin-top: -.25rem; }
.row { display: grid; gap: .35rem; }
label { font-weight: 600; color: var(--color-text-strong); }
textarea.input { resize: vertical; }
.actions { display: flex; justify-content: flex-end; }
</style>
