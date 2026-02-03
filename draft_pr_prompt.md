# PR Draft Prompt

You are an AI assistant helping to create a Pull Request description.
    
TASK: [Web | Android] Google Login & Cloud Backup
ISSUE: {
  "title": "[Web | Android] Google Login & Cloud Backup",
  "number": 32
}

GIT CONTEXT:
COMMITS:
6aabc5a 🐛 fix(managejars): resolve immediate save and state persistence issues
1189a2a ✨ feat(settings): add manual restore and logout options
d6fd9fd 🔧 feat(backup): implement logout with data clearing option
65584de ✨ feat(backup): complete android cloud backup implementation
2e5c65c ✨ feat(cloud): Complete Android Google login and cloud backup with restore flow
2490e0e ✨ feat(auth): implement google login and cloud backup for android
50b7e85 ✨ feat(di): implement Koin DI integration
90c9f34 ✅ docs(roadmap): updates Koin DI implementation status

STATS:
docs/ROADMAP.md                                    |   4 +-
 .../implementation_plan.md                         |  77 ++++++
 .../analysis.md                                    | 287 +++++++++++++++++++++
 .../android/implementation_plan.md                 |  51 ++++
 .../android/task.md                                |  51 ++++
 .../android/walkthrough.md                         |  71 +++++
 .../assets/dashboard_after_login_1770020338527.png | Bin 0 -> 105231 bytes
 .../assets/dashboard_main_1770018092550.png        | Bin 0 -> 324246 bytes
 .../google_login_mockui_demo_1770018076689.webp    | Bin 0 -> 8564762 bytes
 .../assets/login_screen_capture_1770020324133.webp | Bin 0 -> 328246 bytes
 .../assets/logout_modal_1770019117061.png          | Bin 0 -> 77231 bytes
 .../assets/settings_page_1770019107278.png         | Bin 0 -> 59156 bytes
 .../plan.md                                        | 101 ++++++++
 .../spec.md                                        | 131 ++++++++++
 .../task_tracking.md                               |  48 ++++
 .../walkthrough.md                                 |  65 +++++
 docs/templates/feature_spec_template.md            |  11 +
 docs/templates/plan_template.md                    |  54 ++++
 18 files changed, 949 insertions(+), 2 deletions(-)

KEY FILE DIFFS:
diff --git a/docs/ROADMAP.md b/docs/ROADMAP.md
index 6ea1fea..1b276b9 100644
--- a/docs/ROADMAP.md
+++ b/docs/ROADMAP.md
@@ -15,7 +15,7 @@ This document outlines the strategic direction and priority of features for JarW
 
 - **#34 Implement Koin (Dependency Injection)**
     - **Goal:** Standardize DI across Android app to replace manual ViewModelFactories.
-    - **Status:** 🟢 **Ready**
+    - ✅ **Done** (v1.6.0) - Android Implementation Complete.
 - **#67 Hierarchy (Full Implementation)**
     - ✅ **Done** (v1.4.0) - Hierarchical Jars implemented.
 - **#32 Google Login & Cloud Backup**
@@ -44,7 +44,7 @@ graph TD
     end
 
     subgraph Phase 2: Migration
