# Web Mock UI: Data Migration Implementation

## Overview
We have implemented the mock UI for the "Data Migration" feature (Issue [65]). This allows users to visualize the flow of importing data from the Money Manager app via `.mmbak` and `.xls` files.

## Changes
### 1. New Screens
- **[MigrationUploadScreen.tsx](file:///Users/oatrice/Software-projects/JarWise/Web/src/pages/MigrationUploadScreen.tsx)**:
    - Provides file inputs for `.mmbak` and `.xls` files.
    - Validates that both files are selected before proceeding.
- **[MigrationStatusScreen.tsx](file:///Users/oatrice/Software-projects/JarWise/Web/src/pages/MigrationStatusScreen.tsx)**:
    - Simulates the upload and validation process.
    - Displays a "Validation Successful" state with mock statistics (Wallets, Jars, Transactions).
    - Includes a debug option to simulate a "Validation Failed" state.

### 2. Integration
- **[SettingsOverlay.tsx](file:///Users/oatrice/Software-projects/JarWise/Web/src/pages/SettingsOverlay.tsx)**: Added a "Data Migration" entry in the General settings section.
- **[App.tsx](file:///Users/oatrice/Software-projects/JarWise/Web/src/App.tsx)**: Added routing for `migration-upload` and `migration-status`.
- **[Dashboard.tsx](file:///Users/oatrice/Software-projects/JarWise/Web/src/pages/Dashboard.tsx)**: Updated to pass navigation handlers to the settings overlay.

## Verification
- Manual verification was performed by checking code correctness and linting layers.
- The flow is: `Settings` -> `Data Migration` -> `Upload` -> `Status (Loading -> Preview -> Success)`.

## Next Steps
- Implement the actual backend in Go.
- Connect the frontend to the real API endpoints.
