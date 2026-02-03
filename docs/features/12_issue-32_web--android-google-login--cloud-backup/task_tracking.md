# Task: Web Mock UI - Google Login (Issue 32)
# Task Tracking

## Web Components
- [x] Create `useAuthMock.ts` hook
- [x] Create `LoginScreen.tsx` page
- [x] Create `SyncStatusIndicator.tsx` component
- [x] Create `RestoreBackupModal.tsx` component
- [x] Create `LogoutConfirmModal.tsx` component
- [x] Modify `SettingsOverlay.tsx` with profile section

## Web Verification
- [x] Run dev server and test all mock states
- [x] Take screenshots for documentation
- [x] Manual verification of Refactoring (Logout, Memory Leak, Links)

## Web Refactoring (Code Review)
- [x] Fix Logout logic to handle data deletion (SettingsOverlay.tsx)
- [x] Fix memory leak in useAuthMock hook (useAuthMock.ts)
- [x] Fix non-functional links in LoginScreen (LoginScreen.tsx)

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
- [x] **Features:** Timestamped filenames, Folder organization.
- [x] **Logging & Error Handling:** Network errors, Start/End logs, File ID.

### Phase 3: Integration (Pending)
- [ ] Update `SettingsScreen` (Profile, Sync Status)
- [ ] Implement Logout & Delete Data logic
- [ ] Implement Restore Flow on Login
