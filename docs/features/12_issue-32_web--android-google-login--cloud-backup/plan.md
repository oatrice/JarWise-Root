# Implementation Plan: Web Mock UI - Google Login & Cloud Backup

**Issue:** [#32](https://github.com/oatrice/JarWise/issues/32)  
**Scope:** Web Mock UI Only (no real authentication)

---

## Proposed Changes

### [NEW] Login Screen
#### [NEW] [LoginScreen.tsx](file:///Users/oatrice/Software-projects/JarWise/Web/src/pages/LoginScreen.tsx)
- Mock login page with "Sign in with Google" button
- Google-style button design
- Mock state toggling (logged in / logged out)

---

### Settings/Profile Integration
#### [MODIFY] [SettingsOverlay.tsx](file:///Users/oatrice/Software-projects/JarWise/Web/src/pages/SettingsOverlay.tsx)
Add mock profile section:
- User avatar + name display (mock data)
- "Last backup: X minutes ago" status
- "Back up now" button (mock action)
- "Logout" button with confirmation dialog

---

### Sync Status Component
#### [NEW] [SyncStatusIndicator.tsx](file:///Users/oatrice/Software-projects/JarWise/Web/src/components/SyncStatusIndicator.tsx)
- Shows sync states: "Syncing...", "Up to date", "Offline"
- Reusable component for settings page

---

### Modal Dialogs
#### [NEW] [RestoreBackupModal.tsx](file:///Users/oatrice/Software-projects/JarWise/Web/src/components/RestoreBackupModal.tsx)
- "Backup found. Restore your data?" dialog
- "Restore" / "Start Fresh" buttons

#### [NEW] [LogoutConfirmModal.tsx](file:///Users/oatrice/Software-projects/JarWise/Web/src/components/LogoutConfirmModal.tsx)
- "Delete local data?" confirmation dialog
- "Yes, delete" / "No, keep data" options

---

## Mock Data & State
#### [NEW] [useAuthMock.ts](file:///Users/oatrice/Software-projects/JarWise/Web/src/hooks/useAuthMock.ts)
- Mock auth context/hook for UI testing
- Toggle login state, mock user profile

---

## Verification Plan

> [!IMPORTANT]
> **This is Mock UI only.** No real Google API calls.

### Manual Verification
- [ ] Login screen displays correctly with Google button
- [ ] Clicking "Sign in" toggles to logged-in mock state
- [ ] Profile section shows mock user name/avatar
- [ ] Sync status indicator shows different states
- [ ] Restore modal displays correctly
- [x] Modal has 3 options: Delete Data, Keep Data, Cancel

---

## Android Implementation Status

### Phase 1: Setup & Auth ✅
- [x] **Service:** `GoogleAuthService` implemented with TDD.
- [x] **ViewModel:** `LoginViewModel` with `Loading`, `Success`, `Error` states.
- [x] **UI:** `LoginScreen` with "Sign in with Google" button.
- [x] **OAuth:** Real OAuth Configured with Drive scopes enabled.

### Phase 2: Cloud Backup (Completed) ✅
- [x] **Interface:** `CloudStorageService`
    - `uploadBackup(file: File): Result<String>` (returns file ID)
    - `listBackups(): Result<List<BackupMetadata>>`
    - `downloadBackup(fileId: String, destFile: File): Result<Unit>`
- [x] **Implementation:** `GoogleDriveService`
    - Uses `com.google.api.services.drive.Drive`
    - Requires `GoogleAccountCredential` setup with `DriveScopes`.
    - Handle 401/403 errors (token expiry) gracefully.
    - **Features:** Timestamped filenames (`jarwise_backup_yyyyMMdd_HHmmss.db`), scoped to "JarWise backup" folder.
- [x] **Logic:** `BackupManager` (TDD)
    - **Debounce Logic:** Trigger backup only after data settles (e.g., 10s after last DB write).
    - **State Management:** Tracking `SyncStatus` (Syncing, Success, Error).
    - **Logging:** Logs start/end/File ID for debugging.
- [x] **Injection:** Update `DataModule` to provide `CloudStorageService`.

## Verification Plan

### Automated Tests
- [x] `BackupManagerTest`: Verify debounce logic using `CoroutineTestScope`.
- [x] `GoogleDriveServiceTest`: Verified via manual integration.

### Manual Verification
- [x] "Back up now" (Triggered via DB change) uploads a file to Drive.
- [x] File exists in "JarWise backup" folder.
- [x] Logcat shows "End backup. File ID: ..."