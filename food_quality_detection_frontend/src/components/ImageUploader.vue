<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const emit = defineEmits<{
  (e: 'select', file: File): void
}>()

const inputRef = ref<HTMLInputElement | null>(null)
const dragging = ref(false)

function onFiles(files: FileList | null) {
  if (!files || !files.length) return
  const f = files[0]
  emit('select', f)
}

function onDrop(e: DragEvent) {
  e.preventDefault()
  dragging.value = false
  const dt = e.dataTransfer
  if (!dt) return
  if (dt.files && dt.files.length) {
    onFiles(dt.files)
  }
}

function onDragOver(e: DragEvent) {
  e.preventDefault()
  dragging.value = true
}

function onDragLeave() {
  dragging.value = false
}

function triggerPick() {
  inputRef.value?.click()
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    triggerPick()
  }
}

onMounted(() => {
  window.addEventListener('dragover', (e) => e.preventDefault())
  window.addEventListener('drop', (e) => e.preventDefault())
})
onBeforeUnmount(() => {
  window.removeEventListener('dragover', (e) => e.preventDefault())
  window.removeEventListener('drop', (e) => e.preventDefault())
})
</script>

<template>
  <section
    class="uploader card"
    :class="{ dragging }"
    @drop="onDrop"
    @dragover="onDragOver"
    @dragleave="onDragLeave"
    tabindex="0"
    role="button"
    aria-label="Upload or drop an image of food to analyze quality"
    @keydown="onKey"
  >
    <div class="inner">
      <div class="icon" aria-hidden="true">📷</div>
      <div>
        <h2 class="title">Upload or capture food image</h2>
        <p class="hint">Drag and drop an image, or <span class="link" @click.stop="triggerPick">browse</span>. On mobile, you can capture using the camera.</p>
      </div>
    </div>
    <input
      ref="inputRef"
      class="hidden-input"
      type="file"
      accept="image/*"
      capture="environment"
      @change="onFiles(($event.target as HTMLInputElement).files)"
      aria-label="Choose image file to analyze"
    />
  </section>
</template>

<style scoped>
.uploader {
  padding: 2rem;
  text-align: center;
  border-style: dashed;
  border-width: 2px;
  border-color: var(--color-border);
  cursor: pointer;
  transition: border-color .2s ease, background-color .2s ease, transform .08s ease;
}
.uploader.dragging {
  border-color: var(--color-primary);
  background: rgba(37,99,235,0.06);
}
.inner { display: flex; align-items: center; gap: 1rem; justify-content: center; flex-wrap: wrap; }
.icon { font-size: 2rem; }
.title { margin: 0; color: var(--color-text-strong); }
.hint { color: #6b7280; }
.link { color: var(--color-primary); text-decoration: underline; cursor: pointer; }
.hidden-input { display: none; }
</style>
