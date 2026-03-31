# SBE: Change Period on Transaction History

> Issue: [#98](https://github.com/oatrice/JarWise-Root/issues/98)
> Method: Specification by Example
> Status: Implemented

---

## Scenario 1: Default period shows This Month

**Given**
- the user opens `Transaction History`
- the default active period is `This Month`

**When**
- the screen renders for the first time

**Then**
- the summary card shows `This Month`
- only transactions inside the current month are included in the visible list and summary

---

## Scenario 2: User switches to a preset period

**Given**
- the user is on `Transaction History`
- transactions exist both inside and outside the target preset range

**When**
- the user opens `Change Period`
- selects a preset such as `Last 30 Days` or `This Year`

**Then**
- the summary card updates to the selected preset label
- only transactions inside that preset range are shown
- transaction count and total spent match the filtered set

---

## Scenario 3: User prepares a custom range but has not applied it yet

**Given**
- the user is currently viewing an already applied period

**When**
- the user opens the period selector
- chooses `Custom Range`
- enters draft start and end dates
- does not press `Apply Range` yet

**Then**
- the previously applied period remains active on the screen
- the visible transactions and summary do not change yet

---

## Scenario 4: User applies a custom date range

**Given**
- the user opens the period selector
- the entered custom start and end dates are valid

**When**
- the user chooses `Custom Range`
- enters a valid start and end date
- presses `Apply Range`

**Then**
- the active period label changes to `Custom Range`
- only transactions within that inclusive date range are shown
- the summary reflects only that custom window

---

## Scenario 5: User cancels a pending custom range

**Given**
- the user has an applied period already active
- the user has entered different draft custom dates in the picker

**When**
- the user presses `Cancel`

**Then**
- the picker closes
- the previously applied period remains active
- the visible list and summary stay unchanged

---

## Scenario 6: Changing period resets endless pagination

**Given**
- the user has already scrolled far enough to load multiple history batches

**When**
- the user changes the active period

**Then**
- the visible batch resets to the initial page size for the new filtered set
- endless pagination continues to work as the user scrolls again

---

## Scenario 7: No transactions match the selected scope

**Given**
- the user selects a period or filter combination with no matching transactions

**When**
- the filtered list is recomputed

**Then**
- the screen shows a no-match empty state
- no stale transactions from the previous scope remain visible
