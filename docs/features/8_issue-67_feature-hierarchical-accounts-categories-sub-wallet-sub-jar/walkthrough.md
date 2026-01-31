# 🧪 Walkthrough: Web Mock UI Verification (Hierarchical Jars)

## 🎯 Goal
Verify that updating the `Allocation` schema (adding `userId`, `parentId`, `level`) does not break the existing "Manage Jars" UI.

## 🛠️ Changes
- **File**: `Web/src/utils/generatedMockData.ts`
- **Updates**:
    - Renamed `Jar` type to `Allocation`.
    - Added `userId` (for security).
    - Added `parentId` (nullable) for hierarchy.
    - Added `level` (0=Jar, 1=Category).
    - Updated mock data `jars` to match new schema.

## ✅ Verification Steps

### 1. Unit Tests
ran `npm test -- ManageJars`:
```
✓ src/__tests__/ManageJars.test.tsx (11 tests)
```
**Result**: PASSED. No logic regression.

### 2. Manual Visual Verification
Accessed `http://localhost:5173/` -> Dashboard -> "Manage Jars".

**Result**: PASSED. UI renders correctly.

![Manage Jars Modal UI](/Users/oatrice/.gemini/antigravity/brain/b3bdca66-7dd8-46d6-aba8-327cf5be59a6/manage_jars_modal_1769850970856.png)

## 📌 Next Steps
- Implement **Tree View UI** in `ManageJars.tsx` to visualize hierarchy.
- Add "Add Sub-jar" functionality.
