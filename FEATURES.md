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
| `CORE-01` | **6 Jars Summary** | ✅ Live | ⏳ Pending | 🖌️ Mock/UI | ⏳ Pending | Web is reference. Flutter repo is placeholder. |
| `CORE-02` | **Transaction Feed** | ✅ Live | ⏳ Pending | 🖌️ Mock/UI | ⏳ Pending | Android uses GeneratedMockData. |
| `CORE-03` | **Add Transaction** | ✅ Live (Basic) | ⏳ Pending | ✅ Live (Basic) | ⏳ Pending | Enhancing for DateTime & Wallet. |
| `CORE-04` | **Manage Jars** | 🖌️ Mock/UI | ⏳ Pending | ✅ Live | ⏳ Pending | Edit percentages, rename jars. |
| `CORE-05` | **Transaction History** | ✅ Live | ⏳ Pending | 🖌️ Mock/UI | ⏳ Pending | Dedicated history page with grouping. |

## 🎨 Design System

| ID | Feature Name | 🌐 Web | 📱 Mobile (Flutter) | 🤖 Android (Native) | 🍎 iOS | Notes |
| :--- | :--- | :---: | :---: | :---: | :---: | :--- |
| `DS-01` | **Color Tokens** | ✅ Live | ⏳ Pending | ✅ Live | ⏳ Pending | Synced via `shared-spec/`. |
| `DS-02` | **Typography** | ✅ Live | ⏳ Pending | ✅ Live | ⏳ Pending | Custom fonts (Inter/Kanit). |
| `DS-03` | **Iconography** | ✅ Live | ⏳ Pending | ✅ Live | ⏳ Pending | Material Icons on Android. |
| `DS-04` | **Dark Mode** | ✅ Live | ⏳ Pending | ✅ Live | ⏳ Pending | Dark theme only. |

## 🤖 Native Integrations

| ID | Feature Name | 🌐 Web | 📱 Mobile (Flutter) | 🤖 Android (Native) | 🍎 iOS | Notes |
| :--- | :--- | :---: | :---: | :---: | :---: | :--- |
| `NAT-01` | **SMS Reader** | 🚫 N/A | 🚫 N/A | ⏳ Pending | 🚫 N/A | Android specific automation. |
| `NAT-02` | **Home Widget** | 🚫 N/A | ⏳ Pending | ⏳ Pending | ⏳ Pending | |
| `NAT-03` | **Push Notifications** | ⏳ Pending | ⏳ Pending | ⏳ Pending | ⏳ Pending | |

## 🧪 Testing & CI

| ID | Feature Name | 🌐 Web | 📱 Mobile (Flutter) | 🤖 Android (Native) | 🍎 iOS | Notes |
| :--- | :--- | :---: | :---: | :---: | :---: | :--- |
| `CI-01` | **Unit Tests** | ✅ Live | ⏳ Pending | ✅ Live | ⏳ Pending | Vitest (Web), JUnit (Android). |
| `CI-02` | **CI Workflow** | ✅ Live | ⏳ Pending | ✅ Live | ⏳ Pending | Lint → Test → Build. |
| `CI-03` | **Auto-Tag** | ✅ Live | ⏳ Pending | ✅ Live | ⏳ Pending | Version-based tagging. |

---

## 📈 Platform Summary

| Platform | Status | Codebase | Notes |
| :--- | :---: | :--- | :--- |
| 🌐 **Web** | ✅ Active | React + Vite + TypeScript | Reference implementation |
| 🤖 **Android** | ✅ Active | Jetpack Compose + Kotlin | Mock data, CI ready |
| 📱 **Mobile (Flutter)** | ⏳ Placeholder | Dart + Flutter | Only README exists |
| 🍎 **iOS** | ⏳ Placeholder | SwiftUI | Only README exists |

---

## 🔄 Release Alignment

**Current Milestone:** `v0.4.0 (Mock Data & Currency)`

- **Goal**: Enhanced mock data sync and currency support.
- **Status**: ✅ Achieved.

**Next Milestone:** `v0.5.0 (Sub-Transaction Feature)`

- **Goal**: Enable recording sub-items within a single slip/transaction.
- **Status**: 🚧 Planning
