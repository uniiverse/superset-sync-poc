# Staging Cron Job Setup Guide

This guide shows you how to set up the 6-hour automated dashboard sync for staging.

---

## What This Does

✅ **Automatically runs every 6 hours** (00:00, 06:00, 12:00, 18:00 UTC)
✅ **Can be triggered manually** via GitHub UI
✅ **Exports all dashboards** from staging Superset
✅ **Creates PRs automatically** when changes are detected

---

## Step 1: Push to GitHub

```bash
cd /Users/priya.singh/code/superset-sync-poc

# Option A: Using GitHub CLI (recommended)
gh repo create superset-sync-poc --private --source=. --remote=origin
git add .
git commit -m "Initial commit: Reports POC with staging cron job"
git push -u origin master

# Option B: Manual
# 1. Create repo at https://github.com/new
# 2. Name: superset-sync-poc (make it PRIVATE)
# 3. Then run:
git remote add origin https://github.com/YOUR_USERNAME/superset-sync-poc.git
git add .
git commit -m "Initial commit: Reports POC with staging cron job"
git push -u origin master
```

---

## Step 2: Add GitHub Secrets

Go to your GitHub repo:
```
https://github.com/YOUR_USERNAME/superset-sync-poc
```

1. Click: **Settings** → **Secrets and variables** → **Actions**
2. Click: **New repository secret**
3. Add these 3 secrets:

### Secret 1: SUPERSET_URL
- **Name:** `SUPERSET_URL`
- **Value:** `https://superset.data-us-east4.clusters.staging.universe.engineer`
- Click "Add secret"

### Secret 2: SUPERSET_USERNAME
- **Name:** `SUPERSET_USERNAME`
- **Value:** Your staging Superset admin username (e.g., `admin`)
- Click "Add secret"

### Secret 3: SUPERSET_PASSWORD
- **Name:** `SUPERSET_PASSWORD`
- **Value:** Your staging Superset admin password
- Click "Add secret"

✅ **Secrets configured!**

---

## Step 3: Test the Workflow (Manual Trigger)

Don't wait 6 hours - test it now!

1. Go to: **Actions** tab in your GitHub repo
2. Click: **"Sync Dashboards from Staging Superset"** in the left sidebar
3. Click: **"Run workflow"** button (top right)
4. Click: Green **"Run workflow"** button in the dropdown
5. **Watch it run!** Should take ~1-2 minutes

### What Should Happen:
```
✅ Checkout code
✅ Setup Node.js
✅ Install dependencies (npm ci)
✅ Export dashboards from staging
✅ Check for changes
✅ Create PR (if changes detected)
```

### Expected Results:
- **If dashboards changed:** You'll see a new PR titled "[Staging] Sync dashboards from Superset"
- **If no changes:** Workflow succeeds but no PR created (this is normal!)

---

## Step 4: Verify It's Working

### After first manual run:

**Check the Actions tab:**
- Should show green checkmark ✅
- Click on the run to see detailed logs

**Check Pull Requests tab:**
- If dashboards changed, you'll see a PR
- PR will have "automated", "dashboards", "staging", "poc" labels
- Review the changes and merge if they look good

**Check dashboards/ folder:**
- Should have YAML files exported from staging

---

## Automatic Schedule

Once set up, the workflow will run **automatically every 6 hours**:
- **00:00 UTC** (7pm EST / 4pm PST previous day)
- **06:00 UTC** (1am EST / 10pm PST previous day)
- **12:00 UTC** (7am EST / 4am PST)
- **18:00 UTC** (1pm EST / 10am PST)

You don't need to do anything - GitHub Actions will run it for you!

---

## Manual Trigger Anytime

You can always trigger it manually:
1. Go to Actions tab
2. Select "Sync Dashboards from Staging Superset"
3. Click "Run workflow"

Great for:
- Testing after making dashboard changes
- Syncing immediately instead of waiting
- Debugging issues

