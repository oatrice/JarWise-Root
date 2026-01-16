#!/bin/bash

# Specify the Project Name
PROJECT_NAME="JarWise Kanban"

echo "Ensuring 'backlog' label exists..."
gh label create backlog --description "Status: Backlog" --color "dbdbdb" || true

echo "Creating issues in '$PROJECT_NAME' (Column: Default/Backlog)..."

# 1. Web Integration
gh issue create \
  --title "[Web] Integrate Shared Mock Data" \
  --body "# 🎯 Objective
Update the Web project to use the centrally managed \`mockData.json\` via the generator script.

## 📝 Specifications
- [ ] Run \`node scripts/sync_mock_data.js\` to update \`Web/src/utils/generatedMockData.ts\`
- [ ] Refactor \`Web/src/pages/Dashboard.tsx\` to import from \`generatedMockData\`
- [ ] Refactor \`Web/src/components/JarCard.tsx\` to use the new Types
- [ ] Delete manual \`Web/src/utils/mockData.ts\`

## 🔗 References
- Feature ID: \`DS-03\` (Shared Data)" \
  --label "task,backlog" \
  --project "$PROJECT_NAME"

# 2. Android Integration
gh issue create \
  --title "[Android] Integrate Shared Mock Data" \
  --body "# 🎯 Objective
Update the Android project to consume the Shared Spec for Jars and Transactions.

## 📝 Specifications
- [ ] Update \`scripts/sync_mock_data.js\` to uncomment the Android generation logic
- [ ] Verify the output path: \`Android/app/src/main/java/com/oatrice/jarwise/data/GeneratedMockData.kt\`
- [ ] Run the sync script
- [ ] Refactor Android codebase to use \`GeneratedMockData.jars\` instead of the manual MockData object

## 🔗 References
- Feature ID: \`DS-03\`" \
  --label "task,backlog" \
  --project "$PROJECT_NAME"

# 3. DevOps
gh issue create \
  --title "[DevOps] Setup Auto-Tag for iOS & Mobile" \
  --body "# 🎯 Objective
Implement automated semantic versioning and tagging for the remaining platforms (iOS & Flutter).

## 📝 Specifications
- [ ] Create \`.github/workflows/auto-tag.yml\` in \`JarWise-Mobile\`
- [ ] Create \`.github/workflows/auto-tag.yml\` in \`JarWise-iOS\`
- [ ] Ensure they parse their respective version files (\`pubspec.yaml\`, \`Info.plist\`)

## 🔗 References
- Feature ID: \`DEVOPS-01\`
- Ref: \`RELEASES.md\`" \
  --label "task,backlog" \
  --project "$PROJECT_NAME"

# 4. Meta
gh issue create \
  --title "[Meta] Populate Feature Matrix" \
  --body "# 🎯 Objective
Audit and document the current status of the Mobile (Flutter) and iOS applications.

## 📝 Specifications
- [ ] Review \`JarWise-Mobile\` codebase
- [ ] Review \`JarWise-iOS\` repository status
- [ ] Update \`FEATURES.md\` in Root with accurate status (✅ Live, 🚧 Dev, or ⏳ Pending)

## 🔗 References
- Ref: \`FEATURES.md\`" \
  --label "task,backlog" \
  --project "$PROJECT_NAME"

echo "Done!"
