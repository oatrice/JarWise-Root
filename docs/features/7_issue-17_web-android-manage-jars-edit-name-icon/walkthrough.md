# Walkthrough: #17 Manage Jars - Web Mock UI

## Summary
Implemented Web Mock UI for managing jar configurations allowing users to edit name, percentage, color, and icon.

---

## Files Created/Modified

| File | Action | Description |
|------|--------|-------------|
| [ManageJars.tsx](file:///Users/oatrice/Software-projects/JarWise/Web/src/pages/ManageJars.tsx) | **NEW** | Full-screen modal for jar management |
| [Dashboard.tsx](file:///Users/oatrice/Software-projects/JarWise/Web/src/pages/Dashboard.tsx) | **MODIFIED** | Added state, import, button |
| [ManageJars.test.tsx](file:///Users/oatrice/Software-projects/JarWise/Web/src/__tests__/ManageJars.test.tsx) | **NEW** | 11 unit tests |

---

## Features Implemented

### ManageJars Component

| Feature | Status | Details |
|---------|--------|---------|
| **Edit Name** | ✅ | Text input, 50 char limit |
| **Edit Percentage** | ✅ | Range slider, 0-100% |
| **Edit Color** | ✅ | 8 color picker |
| **Edit Icon** | ✅ | 8 icon picker |
| **Validation** | ✅ | Total must = 100% |
| **Reset to Default** | ✅ | Confirmation modal |
| **Save** | ✅ | Mock save (console.log) |

---

## Test Results

```
 ✓ src/__tests__/ManageJars.test.tsx (11 tests) 458ms

 Test Files  1 passed (1)
      Tests  11 passed (11)
   Duration  1.51s
```

### Test Coverage
- ✅ Rendering (header, jars, buttons)
- ✅ Validation (100% valid, disabled save)
- ✅ User interactions (expand, reset modal)
- ✅ Edit functionality (name change)
- ✅ Save functionality (onClose)

---

## Manual Verification

| Step | Result |
|------|--------|
| Click "Manage Jars" button | ✅ Modal opens |
| Click jar to expand | ✅ Edit panel shows |
| Edit name | ✅ Updates in real-time |
| Adjust % slider | ✅ Total updates |
| Change color | ✅ Color applied |
| Change icon | ✅ Icon changes |
| Click Reset | ✅ Confirmation shown |
| Click Save | ✅ Modal closes |

---

## Next Steps

- [ ] Android: Full implementation with Room DB
- [ ] Backend: API implementation (#60)
- [ ] Web: Connect to backend when ready
