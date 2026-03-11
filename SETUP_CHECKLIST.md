# ✅ Setup Checklist - GitHub Environments & Approval System

Use this checklist to set up your advanced workflow with approval gates.

---

## 📋 Phase 1: GitHub Repository Setup

### Repository Ready? 
- [ ] Code is pushed to GitHub
- [ ] You have admin access to the repository
- [ ] Actions are enabled in repository settings

---

## 🏗️ Phase 2: Create Environments

### Create Staging Environment

1. - [ ] Go to **Settings** → **Environments** → **New environment**
2. - [ ] Name it: `staging`
3. - [ ] Click **Configure environment**
4. - [ ] (Optional) Add environment protection rules:
   - [ ] Required reviewers: 0-1 person (optional for staging)
   - [ ] Wait timer: 0 minutes
5. - [ ] Click **Save protection rules**

### Create Production Environment

1. - [ ] Go to **Settings** → **Environments** → **New environment**
2. - [ ] Name it: `production`
3. - [ ] Click **Configure environment**
4. - [ ] **REQUIRED** Add environment protection rules:
   - [ ] ✅ Check **"Required reviewers"**
   - [ ] Add at least **2 reviewers** (recommended)
     - [ ] Reviewer 1: _________________
     - [ ] Reviewer 2: _________________
     - [ ] Reviewer 3: _________________ (optional)
   - [ ] ✅ Check **"Prevent self-review"** (highly recommended)
   - [ ] (Optional) Wait timer: **5 minutes** (safety delay)
5. - [ ] Click **Save protection rules**

---

## 🔐 Phase 3: Add Repository Secrets

Go to **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

### UAT Database Credentials

- [ ] Add `UAT_DB_HOST`
  - Name: `UAT_DB_HOST`
  - Value: `___________________________`

- [ ] Add `UAT_DB_USER`
  - Name: `UAT_DB_USER`
  - Value: `___________________________`

- [ ] Add `UAT_DB_PASSWORD`
  - Name: `UAT_DB_PASSWORD`
  - Value: `___________________________`

- [ ] Add `UAT_DB_NAME`
  - Name: `UAT_DB_NAME`
  - Value: `___________________________`

---

## 🔒 Phase 4: Add Environment Secrets

### Staging Environment Secrets

Go to **Settings** → **Environments** → **staging** → **Add secret**

- [ ] Add `STAGING_DB_HOST`
  - Name: `STAGING_DB_HOST`
  - Value: `___________________________`

- [ ] Add `STAGING_DB_USER`
  - Name: `STAGING_DB_USER`
  - Value: `___________________________`

- [ ] Add `STAGING_DB_PASSWORD`
  - Name: `STAGING_DB_PASSWORD`
  - Value: `___________________________`

- [ ] Add `STAGING_DB_NAME`
  - Name: `STAGING_DB_NAME`
  - Value: `___________________________`

### Production Environment Secrets

Go to **Settings** → **Environments** → **production** → **Add secret**

- [ ] Add `PROD_DB_HOST`
  - Name: `PROD_DB_HOST`
  - Value: `___________________________`

- [ ] Add `PROD_DB_USER`
  - Name: `PROD_DB_USER`
  - Value: `___________________________`

- [ ] Add `PROD_DB_PASSWORD`
  - Name: `PROD_DB_PASSWORD`
  - Value: `___________________________`

- [ ] Add `PROD_DB_NAME`
  - Name: `PROD_DB_NAME`
  - Value: `___________________________`

---

## 🧪 Phase 5: Test the Workflow

### Test 1: Staging (No Approval)

- [ ] Go to **Actions** tab
- [ ] Select **"Data Migration - UAT to Prod (Advanced)"**
- [ ] Click **"Run workflow"**
- [ ] Configure:
  - Table: `users`
  - Environment: **staging**
  - Strategy: `incremental`
  - Batch size: `1000`
  - Dry run: **true** ✅
  - Create backup: **true**
  - Validate data: **true**
- [ ] Click **"Run workflow"**
- [ ] ✅ Workflow should run immediately (no approval needed)
- [ ] Check logs for success
- [ ] Download and review artifact

### Test 2: Production Dry Run (With Approval)

