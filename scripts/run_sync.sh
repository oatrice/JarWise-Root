#!/bin/bash

# Sync Mock Data from shared-spec to Web and Android
# Usage: ./run_sync.sh

set -e  # Exit on error

echo "🔄 Syncing Mock Data from shared-spec/data/mockData.json..."
echo ""

cd "$(dirname "$0")"
node sync_mock_data.js

echo ""
echo "✅ Mock Data Synced Successfully!"
echo ""
echo "📝 Generated files:"
echo "  - Web/src/utils/generatedMockData.ts"
echo "  - Android/app/src/main/java/com/oatrice/jarwise/data/GeneratedMockData.kt"
