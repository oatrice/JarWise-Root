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


## 📸 Pull Request Requirements

Before opening a Pull Request (PR), please ensure:

1.  **Screenshots / Screen Recording:**
    *   For **UI changes**, you **MUST** include screenshots or a screen recording (GIF/Video) showing the change.
    *   Show "Before" and "After" if applicable.
    *   Ensure screenshots verify responsiveness (Mobile vs Desktop) for Web.

2.  **Full Issue URLs:**
    *   In the PR Body, under "Related Issues", use the **Full URL** of the issue, not just the number.
    *   ✅ Correct: `Related to https://github.com/oatrice/JarWise-Web/issues/5`
    *   ✅ Correct: `Related to https://github.com/oatrice/JarWise-Android/issues/5`
    *   ❌ Incorrect: `Related to #5`
    *   This is critical for cross-repository linking (Web/Android linking to Root issues).

## 🧪 Testing

*   **Android:** Run `./gradlew test` and ensure the build passes.
*   **Web:** Run `npm test` and `npm run build`.
*   TDD (Test Driven Development) is encouraged: Red -> Green -> Refactor.
