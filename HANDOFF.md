# HANDOFF.md - Matura Filozofia

## Current Goal
- **Local Data Portability**: Transitioned from a Supabase-backed system to a local-first architecture with manual synchronization.
- **Content Enrichment**: Finalizing the "Codex" and "Philosophers" database to provide a premium, self-contained study experience for the Philosophy Matura exam.

## Context & Architecture
- **Framework**: Next.js (App Router), TypeScript, Tailwind CSS.
- **UI/UX**: Premium dark-mode aesthetic with Lucide icons, Framer Motion animations, and Radix UI components.
- **Data Layer**: Centralized in `src/data/philosophers.json`.
- **Sync Mechanism**: Uses a Base64-based export/import system to allow users to sync notes and progress without a backend. Logic resides in `src/lib/sync.ts`.

## Recent Changes
- **Supabase Removal**: Completely removed Supabase dependencies and authentication.
- **Manual Sync**: Implemented "Sync via Code" (Base64 export/import) with a user-friendly modal.
- **Codex Update**: Updated the Codex section with key concepts and definitions.
- **UI Fixes**: Adjusted mobile padding for the SyncBanner and added a confirmation modal for note deletion.

## Next Steps (Pending Tasks)
1. **Verification**: Thoroughly test the Base64 sync on various mobile browsers (iOS/Android).
2. **Content Audit**: Ensure all secondary philosophers have full `description_full` and `context` fields.
3. **PWA Support**: Consider adding a manifest file for better offline/standalone mobile experience.

## Known Issues/Blockers
- **Sync Conflict**: No automatic merging; the last imported file overwrites current local state.
- **Data Size**: Large notes might result in very long Base64 strings for manual copy-pasting.
