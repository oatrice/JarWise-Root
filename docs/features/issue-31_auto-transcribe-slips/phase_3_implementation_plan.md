# Implementation Plan - Phase 3: UI Refinements

**Goal**: Enhance the user experience in the `SlipEditDialog` by allowing image zooming, jar selection, and date editing.

## Proposed Changes
### [MODIFY] SlipImportScreen.kt
- **Pinch Zoom**:
    - Apply `Modifier.graphicsLayer` and `detectTransformGestures` to the slip preview image.
    - Track `scale` and `offset` states.
- **Jar Selection**:
    - Use `JARS_METADATA` from `Constants.kt`.
    - Implement a `ExposedDropdownMenu` or `DropdownMenu` to select a target Jar.
    - Default to "Necessities" or the first jar.
- **Editable Date**:
    - Add `DatePickerDialog` (Material3).
    - Allow clicking the Date text field to open the picker.
    - Format selected date for display and storage.
- **Update Callbacks**:
    - Update `onConfirm` to return `jarId` and proper `Date`.

### [MODIFY] MainActivity.kt
- Update `onConfirmSlip` to accept `jarId` and pass it to `saveTransaction`.

## Verification Plan - Phase 3
### Manual Verification
- [x] **Zoom**: Open a slip, try pinching. Image should zoom and pan.
- [x] **Jar**: Click Dropdown, select "Play". Confirm transaction is saved with "Play" jar (check logs or DB).
- [x] **Date**: Click Date. Change date in picker. Confirm transaction saved with new date.
