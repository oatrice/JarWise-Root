# 🏰 JarWise Project Overview

Welcome to the **JarWise** project landing page!

JarWise is a comprehensive personal finance management system based on the **6
Jars money management method** by T. Harv Eker. It is built as a multi-platform
solution with distinct specialized squads.

## 🚀 Repositories & Squads

### [🌐 JarWise Web (Frontend & Prototype)](https://github.com/oatrice/JarWise-Web)

* **Role**: UI/UX Playground, Design System Owner, Web Dashboard.
* **Tech Stack**: React, Vite, Tailwind CSS v4, Framer Motion.
* **Key Responsibilities**:
  * Developing the Core Design System (Neon Theme).
  * Prototyping new features and logic.
  * Providing the main user dashboard.

### [📱 JarWise Mobile (Cross-Platform App)](https://github.com/oatrice/JarWise-Flutter)

* **Role**: Main End-User Application.
* **Tech Stack**: Flutter.
* **Key Responsibilities**:
  * Delivering the iOS & Android application.
  * Implementing features defined by the Web squad.

### [🤖 JarWise Android (Native Integration)](https://github.com/oatrice/JarWise-Android)

* **Role**: Deep System Integrations.
* **Tech Stack**: Kotlin, Jetpack Compose.
* **Key Responsibilities**:
  * SMS reading automation.
  * Native OS widgets and background services.
  * Specific Android platform optimizations.

### [🍎 JarWise iOS (Native Integration)](https://github.com/oatrice/JarWise-iOS)

* **Role**: Native iOS Experience.
* **Tech Stack**: Swift, SwiftUI.
* **Key Responsibilities**:
  * Siri Shortcuts.
  * iOS Widgets & App Clips.

---

## 🎨 Design System & Tokens

We use a **Unified Design Token System** to ensure consistency across Web and
Mobile.

* **Source of Truth**: `tokens/colors.json`
* **Sync Script**: `scripts/sync_tokens.js`

**How to update colors:**

1. Edit `tokens/colors.json`.
2. Run `node scripts/sync_tokens.js` in the root directory.
3. This will automatically generate:
   * `Web/tailwind.theme.js` for Tailwind CSS.
   * `Android/app/src/main/java/com/oatrice/jarwise/ui/theme/Color.kt` for
     Jetpack Compose.

## 🛠 Development Strategy

1. **Web First**: We develop and refine UI/UX on the Web platform first.
2. **Native One-to-One**: Once finalized, the design is ported to Android/iOS,
   ensuring a 1:1 match using our shared tokens and consistent component
   structure.

---

## 📚 Project Documentation

* **Architecture**: See [Architecture Overview](.agent/rules/SYSTEM_PROMPT.md)
* **Changelog**: [Global Changelog](CHANGELOG.md)
* **Project Board**: [JarWise Kanban](https://github.com/users/oatrice/projects/7)
* **Implementation Specs**: [Notes for Mobile/iOS Squads](IMPLEMENTATION_NOTES.md)

## 🤝 Contributing

Each squad manages its own repository. Please refer to the `README.md` within each
specific platform's repository for setup and contribution guidelines.
