Resolves https://github.com/oatrice/JarWise-Root/issues/32
Resolves https://github.com/oatrice/JarWise-Root/issues/34

## ✅ Checklist
- [x] 🏗️ I have moved the related issue to "In Progress" on the Kanban board.

## 🎯 Type

- [x] ✨ Feature
- [x] 🏗️ Architecture
- [x] 📄 Documentation
- [x] 💥 Breaking change

## 🔗 Affected Platforms

- [x] Android

## 📝 Detailed Changes

This pull request introduces a major architectural update and a critical user-facing feature for the Android application: **Google Sign-In and Google Drive Cloud Backup**. This addresses the core problem of data being siloed on a single device and the risk of permanent data loss.

### 1. Architectural Foundation: Koin Dependency Injection
As a prerequisite for implementing the new authentication and backup services cleanly, this PR first introduces **Koin** as the dependency injection framework for the Android app.

- **Replaces Manual DI:** All manual ViewModel factories and repository instantiations have been replaced with a standardized, Koin-managed DI graph.
- **Improved Testability & Maintainability:** This significantly improves the codebase's structure, making it more modular, easier to maintain, and simpler to test.
- **New DI Modules:** Dedicated modules for ViewModels, Repositories, and Data sources (DAOs, Database) have been created.

### 2. Feature: Google Authentication & Cloud Backup
This is the primary feature of this PR, enabling users to secure their data and access it across devices in the future.

- **Google Sign-In:** A complete authentication flow using the Google Sign-In SDK has been implemented. Users can now create an account and log in with their Google credentials.
- **Google Drive Backup:** Upon logging in, the app's data (database) is automatically backed up to the user's Google Drive in a sandboxed application folder, ensuring user privacy and data security.
- **Restore Flow:** When a logged-in user performs a fresh installation, they are prompted to restore their data from the existing cloud backup, enabling a seamless device transition.
- **Manual Controls:** The Settings screen has been updated to include:
    - The currently logged-in user's profile information.
    - A "Logout" button with an option to clear all local data.
    - A manual "Restore from Backup" option.
- **Extensive Documentation:** Comprehensive analysis, planning, and walkthrough documents for this feature have been added to the repository.

## 📸 Screenshots

<table>
  <tr>
    <td><strong>Login Screen</strong></td>
    <td><strong>Dashboard (Logged In)</strong></td>
  </tr>
  <tr>
    <td><img src="https://raw.githubusercontent.com/oatrice/JarWise-Root/2e5c65c/docs/features/12_issue-32_web--android-google-login--cloud-backup/assets/login_screen_capture_1770020324133.webp" width="350" /></td>
    <td><img src="https://raw.githubusercontent.com/oatrice/JarWise-Root/2e5c65c/docs/features/12_issue-32_web--android-google-login--cloud-backup/assets/dashboard_after_login_1770020338527.png" width="350" /></td>
  </tr>
  <tr>
    <td><strong>Settings Page</strong></td>
    <td><strong>Logout Confirmation</strong></td>
  </tr>
  <tr>
    <td><img src="https://raw.githubusercontent.com/oatrice/JarWise-Root/2e5c65c/docs/features/12_issue-32_web--android-google-login--cloud-backup/assets/settings_page_1770019107278.png" width="350" /></td>
    <td><img src="https://raw.githubusercontent.com/oatrice/JarWise-Root/2e5c65c/docs/features/12_issue-32_web--android-google-login--cloud-backup/assets/logout_modal_1770019117061.png" width="350" /></td>
  </tr>
</table>

## 🧪 Testing
- [x] Changes verified locally
- [x] Documentation reviewed for accuracy
- [x] Manually tested the full login -> backup -> logout -> fresh install -> restore flow.
- [x] Verified that all ViewModel and Repository dependencies are correctly injected by Koin.

## 🔗 Related Issues

- Resolves https://github.com/oatrice/JarWise-Root/issues/32
- Resolves https://github.com/oatrice/JarWise-Root/issues/34

**Breaking Changes**: Yes. The introduction of an authentication system is a fundamental shift. While existing users can continue to use the app locally, cloud features require signing in.

**Migration Required**: Yes. For existing users with local data, a migration path is provided. Upon their first login, the app will prompt them to upload their existing local data to their account to create the initial cloud backup, ensuring a seamless transition without data loss.