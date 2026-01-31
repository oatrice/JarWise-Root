# Analysis: Hierarchical Wallets (Sub-accounts)

| Item | Detail |
| --- | --- |
| **Feature Name** | Support Hierarchical Wallets (Sub-accounts) |
| **Issue URL** | [#69](https://github.com/oatrice/JarWise-Root/issues/69) |
| **Status** | **In Progress** |
| **Parent Feature** | [#67 Hierarchical Accounts](..) |

---

## 1. Problem Statement
Users need to organize their wallets (accounts) logically, for example grouping "Savings" and "Checking" under a main "Bank Account", or "Cash" under "Physical Wallet". The current system is flat, making the wallet list cluttered.

## 2. Requirement Analysis

### 2.1 User Stories
- **US-1:** As a user, I want to create a sub-wallet under a parent wallet (e.g., "Savings" under "K-Bank").
- **US-2:** As a user, I want to see my wallets displayed in a tree structure (indentation) in the Manage Wallets screen.
- **US-3:** As a user, I want to select a parent wallet when creating or editing a wallet.

### 2.2 Scope (Phase 1: Web Mock UI)
- **Create/Edit Modal:** Add a "Parent Wallet" dropdown selector.
- **List View:** Display wallets with indentation or grouping based on `parentId`.
- **Logic:**
    - A wallet cannot be its own parent.
    - Limit nesting to 2 levels (Parent > Child) for simplicity initially, though 3 is acceptable.

## 3. Technical Implementation (Web Mock)

### 3.1 Data Model (Mock)
Modify `generatedMockData.ts` to include `parentId` in `Wallet` type (similar to Jar/Allocation).

```typescript
export type Wallet = {
    id: string;
    name: string;
    balance: number;
    color: string;
    icon: LucideIcon;
    parentId: string | null; // NEW
    level: number;           // NEW (0=Main, 1=Sub)
}
```

### 3.2 UI Components
- **ManageWallets.tsx:** Update to render recursion/tree.
- **AddWalletModal:** Add `Select` component for Parent.

## 4. Verification
- [ ] Create a "Bank" wallet.
- [ ] Create a "Savings" wallet and select "Bank" as parent.
- [ ] Verify "Savings" appears nested under "Bank" in the list.
