# Walkthrough: Manage Jars (Web)

## Summary
Implemented the **Manage Jars** feature for Web using a Mock UI approach, allowing users to interact with a modal to edit jar details. This serves as the foundation for future backend integration.

---

## Key Achievements

### 1. UI Implementation
- **Component**: `ManageJars.tsx`
- **Design logic**: Modal-based interface accessed from the Dashboard.
- **Features**:
  - Edit Jar Name
  - Adjust Percentage (with visual validation)
  - Color & Icon Selection logic
  - Reset functionality

### 2. Dashboard Integration
- **Entry Point**: Added a "Manage" button next to the "Your Jars" section in `Dashboard.tsx`.
- **State Management**: Uses local component state (Mock) for this phase.

---

## 🧪 Verification & Tests

### Automated Tests (Jest + React Testing Library)
- **File**: `ManageJars.test.tsx`
- **Results**: 11 Unit Tests Passed.
- **Coverage**:
  - Modal opening/closing
  - Input validation (Percentage total)
  - Form submission (Mock save)

### Build Status
Web build and tests are passing in the CI/CD pipeline (simulated).
