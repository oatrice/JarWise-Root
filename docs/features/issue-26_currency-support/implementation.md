# Currency Support Implementation Plan

This document outlines the comprehensive plan for implementing multi-currency support in JarWise, covering both Android and Web platforms.

## 1. Goal
Enable users to view their transactions and jar balances in their preferred currency (THB, USD, EUR, JPY). The selection should persist across sessions.

## 2. Architecture

### Android
*   **Data Layer**:
    *   `UserPreferencesRepository`: Stores the selected currency code (String) using DataStore.
    *   `CurrencyRepository`: abstraction layer for accessing/updating currency.
*   **ViewModel**:
    *   `MainViewModel`: Exposes `selectedCurrency` StateFlow and `formattedTotalBalance`.
    *   It combines `transactions` and `selectedCurrency` to emit formatted values.
*   **UI Layer**:
    *   `TransactionDisplayUtils`: Helper object to format Double amounts into currency strings (e.g., "฿100.00", "$100.00").
    *   **Components**: `DashboardScreen`, `TransactionCard`, `JarCard`, `SettingsScreen`.

### Web (Planned)
*   **State Management**: `CurrencyContext` or Global Store (Zustand/Redux).
*   **Storage**: `localStorage` to persist "settings.currency".
*   **UI**: `Intl.NumberFormat` for formatting.

---

## 3. Implementation Phases

### Phase 1: Data & formatting (Completed)
- [x] **DataStore Setup**: Implemented `UserPreferencesRepository` to save "currency_code".
- [x] **Repository Layer**: Created `CurrencyRepository` to mediate data access.
- [x] **Utility**: Implemented `TransactionDisplayUtils.formatCurrency(amount, code)`.
- [x] **Tests**: Unit tests for formatting logic properties.

### Phase 2: Core UI Integration (Completed)
- [x] **Settings Screen**: Added UI to select currency (Dropdown/List).
- [x] **Dashboard State**: `MainViewModel` now emits `selectedCurrency`.
- [x] **Transaction List**: `TransactionCard` updated to accept `currencyCode`.
- [x] **Total Balance**: Dashboard header now displays dynamic currency.

### Phase 3: Scope Expansion (In Progress)
- [ ] **JarCard**: Update `JarCard.kt` to accept `currencyCode`.
- [ ] **Summary/Cards**: Verify any other cards showing amounts (like Monthly Limit or Savings Goal) use the formatter.

### Phase 4: Web Parity (Planned)
- [ ] **Settings UI**: Add Settings page or modal on Web.
- [ ] **State**: Implement currency selection logic in React state.
- [ ] **Components**: Update `TransactionList`, `Dashboard` header to use dynamic formatting.

## 4. Feature Parity Matrix

| Feature | Android | Web | Status |
| :--- | :--- | :--- | :--- |
| **Currency Storage** | DataStore (Impl) | TBD | Android Done |
| **Settings UI** | Native Screen (Impl) | Missing | Gap |
| **Dashboard Balance** | Dynamic (Impl) | Static ($) | Gap |
| **Transaction List** | Dynamic (Impl) | Static ($) | Gap |
| **Jar Cards** | Static ($) (Fixing) | Static ($) | Gap |
| **Formatting Logic** | `TransactionDisplayUtils` | `Intl` (Planned) | - |
