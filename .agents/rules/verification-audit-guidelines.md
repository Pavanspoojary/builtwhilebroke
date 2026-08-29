# Mandatory Verification & Audit Guidelines

Whenever any new tool, workstation, space, component, or configuration is added or modified in the **BuiltWhileBroke** codebase, the following multi-tier verification and audit protocol **must be strictly executed**:

---

## 1. Automated Build & Type-Safety Verification
- **Full Production Build Check**: Run `npm run build` (`tsc -b && vite build`) after completing any changes.
- **Zero-Error Tolerance**: No TypeScript compilation warnings, unresolved symbol imports, or missing prop types are permitted.
- **Bundle Integrity**: Ensure generated chunks and assets in `dist/` compile cleanly without broken dynamic import paths.

---

## 2. Asset & Binary Integrity Verification
- **Static Asset Verification**: When adding tools embedded in `public/tools/<tool-name>/`, verify that all required static files (`index.html`, WebAssembly `.wasm` binaries, JavaScript worker scripts, ROMs, images) are physically present in the target directory.
- **WASM Checksum & Path Matching**: Ensure all `new URL('./...', import.meta.url)` paths resolve cleanly within the isolated tool directory and match upstream SHA-256 release manifests where applicable.
- **Zero Broken Links**: Verify all asset URLs (avatars, icons, samples, images) render with valid sources or provide resilient client-side fallbacks.

---

## 3. Upstream License & Model Compliance Audit
- **Code License Verification**: Verify and document the core application's open-source license (MIT, BSD-2-Clause, Apache 2.0).
- **Model Weight Licensing**: Explicitly audit all on-device weights, models, and embeddings (e.g., Whisper, TitaNet, Nemotron, Qwen3, LFM2.5, Gemma, Kokoro, Piper).
- **Attribution & Transparency**: Ensure every tool wrapper includes:
  - Direct upstream GitHub source repository link.
  - Interactive "MIT / BSD License & Model Audit" transparency modal.
  - Upstream author copyright notice.

---

## 4. Cross-Space Consistency & Navigation Verification
- **Route Registration**: Verify direct route in `App.tsx` (e.g., `/tools/<tool-name>`).
- **Catalogue Sync**: Ensure new additions are registered across:
  - Home Page Tool Catalogue (`src/components/CategoryGrid.tsx`).
  - Space 01: **TOOLS** (`/tools`).
  - Space 03: **DIRECTORY** (`/directory`).
  - Space 06: **OPEN SOURCE** (`/open-source`).
- **Client-Side Navigation**: Test that clicking cards, nav links, and CTA buttons switches routes smoothly using the browser History API without full page reloads.

---

## 5. Graceful Degradation & Error Handling
- **Hardware Fallback**: Handle unsupported WebGPU environments by gracefully switching to WASM/CPU execution with informative UI status badges.
- **Zero Console Spam**: Ensure missing hardware features (mic permissions, WebGPU, WebAudio gestures) are caught cleanly without unhandled rejections or infinite retry loops.
