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

## PR Template Checklist

Before submitting PR, ensure:
1. [ ] All screenshots have `width="400"`
2. [ ] Screenshots are committed and pushed
3. [ ] PR body follows the repo's template
4. [ ] Related issues are linked with full URL

## Branch Naming
- Features: `feat/<issue-number>-<short-description>`
- Fixes: `fix/<issue-number>-<short-description>`
- Docs: `docs/<description>`
