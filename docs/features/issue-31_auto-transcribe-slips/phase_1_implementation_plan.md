# Implementation Plan - Phase 1: Support Auto Transcribe Slips (Foundation)

**Goal**: Prepare the Android project with necessary ML Kit dependencies and implement the foundational "Image Source" layer (File Picker & Auto-Detect logic) to support the Auto Transcribe feature.

## User Review Required
> [!IMPORTANT]
> **Permissions**: This phase involves adding `READ_MEDIA_IMAGES` (Android 13+) and `READ_EXTERNAL_STORAGE` permissions.
> **Dependencies**: Adding Google ML Kit libraries (`text-recognition`, `barcode-scanning`) which will increase app size slightly.

## Proposed Changes

### Android

#### Dependencies
##### [MODIFY] [build.gradle.kts (App Level)](file:///Users/oatrice/Software-projects/JarWise/Android/app/build.gradle.kts)
- Add ML Kit dependencies:
    - `com.google.android.gms:play-services-mlkit-text-recognition:19.0.0`
    - `com.google.mlkit:barcode-scanning:17.2.0`
- Add Coroutines/Lifecycle dependencies if missing.

#### Manifest
##### [MODIFY] [AndroidManifest.xml](file:///Users/oatrice/Software-projects/JarWise/Android/app/src/main/AndroidManifest.xml)
- Add permissions:
    - `<uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />`
    - `<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />`

#### Logic / Data Layer
##### [NEW] `data/repository/SlipRepository.kt`
- Function `getRecentImages(limit: Int): List<Uri>` using `MediaStore`.
- Function `getImagesFromFolder(folderUri: Uri): List<Uri>` using `DocumentFile`.
- **Auto-Detect Logic**: `ContentObserver` implementation to watch for new changes in `MediaStore`.

#### UI Layer
##### [NEW] `ui/slip/SlipImportScreen.kt`
- Simple UI to test the logic:
    - Button "Select Folder"
    - List "Detected Images" (Auto-detected recent headers)
    - Preview selected images.

## Verification Plan

### Automated Tests
- [ ] Unit Test `SlipRepository`: Mock `ContentResolver` to verify query logic (if possible, otherwise instrumented test).
- [ ] UI Test: Verify "Select Folder" button calls the Intent.

### Manual Verification
1.  **Permission Test**: Install app -> Check if it asks for Storage Permission.
2.  **Auto-Detect Test**:
    *   Open App.
    *   Go to Camera App -> Take a photo.
    *   Switch back to App -> Check if `SlipRepository` detects the new image.
3.  **Folder Selection**:
    *   Click "Select Folder" -> Pick a folder with images.
    *   Verify app lists the images from that folder.