- [ ] Go to **Actions** tab
- [ ] Click **"Run workflow"**
- [ ] Configure:
  - Table: `users`
  - Environment: **production**
  - Strategy: `incremental`
  - Batch size: `500`
  - Dry run: **true** ✅
  - Create backup: **true**
  - Validate data: **true**
  - Rollback on error: **true**
  - Notification email: `_______________`
- [ ] Click **"Run workflow"**
- [ ] ⏸️ Workflow should pause waiting for approval
- [ ] Reviewers should receive notification
- [ ] Reviewer clicks **"Review deployment"**
- [ ] Reviewer reviews configuration
- [ ] Reviewer clicks **"Approve deployment"**
- [ ] ✅ Workflow continues and completes
- [ ] Review logs and artifacts

### Test 3: Real Production Migration (After Testing)

⚠️ **Only proceed after successful dry run tests!**

- [ ] Double-check dry run results
- [ ] Verify reviewers are available
- [ ] Configure migration:
  - Table: _____________
  - Environment: **production**
  - Strategy: _____________
  - Batch size: _____________
  - Dry run: **false** ⚠️
  - Create backup: **true** ✅
  - Validate data: **true** ✅
  - Rollback on error: **true** ✅
  - Notification email: `_______________`
- [ ] Submit for approval
- [ ] Wait for approval
- [ ] Monitor migration progress
- [ ] Verify completion
- [ ] Review logs
- [ ] Validate migrated data

---

## 📖 Phase 6: Documentation Review

- [ ] Read [APPROVAL_SETUP.md](APPROVAL_SETUP.md) - Complete setup guide
- [ ] Read [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - Quick reference for daily use
- [ ] Read [ENHANCEMENT_SUMMARY.md](ENHANCEMENT_SUMMARY.md) - What's new
- [ ] Bookmark [README.md](README.md) - Main documentation

---

## ✅ Verification Checklist

Before going live, verify:

### Environments
- [ ] `staging` environment exists
- [ ] `production` environment exists
- [ ] Production has 2+ required reviewers
- [ ] "Prevent self-review" is enabled for production

### Secrets
- [ ] All 4 UAT secrets are set
- [ ] All 4 STAGING secrets are set
- [ ] All 4 PROD secrets are set
- [ ] Values are correct (tested in staging)

### Workflow
- [ ] Workflow file is updated
- [ ] Test run in staging succeeded
- [ ] Test approval process worked
- [ ] Dry run succeeded
- [ ] Logs show correct configuration

### Team
- [ ] Reviewers know their responsibilities
- [ ] Team knows how to submit migrations
- [ ] Emergency rollback procedure documented
- [ ] Database backups are working

---

## 🎓 Training Checklist

Make sure your team knows:

- [ ] How to run a staging migration (no approval)
- [ ] How to run a production migration (with approval)
- [ ] How to approve a migration (for reviewers)
- [ ] What each parameter does
- [ ] When to use dry_run: true vs false
- [ ] Where to find logs
- [ ] How to download artifacts
- [ ] What to do if migration fails
- [ ] How to verify migration success

---

## 🚨 Emergency Contacts

Fill in and share with team:

| Role | Name | Email | Phone |
|------|------|-------|-------|
| Database Admin | ___________ | ___________ | ___________ |
| DevOps Lead | ___________ | ___________ | ___________ |
| Reviewer 1 | ___________ | ___________ | ___________ |
| Reviewer 2 | ___________ | ___________ | ___________ |
| On-Call | ___________ | ___________ | ___________ |

---

## 📅 Recommended Schedule

- [ ] **Daily:** Run incremental migrations to staging (automated if possible)
- [ ] **Weekly:** Run incremental migrations to production (during business hours)
- [ ] **Monthly:** Run full migration to production (during maintenance window)
- [ ] **Quarterly:** Review and update this checklist

---

## 🎉 You're Ready!

Once all items above are checked, you have:

✅ GitHub Environments configured  
✅ Approval process set up  
✅ All secrets configured  
✅ Workflow tested  
✅ Team trained  
✅ Documentation reviewed  

**You're ready to run production migrations with confidence!**

---

## 📞 Need Help?

- Review documentation in this repository
- Check workflow logs for errors
- Consult [GitHub Environments Documentation](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment)
- Contact your DevOps team

---

**Setup Version:** 1.0  
**Last Updated:** March 11, 2026  
**Keep this checklist for reference and periodic review!**
