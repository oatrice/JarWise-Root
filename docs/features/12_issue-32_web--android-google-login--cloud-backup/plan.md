# Implementation Plan

**Feature:** [Web | Android] Google Login & Cloud Backup
**Feature ID:** `AUTH-01`, `SYNC-01`

## 1. Overview

This document outlines the technical implementation plan for integrating Google Sign-In for authentication and Google Drive for cloud backup and synchronization. The goal is to provide a seamless, secure, and reliable cross-platform data management experience for JarWise users.

The implementation will consist of three main parts, tailored to the platform scope:

1.  **Authentication Module:**
    *   **Android:** Full Google OAuth 2.0 flow implementation.
    *   **Web:** Mockup of the login screen and states.
2.  **Synchronization Service:**
    *   **Android:** Dedicated service interacting with Google Drive API.
    *   **Web:** Not implemented in this phase.
3.  **UI/UX Integration:**
    *   **Android:** Functional UI with real status indicators.
    *   **Web:** Static/Interactive Mock UI to demonstrate the flow.

The chosen synchronization strategy is **"Last Write Wins"** based on the timestamp of the entire backup file. This provides a simple and robust mechanism for the specified requirements, avoiding the complexity of record-level merging.

## 2. Prerequisites & Setup

Before development begins, the following setup must be completed in the Google Cloud Platform (GCP) Console.

1.  **Create a GCP Project:** If one does not already exist for JarWise.
2.  **Enable APIs:** In the "APIs & Services" dashboard, enable:
    *   **Google Sign-In API**
    *   **Google Drive API**
3.  **Configure OAuth Consent Screen:**
    *   Set the application name to "JarWise".
    *   Provide user support email and developer contact information.
    *   Upload the application logo.
    *   Define the required scopes:
        *   `https://www.googleapis.com/auth/userinfo.profile` (for name, avatar)
        *   `https://www.googleapis.com/auth/userinfo.email` (for email)
        *   `https://www.googleapis.com/auth/drive.appdata` (for access to the app-specific data folder)
4.  **Create OAuth 2.0 Client IDs:**
    *   **For Web Application:**
        *   Create a Client ID for "Web application".
        *   Add authorized JavaScript origins (e.g., `http://localhost:3000`, `https://app.jarwise.com`).
    *   **For Android Application:**
        *   Create a Client ID for "Android".
        *   Provide the application's package name.
        *   Provide the SHA-1 certificate fingerprint of the signing key.

These credentials (Client IDs) must be securely stored in the respective application's configuration.

## 3. Architecture & Design

### 3.1. Core Components

We will introduce three new abstractable services to encapsulate the logic.

*   **`AuthService`**:
    *   **Responsibilities:** Manages the user's authentication state.
    *   **Methods:** `signIn()`, `signOut()`, `getCurrentUser()`, `getAccessToken()`, `onAuthStateChanged(callback)`.
    *   **Details:** It will wrap the platform-specific Google Sign-In SDKs. It will be responsible for securely storing and retrieving the OAuth tokens to maintain a persistent session.

*   **`DatabaseService`**:
    *   **Responsibilities:** Abstract interaction with the local database (e.g., SQLite, IndexedDB).
    *   **Methods:** `getDataSnapshot()`, `restoreFromSnapshot(data)`, `onDataModified(callback)`.
    *   **Details:** This existing service will be augmented with a mechanism to notify listeners of any data changes and to perform a full database export/import.

*   **`GoogleDriveSyncService`**:
    *   **Responsibilities:** Handles all communication with the Google Drive API.
    *   **Methods:** `getBackupMetadata()`, `uploadBackup(jsonData)`, `downloadBackup()`.
    *   **Details:** Uses the access token from `AuthService`. It will exclusively use the `appDataFolder` scope to ensure user privacy, as files in this folder are hidden from the user's main Drive UI. The backup file will be named `jarwise_backup.json`.

### 3.2. Data Model

#### Backup File (`jarwise_backup.json`)

The backup will be a single JSON file containing a full snapshot of the application's state.

```json
{
  "metadata": {
    "version": "1.0",
    "timestamp": "2023-10-27T10:00:00.000Z",
    "source": "android" // or "web"
  },
  "data": {
    "transactions": [
      { "id": "t1", "amount": 50, "date": "..." }
    ],
    "jars": [
      { "id": "j1", "name": "Savings", "balance": 100 }
    ],
    "settings": {
      "theme": "dark",
      "currency": "USD"
    }
  }
}
```

#### Sync State Management

A global state will be managed (e.g., using Redux, Zustand, or a similar state management library) to track the synchronization status.

