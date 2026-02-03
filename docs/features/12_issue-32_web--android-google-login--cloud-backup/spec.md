# Specification

**Title:** [Web | Android] Google Login & Cloud Backup
**Feature ID:** `AUTH-01`, `SYNC-01`
**Author:** Expert Product Manager
**Status:** In Review
**Last Updated:** 2023-10-27

---

## 1. Goal

To provide users with a seamless and secure way to manage their JarWise data across multiple devices (Web, Android) and to prevent data loss. By integrating Google Sign-In, we offer a trusted and convenient authentication method. By leveraging Google Drive for backups, we ensure user data is persistent, restorable, and synchronized.

### Scope & Phasing
*   **Android Platform**: **Full Implementation**. Must include functional Google Sign-In, real Google Drive API synchronization, local database integration, and production-ready UI.
*   **Web Platform**: **Mock UI Only**. Focus on designing the visual interface and user flow. No real authentication or backend integration is required at this stage.

## 2. User Stories

- **As a new user,** I want to sign up/in with my Google account so that I don't have to create and remember another password.
- **As an existing user,** I want my data to be automatically backed up to the cloud so that I don't have to worry about losing it if I lose my device.
- **As a multi-device user,** I want to log in on my phone and my computer and see the same data, so I can manage my finances from anywhere.
- **As a user setting up a new phone,** I want to log in and restore my data from a cloud backup so I can get back up and running quickly.
- **As a cautious user,** I want to be able to trigger a manual backup at any time for peace of mind.
- **As a user,** I want to see when my data was last backed up so I can be confident that my latest changes are safe.
- **As a user who is finished with the app,** I want to be able to log out and have the option to clear all my local data from the device for privacy.

## 3. Requirements & Functional Specification

### 3.1. Authentication (AUTH-01)

| ID | Requirement | Description |
|---|---|---|
| **AUTH-01-01** | **Sign-In with Google** | The user shall be able to initiate an authentication flow using their Google account via a "Sign in with Google" button. This will use the standard Google OAuth 2.0 flow. |
| **AUTH-01-02** | **Permissions Grant** | During the first sign-in, the user must be prompted to grant permission for the app to: 1. View their basic profile information (name, email, avatar). 2. Create, view, and manage files in its own app-specific folder within their Google Drive. |
| **AUTH-01-03** | **User Profile Display** | Once logged in, the user's name and Google account avatar shall be displayed within the app's UI (e.g., in a settings or profile screen). |
| **AUTH-01-04** | **Persistent Session** | The user's login session shall be remembered. When the user closes and re-opens the app, they shall remain logged in without needing to re-authenticate. |
| **AUTH-01-05** | **Logout** | The user shall have an explicit "Logout" option. Upon triggering logout, the app must present a confirmation dialog asking if they also want to delete all local app data from the device. The session is cleared regardless of the choice. |

### 3.2. Data Synchronization (SYNC-01)

| ID | Requirement | Description |
|---|---|---|
| **SYNC-01-01** | **Automatic Backup** | After a user successfully logs in, the app will automatically back up the entire application database to the app's private folder in the user's Google Drive. Backups are triggered after any data modification (e.g., adding a transaction, changing a setting). A debounce mechanism of 10 seconds should be used to avoid excessive writes. |
| **SYNC-01-02** | **Manual Backup** | A "Back up now" button shall be available in the settings. Tapping this button will immediately trigger the backup process. |
| **SYNC-01-03** | **Data Restore on New Install** | Upon logging into a device with no local data, the app will check for a backup file in Google Drive. If a backup is found, the user will be prompted to restore it. If they accept, the app will download and apply the backup. If they decline, they will start with a fresh, empty state. |
| **SYNC-01-04** | **Sync Status Indicator** | The UI shall display the last backup status and timestamp (e.g., "Last backup: 5 minutes ago", "Syncing...", "Backup failed. Retry?"). |
| **SYNC-01-05** | **Offline Operation** | If the user modifies data while offline, the changes are saved locally. The app will queue the backup operation and automatically execute it once network connectivity is restored. The sync status will indicate "Waiting for connection". |
| **SYNC-01-06** | **Conflict Resolution** | The system will use a "Last Write Wins" strategy based on the timestamp of the entire backup file. When the app comes online or is opened, it compares the timestamp of the local data with the cloud backup. <br> - If cloud is newer, the user is prompted to download the latest version, overwriting local changes. <br> - If local is newer, the app uploads its version, overwriting the cloud version. |
| **SYNC-01-07** | **Data Scope** | The backup file must contain all user-generated data, including: Transactions, Jar configurations, User preferences, and App settings. |

