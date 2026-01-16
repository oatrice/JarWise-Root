# 📦 Release Strategy & Versioning Policy

To manage the complexity of a multi-platform monorepo, we distinguish between **Marketing Releases** (Milestones) and **Platform Versions** (Technical).

## 1. Marketing Releases (The "JarWise Version")

This is the public-facing version number used in marketing announcements, blog posts, and the main `CHANGELOG.md`. It represents a set of features available across all supported platforms.

*   **Format**: `Year.Quarter.Release` (e.g., `2026.Q1.0`, `2026.Q1.1`)
*   **Purpose**: Communicates value to the user. "JarWise 2026.Q1 brings Dark Mode!"

### Current Milestone: `2026.Q1.0 (Foundation)`
*   **Target Scope**:
    *   Design System (Neon) live on Web & Android.
    *   6 Jars Dashboard View.
    *   Basic Transaction Feed.
*   **Deadline**: Feb 28, 2026.

## 2. Platform Versions (Semantic Versioning)

Each platform moves at its own pace to fix bugs and refactor code. These revisions follow [SemVer](https://semver.org/).

*   **Web**: `v0.2.x`
*   **Android**: `v0.1.x`
*   **Mobile (Flutter)**: `v0.0.x`

**Rules:**
1.  **Independent Patching**: Android can release `v0.1.5` to fix a crash without waiting for Web.
2.  **Sync on Major**: When a *Marketing Release* happens (e.g., `2026.Q1`), all platforms should ideally bump their minor/major version to signify a jump in shared capabilities (e.g., all go to `v1.0.0` or `v0.2.0`).

## 3. Release Process

### Step A: Individual Platform Readiness
Each Squad (Web/Android) works to complete the required features in their capability matrix.
- Web finishes `CORE-01`.
- Android finishes `CORE-01`.

### Step B: The "Train" Departure (Release Cut)
When the Marketing Release date arrives:
1.  **Freeze**: Code freeze for all platforms.
2.  **Verify Parity**: Check `FEATURES.md`. If Android implementation of `CORE-01` is missing, the feature is dropped from the Release Announcement (or the Release is delayed).
3.  **Tagging**:
    - Root: Tag `2026.Q1.0`
    - Web: Tag `v0.2.0`
    - Android: Tag `v0.2.0`
4.  **Announce**: Update Root `CHANGELOG.md`.

## 4. Hotfixes vs Features

| Type | Action |
| :--- | :--- |
| **Crash Fix** | Release immediately on that platform. Increment PATCH version. |
| **New UI/Feature** | Must align with Design System. Add to `FEATURES.md`. Wait for next Milestone Release (if large) or sync with other squads (if small). |
