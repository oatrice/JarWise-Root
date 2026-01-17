# Walkthrough - Phase 1 & 2: Slip Import & Extraction

## Goal
Establish the technical foundation for the "Auto-Transcribe Slips" feature (Issue #31) on Android, enabling the app to access, filter, display, and extract data from slip images.

## Phase 1: Foundation (Completed)
### 1. Dependencies & Permissions
- Added Google ML Kit libraries (`text-recognition`, `barcode-scanning`) in `build.gradle.kts`.
- Added `READ_MEDIA_IMAGES` and `READ_EXTERNAL_STORAGE` permissions in `AndroidManifest.xml`.

### 2. Slip Repository (`SlipRepository.kt`)
- Implemented `getRecentImages()` using `MediaStore` API.
- Implemented `getImagesFromFolder(uri)` using `DocumentFile` API.
- Implemented `observeNewImages()` for real-time updates.

### 3. UI Implementation
- **`SlipImportScreen.kt`**: Grid layout for displaying recent images.
- **`SlipViewModel.kt`**: State management for images and buckets.
- **`DashboardScreen.kt`**: Added "Import" button.

## Phase 2: Core Logic & Integration (Completed)

### 1. Data Extraction Logic (`SlipParser.kt`)
- Implemented robust regex-based extraction for:
    - **Amount**: Supports commas `1,250.00` and currency labels `THB`, `Baht`, `บาท`.
    - **Date**: Supports `dd MMM yyyy` (17 Jan 2026) and `dd/MM/yyyy` (17/01/2569).
    - **Bank Name**: Detects common Thai banks (KBank, SCB, BBL, KTB, etc.) via keywords.
- Integrated into `SlipDetectorServiceImpl`: Now runs OCR on every image to populate `ParsedSlip` data.

### 2. UI Logic (`SlipEditDialog`)
- Added a "Review Slip" dialog to `SlipImportScreen`.
- Displays the detected slip image along with editable fields for Amount and Bank Name.
- Shows confidence score.
- Allows user to manually correct OCR errors.

### 3. Database Integration (`MainViewModel` & `MainActivity`)
- Updated `MainViewModel` to accept custom dates.
- Wired `onConfirmSlip` in `MainActivity` to save the verified data directly into the JarWise database as a new Transaction.

## Verification Steps
1.  **Launch App**: Open JarWise on an Android device.
2.  **Scan Slip**: Select a slip image from the gallery or camera (via auto-detect).
3.  **Review**: Tap the detected slip in the grid.
4.  **Verify Data**: Check if the Amount, Date, and Bank Name are correctly extracted in the dialog.
5.  **Confirm**: Tap the Checkmark button.
6.  **Check History**: Navigate to "Transaction History" to verify the new transaction appears with the correct date and amount.

## Next Steps (Phase 3)
- **UI Refinements**: Pinch zoom, Jar selection, and Date picker.
