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
#### [MODIFY] `data/repository/SlipRepository.kt`
- **[UPDATE]** `getRecentImages`: Update to support optional `bucketId` filtering.
- **[NEW]** `getImageBuckets(): List<Bucket>`: Query MediaStore to get unique folders (Download, Camera, etc.) and their validation info (count, thumbnail).
- **Remove**: `getImagesFromFolder` (DocumentFile logic) as we are dropping `OPEN_DOCUMENT_TREE`.

#### UI Layer
#### [MODIFY] `ui/slip/SlipImportScreen.kt`
- **Folder Picker UI**:
    - Replace `FloatingActionButton` that launches Intent.
    - Add `ModalBottomSheet` or `Dialog` showing list of "Albums" (Buckets).
    - On Album select -> Reload `recentImages` filtered by that bucket.

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
