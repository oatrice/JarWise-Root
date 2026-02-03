# Android Implementation Plan: Google Login & Cloud Backup (Issue 32)
**Status:** ✅ Phase 1-5 Complete

## ✅ Phase 1: Dependencies & Configuration
- [x] Add `play-services-auth` & `google-api-client-android` dependencies
- [x] Configure SHA-1 fingerprint & `google-services.json`

## ✅ Phase 2: Authentication (TDD)
- [x] `AuthService` interface & `GoogleAuthService` implementation.
- [x] `LoginViewModel` & `LoginScreen` UI.
- [x] Verified with Tests.

## ✅ Phase 3: Cloud Backup Logic & Settings
- [x] `CloudStorageService` (Google Drive REST API).
- [x] `BackupManager` with Debounce & Pause logic.
- [x] `SettingsScreen` Integration (Profile, Sync Status, Manual Backup).
- [x] Persistent Login & UI Visibility logic.

## ✅ Phase 4: Restore Flow
- [x] **Check Backup:** On Login, query Drive for `checkForBackup`.
- [x] **UI:** Dialog "Backup Found" -> Restore / Start Fresh.
- [x] **Secure Restore:** 
    - Downloads to `.restore_temp` file first.
    - Swaps file safely to avoid locking issues.
    - Cleans up `-wal` and `-shm` files to prevent data corruption.
- [x] **Success:** Navigate to Dashboard.

## ✅ Phase 5: UI Refinements
1. **Login Screen:**
   - [x] **Guest Login:** Added "Continue as Guest" button.
   - [x] **Loading Logic:** Show loading indicator instantly on click.
   - [x] **Restore Fix:** Restarts app process after successful restore to reload Room DB.
2. **Settings Screen:**
   - [x] **Sign In:** Show "Sign In with Google" button when logged out.
   - [x] **Direct Dialog:** Triggers Google Sign-In intent directly within Settings.
   - [x] **Auto-Restore Check:** Checks for backup immediately after Settings Sign-In.
   - [x] **Manual Restore:** Added "Restore from Server" button.
   - [x] **Logout:** Added "Delete local data" option.

39: 
40: ## ✅ Phase 6: Bug Fixes & Stabilization
41: - [x] **Manage Jars Immediate Save:**
42:     - Refactored `ManageJarsViewModel` to use In-Memory editing (Draft State).
43:     - Implemented `save()` for batch transactional updates.
44:     - Fixed "Auto-Save" illusion by resetting state on navigation in `MainActivity`.
45: 
46: ---

## Verification Plan
- [x] Build Success.
- [x] Automated Tests Passed.
