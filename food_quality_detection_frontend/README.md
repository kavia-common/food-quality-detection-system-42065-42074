# Food Quality Detection - Frontend (Vue 3 + Vite)

A responsive web UI to analyze food quality from an uploaded or captured image.

- Ocean Professional theme (primary #2563EB, secondary/success #F59E0B, error #EF4444, background #f9fafb, surface #ffffff, text #111827)
- Accessible components with keyboard navigation
- API service using VITE_API_BASE with timeout, AbortController, and graceful error handling
- Mock mode when VITE_API_BASE is empty so the UI is fully testable offline

## Screenshots (placeholders)
- Home (Uploader + Results + Feedback)
- Settings (Env values)

## Getting Started

1) Install dependencies
```bash
npm install
```

2) Run locally
```bash
npm run dev
```
The app will start on http://localhost:3000 (port set in vite.config.ts).

3) Build for production
```bash
npm run build
```

4) Preview production build
```bash
npm run preview
```

## Environment Variables

The app reads VITE_* values at build time. Do not modify .env here; configure via deployment environment.

Key variables used:
- VITE_API_BASE: Base URL for the backend API. If empty, the app uses mock responses and shows a banner.
- Other variables displayed on Settings page: VITE_BACKEND_URL, VITE_FRONTEND_URL, VITE_WS_URL, VITE_NODE_ENV, VITE_NEXT_TELEMETRY_DISABLED, VITE_ENABLE_SOURCE_MAPS, VITE_PORT, VITE_TRUST_PROXY, VITE_LOG_LEVEL, VITE_HEALTHCHECK_PATH, VITE_FEATURE_FLAGS, VITE_EXPERIMENTS_ENABLED.

## Features

- Central image uploader with drag-and-drop and camera capture on mobile
- Results panel showing predicted quality, confidence, and indicators
- Feedback form to submit correction/notes (console logged; ready to hook to backend)
- Settings page displaying current VITE_* values (read-only)
- Graceful handling of large files and unsupported formats

## Tech & Structure

- Composition API, Vue Router
- src/services/api.ts — isolated API service with fetch/AbortController and mock fallback
- src/composables/useAnalyzer.ts — manages upload/analyze flow and UI state
- Components: ImageUploader, ResultsPanel, FeedbackForm, TopNav, AppFooter

## Accessibility

- Proper aria roles/labels
- Keyboard navigation for uploader (Enter/Space)
- ARIA live regions for results

## Notes

- If a backend is provided, set VITE_API_BASE to your API base (e.g., https://api.example.com).
- POST /analyze expects multipart form-data with a "file" field.

