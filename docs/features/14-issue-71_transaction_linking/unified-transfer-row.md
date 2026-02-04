# Unified Transfer Row

## Overview
When displaying linked transactions (transfers) in list views (History, Dashboard), show a **single merged row** instead of 2 separate rows (Expense + Income). This provides a cleaner UX and reduces visual clutter.

## Data Model Requirements
Each `Transaction` has:
```kotlin
relatedTransactionId: String? // Points to the linked counterpart
```

When a transfer is created, save **2 transactions**:
1. **Expense** from Source Wallet (`relatedTransactionId` → Income ID)
2. **Income** to Destination Wallet (`relatedTransactionId` → Expense ID)

---

## Display Logic

### 1. Filtering (in ViewModel/Repository)
Before mapping to UI models, filter out the income side:
```kotlin
val visibleTransactions = allTransactions.filter { tx ->
    !(tx.type == TransactionType.INCOME && tx.relatedTransactionId != null)
}
```

### 2. Detecting Transfers
```kotlin
val isTransfer = transaction.relatedTransactionId != null
```

---

## UI Specification

### TransactionListItem Styling

| Element | Normal Transaction | Transfer |
|---------|-------------------|----------|
| **Icon** | Category Icon (e.g., 🍔) | `ArrowRightLeft` icon |
| **Icon BG** | Gray | Blue (Accent) |
| **Title** | Note or Category Name | `[Source Wallet] → [Dest Wallet]` |
| **Subtitle** | Category Name | "Transfer" |
| **Amount Color** | Red (Expense) / Green (Income) | Blue (Neutral) |
| **Amount Prefix** | `-` / `+` | (None) |

### Example
```
┌─────────────────────────────────────────────┐
│ 🔄  Cash → Bank Account                     │
│     Transfer                    ฿10,000.00  │
└─────────────────────────────────────────────┘
```

---

## Implementation Checklist

### Android (Compose)
- [ ] Update `TransactionListItem` composable:
  - Check `isTransfer` flag
  - Conditionally render icon, colors, and title
- [ ] Lookup linked transaction to get destination wallet name
- [ ] Apply filtering in `TransactionViewModel` or `UseCase`

### Web (Reference - Already Implemented)
- [x] `TransactionCard.tsx`: `isTransfer` and `linkedTransaction` props
- [x] `TransactionHistory.tsx`: Filtering and linked tx lookup
- [x] `Dashboard.tsx`: Same logic applied

---

## Reference Files (Web)
- [TransactionCard.tsx](file:///Users/oatrice/Software-projects/JarWise/Web/src/components/TransactionCard.tsx)
- [TransactionHistory.tsx](file:///Users/oatrice/Software-projects/JarWise/Web/src/pages/TransactionHistory.tsx)
- [Dashboard.tsx](file:///Users/oatrice/Software-projects/JarWise/Web/src/pages/Dashboard.tsx)
