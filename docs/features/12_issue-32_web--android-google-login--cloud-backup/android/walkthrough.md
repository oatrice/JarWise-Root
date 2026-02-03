# Walkthrough - Android Google Login & Cloud Backup

This walkthrough documents the implementation of Google Authentication and Cloud Backup features for JarWise Android, including the robust restore flow.

## 1. Google Authentication
We implemented a clean, secure authentication flow using **Google Sign-In**.

### Features
- **Login Screen:** Dedicated screen with "Sign In with Google" and "Continue as Guest" options.
- **Persistent Session:** App remembers login state across restarts.
- **Profile Integration:** Displays User Name, Email, and Photo in Settings.
- **Direct Settings Login:** Users can sign in directly from the Settings menu if they initially skipped it.

## 2. Cloud Backup (Google Drive)
We integrated **Google Drive API** to safely backup the user's financial data.

### Features
- **Auto-Backup:** (Debounced) automatically backs up data 10 seconds after changes.
- **Manual Trigger:** "Back up now" button in Settings.
- **Smart Sync Status:** UI shows "Syncing...", "Up to date", or "Last synced: [Date]".

## 3. Restore Flow (Robust Implementation)
The restore mechanism was the most technically challenging part. We ensured data consistency and safety.

### The Problem
Simply overwriting the SQLite `.db` file while the app (Room) has it open causes:
1. **File Locks:** preventing overwrite.
2. **Data Corruption:** `SQLITE_IOERR_SHORT_READ`.
3. **Stale Data:** Room reading old `-wal` (Write-Ahead Log) files instead of the new content.

### The Solution (Atomic Swap)
We implemented a safe "Download -> Verify -> Swap" strategy:
1. **Download to Temp:** Backup is downloaded to a temporary file (`.restore_temp`) first.
2. **Safe Inspection:** We inspect this temp file to log debug info (Transaction counts) *before* touching the main DB.
3. **Atomic Swap:** We delete the old DB and rename the temp file to replace it.
4. **Cleanup:** **Crucial Step** - We explicitly delete old `-wal` and `-shm` files to force SQLite to read the fresh DB.
5. **App Restart:** The app automatically restarts to re-initialize the Room database connection with the new file.

## 4. Key Code Components

### `BackupManager.kt`
Handles the orchestration of backups, complex restore logic, and **local data clearing**.
```kotlin
fun clearLocalData() {
    // Deletes .db, -wal, and -shm files
}
```

### `SettingsScreen.kt`
- **Manual Restore Button:** Added "Restore from Server" to manually check for backups.
- **Logout Dialog:** Includes "Also delete local data (start fresh)" checkbox.
- **Restart Logic:** Ensures clean slate after restore or data clearing.

### `GoogleDriveService.kt`
Handles low-level Drive API interactions, ensuring file streams are properly flushed and synced to disk.

### `SettingsViewModel.kt`
Manages User Identity, Backup Status, and Restore Flow state including "No Backup Found".

## 5. Verification
- **Unit Tests:** `BackupManagerTest` verifies the debounce logic and success/failure states.
- **Manual Verification:**
    - Verified Google Sign-In prompts.
    - Verified Backup creation in Google Drive.
    - Verified Data Restore (Database correctly populated after app restart).
    - Verified IO Error fix (No more `SHORT_READ` errors).
    - Verified "Delete Data on Logout" correctly wipes the database.
    - Verified "Restore from Server" button correctly finds (or reports missing) backups.

## Future Considerations
- **Conflict Resolution:** Tracked in Issue #74 (Multi-device simultaneous edits).
