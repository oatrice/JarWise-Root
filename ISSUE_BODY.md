# Feature: Support Hierarchical Wallets (Sub-accounts)

## Overview
Enable users to organize their wallets (accounts) in a hierarchical structure, allowing for sub-accounts (e.g., "Bank Account" -> "Savings" | "Checking"). This enhances the flexibility of financial tracking.

## Core Objective
- Implement `parentId` logic for Wallet Allocations.
- Provide a UI for managing this hierarchy.

## Implementation Phases
### Phase 1: Web Mock UI (Priority)
- [ ] Create Mock UI for creating sub-wallets.
- [ ] Visual tree representation of wallets.
- [ ] Drag-and-drop or parent selection support.

### Phase 2: Android Implementation (Future)
- [ ] Update `ManageWalletsViewModel` to support hierarchy.
- [ ] Update UI to display tree structure.

## Technical Details
- **Schema:** Uses existing `Allocation` table (`parentId` field).
- **Type:** `Allocation.type` (implied constraints) or separated UI logic.

## Acceptance Criteria
- [ ] User can create a Wallet under another Wallet.
- [ ] Hierarchy is visually distinct in the management list.
- [ ] Deleting a parent prompt for reassignment (aligned with Jar logic).