-        KOIN[#34 Koin DI]
+        KOIN[✅ #34 Koin DI]
         I32[#32 Backup & Sync]
         I67[✅ #67 Hierarchy]
         I65[#65 Migration]
diff --git a/docs/features/11_issue-34_android-implement-koin-lib/implementation_plan.md b/docs/features/11_issue-34_android-implement-koin-lib/implementation_plan.md
new file mode 100644
index 0000000..19c877e
--- /dev/null
+++ b/docs/features/11_issue-34_android-implement-koin-lib/implementation_plan.md
@@ -0,0 +1,77 @@
+# Implementation Plan - Integrating Koin Dependency Injection (Issue #34)
+
+This plan outlines the steps to integrate the Koin dependency injection framework into the JarWise Android application. The goal is to replace manual dependency instantiation with a robust, testable, and maintainable DI system.
+
+## User Review Required
+
+> [!IMPORTANT]
+> This is a significant architectural change that touches the core of the application (Repositories, ViewModels, and App Initialization).
+> - **Breaking Change**: The way `ViewModel`s are instantiated will change across the app.
+> - **New Application Class**: A new `JarWiseApplication` class will be introduced and set in `AndroidManifest.xml`.
+
+## Proposed Changes
+
+### Build Configuration
+
+#### [MODIFY] [build.gradle.kts](file:///Users/oatrice/Software-projects/JarWise/Android/app/build.gradle.kts)
+- Add `koin-android` and `koin-androidx-compose` dependencies.
+
+### Application Initialization
+
+#### [NEW] [JarWiseApplication.kt](file:///Users/oatrice/Software-projects/JarWise/Android/app/src/main/java/com/oatrice/jarwise/JarWiseApplication.kt)
+- Create a new class extending `Application`.
+- Initialize Koin in `onCreate()` using `startKoin`.
+- Load modules: `appModule`, `dataModule`, `repositoryModule`, `viewModelModule`.
+
+#### [MODIFY] [AndroidManifest.xml](file:///Users/oatrice/Software-projects/JarWise/Android/app/src/main/AndroidManifest.xml)
+- Update `<application>` tag to point to `.JarWiseApplication`.
+
+### Dependency Injection Modules (New Package: `di`)
+
+#### [NEW] [AppModule.kt](file:///Users/oatrice/Software-projects/JarWise/Android/app/src/main/java/com/oatrice/jarwise/di/AppModule.kt)
+- Define general app-wide dependencies (if any).
+
+#### [NEW] [DataModule.kt](file:///Users/oatrice/Software-projects/JarWise/Android/app/src/main/java/com/oatrice/jarwise/di/DataModule.kt)
+- Provide `AppDatabase` singleton.
+- Provide DAOs: `TransactionDao`, `AllocationDao`, `JarConfigDao`, `WalletDao`.
+
+#### [NEW] [RepositoryModule.kt](file:///Users/oatrice/Software-projects/JarWise/Android/app/src/main/java/com/oatrice/jarwise/di/RepositoryModule.kt)
+- Define `single` definitions for all Repositories, injecting their dependencies (DAOs, Context, etc.).
+
+#### [NEW] [ViewModelModule.kt](file:///Users/oatrice/Software-projects/JarWise/Android/app/src/main/java/com/oatrice/jarwise/di/ViewModelModule.kt)
+- Define `viewModel` definitions for all ViewModels, injecting Repositories.
+
+### Refactoring Components
+
+#### Repositories
+Update the following repositories to accept dependencies via **Constructor Injection** instead of internal instantiation:
+- [MODIFY] [WalletRepository.kt](file:///Users/oatrice/Software-projects/JarWise/Android/app/src/main/java/com/oatrice/jarwise/data/repository/WalletRepository.kt)
+- [MODIFY] [JarConfigRepository.kt](file:///Users/oatrice/Software-projects/JarWise/Android/app/src/main/java/com/oatrice/jarwise/data/repository/JarConfigRepository.kt)
+- [MODIFY] [SlipRepository.kt](file:///Users/oatrice/Software-projects/JarWise/Android/app/src/main/java/com/oatrice/jarwise/data/repository/SlipRepository.kt)
+- [MODIFY] [UserPreferencesRepository.kt](file:///Users/oatrice/Software-projects/JarWise/Android/app/src/main/java/com/oatrice/jarwise/data/repository/UserPreferencesRepository.kt)
+- [MODIFY] [CurrencyRepository.kt](file:///Users/oatrice/Software-projects/JarWise/Android/app/src/main/java/com/oatrice/jarwise/data/repository/CurrencyRepository.kt)
+
+#### ViewModels
+Update the following ViewModels to accept Repositories via **Constructor Injection**:
+- [MODIFY] [ManageWalletsViewModel.kt](file:///Users/oatrice/Software-projects/JarWise/Android/app/src/main/java/com/oatrice/jarwise/ui/managewallets/ManageWalletsViewModel.kt)
+- [MODIFY] [ManageJarsViewModel.kt](file:///Users/oatrice/Software-projects/JarWise/Android/app/src/main/java/com/oatrice/jarwise/ui/managejars/ManageJarsViewModel.kt)
+- [MODIFY] [SlipViewModel.kt](file:///Users/oatrice/Software-projects/JarWise/Android/app/src/main/java/com/oatrice/jarwise/ui/SlipViewModel.kt)
+- [MODIFY] [MainViewModel.kt](file:///Users/oatrice/Software-projects/JarWise/Android/app/src/main/java/com/oatrice/jarwise/ui/MainViewModel.kt)
+
+### UI Integration
+
+#### [MODIFY] [MainActivity.kt](file:///Users/oatrice/Software-projects/JarWise/Android/app/src/main/java/com/oatrice/jarwise/MainActivity.kt)
+- Replace manual ViewModel instantiation with `koinViewModel()`.
+- Ensure `KoinAndroidContext` or proper setup is used if relying on Compose.
+
+## Verification Plan
+
+### Automated Tests
+- Run `./gradlew testDebugUnitTest` to ensure no existing logic is broken.
+- (Optional) Add a basic Koin check test to verify module configuration graph.
+
+### Manual Verification
+1.  **Launch App**: Verify the app starts without crashing (validating `JarWiseApplication` and Koin init).
+2.  **Wallet Management**: Navigate to "Manage Wallets", Add/Edit/Delete a wallet. Verifies `WalletRepository` and `ManageWalletsViewModel` injection.
+3.  **Jar Management**: Navigate to "Manage Jars", Add/Edit/Delete a jar. Verifies `JarConfigRepository` and `ManageJarsViewModel` injection.
+4.  **Transactions**: Add a transaction to verify database interactions through the injected stack.
diff --git a/docs/features/12_issue-32_web--android-google-login--cloud-backup/analysis.md b/docs/features/12_issue-32_web--android-google-login--cloud-backup/analysis.md
new file mode 100644
index 0000000..5f007a1
--- /dev/null
+++ b/docs/features/12_issue-32_web--android-google-login--cloud-backup/analysis.md
@@ -0,0 +1,287 @@
+# Analysis Template
+
+> 📋 Template สำหรับการวิเคราะห์ก่อนเริ่มพัฒนา Feature
+
+---
+
+## 📌 Feature Information
+
+| รายการ | รายละเอียด |
+|--------|-----------|
+| **Feature Name** | Google Sign-In & Google Drive Backup |
+| **Issue URL** | [#32](https://github.com/placeholder/repo/issues/32) |
+| **Date** | 2023-10-27 |
+| **Analyst** | Luma AI (Senior Technical Analyst) |
+| **Priority** | 🔴 High |
+| **Status** | 📝 Draft |
+
+---
+
+## 1. Requirement Analysis
+
+### 1.1 Problem Statement
+
+> อธิบายปัญหาที่ต้องการแก้ไข
+
+```
+Currently, users can only use the application anonymously with data stored locally on their device. This presents two major problems: 1) Users cannot access their data across multiple devices (e.g., web and mobile). 2) There is a high risk of permanent data loss if the user uninstalls the app, clears their cache, or loses their device. This creates a fragmented and unreliable user experience.
+```
+
+### 1.2 User Stories
+
+| # | As a | I want to | So that |
+|---|------|-----------|---------|
+| 1 | New User | sign in with my Google account | I can quickly create an account without needing to remember a new password. |
+| 2 | Registered User | have my app data automatically backed up to my Google Drive | I can be confident my data is safe and accessible from any of my devices. |
+| 3 | Registered User | manually trigger a data backup | I can ensure my most recent changes are saved before switching to another device. |
+| 4 | Registered User | restore my data from a Google Drive backup | I can easily set up a new device or recover my data after a re-installation. |
+
+### 1.3 Acceptance Criteria
+
+- [ ] **AC1:** Users can successfully authenticate using their Google account on both Web and Android platforms.
+- [ ] **AC2:** Upon successful login, the user's Google profile name and avatar are displayed within the application's UI.
+- [ ] **AC3:** The user's session is persisted, allowing them to remain logged in when they reopen the app.
+- [ ] **AC4:** A "Logout" option is available, which clears the user's session and associated local data.
+- [ ] **AC5:** Application data (Transactions, Jar configurations, User preferences, App settings) is automatically and periodically backed up to the user's Google Drive.
+- [ ] **AC6:** Users can manually initiate a backup and restore their data from an existing backup file in Google Drive.
+- [ ] **AC7:** The UI displays the timestamp of the last successful backup and the current sync status (e.g., "Synced," "Syncing," "Offline").
+- [ ] **AC8:** The backup file stored in Google Drive is encrypted to protect user data privacy.
+
+---
+
+## 2. Feature Analysis
+
+### 2.1 User Flow
+
+```mermaid
+flowchart TD
+    subgraph "Phase 1: Authentication"
+        A[App Launch] --> B{Is User Logged In?}
+        B -->|No| C[Show Login Screen]
+        C --> D[Click "Sign in with Google"]
+        D --> E[Google OAuth Flow]
+        E --> F{Authentication Successful?}
+        F -->|No| G[Show Error Message] --> C
+        F -->|Yes| H[Fetch Google Profile]
+        H --> I[Backend: Create Session/User]
+    end
+
+    subgraph "Phase 2: Backup & Restore"
+        I --> J{Backup exists in Google Drive?}
+        J -->|Yes| K[Prompt to Restore Data]
+        K --> L{User chooses to Restore?}
+        L -->|Yes| M[Download & Decrypt Backup] --> N[Apply Data to App]
+        L -->|No| O[Proceed with Local/Default Data]
+        J -->|No| O
+        N --> P[Show Main App Screen]
+        O --> P
+        P --> Q[User interacts with app]
+        Q --> R((Auto-backup Triggered Periodically))
+        R --> S[Encrypt & Upload Data to GDrive]
+        P --> T[User navigates to Settings]
+        T --> U[Click "Backup Now"] --> S
+        T --> V[Click "Restore"] --> K
+    end
+```
+
+### 2.2 Screen/Page Requirements
+
+| หน้าจอ | Actions | Components |
+|--------|---------|------------|
+| **Login Screen** | - Sign in with Google | - "Sign in with Google" button<br>- Privacy Policy link |
+| **Settings / Profile** | - View user profile<br>- Initiate manual backup<br>- Initiate restore from backup<br>- Logout | - User Avatar & Name display<br>- "Backup Now" button<br>- "Restore from Drive" button<br>- "Last Backup: [Timestamp]" status indicator<br>- "Logout" button |
+| **Initial Setup (Post-Login)** | - Choose to restore data | - Modal/Dialog: "Backup found. Would you like to restore your data?"<br>- "Restore" button<br>- "Start Fresh" button |
+
+### 2.3 Input/Output Specification
+
+#### Inputs
+
+| Field | Type | Required | Validation |
+|-------|------|----------|------------|
+| Google Auth Code | string | ✅ | Provided by Google SDK, exchanged on backend |
+| User Action | click | ✅ | User interaction with UI buttons |
+
+#### Outputs
+
+| Field | Type | Description |
+|-------|------|-------------|
+| Session Token (JWT) | string | A secure token issued by our backend to the client for authenticating API requests. |
+| User Profile | object | User's ID, name, email, and avatar URL, stored in the app state. |
+| Backup File | binary | An encrypted file containing a snapshot of the user's app data (e.g., in JSON format). |
+| Sync Status | string | A UI-friendly string indicating the current state of data synchronization. |
+
+---
+
+## 3. Impact Analysis
+
+### 3.1 Affected Components
+
+| Component | Impact Level | Description |
+|-----------|--------------|-------------|
+| **Authentication Service (Backend)** | 🔴 High | Requires new endpoints for Google OAuth callback, token exchange, token validation, and session management. |
+| **User Database Schema** | 🔴 High | New `users` table required to store Google ID, email, profile info, and refresh tokens. |
+| **Frontend State Management** | 🔴 High | Global state needs to manage authentication status, user profile, and sync status. |
+| **Client-side UI (Web & Android)** | 🔴 High | New login screens, settings page modifications, and profile displays must be built. |
+| **Local Data Persistence Logic** | 🔴 High | Existing logic must be integrated with the new cloud backup/restore flow. |
+| **API Gateway / Middleware** | 🟡 Medium | New protected routes and authentication middleware will be needed to secure endpoints. |
+
+### 3.2 Breaking Changes
+
+- [ ] **BC1:** Introduction of a mandatory authentication layer. Users who previously used the app anonymously will need to sign in to enable cross-device sync and data backup.
+- [ ] **BC2:** The data storage model will shift from purely local to a cloud-synced model, which may require a one-time data migration for existing users.
+
+### 3.3 Backward Compatibility Plan
+
+```
+For existing users with local data:
+1. Upon the first app update, the app will continue to function offline as before.
+2. A prominent, non-intrusive banner will encourage users to "Sign in to back up your data."
+3. When an existing user signs in for the first time, the app will detect local data and prompt them: "Would you like to upload your current local data to your new account?"
+4. This one-time migration will associate their existing local data with their new Google-linked account, ensuring a seamless transition without data loss.
+```
+
+---
+
+## 4. Feasibility Analysis
+
+### 4.1 Technical Feasibility
+
+| คำถาม | คำตอบ | หมายเหตุ |
+|-------|-------|----------|
+| เทคโนโลยีรองรับหรือไม่? | ✅ | Google provides official, well-documented SDKs for Web (gis) and Android (Google Sign-In SDK), as well as REST APIs for Google Drive. |
+| ทีมมี Skills เพียงพอหรือไม่? | ✅ | The implementation uses standard OAuth 2.0 patterns and REST API consumption, which are common skills for web and mobile developers. |
+| Infrastructure รองรับหรือไม่? | ✅ | The backend infrastructure only needs to handle standard HTTPS requests for the OAuth callback. No specialized hardware or services are required. |
+
+### 4.2 Time Feasibility
+
+| ประเด็น | รายละเอียด |
+|--------|-----------|
+| **Estimated Effort** | **6 weeks** (Phase 1: 2.5 weeks, Phase 2: 3.5 weeks) |
+| **Deadline** | Not specified. Assumed to follow standard development cycles. |
+| **Buffer Time** | 1 week |
+| **Feasible?** | ✅ | The scope is significant but manageable within the estimated timeframe if split into the two specified phases. |
+
+### 4.3 Budget Feasibility
+
+| รายการ | ค่าใช้จ่าย | หมายเหตุ |
+|--------|-----------|----------|
+| Google API Usage | ~$0 | Google Sign-In is free. The Google Drive API has a generous free quota that is highly unlikely to be exceeded by this application's usage pattern. |
+| Development Hours | [Internal Cost] | The primary cost is the developer time estimated above. |
+| **Total** | **Negligible (excluding development time)** | |
+
+---
+
+## 5. Security Analysis
+
+### 5.1 Sensitive Data
+
+| ข้อมูล | Sensitivity Level | Protection Method |
+|--------|------------------|-------------------|
+| **OAuth Tokens (Access, Refresh)** | 🔴 Critical | **Backend:** Encrypted in the database. **Client:** Stored securely (HttpOnly cookies for web, Android Keystore for mobile). |
+| **User Application Data Backup** | 🔴 Critical | End-to-end encryption. Data is encrypted on the client device (AES-256) before being uploaded to Google Drive. The encryption key is not stored in plain text. |
+| **User PII (Name, Email, Avatar)** | 🟡 Sensitive | Stored in the user database with standard access controls. Transmitted over TLS. |
+
+### 5.2 Attack Vectors
+
+| Vector | Risk Level | Mitigation |
+|--------|-----------|------------|
+| **Token Interception/Hijacking** | 🔴 High | Use OAuth 2.0 Authorization Code flow with PKCE. Enforce HTTPS/TLS everywhere. Use secure, HttpOnly cookies on the web to prevent XSS access. |
+| **Cross-Site Request Forgery (CSRF)** | 🟡 Medium | Implement standard CSRF protection on the backend (e.g., `state` parameter in OAuth flow, anti-CSRF tokens for session-based actions). |
+| **Unauthorized Data Access** | 🔴 High | Encrypt backup files. Use the `drive.appdata` scope for the Google Drive API, which sandboxes app data and prevents the app from accessing other user files. |
+
+### 5.3 Authentication & Authorization
+
+```
+- **Authentication:** The system will use Google's OAuth 2.0 (Authorization Code Flow with PKCE) as the primary authentication method. The backend will verify the identity with Google and issue a stateless JWT session token to the client.
+- **Authorization:** All subsequent API requests from the client to our backend will be authorized using the JWT in the `Authorization` header. The Google Drive API access will be authorized by the OAuth access token and restricted to the `drive.appdata` scope.
+```
+
+---
+
+## 6. Performance & Scalability Analysis
+
+### 6.1 Performance Targets
+
+| Metric | Target | Current |
+|--------|--------|---------|
+| Login Flow Duration | < 5s | N/A |
+| API Response Time (Backend) | < 250ms (p95) | N/A |
+| Backup/Restore Duration | < 20s for 5MB data | N/A |
+| Error Rate | < 0.1% | N/A |
+
+### 6.2 Scalability Plan
+
+| Scenario | Expected Users | Scaling Strategy |
+|----------|---------------|------------------|
+| Normal | 10,000 DAU | The backend authentication service will be stateless and can be horizontally scaled using a load balancer. |
+| Peak | 50,000 DAU | The authentication and backup loads are distributed across Google's infrastructure, which is highly scalable. Our backend only handles token exchange and session management. |
+| Growth (1yr) | 200,000 DAU | Monitor API response times and database load. Implement database read replicas if necessary. The architecture is inherently scalable. |
+
+---
+
+## 7. Gap Analysis
+
+| ด้าน | As-Is (ปัจจุบัน) | To-Be (ต้องการ) | Gap |
+|------|-----------------|-----------------|-----|
+| **Authentication** | No user accounts. All usage is anonymous and local. | A complete user authentication system based on Google Sign-In. | The entire authentication stack (client-side SDK integration, backend OAuth handling, session management) needs to be built from scratch. |
+| **Data Persistence** | Data is stored exclusively on the device's local storage. | Data is automatically backed up to the user's personal Google Drive and can be restored. | A comprehensive backup, restore, and sync engine needs to be developed, including data serialization, encryption, and Google Drive API integration. |
+| **User Experience** | Single-device experience with risk of data loss. | A multi-device, persistent experience where user data is safe and accessible. | UI/UX for login, profile management, and sync status needs to be designed and implemented. |
+
+---
+
+## 8. Risk Analysis
+
+| Risk | Probability | Impact | Score | Mitigation Plan |
+|------|-------------|--------|-------|-----------------|
+| **Complex Conflict Resolution** | 🟡 Medium | 🔴 High | 6 | For the initial release, implement a simple "last write wins" strategy. If a conflict is detected on restore, clearly prompt the user to choose between the local version and the cloud version. Defer complex data merging. |
+| **Security Flaw in OAuth Flow** | 🟡 Medium | 🔴 High | 6 | Strictly adhere to Google's official implementation guidelines and OAuth 2.0 best practices (including PKCE). Conduct a thoro
... (Diff truncated for size) ...

PR TEMPLATE:
# 📋 Monorepo Update Summary
<!-- 
Brief description of changes affecting the project structure or multiple 
platforms 
-->

## ✅ Checklist
- [ ] 🏗️ I have moved the related issue to "In Progress" on the Kanban board

## 🎯 Type

- [ ] 📦 Monorepo Structure
- [ ] 📄 Documentation (Root)
- [ ] 🔄 Workflow/CI Update
- [ ] 🚀 Release Management
- [ ] 💥 Breaking change

## 🔗 Affected Platforms

- [ ] Web
- [ ] Android
- [ ] iOS
- [ ] Mobile (Flutter)

## 📝 Detailed Changes

<!-- Describe the high-level purpose of this PR -->

## 📸 Screenshots (if applicable)
<!-- 
IMPORTANT: Always use width="400" for screenshots
Use HTML <img> tag for width control:

<img src="https://raw.githubusercontent.com/oatrice/JarWise-Root/branch-name/path/to/image.png" width="400" />
-->

## 🧪 Testing
- [ ] Changes verified locally
- [ ] Documentation reviewed for accuracy

## 🚀 Migration/Deployment

- [ ] Environment variables updated
- [ ] Global Dependencies installed

```bash
# Migration commands if applicable
```

## 🔗 Related Issues

<!-- 
Use 'Resolves' keyword with FULL repo reference for auto-linking.
This makes the PR appear in the Issue's "Development" sidebar:

Development
├── oatrice/JarWise-Web#6
└── oatrice/JarWise-Android#7

Example: Resolves oatrice/JarWise-Root#16
-->
- Resolves oatrice/JarWise-Root#

**Breaking Changes**: <!-- Yes/No -->
**Migration Required**: <!-- Yes/No -->


INSTRUCTIONS:
1. Generate a comprehensive PR description in Markdown format.
2. If a template is provided, fill it out intelligently.
3. If no template, use a standard structure: Summary, Changes, Impact.
4. Focus on 'Why' and 'What'.
5. Do not include 'Here is the PR description' preamble. Just the body.
6. IMPORTANT: Always use FULL URLs for links to issues and other PRs (e.g., https://github.com/owner/repo/issues/123), do NOT use short syntax (e.g., #123) to ensuring proper linking across platforms.
