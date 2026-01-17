# Walkthrough - Phase 1: Foundation (Auto-Transcribe Slips)

## Goal
Establish the technical foundation for the "Auto-Transcribe Slips" feature (Issue #31) on Android, enabling the app to access, filter, and display slip images from the device.

## Changes
### 1. Dependencies & Permissions
- Added Google ML Kit libraries (`text-recognition`, `barcode-scanning`) in `build.gradle.kts` for future OCR phases.
- Added `READ_MEDIA_IMAGES` and `READ_EXTERNAL_STORAGE` permissions in `AndroidManifest.xml`.

### 2. Slip Repository (`SlipRepository.kt`)
- Implemented `getRecentImages()` using `MediaStore` API to fetch latest images (for Auto-Detect/Smart Scan).
- Implemented `getImagesFromFolder(uri)` using `DocumentFile` API (for Manual Folder Import).
- Implemented `observeNewImages()` using `ContentObserver` to listen for new camera photos in real-time.

### 3. UI Implementation
- **`SlipImportScreen.kt`**: A grid layout displaying recent images fetched from the repository.
- **`SlipViewModel.kt`**: Manages the image list and listens for real-time updates.
- **`DashboardScreen.kt`**: Added an "Import" button (Cloud Upload icon) next to the Scan button.
- **`MainActivity.kt`**: Wired up navigation and Dependency Injection for the new screen and repository.

## Verification Steps
1.  **Launch App**: Open JarWise on an Android device or emulator.
2.  **Check Dashboard**: Verify the new "Import" button (Cloud icon) appears in the top header.
3.  **Permissions**: Tap the button. If running on Android 13+, ensure permissions are granted (you might need to manually handle runtime permissions in code if strict mode is on, currently assuming dev/debug perm grant or adding runtime request logic in next phase if crushed). *Note: Runtime permission request logic is basic for now; ensure permissions are granted in settings if it crashes.*
4.  **View Images**: The screen should display a grid of recent images from your device.
5.  **Auto-Detect Test**: Minimize app, take a photo with the camera, and return. The list should (ideally) update via the observer (or requires a quick refresh if lifecycle pauses it).

## Next Steps (Phase 2)
- Implement ML Kit OCR to extract text from these images.
- Implement "Smart Filter" to hide non-slip images.