```typescript
type SyncState = {
  status: 'IDLE' | 'SYNCING' | 'SUCCESS' | 'ERROR' | 'OFFLINE';
  lastSyncTimestamp: string | null;
  errorMessage?: string;
};
```

### 3.3. Authentication & Sync Flow

1.  **Login:** User clicks "Sign in with Google". `AuthService.signIn()` is called.
2.  **Token Retrieval:** The app receives an `accessToken` after user consent.
3.  **Session Persistence:** The token is stored securely (`localStorage` for web, `EncryptedSharedPreferences` for Android).
4.  **Initial Sync Check:**
    *   The app checks if a local database exists.
    *   If **NO** local data: `GoogleDriveSyncService.getBackupMetadata()` is called.
        *   If a backup exists, the user is prompted to restore (`SYNC-01-03`).
        *   If no backup, the user starts fresh.
    *   If **YES** local data: `GoogleDriveSyncService.getBackupMetadata()` is called to compare timestamps.
        *   If cloud is newer, the user is prompted to overwrite local data (`SYNC-01-06`).
        *   If local is newer or they are the same, no action is taken immediately. The next local change will trigger an upload.
5.  **Auto-Backup on Change:**
    *   The UI subscribes to `DatabaseService.onDataModified()`.
    *   When data changes, a debounced function (10 seconds) is called.
    *   The function calls `DatabaseService.getDataSnapshot()`, then `GoogleDriveSyncService.uploadBackup()` with the snapshot data. The sync status state is updated accordingly.

## 4. Step-by-Step Implementation

### Phase 1: Authentication Foundation

