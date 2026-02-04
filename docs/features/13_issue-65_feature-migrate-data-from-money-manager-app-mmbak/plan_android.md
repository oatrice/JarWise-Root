# Android Implementation Plan: Migrate Data from Money Manager App

> **Status**: Implemented
> **Parent Feature**: [Issue #65](../analysis.md)

## Goal
Implement the full Android UI and logic to allow users to migrate their data from Money Manager (.mmbak and .xls files) to JarWise.

## Proposed Changes

### 1. Dependencies & Networking
- **Update**: `libs.versions.toml` & `build.gradle.kts`
    - Add `Retrofit`, `OkHttp`, `Gson`.
- **New**: `NetworkModule.kt` (Koin)
    - Provide `OkHttpClient` with logging.
    - Provide `Retrofit` instance.
- **Security**: Update `network_security_config.xml` & `AndroidManifest.xml` to allow Localhost HTTP (for dev).

### 2. Logging
- **New**: `AppLogger.kt`
    - Implement file-based logging (`jarwise_app.log`) for debugging migration issues on device.

### 3. Data Layer
- **New**: `MigrationApi.kt` interface.
- **New**: `MigrationRepository.kt`
    - Handle `Uri` -> `File` conversion.
    - Upload files to Backend.
- **New**: `MigrationResponse` data classes.

### 4. UI Layer
- **New**: `MigrationViewModel.kt`
    - Manage file selection state.
    - Handle API calls and UI states (`Idle`, `Uploading`, `Success`, `Error`).
- **New**: `MigrationScreen.kt`
    - File pickers for `.mmbak` and `.xls`.
    - Progress indicator.
    - Success/Error feedback.
    - Navigation to Dashboard.

### 5. Integration
- **Modify**: `SettingsScreen.kt` -> Add entry point.
- **Modify**: `MainActivity.kt` -> Add navigation route.
- **Modify**: `ViewModelModule.kt` -> Register ViewModel.

## Verification
- Manual testing of happy path (Success).
- Manual testing of validation failure (Error feedback).
- Check `jarwise_app.log` for debugging.
