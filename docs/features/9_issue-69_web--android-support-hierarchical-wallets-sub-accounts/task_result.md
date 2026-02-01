# Task: Support Hierarchical Wallets (Sub-accounts) #69

## Documentation Consolidation
- [x] List contents of feature folders `8-2` and `9` <!-- id: 0 -->
- [x] Move `implementation_plan.md` from `8-2` to `9` folder <!-- id: 1 -->
- [x] Update `implementation_plan.md` to reference local `spec.md` and reconcile any content differences <!-- id: 2 -->
- [x] Remove redundant `8-2` folder if appropriate <!-- id: 3 -->
- [x] Merge `sbe_issue-69.md` into `spec.md` (Edge Case Scenario) and delete `sbe_issue-69.md` <!-- id: 9 -->
- [x] Convert `plan.md` into new issue draft `draft_issue_phase_3_backend.md` and delete `plan.md` <!-- id: 10 -->
- [x] Create GitHub Issue for Phase 3 (#70) and link documents <!-- id: 11 -->

## Implementation (Phase 1: Web Mock UI)
- [ ] Update `Wallet` type in `generatedMockData.ts` (add `parentId`, `level`) <!-- id: 4 -->
- [ ] Seed hierarchical mock data <!-- id: 5 -->
- [ ] Implement Visual Tree in `ManageWallets.tsx` <!-- id: 6 -->
- [x] Implement robust hierarchy logic (Max 3 levels, No Circular Loops) in `ManageWallets.tsx` <!-- id: 12 -->
- [x] Fix Parent Selection (Allow sub-wallets) <!-- id: 13 -->
- [x] Implement Recursive Level Update <!-- id: 14 -->
- [x] Refactor Add Wallet Modal (Remove DOM manipulation) <!-- id: 15 -->
- [ ] Implement Parent Selection in Add/Edit/Delete Modals <!-- id: 7 -->
- [/] Verify Web UI (See walkthrough.md) <!-- id: 8 -->

## Implementation (Phase 2: Android)
- [x] Add `Wallet` data class to `Models.kt` <!-- id: 16 -->
- [x] Seed `wallets` mock data in `GeneratedMockData.kt` <!-- id: 17 -->
- [x] Create `ManageWalletsViewModel` with Hierarchy Logic <!-- id: 18 -->
- [x] Create `WalletTreeItem` Composable <!-- id: 19 -->
- [x] Implement `ManageWalletsScreen` <!-- id: 20 -->
- [x] Implement Add/Edit Wallet with Parent Validation <!-- id: 21 -->
- [x] Unit Test `ManageWalletsViewModel` (Re-parenting, Circular Check) <!-- id: 23 -->
- [x] Verify Android UI (Fixed Add Wallet Level Bug) <!-- id: 22 -->

### Phase 2.5: Android Visual Refinement (Hybrid Design)
- [x] Implement Custom Canvas Drawing for Hierarchy Connection Lines (SKIPPED) <!-- id: 24 -->
- [x] Update Wallet Card Design to match Web (Glassmorphism, Badges) (SKIPPED) <!-- id: 25 -->

### Implementation (Phase 3: Android Database Integration - Local Persistence)
- [x] Convert `Wallet` to Room `@Entity` <!-- id: 26 -->
- [x] Create `WalletDao` (Insert, Update, Delete with Hierarchy) <!-- id: 27 -->
- [x] Implement `WalletRepository` <!-- id: 28 -->
- [x] Update `ManageWalletsViewModel` to use Repository instead of Mock Data <!-- id: 29 -->
- [x] Create Database Migration (Ver 4 -> 5) <!-- id: 30 -->
- [x] Verify Build and Compilation (Passed) <!-- id: 31 -->
- [x] Address User Feedback: Default Wallets Initialization <!-- id: 32 -->
- [x] Address User Feedback: Safe Delete Confirmation Dialog <!-- id: 33 -->

## ⏭️ Next Steps
- Go to [Feature: Transaction Linking (Issue #71)](../10_issue-71_transaction_linking/spec.md) for enabling transfers between wallets.
