# Logic Flow: Manage Jars (Web)

## 0. Goal
Implement a UI for users to manage their 6 Jars configuration on the Web platform.

## 1. Components
- **ManageJars.tsx**: The core modal component.
  - **Props**: `isOpen`, `onClose`, `initialConfigs`, `onSave`
  - **State**: `localConfigs` (Editable copy of jar data)

## 2. Integration Strategy
- **Dashboard.tsx**:
  - Host the `ManageJars` modal.
  - Manage `isManageModalOpen` state.
  - Pass current Jar data to the modal.

## 3. Data Flow (Mock Phase)
- **Read**: Load mock data from `GeneratedMockData.ts` (or equivalent).
- **Write**: Log changes to console / Update local state (Persistence via Backend in future Issue #63).

## 4. Validation Rules
- **Total Percentage**: Must equal 100%. Show error if not.
- **Names**: Cannot be empty.

## Status: ✅ Completed (Mock UI)
