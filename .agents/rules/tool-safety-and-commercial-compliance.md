# Mandatory Tool Safety, Security & Commercial License Compliance Rule

> [!IMPORTANT]
> **PERMANENT CORE DIRECTIVE**: Every single time a new tool, library, AI model, npm dependency, or directory entry is evaluated or proposed for **Built While Broke (BWB)**, an **exhaustive, detailed commercial use and security check MUST be executed first** before any code is written or committed.

---

## 🛡️ 1. Commercial Use & Open-Source License Permissibility Standard

Every proposed candidate must satisfy **unrestricted commercial viability**:

1. **Permitted Commercial Code Licenses**:
   - **MIT License**: Fully approved for commercial use, modification, distribution, and sublicensing.
   - **Apache-2.0**: Fully approved for commercial use, modification, and distribution with patent grant.
   - **BSD-2-Clause & BSD-3-Clause**: Fully approved for commercial use with copyright notice retention.
   - **ISC / CC0 / Public Domain / 0BSD**: Fully approved.
   - **AGPL-3.0 / GPL-3.0**: Approved for standalone tools provided source code availability and AGPL obligations are maintained.
   - **LGPL-2.1 / LGPL-3.0**: Approved for dynamically linked WebAssembly/C++ modules (e.g. OpenCascade.js, FFmpeg.wasm).

2. **Prohibited / Flagged Licenses (Must be rejected or replaced)**:
   - **PolyForm Noncommercial** / **CC-BY-NC** / **Commons Clause** / **Research-Only**: **NOT permitted** for standard BWB tools. Always seek a 100% permissive alternative (e.g., OpenScript [MIT] replacing ReScript [PolyForm]).

3. **Dual-Layer Model Weights & Neural Runtimes Audit**:
   - When tools bundle AI models (Whisper, Kokoro TTS, TitaNet, GGUF quants, MediaPipe Pose, Tesseract OCR), the model weights themselves must be checked for commercial permissibility (MIT, Apache-2.0, OpenRAIL-M, CC-BY-4.0).

---

## 🔒 2. Zero-Telemetry & Client-Side Sandbox Security Standard

1. **100% In-Browser & Local Execution Guarantee**:
   - All computation (inference, video rendering, vector geometry, audio synthesis, OCR) must happen **100% inside client-side browser memory, WebAssembly, WebGL, or WebGPU**.
   - **Zero Unauthorized Outbound Telemetry**: Keystrokes, audio feeds, webcam streams, uploaded files, and prompt contents must **NEVER** be sent to third-party tracking endpoints or cloud servers.
2. **Master Purge Engine Compliance**:
   - Every tool storing data, caching audio/video chunks, or downloading weights must register its IndexedDB databases, CacheStorage buckets, and OPFS directories in [`src/lib/clearData.ts`](file:///Users/pavanspoojary/Developer/builtwhilebroke/src/lib/clearData.ts) so the user can wipe all models and state on demand.

---

## 📋 3. Mandatory 5-Point Pre-Integration Execution Protocol

Before adding or committing any new tool or directory entry, the agent MUST perform and document this 5-point verification:

- [ ] **Step 1: Upstream License & Author Verification**: Read root `LICENSE` file on GitHub, confirm author and permissive license terms.
- [ ] **Step 2: Commercial Viability & Model Weights Check**: Confirm code and bundled model weights are 100% free for commercial use.
- [ ] **Step 3: Zero-Telemetry & Sandbox Audit**: Verify zero unauthorized network calls during execution.
- [ ] **Step 4: Master Purge Registration**: Register all IndexedDB databases, CacheStorage buckets, and OPFS folders in [`src/lib/clearData.ts`](file:///Users/pavanspoojary/Developer/builtwhilebroke/src/lib/clearData.ts).
- [ ] **Step 5: Verification Build Check**: Execute `npm run build` (`tsc -b && vite build`) and confirm **0 errors**.
- [ ] **Step 6: UI License Modal & Source Links**: Ensure tool includes an interactive **License & Credits Modal** and direct upstream source button.
