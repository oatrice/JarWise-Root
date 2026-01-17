---
name: create-pr
description: Create or update a Pull Request with proper template, screenshots, and issue linking
---

# Create PR Skill

This skill automates PR creation/update with JarWise standards.

## Usage

When user says:
- "create pr" / "สร้าง pr"
- "open pr for [repo]"
- "update pr with screenshots"

## Workflow

### Step 1: Identify Target Repo
Determine which repo the user is working with:
- **Root**: `JarWise-Root` (docs, workflows, monorepo config)
- **Web**: `JarWise-Web` (React/Vite)
- **Android**: `JarWise-Android` (Jetpack Compose)

### Step 2: Capture Screenshots (if UI changes)
1. For **Web**: Use browser_subagent to capture mobile (375x812) and desktop (1440x900) views
2. For **Android**: Use `adb shell screencap` to capture emulator screen
3. Save to `screenshots/` folder in the repo
4. Commit and push screenshots before updating PR body

### Step 3: Create PR Body
Follow the repo's PR template. Key requirements:
- **Screenshot width**: Always use `width="400"` with `<img>` tag
- **Issue linking**: Use `Resolves oatrice/JarWise-Root#<issue>` for auto-linking

Example screenshot format:
```html
<img src="https://raw.githubusercontent.com/oatrice/JarWise-Web/branch/screenshots/example.png" width="400" />
```

### Step 4: Create/Update PR
```bash
# Create new PR
gh pr create --title "<type>: <description>" --body-file PR_BODY.md --base main

# Update existing PR
gh pr edit <number> --body-file PR_BODY.md
```

### Step 5: Update Issue Body
Add Related PRs to the Issue's References section:
```markdown
### Related PRs:
- **Web:** oatrice/JarWise-Web#<pr>
- **Android:** oatrice/JarWise-Android#<pr>
```

### Step 6: Cleanup
```bash
rm -f PR_BODY.md
```
