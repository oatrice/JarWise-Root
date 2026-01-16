---
description: Guidelines for creating and updating Pull Requests
---

# Pull Request Guidelines

## Screenshot Requirements

When adding screenshots to Pull Requests, follow these rules:

### Image Width
- **Always use `width="400"`** for screenshots in PR body
- Use HTML `<img>` tag instead of Markdown `![]()` for width control

### Format Example
```html
<img src="https://raw.githubusercontent.com/oatrice/JarWise-Web/branch-name/screenshots/example.png" width="400" />
```

### Screenshot Naming Convention
- Web: `web_<feature>_<view>.png` (e.g., `web_add_transaction_mobile.png`)
- Android: `android_<feature>.png` (e.g., `android_add_transaction.png`)

### Screenshot Storage
- Store screenshots in `screenshots/` folder within the respective repo
- Commit screenshots before updating PR body
- Reference using raw GitHub URL with branch name

## Linking PRs to Issues (Development Sidebar)

**Goal:** Make PRs appear in the Issue's **"Development"** section on GitHub sidebar.

When done correctly, the Issue page will show:
```
Development
├── oatrice/JarWise-Web#6
└── oatrice/JarWise-Android#7
```

### How to Link

#### Step 1: In PR Body - Use Keywords with Full Reference
Since Issues are in `JarWise-Root` and PRs are in platform repos, use **full repo reference**:

```markdown
# 🔗 Related Issues
- Resolves oatrice/JarWise-Root#16
```

#### Supported Keywords
- `Closes oatrice/JarWise-Root#<issue>` - Closes issue when PR is merged
- `Fixes oatrice/JarWise-Root#<issue>` - Same as Closes
- `Resolves oatrice/JarWise-Root#<issue>` - Same as Closes

#### Step 2: In Issue Body - Add Related PRs
Also update the Issue body with PR references for easy navigation:

```markdown
## 🔗 References
### Related PRs:
- **Web:** oatrice/JarWise-Web#6
- **Android:** oatrice/JarWise-Android#7
```


## PR Template Checklist

Before submitting PR, ensure:
1. [ ] All screenshots have `width="400"`
2. [ ] Screenshots are committed and pushed
3. [ ] PR body follows the repo's template
4. [ ] Related issues linked with `Resolves oatrice/JarWise-Root#<issue>`
5. [ ] Issue body updated with PR references

## Branch Naming
- Features: `feat/<issue-number>-<short-description>`
- Fixes: `fix/<issue-number>-<short-description>`
- Docs: `docs/<description>`