## 4. User Journey

1.  **Anna**, a new user, downloads and opens JarWise on her Android phone.
2.  She is presented with a welcome screen and a "Sign in with Google" button.
3.  She taps the button, and the Google account picker appears. She selects her account.
4.  A Google consent screen asks for permission to view her profile and manage files in the app's own Google Drive folder. She accepts.
5.  She is returned to the app's main screen. In the settings menu, she sees her name and profile picture.
6.  She adds her first transaction for `$50`. The app displays a "Syncing..." message, which then changes to "Last backup: just now".
7.  Later, at work, she opens the JarWise web app in her browser.
8.  She clicks "Sign in with Google" and chooses the same account.
9.  The app detects this is a new device with no local data, but finds her backup in Google Drive.
10. A dialog appears: "We found a backup from today at 10:15 AM. Would you like to restore your data?"
11. Anna clicks "Restore". The app loads for a moment.
12. The main screen appears, showing the `$50` transaction she added on her phone. The sync status shows "Up to date".

## 5. Specification by Example (SBE)

### Scenario 1: First-time Login and Initial Backup

**Given** Anna is a new user and has just installed the app.
**When** she logs in with her Google account for the first time and adds a transaction.
**Then** her profile information is displayed and her data is securely backed up to her Google Drive.

**Example:**

**Initial State (Before Login):**
| System Component | State |
|---|---|
| Authentication Status | Logged Out |
| Local Database | Empty |
| Google Drive App Folder | Does not exist / Empty |
| UI Profile Section | Shows "Sign in" button |

**Actions:**
1. User clicks "Sign in with Google".
2. User selects `anna@gmail.com` and grants permissions.
3. User is redirected to the app.
4. User adds a new transaction: `{'item': 'Coffee', 'amount': 5.00}`.

**Final State (After adding transaction):**
| System Component | State |
|---|---|
| Authentication Status | Logged In as `anna@gmail.com` |
| Local Database | Contains 1 transaction record. |
| Google Drive App Folder | Contains `jarwise_backup.json` file with the transaction data. |
| UI Profile Section | Shows "Anna" and her Google avatar. |
| UI Sync Status | "Last backup: just now" |

---

### Scenario 2: Restoring Data on a New Device

**Given** Anna is already a user and her data is backed up to Google Drive.
**When** she logs into her account on a new device (e.g., the web app).
**Then** she is prompted to restore her data and her previous state is loaded.

**Example:**

**Initial State (On New Device):**
| System Component | State |
|---|---|
| Authentication Status | Logged Out |
| Local Database | Empty |
| Google Drive App Folder | Contains `jarwise_backup.json` with 1 transaction record. |

**Actions:**
1. User opens the web app and clicks "Sign in with Google".
2. User selects `anna@gmail.com`.
3. System detects no local data but finds the backup file in Google Drive.
4. System displays a prompt: "Restore data from backup (Last updated: 5 minutes ago)?"
5. User clicks "Restore".

**Final State (After Restore):**
| System Component | State |
|---|---|
| Authentication Status | Logged In as `anna@gmail.com` |
| Local Database | Contains 1 transaction record (`{'item': 'Coffee', 'amount': 5.00}`). |
| UI Main Screen | Displays the "Coffee" transaction. |
| UI Sync Status | "Up to date" |