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

### Step 5: Report Summary
Provide summary to user:
```
✅ Feature Created Successfully!

Issue: oatrice/JarWise-Root#XX
Status: In Progress

Branches Created:
- Web: feat/XX-feature-name
- Android: feat/XX-feature-name
```
