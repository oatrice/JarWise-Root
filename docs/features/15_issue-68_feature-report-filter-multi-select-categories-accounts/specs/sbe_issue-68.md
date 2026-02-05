# SBE: Transaction History Filtering by Jars and Wallets

> 📅 Updated: 2026-02-05
> 🔗 Issue: https://github.com/oatrice/JarWise-Root/issues/68

---

## Feature: Transaction History Filtering

Users can filter Transaction History by selecting multiple Jars (Categories) and Wallets (Accounts). Filters are applied when the user taps **Apply**, and cleared via **Clear**. An active indicator appears on the filter icon when filters are applied.

### Scenario 1: Filter by Jar + Wallet

**Given** the user is viewing Transaction History
**And** the list contains these transactions:

| ID | Jar | Wallet | Amount |
|----|-----|--------|--------|
| 1  | necessities | wallet-cash | 50 |
| 2  | play | wallet-cash | 5 |
| 3  | play | wallet-bank | 20 |
| 4  | education | wallet-bank | 40 |

**When** the user selects:
- Jars: `necessities`, `play`
- Wallets: `wallet-cash`

**And** taps **Apply**

**Then** the list shows only transactions `1` and `2`
**And** the transaction count updates to `2`
**And** the filter indicator is active

---

### Scenario 2: Clear Filters

**Given** filters are active
**When** the user taps **Clear** and **Apply**
**Then** the full list is shown
**And** the filter indicator turns off

---

### Scenario 3: No Matches Found

**Given** the user selects a jar/wallet combination with no results
**When** the user taps **Apply**
**Then** the empty state message is shown
**And** the transaction count is `0`
