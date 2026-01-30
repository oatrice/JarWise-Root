## Goals
Enhance the existing "Add Transaction" feature to support realistic usage scenarios, prioritizing Web Mock UI first.

## Requirements
- [ ] **DateTime Picker**: User must be able to specify the date and time of the transaction (default to current).
- [ ] **Separation of Concerns**: Separate "Source" (Wallet/Account) from "Category" (Jar).
  - **Wallet**: Where the money comes from (e.g., Cash, Bank, Credit Card).
  - **Jar**: Which 6 Jars bucket this expense belongs to.

## Platforms
### 🌐 Web (Phase 1: Mock UI Priority)
- [ ] **Status**: 🚀 Priority
- [ ] **Objective**: focus on **UI/UX and Visuals**.
- [ ] Add **Date Picker** UI.
- [ ] Add **Wallet Type Selector** UI.
- [ ] Logic can be mocked/localStorage for now.

### 🤖 Android (Phase 2: Full Integration)
- [ ] **Status**: ⏳ Planned
- [ ] **Objective**: Full functional implementation.
- [ ] Add Native Date/Time Dialogs.
- [ ] Implement robust Wallet selection and Room database integration.
