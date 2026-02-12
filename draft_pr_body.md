# 📋 Monorepo Update Summary
This pull request introduces a major new feature: multi-select filtering for reports across multiple platforms. Users can now refine report and chart data by selecting specific categories (Jars) and accounts (Wallets). This change involves coordinated updates to the backend API, web frontend, and Android application to provide a consistent user experience.

## ✅ Checklist
- [x] 🏗️ I have moved the related issue to "In Progress" on the Kanban board

## 🎯 Type

- [ ] 📦 Monorepo Structure
- [x] 📄 Documentation (Root)
- [ ] 🔄 Workflow/CI Update
- [x] 🚀 Release Management
- [ ] 💥 Breaking change

## 🔗 Affected Platforms

- [x] Web
- [x] Android
- [ ] iOS
- [ ] Mobile (Flutter)

## 📝 Detailed Changes

This PR implements the functionality outlined in issue #68, enabling powerful and granular filtering on all reporting screens.

**Key Features & Implementation Details:**

*   **Filter Panel UI**: A new filter panel has been added, allowing users to view and select from a list of their categories and accounts.
*   **Multi-Select Checkboxes**: Users can check/uncheck multiple items to include in the report. The UI includes "Apply" and "Clear All" actions for ease of use.
*   **Real-time Updates**: Once filters are applied, the report data and associated charts dynamically update to reflect the new selection.
*   **Backend Support**: The transaction query endpoints on the backend have been enhanced to accept arrays of `category_ids` and `account_ids` to perform the filtering.
*   **Android Implementation**: The Android filter screen was built using Jetpack Compose, with a dedicated `ReportFilterViewModel` to manage state, handle user interactions, and fetch data from repositories. Unit tests for the ViewModel have been included to ensure logic correctness.
*   **Documentation**: The project roadmap, changelog, and feature lists have been updated to reflect the completion of this feature. Manual verification steps have also been documented.

## 📸 Screenshots (if applicable)

Here is a preview of the new filter screen on Android:

<img src="https://i.imgur.com/example-screenshot.png" width="400" alt="A screenshot of the new filter screen showing a list of categories and accounts with checkboxes next to them. An 'Apply' button is visible at the bottom." />

*(Note: Please replace with actual screenshot before merging)*

## 🧪 Testing
- [x] Changes verified locally
- [x] Documentation reviewed for accuracy

Unit tests for the Android ViewModel have been added to cover selection, clearing, and state update logic. Manual end-to-end testing was performed on both web and Android platforms to ensure the filter correctly applies to transaction queries and the UI updates as expected.

## 🚀 Migration/Deployment

- [ ] Environment variables updated
- [ ] Global Dependencies installed

No migration or special deployment steps are required for this feature.

## 🔗 Related Issues

- Resolves https://github.com/oatrice/JarWise-Root/issues/68

**Breaking Changes**: No
**Migration Required**: No