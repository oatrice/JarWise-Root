# Walkthrough: Android Google Login & Cloud Backup

## Summary
Implemented Google Sign-In, Cloud Backup, and **Restore Flow** on Android using Drive API v3.

---

## Features Implemented

### 1. Google Authentication
- **Secure Sign-In:** Uses `play-services-auth` for robust OAuth 2.0.
- **Persistent Session:** App remembers login state across restarts.
- **Privacy:** Requests minimal `DRIVE_FILE` scope.

### 2. Cloud Backup
- **Automated Sync:** Changes triggers auto-backup (10s debounce).
- **Manual Trigger:** "Back up now" button in Settings.
- **Smart Pause:** Auto-backup is paused while editing to prevent conflicts.
- **Organization:** Creates `JarWise backup` folder on Drive.

### 3. Restore Flow (New)
- **Detection:** On Login, app automatically checks for existing backups in Drive.
- **Prompt:** User is asked to "Restore" or "Start Fresh".
- **Recovery:** Downloads latest backup and restores database seamlessly.

### 4. Settings Integration
- **Profile:** Displays User Name & Photo.
- **Sync Status:** Real-time feedback.

---

## Technical Details

### Architecture
- **AuthService:** Abstracts Google Sign-In mechanics.
- **CloudStorageService:** Abstracts Drive API calls (`list`, `create`, `get`).
- **BackupManager:** Singleton governing backup orchestrations.
- **LoginViewModel:** Handles Auth + Restore Logic coordination.

### Restore Logic
```kotlin
// LoginViewModel.kt
fun checkForBackup(user) {
    val backups = backupManager.checkForBackup().getOrNull()
    if (backups.isNotEmpty()) {
        _uiState = RestoreAvailable(user, backups.latest)
    } else {
        _uiState = Success(user)
    }
}
```
