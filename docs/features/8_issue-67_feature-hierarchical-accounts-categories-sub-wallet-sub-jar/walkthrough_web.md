# 🧪 Walkthrough (Web): Hierarchical Jars Verification

## 🎯 Goal
Verify that updating the `Allocation` schema (adding `userId`, `parentId`, `level`) does not break the existing "Manage Jars" UI on Web and adds new hierarchical capabilities.

## 🛠️ Implementation Summary (Phase 4)

### 1. Schema & Mock Data
- Updated `generatedMockData.ts` to include hierarchy fields (`parentId`, `level`).
- Updated `sync_mock_data.js` to support correct type generation (Fixed Double/Integer mismatch for Kotlin sync).

### 2. UI Updates (`ManageJars.tsx`)
- **Tree View**: Implemented recursive rendering with connector lines.
- **Add Category**: Added support for creating sub-categories.
- **Recursive Delete**: Added modal warning/logic for deleting parents.

## ✅ Verification Results

### 1. Interaction Logic
- **Test Flow**:
    1. Click "Add New Jar" -> Created "New Jar".
    2. Click "+ Add Category" (x2) -> Created nested items.
    3. Rename Category -> Verified.
    4. Delete Parent -> Verified recursive delete.
- **Result**: ✅ PASSED.

### 2. Android Sync Verification
- Verified that `npm run sync:mock` generates correct Kotlin data types (`100.0` instead of `100`) to prevent Android build errors.
- **Result**: ✅ PASSED.

## 📸 Screenshots
*(See assets folder for UI screenshots captured during Phase 4)*
