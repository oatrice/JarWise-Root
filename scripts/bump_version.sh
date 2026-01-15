#!/bin/bash
# bump_version.sh <new_version>
# Example: ./scripts/bump_version.sh 1.2.0

NEW_VERSION=$1

if [ -z "$NEW_VERSION" ]; then
  echo "Usage: ./scripts/bump_version.sh <new_version>"
  exit 1
fi

echo "Bumping version to $NEW_VERSION..."

# Web
if [ -f "Web/package.json" ]; then
    sed -i '' "s/\"version\": \".*\"/\"version\": \"$NEW_VERSION\"/" Web/package.json
    echo "Updated Web/package.json"
fi

# Android (Native)
if [ -f "Android/app/build.gradle" ]; then
    sed -i '' "s/versionName \".*\"/versionName \"$NEW_VERSION\"/" Android/app/build.gradle
    echo "Updated Android/app/build.gradle (versionName)"
fi

# Mobile (Flutter)
if [ -f "Mobile/pubspec.yaml" ]; then
    # Assumes format: version: 1.0.0+1
    # This simple regex replaces the whole version line, losing build number if not careful.
    # For simplicity, we restart build number or just keep the version part.
    sed -i '' "s/^version: .*/version: $NEW_VERSION/" Mobile/pubspec.yaml
    echo "Updated Mobile/pubspec.yaml"
fi

echo "Version bump complete!"
