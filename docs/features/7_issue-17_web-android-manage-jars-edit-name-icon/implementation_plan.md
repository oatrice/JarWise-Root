# Implementation Plan: #17 Manage Jars (Web Mock UI)

## Overview
Implement Web Mock UI for managing jar configurations - edit name, percentage, color, and icon.

> [!IMPORTANT]
> **Scope**: Web = Mock UI only (no persistence), Android = Full function (separate implementation)

---

## Proposed Changes

### Web Platform

#### [NEW] [ManageJars.tsx](file:///Users/oatrice/Software-projects/JarWise/Web/src/pages/ManageJars.tsx)

Full-screen modal component for managing jar configurations:

| Feature | Implementation |
|---------|----------------|
| **Edit Name** | Text input with 50 char limit |
| **Edit Percentage** | Range slider (0-100%) |
| **Edit Color** | 8 color options with visual picker |
| **Edit Icon** | 8 icon options (Home, Dollar, Gaming, etc.) |
| **Validation** | Total % must = 100% |
| **Reset** | Restore default 6 Jars configuration |
| **Save** | Mock save (console.log), close modal |

---

#### [MODIFY] [Dashboard.tsx](file:///Users/oatrice/Software-projects/JarWise/Web/src/pages/Dashboard.tsx)

- Import `ManageJars` component
- Add `showManageJars` state
- Add "Manage Jars" button in both mobile and desktop views
- Conditional render `ManageJars` when `showManageJars` is true

---

#### [NEW] [ManageJars.test.tsx](file:///Users/oatrice/Software-projects/JarWise/Web/src/__tests__/ManageJars.test.tsx)

Unit tests covering:
- ✅ Rendering (header, 6 jars, buttons)
- ✅ Validation (100% total, green/red indicator)
- ✅ User interactions (expand jar, reset modal)
- ✅ Edit functionality (name change)
- ✅ Save functionality (onClose called)

---

## Verification Plan

### Automated Tests
```bash
cd Web && npm test -- --run ManageJars
```

### Manual Verification
1. Open http://localhost:5173
2. Click "Manage Jars" button
3. Test: expand jar, edit name/%, change color/icon
4. Verify: Total Allocation bar updates
5. Verify: Save disabled when % ≠ 100
6. Verify: Reset restores defaults

---

## Status: ✅ Complete

| Task | Status |
|------|--------|
| ManageJars.tsx | ✅ Done |
| Dashboard.tsx integration | ✅ Done |
| Unit tests (11 tests) | ✅ Passed |
| Manual verification | ✅ Passed |
