#!/bin/bash
set -e

BRANCH_SOURCE="main"
BRANCH_TARGET="web"
REMOTE="gh"

CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

if ! git diff-index --quiet HEAD -- '*.html' '*.css' '*.js' 'package.json' 2>/dev/null; then
  echo "Error: there are uncommitted changes in source files. Please commit or stash them first."
  git status --short '*.html' '*.css' '*.js' 'package.json'
  exit 1
fi

if ! command -v node &> /dev/null; then
  echo "Error: node is required for versioning"
  exit 1
fi

VERSION=$(node -e "const p=require('./package.json'); console.log(p.version)")

echo "Releasing v$VERSION..."

if git rev-parse "v$VERSION" >/dev/null 2>&1; then
  echo "Tag v$VERSION already exists"
  git push "$REMOTE" "refs/tags/v$VERSION" --force 2>/dev/null || echo "Tag v$VERSION force-pushed"
else
  git tag -a "v$VERSION" -m "Release v$VERSION"
  git push "$REMOTE" "$BRANCH_SOURCE" --tags
fi

MAJOR=$(echo $VERSION | cut -d. -f1)
MINOR=$(echo $VERSION | cut -d. -f2)
PATCH=$(echo $VERSION | cut -d. -f3)
NEW_PATCH=$((PATCH + 1))
NEW_VERSION="$MAJOR.$MINOR.$NEW_PATCH"

echo "Bumping version: $VERSION -> $NEW_VERSION"

node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.version = '$NEW_VERSION';
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
"

sed -i "18s/1.0.[0-9]*/$NEW_VERSION/" index.html

git add package.json index.html sync-web.sh
git commit -m "Prepare for next release: v$NEW_VERSION"

FILES=$(git ls-files '*.html' '*.css' '*.js')

if [ -z "$FILES" ]; then
  echo "No .html/.css/.js files found in $BRANCH_SOURCE"
  exit 0
fi

COUNT=$(echo "$FILES" | wc -l)
echo "Syncing $COUNT files from $BRANCH_SOURCE to $BRANCH_TARGET..."

git checkout "$BRANCH_TARGET"

echo "$FILES" | tr '\n' '\0' | xargs -0 git checkout "$BRANCH_SOURCE" --

if git diff-index --cached --quiet HEAD -- 2>/dev/null; then
  echo "No changes to commit."
else
  git commit -m "Sync $COUNT source files from $BRANCH_SOURCE (v$VERSION)"
  git push "$REMOTE" "$BRANCH_TARGET"
  echo "Pushed to $REMOTE/$BRANCH_TARGET"
fi

git checkout "$CURRENT_BRANCH"

echo "Done. Released v$VERSION, next version will be v$NEW_VERSION."