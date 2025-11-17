export type Indicator = { name: string; value: number; unit?: string }
export type AnalysisResult = {
  quality: 'Fresh' | 'Stale' | 'Spoiled'
  confidence: number // 0..1
  indicators: Indicator[]
}

export type AnalyzeResponse =
  | {
      ok: true
      data: AnalysisResult
    }
  | {
      ok: false
      error: string
      status?: number
    }

const DEFAULT_TIMEOUT_MS = 20000

function getBase(): string {
  // PUBLIC_INTERFACE
  // Read-only base URL from environment variables
  /** Returns the configured API base URL from VITE_API_BASE or empty string when not set. */
  return (import.meta.env.VITE_API_BASE as string) || ''
}

// PUBLIC_INTERFACE
export function isMockMode(): boolean {
  /** Returns whether API mock mode is enabled (active when VITE_API_BASE is empty). */
  return !getBase()
}

function withTimeout<T>(promise: Promise<T>, ms = DEFAULT_TIMEOUT_MS, controller?: AbortController): Promise<T> {
  let timeoutId: number | undefined
  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      controller?.abort('timeout')
      reject(new Error('Request timed out'))
    }, ms) as unknown as number
  })
  return Promise.race([promise, timeout]).finally(() => {
    if (timeoutId !== undefined) clearTimeout(timeoutId)
  })
}

function buildFormData(file: File): FormData {
  const fd = new FormData()
  fd.append('file', file, file.name)
  return fd
}

function mockAnalyze(file: File): Promise<AnalyzeResponse> {
  // Simulate basic "analysis" based on file size to produce deterministic output
  const size = file.size
  const qualities: AnalysisResult['quality'][] = ['Fresh', 'Stale', 'Spoiled']
  const idx = size % 3
  const confidence = Math.min(0.95, 0.5 + ((size % 1000) / 1000) * 0.45)
  const indicators = [
    { name: 'Color Index', value: Math.round(size % 255), unit: 'CI' },
    { name: 'Surface Moisture', value: Math.round((size % 100) / 1.2), unit: '%' },
    { name: 'Texture Score', value: Math.round((size % 100) / 2), unit: '/100' },
  ]
  return new Promise((resolve) => {
    setTimeout(() => resolve({ ok: true as const, data: { quality: qualities[idx], confidence, indicators } }), 650)
  })
}

// PUBLIC_INTERFACE
export async function analyzeImage(
  file: File,
  opts?: { signal?: AbortSignal; timeoutMs?: number },
): Promise<AnalyzeResponse> {
  /** Sends an image for analysis to POST /analyze at VITE_API_BASE or returns a mocked response when mock mode is active.
   * Params:
   *  - file: the image file to analyze
   *  - opts.signal: AbortSignal for cancelling
   *  - opts.timeoutMs: request timeout override (ms)
   * Returns:
   *  - AnalyzeResponse containing either data or error with status code
   */
  if (isMockMode()) return mockAnalyze(file)

  const base = getBase().replace(/\/+$/, '')
  const url = `${base}/analyze`

  const controller = new AbortController()
  // relay is not strictly required but kept for parity with previous logic
  if (opts?.signal) {
    opts.signal.addEventListener(
      'abort',
      () => {
        controller.abort(opts.signal?.reason)
      },
      { once: true },
    )
  }

  const fd = buildFormData(file)
  const req = fetch(url, {
    method: 'POST',
    body: fd,
    signal: controller.signal,
  })
    .then(async (res) => {
      if (!res.ok) {
        const text = await res.text().catch(() => '')
        return { ok: false as const, error: text || `HTTP ${res.status}`, status: res.status }
      }
      const data = (await res.json().catch(() => null)) as
        | { quality?: AnalysisResult['quality']; confidence?: number; indicators?: Indicator[] }
        | null
      if (!data || !data.quality) return { ok: false as const, error: 'Invalid JSON in response' }
      // Coerce shape defensively
      const result: AnalysisResult = {
        quality: data.quality,
        confidence: Number(data.confidence ?? 0),
        indicators: Array.isArray(data.indicators) ? data.indicators : [],
      }
      return { ok: true as const, data: result }
    })
    .catch((err: unknown) => {
      const e = err as { name?: string; message?: string }
      if (e && e.name === 'AbortError') {
        return { ok: false as const, error: 'Request aborted' }
      }
      return { ok: false as const, error: e?.message || 'Network error' }
    })

  return withTimeout(req, opts?.timeoutMs ?? DEFAULT_TIMEOUT_MS, controller)
}
