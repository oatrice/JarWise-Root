# 📊 Feature Capability Matrix

This document serves as the **Single Source of Truth** for the implementation status of features across all JarWise platforms.

**Legend:**
- ✅ **Live**: Fully implemented, tested, and production-ready.
- 🚧 **In Progress**: Currently being developed or refactored.
- 🖌️ **Mock/UI Only**: UI is implemented but logic/data is mocked.
- ⏳ **Pending**: Planned but not started.
- 🚫 **N/A**: Not applicable for this platform.

---

## 🟢 Core Experience (Dashboard & Jars)

| ID | Feature Name | 🌐 Web | 📱 Mobile (Flutter) | 🤖 Android (Native) | 🍎 iOS | Notes |
| :--- | :--- | :---: | :---: | :---: | :---: | :--- |
| `CORE-01` | **6 Jars Summary** | ✅ Live | 🚧 Dev | ✅ Live (Mock) | ⏳ Pending | Web is the reference implementation. |
| `CORE-02` | **Transaction Feed** | ✅ Live | 🚧 Dev | ✅ Live (Mock) | ⏳ Pending | Android uses synced MockData. |
| `CORE-03` | **Add Transaction** | ⏳ Pending | ⏳ Pending | ⏳ Pending | ⏳ Pending | |
| `CORE-04` | **Manage Jars** | ⏳ Pending | ⏳ Pending | ⏳ Pending | ⏳ Pending | Edit percentages, rename jars. |

## 🎨 Design System

| ID | Feature Name | 🌐 Web | 📱 Mobile (Flutter) | 🤖 Android (Native) | 🍎 iOS | Notes |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| `DS-01` | **Color Tokens** | ✅ Live | ⏳ Pending | ✅ Live | ⏳ Pending | Synced via `tokens/colors.json`. |
| `DS-02` | **Typography** | ✅ Live | ⏳ Pending | ✅ Live | ⏳ Pending | Custom fonts (Inter/Kanit). |
| `DS-03` | **Iconography** | ✅ Live | ⏳ Pending | ✅ Live | ⏳ Pending | Lucide Icons. |
| `DS-04` | **Dark/Light Mode** | ✅ Live | ⏳ Pending | 🚧 Dev | ⏳ Pending | |

## 🤖 Native Integrations

| ID | Feature Name | 🌐 Web | 📱 Mobile (Flutter) | 🤖 Android (Native) | 🍎 iOS | Notes |
| :--- | :--- | :---: | :---: | :---: | :---: | :--- |
| `NAT-01` | **SMS Reader** | 🚫 N/A | 🚫 N/A | ⏳ Pending | 🚫 N/A | Android specific automation. |
| `NAT-02` | **Home Widget** | 🚫 N/A | ⏳ Pending | ⏳ Pending | ⏳ Pending | |
| `NAT-03` | **Push Notifications**| ⏳ Pending | ⏳ Pending | ⏳ Pending | ⏳ Pending | |

---

## 🔄 Release Alignment

**Current Target Milestone:** `v0.2.0 (Design System Alignment)`

*   **Goal**: Ensure Web and Android Native (Jetpack Compose) look identical using shared tokens.
*   **Status**: Achieved for Dashboard & Transaction Card UI.
