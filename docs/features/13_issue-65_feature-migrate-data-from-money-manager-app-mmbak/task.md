# Task: Implement Web Mock UI for Issue 65

- [x] Create `MigrationUploadScreen.tsx` <!-- id: 0 -->
- [x] Create `MigrationStatusScreen.tsx` <!-- id: 1 -->
- [x] Update `SettingsOverlay.tsx` to include "Data Migration" option <!-- id: 2 -->
- [x] Update `Dashboard.tsx` to pass navigation prop to Settings <!-- id: 3 -->
- [x] Update `App.tsx` to handle routing for new screens <!-- id: 4 -->
- [x] Verify functionality (Manual Test) <!-- id: 5 -->

## Backend Implementation
- [x] Step 2: API Endpoint and Scaffolding <!-- id: 6 -->
- [x] Step 3: Implement .mmbak (SQLite) Parser <!-- id: 7 -->
- [x] Step 4: Implement .xls (HTML) Parser (Verified with real data) <!-- id: 8 -->
- [x] Step 5: Implement Validation Logic <!-- id: 9 -->
   - [x] Compare Transaction Counts
   - [x] Compare Total Amounts (Income/Expense)
   - [x] Generate Diff Report
- [x] Step 6: Implement Transactional Data Import (Mock persistence implemented) <!-- id: 10 -->

## Android Implementation
- [x] Step 7: Android UI & ViewModel <!-- id: 11 -->
    - [x] MigrationViewModel with File Logging
    - [x] MigrationScreen (File Pickers, Status UI)
- [x] Step 8: Android Integration <!-- id: 12 -->
    - [x] NetworkModule (Retrofit, OkHttp)
    - [x] MigrationRepository (Multipart Upload)
    - [x] End-to-End Verification (Localhost)
- [x] Refactor: Security & Performance Improvements <!-- id: 13 -->