---

## Monitoring

### View Workflow History

Go to: `https://github.com/YOUR_USERNAME/superset-sync-poc/actions`

Shows:
- ✅ All successful runs
- ❌ Any failed runs
- ⏱️ Time taken
- 📊 Logs for debugging

### Get Notified of Failures

1. Go to: https://github.com/settings/notifications
2. Enable: "Actions" notifications
3. Choose: Email or GitHub notifications

Now you'll be alerted if the cron job fails!

---

## Troubleshooting

### ❌ "Authentication failed"

**Fix:** Check your secrets
1. Settings → Secrets and variables → Actions
2. Verify:
   - `SUPERSET_URL` is correct (no trailing slash)
   - `SUPERSET_USERNAME` is correct
   - `SUPERSET_PASSWORD` is correct

**Test manually:**
```bash
curl -X POST "https://superset.data-us-east4.clusters.staging.universe.engineer/api/v1/security/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"YOUR_PASSWORD","provider":"db","refresh":true}'
```

Should return an access token.

---

### ❌ "npm ci failed"

**Fix:** The reports repo has dependencies

This is normal - the workflow will install them automatically.

If it fails:
1. Check if `package.json` exists in repo
2. Check if `npm run export` is a valid command
3. May need to adjust the workflow to match your repo structure

---

### ❌ "No changes detected" every time

**This is normal if:**
- No dashboards have been modified in staging
- Dashboards were already synced

**To test:**
1. Edit a dashboard in staging Superset
2. Manually trigger the workflow
3. Should now create a PR with changes

---

### ❌ Workflow not running automatically

**Check:**
1. Actions are enabled: Settings → Actions → General → "Allow all actions"
2. Workflow file is in correct location: `.github/workflows/sync-dashboards-staging.yaml`
3. Wait up to 6 hours for first automatic run (or trigger manually to test)

---

## Changing the Schedule

Want it to run more or less frequently?

Edit `.github/workflows/sync-dashboards-staging.yaml`:

```yaml
schedule:
  # Every 6 hours (current)
  - cron: '0 */6 * * *'

  # Or every hour:
  # - cron: '0 * * * *'

  # Or every 30 minutes:
  # - cron: '*/30 * * * *'

  # Or daily at 2am UTC:
  # - cron: '0 2 * * *'

  # Or every 12 hours:
  # - cron: '0 */12 * * *'
```

Commit and push the change.

---

## What Gets Synced

The workflow exports **all dashboards** from staging Superset to the `dashboards/` folder.

Each dashboard becomes a YAML file with:
- Dashboard configuration
- Chart definitions
- SQL queries
- Filters and settings

---

## Security Notes

✅ **Secrets are encrypted** by GitHub
✅ **Not visible in logs** - GitHub masks them
✅ **Private repo recommended** - dashboard configs may contain sensitive info
✅ **Use read-only account** if possible - create a dedicated Superset user

---

## Summary

**What you did:**
1. ✅ Pushed POC repo to GitHub
2. ✅ Added 3 secrets (URL, username, password)
3. ✅ Tested manual trigger
4. ✅ Cron job now runs every 6 hours automatically

**What happens automatically:**
- Every 6 hours → GitHub Actions → Export dashboards → Create PR → You review & merge

**No maintenance needed!** 🎉

---

## Questions?

**Q: Will this affect production?**
A: No. This only connects to staging Superset (URL in secrets).

**Q: Can I run this on production too?**
A: Yes, but create a separate workflow with different secrets for production URL/credentials.

**Q: What if I delete a dashboard in Superset?**
A: The YAML file will be removed from the repo and PR will show the deletion.

**Q: Can I sync charts too, not just dashboards?**
A: Yes, but you'd need to modify `tools/export-assets.ts` to include charts.

---

Your staging Superset URL: `https://superset.data-us-east4.clusters.staging.universe.engineer`

Ready to go! 🚀
