# Implementation Plan - Phase 2: Core Logic (Data Extraction & UI)

**Goal**: Extract metadata (Date, Amount, Bank) from identified slips to prepopulate the transaction form and provide basic UI for review.

## Logic Layer
### [NEW] `data/model/ParsedSlip.kt`
- Data class to hold extracted info:
    - `date: Date?`
    - `amount: Double?`
    - `bankName: String?` (Optional)
    - `rawText: String`

### [NEW] `data/service/SlipParser.kt`
- Input: `VisionText` (from ML Kit) or Raw String.
- Logic:
    - **Amount Extraction**: Regex to find currency patterns (e.g., `1,200.00`, `500.00 THB`).
    - **Date Extraction**: Regex for common Thai/English date formats (e.g., `17 Jan 2026`, `17/01/69`).
    - **Heuristics**: Basic keywords to identify bank source if obvious (e.g., "K-Bank", "SCB").

## Integration
### [MODIFY] `data/service/SlipDetectorServiceImpl.kt`
- Integrate `SlipParser` call after successful detection.
- Return `ParsedSlip` data in the result.

### [MODIFY] `ui/SlipViewModel.kt`
- Expose the parsed data to the UI state.

## Verification Plan - Phase 2

### Automated Tests
- [x] `SlipParserTest`:
    - Test with sample strings containing various amount formats.
    - Test with sample strings containing date formats (Thai/Eng).
    - Test with noise text.

### Manual Verification
1.  **Run Import**: Select a folder with known slips.
2.  **Verify Logs**: Check Logcat to see "Extracted Date: ..., Amount: ..." matches the image.
