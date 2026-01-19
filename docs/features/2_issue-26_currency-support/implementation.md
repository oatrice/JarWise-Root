
# Currency Support & UI Parity Implementation Plan

This document outlines the comprehensive plan for implementing multi-currency support and achieving UI parity between Android and Web platforms for JarWise.

## 1. Goal
1.  Enable users to view their transactions and jar balances in their preferred currency (THB, USD, EUR, JPY).
2.  Ensure visual and functional parity between Mobile Android and Mobile Web interfaces, specifically in the Dashboard header and navigation.

## 2. Architecture

### Android (Currency)
*   **Data Layer**: `UserPreferencesRepository` (DataStore), `CurrencyRepository`.
*   **ViewModel**: `MainViewModel` emits `selectedCurrency`.
*   **UI Layer**: `TransactionDisplayUtils`, dynamic `DashboardScreen`, `TransactionCard`.

### Web (Currency) - **Completed**
*   **State Management**: `CurrencyContext`.
*   **Storage**: `localStorage` (key: `settings.currency`).
*   **UI**: `formatAmount` utility, `useCurrency` hook. Consumed by `Dashboard.tsx`, `JarCard.tsx`, `TransactionCard.tsx`.

## 3. Implementation Phases

### Phase 1: Android Core (Completed)
- [x] DataStore & Repository implementation.
- [x] UI Consumption in `DashboardScreen` and `TransactionHistoryScreen`.

### Phase 2: Web Re-Implementation (Completed)
- [x] **Context**: Created `CurrencyContext` with `localStorage` persistence.
- [x] **Integration**: Wrapped App in `CurrencyProvider`.
- [x] **UI**: Refactored `Dashboard`, `JarCard`, `TransactionCard`.
- [x] **Selection**: Implemented Currency Selector (Mobile toggle / Desktop hover).

### Phase 3: Mobile UI Parity (In Progress)
**Goal**: Optimize Dashboard Header space on mobile devices to match Android.

#### Part 1: Header Icons (Completed)
- [x] **Replace Search/Bell**: Replaced default navigation with actionable icons.
- [x] **Import Slip Button**: Added `CloudUpload` icon (mock).
- [x] **Scanner Button**: Retained `ScanBarcode` icon.
- [x] **Overflow Menu**: Added `MoreVertical` menu with "Notifications" and "Settings".

#### Part 2: Import Slip UI (Completed)
**Goal**: create a mock-up of the "Import Slip" screen on Mobile Web to mirror Android's `SlipImportScreen`.
- [x] **Component**: `ImportSlip.tsx`.
- [x] **Features**:
    - Gallery Grid (Recent Images).
    - "Albums" FAB with Mock Dialog.
    - "Review Slip" Dialog (Mock data).
- [x] **Integration**: Overlay/Route in `Dashboard` via "CloudUpload" button.

#### Part 3: Mobile Settings (Completed)
**Goal**: Implement a mobile-friendly Settings interface accessible from the header menu.
- [x] **Component**: `SettingsOverlay.tsx`.
- [x] **Features**:
    - Currency Selection (Full list with flags).
    - Mock "Appearance" and "About" sections.
- [x] **Integration**: Accessible via "MoreVert" -> "Settings".

## 4. Feature Parity Matrix

| Feature | Android | Web | Status |
| :--- | :--- | :--- | :--- |
| **Currency Storage** | DataStore (Impl) | localStorage (Impl) | **Parity** |
| **Settings UI** | Native Screen (Impl) | Settings Overlay (Impl) | **Parity** |
| **Dashboard Balance** | Dynamic (Impl) | Dynamic (Impl) | **Parity** |
| **Mobile Header** | Scan/Import/Menu | Scan/Import/Menu | **Parity** |
| **Import Slip UI** | Native (`SlipImportScreen`) | Mock Overlay (Impl) | **Parity (Mock)** |
