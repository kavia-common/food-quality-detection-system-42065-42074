<script setup lang="ts">
import ImageUploader from '@/components/ImageUploader.vue'
import ResultsPanel from '@/components/ResultsPanel.vue'
import FeedbackForm from '@/components/FeedbackForm.vue'
import { useAnalyzer } from '@/composables/useAnalyzer'
import { computed } from 'vue'

const {
  file, previewUrl, loading, error, result, mockMode,
  canAnalyze, setFile, analyze, reset, toggleMockMode, MAX_FILE_SIZE_MB, SUPPORTED_TYPES, ASSESSMENT_MIME_TYPES, loadAssessment
} = useAnalyzer()

const accept = computed(() => SUPPORTED_TYPES.join(','))
const assessmentAccept = computed(() => ASSESSMENT_MIME_TYPES.join(','))

function onSelect(f: File) { setFile(f) }
function onAnalyze() { analyze() }
function onReset() { reset() }
function onFeedback(payload: { correction?: 'Fresh'|'Stale'|'Spoiled'|''; notes: string }) {
  // Stub: Wire up to backend endpoint when available
  console.info('Feedback submitted', payload)
}
async function onAssessmentPick(e: Event) {
  const input = e.target as HTMLInputElement
  const f = input.files && input.files[0]
  if (!f) return
  await loadAssessment(f)
  // clear chosen file to allow re-select same file if needed
  input.value = ''
}
</script>

<template>
  <div class="home">
    <div class="banner card" role="status" v-if="mockMode">
      <strong>Mock mode:</strong> Backend URL not configured (VITE_API_BASE empty). Responses are simulated.
      <button class="button-secondary button" style="margin-left:.75rem" @click="toggleMockMode(false)">Hide</button>
    </div>

    <div class="hero card">
      <div class="hero-text">
        <h1>Food Quality Detection</h1>
        <p class="lead">Upload a photo of your food item to estimate quality with confidence and key indicators.</p>
        <p class="meta">Max size: {{ MAX_FILE_SIZE_MB }} MB • Accepted: {{ accept }}</p>
      </div>
      <div class="actions">
        <ImageUploader @select="onSelect" />
        <div v-if="file" class="picked">
          <div class="preview" v-if="previewUrl">
            <img :src="previewUrl" alt="Preview of selected food image" />
          </div>
          <div class="buttons">
            <button class="button" :disabled="!canAnalyze" @click="onAnalyze" aria-label="Analyze image">Analyze</button>
            <button class="button button-danger" @click="onReset" aria-label="Clear image">Clear</button>
          </div>
        </div>

        <div class="assessment-loader">
          <label for="assessment-input" class="muted">Or load an existing assessment (.json):</label>
          <input id="assessment-input" class="input" type="file" :accept="assessmentAccept" @change="onAssessmentPick" />
        </div>
      </div>
    </div>

    <ResultsPanel :result="result" :loading="loading" :error="error" />

    <FeedbackForm class="feedback" :disabled="loading || !result" @submit="onFeedback" />
  </div>
</template>

<style scoped>
.home { display: grid; gap: 1rem; }
.banner { padding: .75rem 1rem; background: rgba(245,158,11,0.10); border-left: 4px solid var(--color-secondary); }
.hero { padding: 1rem; display: grid; gap: 1rem; }
.hero-text { display: grid; gap: .5rem; }
.lead { color: #374151; }
.meta { color: #6b7280; font-size: .9rem; }
.actions { display: grid; gap: 1rem; }
.picked { display: grid; gap: .75rem; }
.preview { max-height: 280px; overflow: hidden; border-radius: var(--radius-sm); border: 1px solid var(--color-border); }
.preview img { display: block; width: 100%; height: auto; object-fit: cover; }
.buttons { display: flex; gap: .5rem; flex-wrap: wrap; }
.feedback { margin-top: .5rem; }
.assessment-loader { display: grid; gap: .35rem; }
.muted { color: #6b7280; }
</style>
