#!/bin/bash
set -e

BRANCH_SOURCE="main"
BRANCH_TARGET="web"
REMOTE="gh"

CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
STASH_NEEDED=false
if ! git diff-index --quiet HEAD --; then
  echo "Stashing uncommitted changes..."
  git stash push -m "sync-web-temp"
  STASH_NEEDED=true
fi

FILES=$(git ls-tree -r HEAD -- '*.html' '*.css' '*.js' | awk '{print $4}')

if [ -z "$FILES" ]; then
  echo "No .html/.css/.js files found in $BRANCH_SOURCE"
  exit 0
fi

COUNT=$(echo "$FILES" | wc -l)
echo "Syncing $COUNT files from $BRANCH_SOURCE to $BRANCH_TARGET..."

if ! git show-ref --verify "refs/heads/$BRANCH_TARGET" > /dev/null 2>&1; then
  git checkout --orphan "$BRANCH_TARGET"
  git rm -rf .
else
  git checkout "$BRANCH_TARGET"
fi

echo "$FILES" | tr '\n' '\0' | xargs -0 git checkout "$BRANCH_SOURCE" --

if git diff-index --cached --quiet HEAD -- 2>/dev/null; then
  echo "No changes to commit."
else
  git commit -m "Sync $COUNT source files from $BRANCH_SOURCE ($(date +%Y-%m-%d))"
  git push "$REMOTE" "$BRANCH_TARGET"
  echo "Pushed to $REMOTE/$BRANCH_TARGET"
fi

git checkout "$CURRENT_BRANCH"
if $STASH_NEEDED; then
  git stash pop
  echo "Stash restored."
fi

echo "Done."
