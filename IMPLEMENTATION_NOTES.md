# 📋 Implementation Notes for Mobile/iOS Squads

This document tracks specific implementation details, logic behaviors, and
"gotchas" discovered by the Web and Android squads. Use this as a guide when
building features for Flutter or iOS to ensure alignment.

## 🎨 Shared Design System

* **Colors**: Do NOT hardcode colors. Consume `tokens/colors.json`.
  * *Action*: You may need to write a simple parser/generator (similar to
    `scripts/sync_tokens.js`) to convert this JSON into Dart (Flutter) or Swift
    (iOS) files.

## 🧩 UI Components & Logic

### Transaction Card (`TransactionCard`)

* **Icon Tinting Logic**: The Web/Android design involves a specific pattern for
  transaction category icons:
  * **Foreground**: The solid color matching the category (e.g., `Green400`).
  * **Background**: A circle with the *same color* but at **10-15% opacity**.
  * *Implementation*: Ensure your component accepts a single color token and can
    derive the background alpha variant programmatically, or use the specific
    tokens if available.
  * *Reference*: See
    `Android/app/src/main/java/com/oatrice/jarwise/ui/components/TransactionCard.kt`

### Notification Badge

* **Style**: Small red dot (approx 8dp) positioned top-right of the bell icon.
* **Border**: Requires a small 'gap' or border (approx 2dp) matching the header
  background color (Dark/Black) to separate it visually from the icon.

## 💾 Data & Models

### Mock Data Alignment

* **Status**: Web and Android have synchronized mock data.
* **Source**: Use `Android/app/src/main/java/com/oatrice/jarwise/data/MockData.kt`
  or `Web/src/utils/mockData.ts` as the reference for:
  * **Jars**: 6 Specific Jars (Necessities, Play, Education, etc.) with specific
    percentages/amounts.
  * **Transactions**: Spotify, Whole Foods, Starbucks, Apple Store.

## 🐛 Known Issues / Fixes

* *(None yet - Reserved for future bug fix alignments)*
## 🛠️ Build & Development Guidelines

### Android Build Environment
* **Issue**: Direct use of `./gradlew` may fail due to JDK version mismatches (e.g., Java 25 vs Android Gradle Plugin incompatibility).
* **Policy**: ALWAYS use the provided helper scripts in `Android/scripts/` which configure the correct JDK (Java 21 from Android Studio).
* **Commands**:
  * Build: `./Android/scripts/build_android.sh :app:assembleDebug`
  * Test: `./Android/scripts/run_tests.sh` (or `build_android.sh` with test tasks)
