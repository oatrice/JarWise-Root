# Task: Android Google Login & Cloud Backup (Issue 32)
## Android Implementation
### Phase 1: Setup & Auth
- [x] Add Dependencies (Play Services Auth, Drive API)
- [x] Create `AuthService` interface & Mock (TDD: Red)
- [x] Implement `GoogleAuthService` & Koin Module (TDD: Green)
- [x] Create `LoginViewModel` & Tests (TDD: Refactor)
- [x] Implement `LoginScreen` UI

### Phase 1.5: Real OAuth Setup
- [x] Get SHA-1 Fingerprint
- [x] Setup Firebase Project & Android App
- [x] Add `google-services.json` to Project
- [x] Configure `GoogleAuthService` with Real Client ID
- [x] Add `@Preview` support for LoginScreen

### Phase 2: Cloud Backup
- [x] Create `CloudStorageService` interface
- [x] Implement `GoogleDriveService` (REST API)
- [x] Create `BackupManager` with 10s Debounce (TDD)
- [x] Integrate Backup Trigger into App logic

### Phase 3: Integration
- [x] Update `SettingsScreen` (Profile, Sync Status)
- [x] Implement Manual Backup Trigger ("Back up now")
- [x] Implement Persistent Login
- [x] Implement Logout with "Clear Data" option

### Phase 4: Restore Flow
- [x] Check for backup on successful login
- [x] UI: Download/Restore prompt
- [x] Implement DB replacement logic
- [x] **Fix:** Prevent IO Errors (Short Read) using Temp File Swap & WAL Cleanup

### Phase 5: UI Refinements
- [x] Implement "Continue as Guest"
- [x] Add Loading indicator for Google Sign In launch
- [x] Add "Sign In" button in Settings when logged out
- [x] **Fix:** Direct Sign-In Dialog from Settings
- [x] **Fix:** App Restart on Restore for Data Visibility

## Future Tasks (Tracked)
- [ ] **Conflict Resolution:** Advanced logic for multi-device edits (Issue #74 created).
