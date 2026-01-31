# 🧪 Walkthrough (Android): Verification & Manual Testing

## 🎯 Goal
Verify that the `Allocation` schema update (v4 -> v5 migration) and Data Seeding are working correctly on Android.

## ✅ Verification Steps

### 1. Automated Tests (Status)
- **DAO Test**: `AllocationDaoTest` ✅ PASSED.
- **Migration Test**: `MigrationTest` ⚠️ Skipped (Environment limitation), reliant on Manual Verification.

### 2. Manual Verification (User Action Required)
Since this requires an Android Device/Emulator, please follow these steps to verify the Schema Migration and Seed Data:

1.  **Fresh Install (Recommended)**:
    - Uninstall the existing app from your device/emulator to trigger a fresh database creation.
    - Run the app from Android Studio (`Shift + F10`).

2.  **Verify Database Schema**:
    - Open **App Inspection** tab in Android Studio (bottom toolbar).
    - Select your device and `com.oatrice.jarwise` process.
    - Go to **Databases Inspector**.
    - Verify that `allocations` table exists.
    - Verify columns: `id`, `userId`, `name`, `parentId`, `level`, `targetPercent`, etc.

3.  **Verify Seed Data**:
    - Double-click the `allocations` table to view data.
    - Confirm **2 rows** exist (migrated/seeded data):
        - **Row 1**: Name="Necessities", Percent=55, Level=0
        - **Row 2**: Name="Financial Freedom", Percent=10, Level=0
    - Note: If migrated from v4, you might see existing data. If fresh install, you should see the 6 default jars if `SEED_CALLBACK` worked.

4.  **Verify DAO Logic (Optional)**:
    - You can observe Logcat filters for `Room` or `SQLite` to see if queries are executing without error.
