# Implementation Plan - Phase 4: Smart Logic (Auto-Categorization) & Future Improvements

## Goal
Simplify the user experience by automatically categorizing slips. Also outlines future improvements for slip management and data safety.

## Completed: Phase 4.1 (Auto-Categorization)
- **SlipParser Updates**: Implemented keyword mapping (e.g., "7-Eleven" -> "Play", "Water" -> "Necessities").
- **Verification**: Validated with unit tests (`SlipParserTest`).

## Deferred: Phase 4.2 (Improve Filters)
> [!NOTE]
> This feature has been moved to the **Improvement Plan** for a later release.
**Goal**: Enhance `SlipDetectorService` to strictly distinguish slip images from other document types.
- **Potential Heuristics**: Aspect ratio checks, denser keyword density requirements, face detection (exclusion).

## Future Improvement Plan (Backlog)

### 1. Transaction Image Linking
**Requirement**: After a user reviews and confirms a slip transaction, the system should permanently link the image to the transaction record.

- **Workflow**:
    1. User confirms slip details.
    2. App uploads/saves the image to permanent storage.
    3. App stores the public/accessible URL in the `Transaction` record (e.g., `imageUrl` field).

### 2. Backup Strategy
**Requirement**: Ensure slip images are safely backed up, as local storage might be cleared.

- **Primary Strategy**: **Google Drive Integration**
    - Auto-upload confirmed slips to a specific "JarWise Slips" folder in the user's Google Drive.
    - Retrieve the `webContentLink` or `webViewLink` to store in the app.

- **Contingency (Drive Full / Audit)**:
    - **Drive Full**: Detect `StorageQuotaExceeded` error. Prompt user to switch to alternative cloud storage or local export.
    - **Clear Drive**: If user clears their Drive, the app should handle broken links gracefully (show placeholder or "Image not found").
    - **Migration**: Future feature to batch move images from Drive to another provider (e.g., Dropbox, S3) if needed.

## Verification Plan
### Automated Tests
- [x] **SlipParserTest**: Verified keyword mapping logic.

### Manual Verification
- [ ] **Future**: Verify Google Drive auth and upload flows.
- [ ] **Future**: Verify successful linking of URL to Transaction after backup.
