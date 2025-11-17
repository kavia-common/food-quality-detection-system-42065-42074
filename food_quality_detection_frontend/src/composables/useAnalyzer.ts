import { ref, computed } from 'vue'
import { analyzeImage, isMockMode, loadAssessmentFromFile, type AnalyzeResponse, type AnalysisResult } from '@/services/api'

const MAX_FILE_SIZE_MB = 15
const SUPPORTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']
const ASSESSMENT_MIME_TYPES = ['application/json']

export function useAnalyzer() {
  const file = ref<File | null>(null)
  const previewUrl = ref<string | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const result = ref<AnalysisResult | null>(null)
  const mockMode = ref(isMockMode())

  const canAnalyze = computed(() => !!file.value && !loading.value)

  function reset() {
    file.value = null
    result.value = null
    error.value = null
    if (previewUrl.value) {
      URL.revokeObjectURL(previewUrl.value)
      previewUrl.value = null
    }
  }

  function validateFile(f: File): string | null {
    if (!SUPPORTED_TYPES.includes(f.type)) {
      return 'Unsupported file format. Please upload JPEG, PNG, WEBP, or HEIC/HEIF.'
    }
    const sizeMB = f.size / (1024 * 1024)
    if (sizeMB > MAX_FILE_SIZE_MB) {
      return `File too large (${sizeMB.toFixed(1)} MB). Maximum allowed is ${MAX_FILE_SIZE_MB} MB.`
    }
    return null
  }

  function setFile(f: File) {
    error.value = null
    const v = validateFile(f)
    if (v) {
      error.value = v
      return
    }
    file.value = f
    if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = URL.createObjectURL(f)
  }

  async function analyze() {
    if (!file.value) return
    loading.value = true
    error.value = null
    result.value = null
    try {
      const res: AnalyzeResponse = await analyzeImage(file.value)
      if (res.ok) {
        result.value = res.data
      } else {
        error.value = res.error || 'Analysis failed'
      }
    } finally {
      loading.value = false
    }
  }

  // PUBLIC_INTERFACE
  async function loadAssessment(file: File) {
    /** Load an assessment JSON file and set it as the current result. */
    loading.value = true
    error.value = null
    try {
      const res = await loadAssessmentFromFile(file)
      if (res.ok) {
        result.value = res.data
      } else {
        error.value = res.error || 'Invalid assessment file'
      }
    } finally {
      loading.value = false
    }
  }

  // PUBLIC_INTERFACE
  function toggleMockMode(on: boolean) {
    /** Toggle mock mode for UI testing when no backend is reachable. Note: Actual API service uses VITE_API_BASE; this toggle is a UI hint. */
    mockMode.value = on
    // When forcing mock on, we don't change env var; service already uses env emptiness.
    // This flag can be used by UI to show banner.
  }

  return {
    file,
    previewUrl,
    loading,
    error,
    result,
    mockMode,
    canAnalyze,
    setFile,
    analyze,
    reset,
    toggleMockMode,
    loadAssessment,
    SUPPORTED_TYPES,
    MAX_FILE_SIZE_MB,
    ASSESSMENT_MIME_TYPES,
  }
}
