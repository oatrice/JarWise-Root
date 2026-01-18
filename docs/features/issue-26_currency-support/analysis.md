# Phase 5: Currency Support & Balance Refinement

## 1. Overview
This phase focuses on refining the financial display in the Android application. Currently, the total balance on the Dashboard lacks decimal precision is hardcoded. The goal is to support proper formatting and multi-currency selection.

## 2. Problem Statement
- **Missing Decimals**: The dashboard total balance shows an integer (e.g., `1000`) instead of a formatted currency string (e.g., `1,000.00`).
- **Single Currency**: The app assumes a single currency context without explicit configuration.

## 3. Requirements

### 3.1 Balance Formatting
- [ ] Display Total Balance with 2 decimal places.
- [ ] Use comma separators for thousands.
- [ ] Example: `1,250.50` instead of `1250`.

### 3.2 Multi-Currency Support
- [ ] **Default Currency**: Thai Baht (THB - ฿).
- [ ] **Supported Currencies**:
    - THB (฿)
    - USD ($)
    - EUR (€)
    - JPY (¥)
- [ ] **Configuration**: Add a setting to toggle the active currency.
- [ ] **Implementation**:
    - Create a `UserPreferences` repository (DataStore).
    - Update `DashboardScreen` to observe the selected currency.

## 4. Implementation Plan (Draft)

1.  **Dependency Injection**: Add DataStore for preferences.
2.  **Repo Layer**: `CurrencyRepository`.
3.  **UI Updates**:
    - `DashboardViewModel`: Expose `formattedBalance`.
    - `SettingsScreen`: Add "Currency" dropdown.

## 5. Success Metrics
- Balance displays as `฿XX,XXX.XX` by default.
- Changing currency in settings updates the dashboard symbol immediately.