#### Step 1.1: Project Setup & SDK Installation
*   **Description:** Add Google Sign-In SDKs and necessary libraries to both Web and Android projects. Configure the environment with the Client IDs from the GCP setup.
*   **Files to Modify:**
    *   **Web:** `package.json` (add `@react-oauth/google` or similar), `index.html` (if using Google's platform library directly), `.env` (for Client ID).
    *   **Android:** `build.gradle` (add `com.google.android.gms:play-services-auth`), `AndroidManifest.xml`, `strings.xml` (for Client ID).
*   **Verification:** The projects build successfully without errors. The Client IDs are accessible within the application code.

#### Step 1.2: Create `AuthService`
*   **Description:** Implement the `AuthService` to handle sign-in, sign-out, and session management. This service will abstract the platform-specific SDK calls.
*   **Files to Create:**
    *   `src/services/AuthService.ts` (Web)
    *   `app/src/main/java/.../services/AuthService.kt` (Android)
*   **Verification:**
    *   Unit tests for `AuthService` pass.
    *   Calling `signIn()` successfully triggers the Google OAuth flow and returns user profile data and an access token.
    *   Calling `signOut()` clears the session.

#### Step 1.3: Implement Login UI & Persistent Session
*   **Description:** Add a "Sign in with Google" button to the welcome screen. On successful login, store the session token. On app startup, check for the token and automatically sign the user in.
*   **Files to Modify:**
    *   `src/components/LoginScreen.tsx` (Web)
    *   `app/src/main/res/layout/activity_login.xml` & `LoginActivity.kt` (Android)
    *   `src/App.tsx` / `MainActivity.kt` (for startup logic).
*   **Verification:**
    *   User can log in successfully.
    *   After closing and reopening the app, the user remains logged in.
    *   The user's name and avatar are displayed in the profile/settings screen (`AUTH-01-03`).

### Phase 2: Core Synchronization Logic

#### Step 2.1: Create `GoogleDriveSyncService`
*   **Description:** Implement the service to interact with the Google Drive API. It will require the access token from `AuthService`. Methods will include finding, creating/updating, and reading the `jarwise_backup.json` file in the `appDataFolder`.
*   **Files to Create:**
    *   `src/services/GoogleDriveSyncService.ts` (Web)
    *   `app/src/main/java/.../services/GoogleDriveSyncService.kt` (Android)
*   **Verification:**
    *   Unit tests confirm that the service can correctly format API requests.
    *   An integration test shows that `uploadBackup()` successfully creates a file in the user's Google Drive `appDataFolder`.
    *   `downloadBackup()` can retrieve and parse the file content.

#### Step 2.2: Augment `DatabaseService` for Snapshots
*   **Description:** Add the `getDataSnapshot()` and `restoreFromSnapshot()` methods. `getDataSnapshot()` will serialize the entire database into the JSON format defined in section 3.2. `restoreFromSnapshot()` will wipe the local database and repopulate it from the provided JSON. Also, add the `onDataModified()` event emitter.
*   **Files to Modify:**
    *   `src/services/DatabaseService.ts` (Web)
    *   `app/src/main/java/.../data/AppDatabase.kt` and related DAOs (Android)
*   **Verification:**
    *   `getDataSnapshot()` produces a valid JSON string matching the specified schema.
    *   Calling `restoreFromSnapshot()` on an empty database correctly populates it with the snapshot's data.

#### Step 2.3: Implement Auto-Backup with Debounce
*   **Description:** Create a central logic controller or hook that listens to `DatabaseService.onDataModified()`. When triggered, it will call a debounced function that executes the backup process: get snapshot, then call `GoogleDriveSyncService.uploadBackup()`.
*   **Files to Create/Modify:**
    *   `src/hooks/useAutoBackup.ts` (Web)
    *   `app/src/main/java/.../viewmodels/MainViewModel.kt` (Android)
*   **Verification:**
    *   Make a single change to the data. Verify that after 10 seconds, the `jarwise_backup.json` file is updated in Google Drive.
    *   Make multiple rapid changes. Verify that only one API call is made to Google Drive, 10 seconds after the *last* change.

### Phase 3: UI and User Experience

#### Step 3.1: Implement Restore and Conflict Prompts
*   **Description:** Integrate the sync checks into the post-login flow.
    1.  **Restore:** If no local data exists but a cloud backup is found, show a modal asking the user to restore.
    2.  **Conflict:** If local data exists but the cloud backup's timestamp is newer, show a modal asking the user to download the latest version, warning them that local changes will be lost.
*   **Files to Modify:**
    *   `src/App.tsx` (or a root component)
    *   `app/src/main/java/.../MainActivity.kt`
    *   Create new UI components for the modals.
*   **Verification:**
    *   Log in on a fresh install. The "Restore from backup?" prompt appears. Accepting it populates the data.
    *   Modify data on device A. Open the app on device B (with older data). The "A newer version is available" prompt appears.

#### Step 3.2: Implement Sync Status Indicator and Manual Backup
*   **Description:** Create a UI component that displays the sync status (`SYNC-01-04`). This component will subscribe to the global `SyncState`. Add a "Back up now" button in the settings that directly calls the backup function, bypassing the debounce.
*   **Files to Modify:**
    *   `src/components/SyncStatusIndicator.tsx`
    *   `src/pages/SettingsPage.tsx`
    *   `app/src/main/res/layout/fragment_settings.xml` & `SettingsFragment.kt`
*   **Verification:**
    *   The UI correctly displays "Syncing...", "Last backup: 5 minutes ago", "Backup failed", etc.
    *   Clicking "Back up now" immediately triggers an upload to Google Drive.
    *   When offline, the status shows "Waiting for connection". Once online, the backup proceeds automatically (`SYNC-01-05`).

#### Step 3.3: Implement Logout Flow
*   **Description:** Implement the logout button functionality. When clicked, it should call `AuthService.signOut()`. Before signing out, it must display a confirmation dialog asking the user if they also want to delete all local data from the device (`AUTH-01-05`).
*   **Files to Modify:**
    *   `src/pages/SettingsPage.tsx`
    *   `app/src/main/java/.../fragments/SettingsFragment.kt`
*   **Verification:**
    *   Clicking "Logout" shows the confirmation prompt.
    *   Choosing "Yes" clears the local database and logs the user out.
    *   Choosing "No" only logs the user out, leaving the local data intact.

## 5. Rollout Plan

1.  **Internal Testing (QA):** Deploy the feature to a staging environment for rigorous testing by the QA team across multiple devices (Web/Android) and scenarios (offline, conflict, etc.).
2.  **Feature Flag:** The entire feature will be wrapped in a feature flag (e.g., `enableGoogleSync`). This allows us to enable it for specific users or a percentage of the user base.
3.  **Phased Rollout:**
    *   **Week 1:** Enable the feature flag for 5% of new users. Monitor error logs and performance metrics closely.
    *   **Week 2:** Increase rollout to 25% of users.
    *   **Week 3:** Increase to 50% of users.
    *   **Week 4:** Full rollout to 100% of users.
4.  **Monitoring:** Key metrics to monitor include Google API error rates, sync success/failure rates, and user-reported issues related to data loss or corruption.

## 6. Future Considerations

*   **Granular Sync:** The current "Last Write Wins" model on a full backup is simple but can lead to data loss in complex conflict scenarios. A future iteration could explore record-level synchronization using CRDTs or an operational transformation approach, though this would significantly increase complexity.
*   **Backup History:** The current implementation overwrites the single backup file. A future enhancement could be to store multiple historical versions of the backup, allowing users to restore from a specific point in time.
*   **Alternative Cloud Providers:** The service-based architecture is designed to be extensible. In the future, we could add support for other providers like Dropbox or iCloud by creating new `SyncService` implementations.