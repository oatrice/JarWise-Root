#!/bin/bash
# scripts/move_issue_to_inprogress.sh

# Configuration for JarWise Project Board
PROJECT_NUMBER=7
PROJECT_ID="PVT_kwHOATfKEM4BMuLi"  # ID for Project #7
OWNER="oatrice"
STATUS_FIELD_ID="PVTSSF_lAHOATfKEM4BMuLizg77IqE"
IN_PROGRESS_OPTION_ID="37716bfb"

ISSUE_URL_OR_NUM=$1

if [ -z "$ISSUE_URL_OR_NUM" ]; then
  echo "Usage: ./scripts/move_issue_to_inprogress.sh <issue-url>"
  exit 1
fi

echo "🔍 Finding Project Item for: $ISSUE_URL_OR_NUM"

# Fetch project items and search for the issue
ITEM_ID=$(gh project item-list $PROJECT_NUMBER --owner $OWNER --format json --limit 100 | \
  python3 -c "import sys, json; data = json.load(sys.stdin); target = '$ISSUE_URL_OR_NUM'; items = [i for i in data['items'] if i['content']['url'] == target or str(i['content']['number']) == target]; print(items[0]['id'] if items else '')")

if [ -z "$ITEM_ID" ]; then
  echo "❌ Error: Issue not found in Project Board #$PROJECT_NUMBER."
  echo "Please ensure the issue is added to the 'JarWise ...' project board."
  exit 1
fi

echo "✅ Found Item ID: $ITEM_ID. Updating status to 'In Progress'..."

gh project item-edit \
  --id "$ITEM_ID" \
  --project-id "$PROJECT_ID" \
  --field-id "$STATUS_FIELD_ID" \
  --single-select-option-id "$IN_PROGRESS_OPTION_ID" --format text

echo "✅ Success! Issue moved to 'In Progress'."
