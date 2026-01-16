---
name: create-feature
description: Create a new feature with Issue, branches across platforms, and move to In Progress
---

# Create Feature Skill

This skill automates feature creation across the JarWise monorepo.

## Usage

When user says:
- "create feature [name]"
- "สร้าง feature [name]"
- "new feature for [description]"

## Workflow

### Step 1: Gather Requirements
Ask user for:
1. **Feature Name**: Short description (e.g., "Manage Jars")
2. **Platforms**: Which platforms? (Web, Android, iOS, Mobile)
3. **Objective**: What does this feature do?
4. **Specifications**: Checkbox list of requirements

### Step 2: Create Issue in Root Repo
Create issue in `JarWise-Root` with template:

```markdown
## 🎯 Objective
[Description of what this feature does]

## 📝 Specifications
- [ ] Spec 1
- [ ] Spec 2
- [ ] Spec 3

## 🔗 References
- Feature ID: `CORE-XX` (See FEATURES.md)
- Design Reference: [link or description]

## 🏗️ Implementation Guidelines
- **Web:** [React/Vite specific notes]
- **Android:** [Compose specific notes]
```

```bash
gh issue create --title "[Web | Android] <Feature Name>" --body-file ISSUE_BODY.md --project "JarWise Kanban"
```

### Step 3: Move Issue to In Progress
```bash
./scripts/move_issue_to_inprogress.sh <issue_url>
```

### Step 4: Create Branches in Platform Repos
For each platform specified:

```bash
# Web
cd Web
git checkout main && git pull
git checkout -b feat/<issue>-<short-name>
git push -u origin feat/<issue>-<short-name>

# Android
cd Android
git checkout main && git pull
git checkout -b feat/<issue>-<short-name>
git push -u origin feat/<issue>-<short-name>
```

### Step 5: Scaffold Initial Files (Optional)
Based on feature type, create:
- **Web**: New page in `src/pages/`
- **Android**: New screen in `ui/`

### Step 6: Report Summary
Provide summary to user:
```
✅ Feature Created Successfully!

Issue: oatrice/JarWise-Root#XX
Status: In Progress

Branches Created:
- Web: feat/XX-feature-name
- Android: feat/XX-feature-name

Next Steps:
1. Start implementation on each platform
2. Create PRs when ready
```

## Expected Result
- Issue created in Root repo
- Issue moved to "In Progress" on Kanban
- Branches created in specified platform repos
- Ready to start development
