# Contributing to JarWise

Thank you for contributing to JarWise! Please follow these guidelines to ensure a smooth development process.

## 📋 Development Workflow

1.  **Pick an Issue:** Verify that the issue is assigned to you.
2.  **Move to In Progress:** **Before writing any code**, move the issue card on the Project Board (Kanban) to the **"In Progress"** column.
3.  **Branching:** Create a new branch from `main` (or relevant parent branch).
    *   Format: `type/issue-number-short-description`
    *   Example: `feat/5-transaction-history`

4.  **🤖 Automation (For AI Agents):**
    *   When starting a task, the AI Agent **MUST** run the automation script to update the Kanban board status:
    *   Command: `./scripts/move_issue_to_inprogress.sh <issue_full_url>`

## 📱 Android Development Guidelines

### Jetpack Compose Preview
*   Every new UI component (`@Composable`) **MUST** have a corresponding `@Preview` function.
*   Previews should use `showBackground = true` and appropriate background colors (e.g., `0xFF0A0A0A` for Dark Mode).
*   Use `MockData` or `GeneratedMockData` for preview content.


## 📸 Pull Request Requirements

Before opening a Pull Request (PR), please ensure:

### Screenshots
*   For **UI changes**, you **MUST** include screenshots or a screen recording (GIF/Video).
*   **Always use `width="400"`** for screenshots in PR body.
*   Use HTML `<img>` tag for width control:
    ```html
    <img src="https://raw.githubusercontent.com/oatrice/JarWise-Web/branch/screenshots/example.png" width="400" />
    ```
*   Store screenshots in `screenshots/` folder and commit before updating PR.
*   Show "Before" and "After" if applicable.

### Linking PRs to Issues (Development Sidebar)

**Goal:** Make PRs appear in the Issue's **"Development"** section on GitHub sidebar:
```
Development
├── oatrice/JarWise-Web#6
└── oatrice/JarWise-Android#7
```

**Step 1:** In PR Body, use **`Resolves`** keyword with **full repo reference**:
```markdown
# 🔗 Related Issues
- Resolves oatrice/JarWise-Root#16
```
*Supported keywords: `Closes`, `Fixes`, `Resolves` (all auto-close Issue when PR is merged)*

**Step 2:** Update Issue body with Related PRs section:
```markdown
### Related PRs:
- **Web:** oatrice/JarWise-Web#6
- **Android:** oatrice/JarWise-Android#7
```

## 🧪 Testing

*   **Android:** Run `./gradlew test` and ensure the build passes.
*   **Web:** Run `npm test` and `npm run build`.
*   TDD (Test Driven Development) is encouraged: Red -> Green -> Refactor.
