# 🎯 Task: Hierarchical Jars & Categories (#67)

## Phase 1: Foundation Planning
- [x] อ่าน Issue #67 เพื่อเข้าใจ requirements
- [x] วิเคราะห์ current schema (Android & Web)
- [x] เขียน Implementation Plan
- [x] User Approval (Implementation Plan saved to docs)
- [x] **New Policy**: Enforce Web Mock UI First

## Phase 2: Web Mock UI (Priority)
- [ ] อัพเดท generatedMockData.ts (Add hierarchy types)
- [ ] Create/Update `ManageJars` component (Web)
- [ ] Implement Tree View UI
- [ ] Implement Add/Delete Jar UI
- [ ] Verify UI with Mock Data

## Phase 3: Schema Migration (Android)
- [/] สร้าง `Allocation` Entity ใหม่
    - [x] Create `Allocation.kt`
    - [x] Create `AllocationDao.kt`
    - [x] Update `AppDatabase` with Migration 4->5
- [ ] เขียน Unit Tests สำหรับ migration
- [ ] เขียน Seed function สำหรับ default 6 jars

## Phase 4: Schema Migration (Web Logic)
- [ ] อัพเดท sync_mock_data.js script
- [ ] เขียน Unit Tests (Web Logic)

## Phase 5: Android UI Implementation
- [ ] อัพเดท ManageJarsScreen (Android)
- [ ] เชื่อมต่อ ViewModel กับ `AllocationDao`

## Phase 6: Verification
- [ ] รัน existing tests
- [ ] Manual testing บน Web
- [ ] Manual testing บน Android
- [ ] สร้าง Walkthrough
