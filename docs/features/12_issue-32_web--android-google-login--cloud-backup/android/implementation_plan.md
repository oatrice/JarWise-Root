# Android Implementation Plan: Google Login & Cloud Backup

**Issue:** [#32](https://github.com/oatrice/JarWise/issues/32)  
**Scope:** Full Implementation (Production-Ready)  
**Status:** 📋 Pending (After Web Mock UI)

---

## Overview
This phase will implement the complete Google Sign-In and Google Drive backup functionality for Android.

> [!IMPORTANT]
> **Development Order:** This phase starts AFTER Web Mock UI is complete.
> 
> **Android Build Policy:** MUST use scripts in `Android/scripts/` (e.g., `build_android.sh`) instead of direct `./gradlew`.

---

## Proposed Changes

### Phase 1: Authentication
- [ ] Add Google Sign-In SDK to `build.gradle`
- [ ] Create `AuthService.kt` for OAuth flow
- [ ] Implement `LoginActivity.kt` with Google button
- [ ] Store tokens in `EncryptedSharedPreferences`

### Phase 2: Synchronization
- [ ] Create `GoogleDriveSyncService.kt`
- [ ] Implement `getDataSnapshot()` in `AppDatabase`
- [ ] Add auto-backup with 10s debounce
- [ ] Handle offline mode with pending queue

### Phase 3: UI/UX
- [ ] Add Profile section to Settings
- [ ] Create `SyncStatusView` component
- [ ] Implement Restore/Conflict dialogs
- [ ] Add logout with data deletion option

---

## Verification Plan

### Automated Tests
- [ ] Unit tests for `AuthService`
- [ ] Unit tests for `GoogleDriveSyncService`
- [ ] Integration tests for backup/restore flow

### Manual Verification
- [ ] Login with Google account works
- [ ] Backup uploads to Google Drive
- [ ] Restore works on fresh install
- [ ] Offline changes sync when online
