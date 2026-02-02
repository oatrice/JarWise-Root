# Android Implementation Plan: Google Login & Cloud Backup (Issue 32)

**Status:** ✅ Phase 1-3 Complete | 🚧 Phase 4 (Integration) Planned
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

## ✅ Phase 3: Cloud Backup Logic (TDD)
1. **GoogleDriveService**
   - [x] Define `CloudStorageService` interface.
   - [x] Implement `GoogleDriveService` (REST API).
   - [x] **Feature:** Timestamped filenames (`jarwise_backup_yyyyMMdd_HHmmss.db`).
   - [x] **Feature:** Organizational Folder (`JarWise backup`) auto-creation.
2. **BackupManager**
   - [x] Implement Debounced Auto-Backup (10s delay).
   - [x] **Logging:** Added `AppLogger` for detailed "Start/End/File ID" logging.
   - [x] **Test:** `BackupManagerTest` with CoroutineTestScope (Verified).

## 🚧 Phase 4: Integration & UI (Next Steps)
1. **Settings Integration**
   - [ ] Update `SettingsScreen` to show Profile and Sync Status.
   - [ ] Implement "Back up now" button.
   - [ ] Implement Logout with "Delete Local Data" dialog.
2. **Restore Flow**
   - [ ] Implement "Onboarding Restore" check on first run.

---

## 🧪 Verification Plan
### Automated Tests (JUnit)
- [x] `AuthServiceTest`: Verified session persistence.
- [x] `BackupManagerTest`: Verified debounce logic & status updates.
- [x] `LoginViewModelTest`: Verified UI state mapping.

### Manual Verification
- [x] Sign in with Real Google Account.
- [x] Add data -> Wait 10s -> Verify Upload to Drive.
- [x] Verify File exists in "JarWise backup" folder on Drive.
- [x] Check Logcat for "End backup. File ID: xxx".
- [ ] Clear App Data -> Open App -> Sign in -> "Restore?" (Pending Phase 4).
