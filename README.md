# Grafana Bench Git Test Repository

This repository is specifically designed for testing nanogit integration in the grafana-bench project. It provides a controlled environment with known files, commits, tags, and branch scenarios.

## Repository Purpose

This test repository contains:
- Known file structure for reliable testing
- Predictable git history with specific scenarios
- Test data for nanogit checkout functionality

## Test Scenarios Available

1. **Scenario 1: Main branch checkout** - Full repository with all base files
2. **Scenario 2: Tag checkout** - Checkout at tag `v1.0.0`
3. **Scenario 3: Deleted branch commit checkout** - Checkout commit from a branch that no longer exists

## Repository Structure

```
.
├── README.md                    # This file
├── playwright.config.ts         # Playwright configuration
├── package.json                 # Package file
├── CODEOWNERS                   # Code ownership
├── codeowners-mapping.yaml      # Codeowners mapping
└── tests/
    ├── login.js                 # Base test file
    └── dashboard.spec.js        # Additional test file (only in deleted branch commit)
```

## Important Commit Hashes

- **Main branch commit**: `49b4616` (also tagged as `v1.0.0`)
- **Deleted branch commit**: `daf9a7ed0e3f65c1a5d0bdc9060b00754ea629a1` (contains extra files)

## Recreation Script

If you need to recreate this repository from scratch, run this script from the parent directory of where you want to create the test repo:

```bash
#!/bin/bash
set -e

# Repository configuration
REPO_NAME="grafana-bench-git-test"
REPO_URL="git@github.com:grafana/grafana-bench-git-test.git"
BENCH_REPO_PATH="./bench"  # Adjust this path to your grafana-bench repo location

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Creating test repository: $REPO_NAME${NC}"

# Step 1: Create and initialize repository
echo -e "${GREEN}Step 1: Initializing repository...${NC}"
mkdir -p $REPO_NAME
cd $REPO_NAME
git init
git remote add origin $REPO_URL

# Step 2: Copy base files from grafana-bench repo
echo -e "${GREEN}Step 2: Copying base files...${NC}"
cp $BENCH_REPO_PATH/CI/playwright.yaml ./playwright.config.ts
cp $BENCH_REPO_PATH/CODEOWNERS ./
cp $BENCH_REPO_PATH/codeowners-mapping.yaml ./
cp -r $BENCH_REPO_PATH/CI/playwright/tests ./

# Step 3: Create package.json
echo -e "${GREEN}Step 3: Creating package.json...${NC}"
cat > package.json << 'EOF'
{
  "name": "grafana-bench-git-test",
  "version": "1.0.0",
  "description": "Test repository for nanogit integration tests",
  "scripts": {
    "test": "playwright test"
  },
  "devDependencies": {
    "@playwright/test": "^1.40.0"
  }
}
EOF

# Step 4: Create initial commit and tag
echo -e "${GREEN}Step 4: Creating initial commit and tag...${NC}"
git add .
git commit -m "Initial commit with test files

- Add playwright.config.ts
- Add package.json  
- Add CODEOWNERS
- Add codeowners-mapping.yaml
- Add tests directory with sample tests"

git tag -a v1.0.0 -m "Release v1.0.0 - Initial stable release"

# Step 5: Create feature branch with additional files
echo -e "${GREEN}Step 5: Creating feature branch...${NC}"
git checkout -b feature-new-tests

# Create additional test file
cat > tests/dashboard.spec.js << 'EOF'
const { test, expect } = require('@playwright/test');

test.describe('Dashboard tests', () => {
  test('should load dashboard page', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.locator('h1')).toContainText('Dashboard');
  });

  test('should create new dashboard', async ({ page }) => {
    await page.goto('/dashboard/new');
    await page.click('button[data-testid="new-dashboard"]');
    await expect(page.locator('.dashboard-title')).toBeVisible();
  });
});
EOF

# Create feature documentation
cat > feature-readme.md << 'EOF'
# Feature Branch

This branch contains additional test files that were added as part of a feature development.

## New Tests Added
- dashboard.spec.js - Tests for dashboard functionality
- Additional test utilities

This commit will be used to test nanogit's ability to checkout specific commits
even after the branch has been deleted.
EOF

# Commit feature branch changes
git add .
git commit -m "Add feature branch test files

- Add dashboard.spec.js with dashboard tests
- Add feature-readme.md explaining feature branch
- This commit will be used for testing checkout of deleted branch commits"

# Step 6: Get commit hash and delete feature branch
echo -e "${GREEN}Step 6: Getting commit hash and cleaning up...${NC}"
FEATURE_COMMIT=$(git rev-parse HEAD)
echo "Feature branch commit hash: $FEATURE_COMMIT"

git checkout main
git branch -D feature-new-tests

# Step 7: Push to remote
echo -e "${GREEN}Step 7: Pushing to remote...${NC}"
git push origin main
git push origin --tags

echo -e "${BLUE}Repository setup complete!${NC}"
echo ""
echo "Test scenarios available:"
echo "1. Main branch: $(git rev-parse main | cut -c1-7)"
echo "2. Tag v1.0.0: $(git rev-list -n 1 v1.0.0 | cut -c1-7)"
echo "3. Deleted branch commit: $(echo $FEATURE_COMMIT | cut -c1-7)"
echo ""
echo "Full commit hash for deleted branch: $FEATURE_COMMIT"
echo ""
echo "Repository URL: $REPO_URL"
```

## Usage

To use this repository in nanogit integration tests:

```go
const (
    testRepoURL = "https://github.com/grafana/grafana-bench-git-test"
    testTag = "v1.0.0"
    deletedBranchCommit = "daf9a7ed0e3f65c1a5d0bdc9060b00754ea629a1"
)
```

## Expected Files by Scenario

### Scenario 1 & 2 (Main branch / v1.0.0 tag):
- `playwright.config.ts`
- `package.json`
- `CODEOWNERS`
- `codeowners-mapping.yaml`
- `tests/login.js`

### Scenario 3 (Deleted branch commit):
All files from Scenario 1 & 2, plus:
- `tests/dashboard.spec.js`
- `feature-readme.md`

## Maintenance

If you need to update this repository:
1. Make changes to the recreation script above
2. Delete the current repository (if needed)
3. Run the recreation script
4. Update the commit hashes in your integration tests

This ensures the test repository remains consistent and predictable for nanogit integration testing.