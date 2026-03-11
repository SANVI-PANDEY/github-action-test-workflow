# 🔐 Approval System Setup Guide

This guide explains how to set up the advanced approval system for your data migration workflow.

## 📋 Table of Contents

- [Overview](#overview)
- [New Input Parameters](#new-input-parameters)
- [GitHub Environments Setup](#github-environments-setup)
- [Approval Configuration](#approval-configuration)
- [Usage Examples](#usage-examples)
- [Secrets Configuration](#secrets-configuration)

---

## 🎯 Overview

The enhanced workflow now includes:

✅ **Pre-flight validation** - Automatic checks before migration starts  
✅ **Multiple migration strategies** - Full, incremental, or differential  
✅ **Batch processing** - Configure batch sizes for large datasets  
✅ **Automatic backups** - Optional backup before migration  
✅ **Data validation** - Post-migration data integrity checks  
✅ **Environment-based approvals** - Manual approval for production  
✅ **Rollback capability** - Automatic rollback on errors  
✅ **Email notifications** - Get notified when migration completes  
✅ **Date filtering** - Migrate only records within a date range  

---

## 🆕 New Input Parameters

### Required Parameters
| Parameter | Type | Options | Description |
|-----------|------|---------|-------------|
| `table_name` | choice | users, products, orders, all | Table(s) to migrate |
| `environment` | choice | staging, production | Target environment |
| `migration_strategy` | choice | full, incremental, differential | Migration approach |

### Optional Parameters
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `batch_size` | number | 1000 | Records processed per batch (1-10,000) |
| `create_backup` | boolean | true | Create backup before migration |
| `validate_data` | boolean | true | Run post-migration validation |
| `dry_run` | boolean | true | Preview mode (no actual changes) |
| `notification_email` | string | - | Email address for notifications |
| `date_filter_start` | string | - | Start date for filtering (YYYY-MM-DD) |
| `date_filter_end` | string | - | End date for filtering (YYYY-MM-DD) |
| `skip_validation` | boolean | false | Skip pre-migration checks |
| `rollback_on_error` | boolean | true | Auto-rollback on failure |

---

## 🏗️ GitHub Environments Setup

### Step 1: Create Environments

1. Go to your repository on GitHub
2. Click **Settings** → **Environments**
3. Click **New environment**

#### Create "staging" Environment

```
Name: staging
Deployment protection rules: (optional)
- Wait timer: 0 minutes
- Required reviewers: (none or 1 person)
Environment secrets: STAGING_DB_HOST, STAGING_DB_USER, etc.
```

#### Create "production" Environment

```
Name: production
Deployment protection rules: (REQUIRED)
- ✅ Required reviewers: Add 1-6 reviewers
- ✅ Wait timer: 5 minutes (optional safety delay)
- ✅ Prevent self-review (recommended)
Environment secrets: PROD_DB_HOST, PROD_DB_USER, etc.
```

### Step 2: Configure Required Reviewers

For **production** environment:

1. Click on the **production** environment
2. Under "Environment protection rules"
3. Check ✅ **Required reviewers**
4. Add reviewers (minimum 1, recommended 2+):
   - Database administrators
   - DevOps team leads
   - Senior developers
5. ✅ Check **Prevent self-review** to ensure the person triggering the workflow can't approve it themselves

### Step 3: Add Environment Secrets

For each environment, add the required secrets:

#### Staging Environment Secrets
```
STAGING_DB_HOST = staging-db.example.com
STAGING_DB_USER = staging_user
STAGING_DB_PASSWORD = ***********
STAGING_DB_NAME = staging_database
```

#### Production Environment Secrets
```
PROD_DB_HOST = prod-db.example.com
PROD_DB_USER = prod_user
PROD_DB_PASSWORD = ***********
PROD_DB_NAME = production_database
```

#### UAT Environment Secrets (Repository level)
```
UAT_DB_HOST = uat-db.example.com
UAT_DB_USER = uat_user
UAT_DB_PASSWORD = ***********
UAT_DB_NAME = uat_database
```

---

## ✅ Approval Configuration

### How Approvals Work

#### Staging Environment
- **Automatic** - No manual approval required
- Runs immediately after pre-flight checks pass
- Good for testing and validation

#### Production Environment
- **Manual Approval Required** ⚠️
- Workflow pauses and waits for reviewer approval
- Reviewers receive notification
- Must be approved before migration executes
- Timeout: 30 days by default

### Approval Process Flow

```
┌─────────────────────────────────────┐
│  User Triggers Workflow             │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Pre-flight Validation              │
│  ✓ Batch size check                 │
│  ✓ Date format validation           │
│  ✓ Input parameter validation       │
└──────────────┬──────────────────────┘
               │
               ▼
        ┌──────┴──────┐
        │             │
        ▼             ▼
   ┌─────────┐   ┌─────────┐
   │ Staging │   │  Prod   │
   │  (Auto) │   │ (Wait)  │
   └─────────┘   └────┬────┘
                      │
                      ▼
              ┌───────────────┐
              │ Reviewers Get │
              │ Notification  │
              └───────┬───────┘
                      │
                      ▼
              ┌───────────────┐
              │ Manual Review │
              │  & Approval   │
              └───────┬───────┘
                      │
                      ▼
              ┌───────────────┐
              │   Migration   │
              │    Executes   │
              └───────────────┘
```

---

## 💡 Usage Examples

### Example 1: Safe Production Migration (Recommended)

```yaml
Parameters:
  table_name: users
  environment: production
  migration_strategy: incremental
  batch_size: 500
  create_backup: true ✅
  validate_data: true ✅
  dry_run: true ✅
  rollback_on_error: true ✅
  notification_email: admin@example.com
```

**Flow:**
1. Runs in dry-run mode (no changes)
2. Waits for approval
3. Creates backup
4. Migrates in batches of 500
5. Validates data
6. Sends email notification

### Example 2: Full Production Migration

```yaml
Parameters:
  table_name: all
  environment: production
  migration_strategy: full
  batch_size: 1000
  create_backup: true ✅
  validate_data: true ✅
  dry_run: false ⚠️
  rollback_on_error: true ✅
  notification_email: team@example.com
```

**⚠️ Warning:** This will modify production data!

### Example 3: Incremental Migration with Date Filter

```yaml
Parameters:
  table_name: orders
  environment: production
  migration_strategy: incremental
  batch_size: 2000
  date_filter_start: 2026-03-01
  date_filter_end: 2026-03-10
  create_backup: true
  validate_data: true
  dry_run: false
  notification_email: admin@example.com
```

Migrates only orders between March 1-10, 2026.

### Example 4: Staging Test Run

```yaml
Parameters:
  table_name: products
  environment: staging
  migration_strategy: incremental
  batch_size: 500
  create_backup: false
  validate_data: true
  dry_run: false
```

**No approval required** - runs immediately!

---

## 🔒 Secrets Configuration

### Adding Repository Secrets

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add each UAT secret:

```
Name: UAT_DB_HOST
Value: uat-database.example.com

Name: UAT_DB_USER
Value: uat_admin

Name: UAT_DB_PASSWORD
Value: your_secure_password

Name: UAT_DB_NAME
Value: uat_database
```

### Adding Environment Secrets

1. Go to **Settings** → **Environments** → Click environment name
2. Click **Add secret**
3. Add secrets specific to that environment

---

## 📝 Best Practices

### ✅ DO

- ✅ Always test in **staging** first
- ✅ Use **dry_run: true** initially to preview changes
- ✅ Enable **create_backup: true** for production
- ✅ Set appropriate **batch_size** based on data volume
- ✅ Configure at least 2 reviewers for production
- ✅ Enable **validate_data: true** to catch issues
- ✅ Use **rollback_on_error: true** for safety
- ✅ Provide **notification_email** for critical migrations

### ❌ DON'T

- ❌ Skip pre-flight validation for production
- ❌ Use **dry_run: false** without testing first
- ❌ Approve your own production migrations (enable prevent self-review)
- ❌ Set batch_size too large (max 10,000)
- ❌ Disable backups for production migrations
- ❌ Rush approval - review the configuration carefully

---

## 🚀 Quick Start

1. **Set up environments** (see above)
2. **Configure secrets** for UAT, staging, and production
3. **Add reviewers** to production environment
4. **Test in staging** first:
   ```
   - environment: staging
   - dry_run: true
   ```
5. **Review the logs** and artifacts
6. **Run production** with approval:
   ```
   - environment: production
   - dry_run: true (first time)
   - Wait for approval
   - Review results
   - Run again with dry_run: false
   ```

---

## 🔍 Monitoring & Troubleshooting

### Viewing Approvals

- Go to **Actions** → Select your workflow run
- You'll see "Waiting for review" status
- Reviewers will see "Review deployment" button

### Checking Logs

- Each migration creates detailed logs
- Logs are uploaded as artifacts
- Retention: 30 days (staging), 90 days (production)

### Common Issues

**Issue:** Workflow stuck waiting for approval  
**Solution:** Ensure reviewers are notified and have access

**Issue:** Pre-flight validation fails  
**Solution:** Check batch size and date format

**Issue:** Secrets not found  
**Solution:** Verify secrets are added to correct environment

---

## 📞 Support

For issues or questions:
1. Check the migration logs (artifacts)
2. Review the workflow run summary
3. Contact your database administrator
4. Check environment configuration

---

**Last Updated:** March 11, 2026  
**Workflow Version:** 2.0 (Advanced)
