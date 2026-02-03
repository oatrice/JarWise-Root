# Android Implementation Plan: Google Login & Cloud Backup (Issue 32)

**Status:** ✅ Phase 1-4 Complete
**Goal:** Implement Google Sign-In and Google Drive Cloud Backup for Android using TDD.

---

## ✅ Phase 1: Dependencies & Configuration
- [x] Add `play-services-auth` & `google-api-client-android` dependencies
- [x] Add `INTERNET` permission
- [x] Configure `google-services.json`
- [x] Configure SHA-1 fingerprint for Firebase/Google Cloud Console

## ✅ Phase 2: Authentication (TDD)
1. **AuthService Interface & Mock**
   - [x] Define `AuthService` interface.
   - [x] Create `MockAuthService` for unit testing.
   - [x] **Test:** `AuthServiceTest` (Verified).
2. **GoogleAuthService Implementation**
   - [x] Implement `GoogleAuthService` using `play-services-auth`.
   - [x] Koin Injection (`AuthModule`).
   - [x] **Scopes:** `DRIVE_FILE` (for creating files), `DRIVE_APPDATA` (legacy/optional).
3. **Login UI**
   - [x] Create `LoginScreen` (Compose).
   - [x] **Test:** `LoginViewModelTest` (Verified).
   - [x] **Error Handling:** Enhanced user-friendly messages for Network Errors.

## ✅ Phase 3: Cloud Backup Logic & Settings
1. **GoogleDriveService**
   - [x] Define `CloudStorageService` interface.
   - [x] Implement `GoogleDriveService` (REST API).
   - [x] **Feature:** Timestamped filenames (`jarwise_backup_yyyyMMdd_HHmmss.db`).
   - [x] **Feature:** Organizational Folder (`JarWise backup`) auto-creation.
2. **BackupManager**
   - [x] Implement Debounced Auto-Backup (10s delay).
   - [x] **Pausable Logic:** Pause backup when editing Jars to prevent mid-edit syncs.
   - [x] **Logging:** Added `AppLogger` for detailed "Start/End/File ID" logging.
   - [x] **Test:** `BackupManagerTest` with CoroutineTestScope (Verified).
3. **Settings Integration**
   - [x] Update `SettingsScreen` to show Profile and Sync Status.
   - [x] Implement "Back up now" button.
   - [x] Persistent Login: Check auth state on App Launch.
   - [x] Hide Backup Controls when logged out.

## ✅ Phase 4: Restore Flow
1. **Restore Logic**
   - [x] **Check Backup:** On Login, query Drive for `checkForBackup`.
   - [x] **UI:** Dialog "Backup Found" -> Restore / Start Fresh.
   - [x] **Download:** `restoreBackup` replaces local DB file.
   - [x] **Success:** Navigate to Dashboard (User may need restart if hot-reload issues occur).

---

## 🧪 Verification Plan
### Automated Tests (JUnit)
- [x] `AuthServiceTest`: Verified session persistence.
- [x] `BackupManagerTest`: Verified debounce logic & restore functions.
- [x] `LoginViewModelTest`: Verified UI workflow.

### Manual Verification
- [x] Sign in with Real Google Account.
- [x] Add data -> Wait 10s -> Verify Upload to Drive.
- [x] Verify File exists in "JarWise backup" folder on Drive.
- [x] Restore Flow:
    - [x] Verified code logic via TDD.
