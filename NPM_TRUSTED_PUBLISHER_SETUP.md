# npm Trusted Publisher Setup for @ziuus/daily

## Prerequisites
- GitHub repo: `ziuus/daily-workspace` (or your actual repo)
- npm package: `@ziuus/daily` (already published)

---

## Step 1: Configure npm Trusted Publisher

1. Go to **https://www.npmjs.com/package/@ziuus/daily**
2. Click **Access** tab → **Trusted publishers** section
3. Click **Add trusted publisher**
4. Fill in:
   - **Owner**: `ziuus` (your GitHub username/org)
   - **Repository**: `daily-workspace` (your repo name)
   - **Workflow name**: `npm-publish.yml` (or `Publish to npm` — the workflow filename or display name)
   - **Environment**: `release` (matches `environment: release` in workflow)

5. Click **Add**

---

## Step 2: Add GitHub Environment (Optional but Recommended)

1. Go to your GitHub repo → **Settings** → **Environments**
2. Click **New environment** → Name: `release`
3. Add protection rules (optional):
   - **Required reviewers**: Add yourself/team
   - **Wait timer**: 0-30 minutes
   - **Deployment branches**: `main` (or your release branch)

---

## Step 3: Test the Workflow

### Option A: Via Release (Recommended)
```bash
# Tag and push a release
git tag v1.2.7
git push origin v1.2.7

# Then create GitHub Release from the tag
# This triggers the workflow automatically
```

### Option B: Manual Trigger
1. Go to **Actions** tab → **Publish to npm** workflow
2. Click **Run workflow**
3. Choose version bump: `patch` / `minor` / `major`
4. Click **Run workflow**

---

## Step 4: Verify Provenance

After publish, check the npm page:
- Package page shows **"Provenance"** badge
- Click it → shows GitHub Actions build URL, commit SHA, workflow name

Or via CLI:
```bash
npm view @ziuus/daily@1.2.7 --json | jq .provenance
```

---

## How It Works

| Trigger | What Happens |
|---------|--------------|
| `release` published | Builds web, publishes to npm with provenance |
| `workflow_dispatch` | Bumps version, commits, tags, pushes, publishes, creates GH Release |

The `id-token: write` permission lets GitHub Actions request an OIDC token from GitHub's OIDC provider, which npm verifies against the trusted publisher config — **no NPM_TOKEN secret needed** (the workflow includes it as fallback only).

---

## Files Changed

- `.github/workflows/npm-publish.yml` — New workflow

Commit and push:
```bash
cd /home/zius/.daily
git add .github/workflows/npm-publish.yml
git commit -m "ci: add npm trusted publisher workflow"
git push
```