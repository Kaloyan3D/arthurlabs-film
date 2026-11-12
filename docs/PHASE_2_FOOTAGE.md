# Native footage and demo reproduction

The recordings are from the real macOS Tauri development window at the audited commit. Build and run from a separate clone with `cd apps/arthur && npm ci && npm run tauri -- dev`. The local Vite page serves the frontend to the native WebView, which uses the desktop IPC client and SQLite. The browser preview client was not used. A temporary app wrapper around the unmodified development executable made the window accessible to the desktop capture tooling.

Use a fresh demo profile. Enable OpenAI in Arthur through its normal setup before attempting distillation. The temporary local demo credential used during production was removed after capture. Enter the following in Home, allowing each real provider result to complete.

1. The app must work completely offline. Core workflows must work in airplane mode.
2. All core processing must depend on a cloud API. It cannot run without an internet connection.
3. Local inference requires a downloadable model stored on the device.

The three observed titles were **Offline app functionality**, **Cloud API dependency** and **Local inference model requirement**. In Connections, use **Find connections**. The recorded run returned one verified contradiction. In the offline node inspector, add a **depends on** link to the local model requirement. Select each edge to show its origin. Provider outputs can vary. The raw clips preserve the actual recorded results.

In Evolution, revise Offline app functionality. The recorded profile has an intermediate R2 from a prior edit. The final take shows saving R3 with the exact text “Run core workflows with the downloaded model. Use the cloud only when connected.” The three revisions are visible together. No fixture writes or SQLite edits were used.

Record the native window region with macOS screen capture. The source in this workspace is 2560 × 1600 Retina video. Locate the window bounds in points, then use a command such as `screencapture -x -v -V 15 -R221,50,1280,800 capture-one.mov`. Adjust the rectangle for the actual window. Keep recordings in `assets/footage/arthur-studio/raw/`. The capture origin and trims are defined in `scripts/capture/prepare-studio-footage.sh`. It prepares 1920 × 1200, 30 fps editorial clips from the variable-rate recordings and extracts the locked opening's final frame read-only. It expects fresh output paths.
