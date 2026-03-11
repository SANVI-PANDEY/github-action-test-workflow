# GitHub Actions Data Migration Demo - Advanced Edition

This repository demonstrates an **advanced** data migration workflow using GitHub Actions with approval gates, multiple input parameters, and production safety features.

## ✨ New Features

🔐 **Approval System** - Manual approval required for production migrations  
📊 **Multiple Migration Strategies** - Full, incremental, or differential  
🔄 **Batch Processing** - Configurable batch sizes for large datasets  
💾 **Automatic Backups** - Optional pre-migration backups  
✅ **Data Validation** - Post-migration integrity checks  
🔔 **Email Notifications** - Get notified when migrations complete  
📅 **Date Filtering** - Migrate only records within a date range  
🛡️ **Rollback Protection** - Automatic rollback on errors  
🚦 **Pre-flight Checks** - Validation before migration starts  

## 📁 Project Structure

```
.
├── .github/
│   └── workflows/
│       └── data-migration.yml    # Advanced workflow with approval gates
├── dummy-data/
│   ├── users.sql                 # Sample users data
│   ├── orders.sql                # Sample orders data
│   └── products.sql              # Sample products data
├── scripts/
│   └── migrate_data.ts           # TypeScript migration script
├── APPROVAL_SETUP.md             # 📘 Complete approval system guide
├── package.json
└── README.md
```

## 🚀 Quick Start

### Step 1: Set Up GitHub Environments

**This is REQUIRED for the approval system to work!**

1. Go to **Settings** → **Environments**
2. Create two environments:
   - `staging` (no approval required)
   - `production` (approval required)
3. For **production**, add reviewers under "Environment protection rules"
4. Add database secrets to each environment

📘 **[See complete setup guide →](APPROVAL_SETUP.md)**

### Step 2: Configure Secrets

Add these secrets to your repository:

**Repository Secrets** (Settings → Secrets and variables → Actions):
```
UAT_DB_HOST
UAT_DB_USER
UAT_DB_PASSWORD
UAT_DB_NAME
```

**Environment Secrets** (Settings → Environments → [environment] → Add secret):

For **staging** environment:
```
STAGING_DB_HOST
STAGING_DB_USER
STAGING_DB_PASSWORD
STAGING_DB_NAME
```

For **production** environment:
```
PROD_DB_HOST
PROD_DB_USER
PROD_DB_PASSWORD
PROD_DB_NAME
```

### Step 3: Run the Advanced Workflow

1. Go to your GitHub repository
2. Click on **Actions** tab
3. Select **Data Migration - UAT to Prod (Advanced)** workflow
4. Click **Run workflow** button
5. Configure the parameters:

#### Required Parameters
- **Table to migrate**: `users`, `products`, `orders`, or `all`
- **Target environment**: `staging` or `production`
- **Migration strategy**: `full`, `incremental`, or `differential`

#### Optional Parameters
- **Batch size**: Number of records per batch (default: 1000)
- **Create backup**: Enable/disable pre-migration backup (default: true)
- **Validate data**: Enable/disable post-migration validation (default: true)
- **Dry run**: Preview mode without making changes (default: true)
- **Notification email**: Email for completion notifications
- **Date filter start/end**: Migrate only records within date range (YYYY-MM-DD)
- **Rollback on error**: Auto-rollback if migration fails (default: true)

6. Click **Run workflow**

### Step 4: Approval Process (Production Only)

If you selected **production** environment:

1. Workflow will run **pre-flight validation** automatically
2. Workflow will **pause** and wait for approval
3. **Reviewers** will receive a notification
4. Reviewers must click **Review deployment** → **Approve deployment**
5. Migration executes after approval

**Staging** environment runs automatically without approval!

### Step 3: View Results

- Watch the workflow run in real-time
- See the data preview and validation steps
- Download the exported data artifact (available for 7 days)

## 🔐 For Real Database Migration

### Understanding GitHub Secrets Masking

**Important:** GitHub automatically masks (hides with `***`) ANY value stored as a secret in workflow logs. This is a security feature.

**What you'll see in logs:**
- ✅ Secret status check (SET ✓ or NOT SET ✗)
- ✅ String lengths (e.g., "Host length: 15 chars")
- ✅ Last 4 characters (e.g., "********db01")
- ❌ Full secret values (masked as `***`)

**Example log output:**
```
Configuration Check:
   Host: ********db01 ✓ (15 chars)
   User: ****user ✓ (10 chars)
   Database: ****prod ✓ (12 chars)
   Password: ***SET*** ✓
```

This is **intentional** - it prevents credentials from leaking in logs!

### Add GitHub Secrets

Go to **Settings → Secrets and variables → Actions** and add:

**UAT Database:**
- `UAT_DB_HOST` - UAT database host
- `UAT_DB_USER` - UAT database username
- `UAT_DB_PASSWORD` - UAT database password
- `UAT_DB_NAME` - UAT database name

**Production Database:**
- `PROD_DB_HOST` - Production database host
- `PROD_DB_USER` - Production database username
- `PROD_DB_PASSWORD` - Production database password
- `PROD_DB_NAME` - Production database name

### Modify the Workflow

Uncomment the real database commands in the workflow file:

```yaml
# In "Export from UAT" step, replace simulation with:
mysqldump -h ${{ secrets.UAT_DB_HOST }} \
  -u ${{ secrets.UAT_DB_USER }} \
  -p${{ secrets.UAT_DB_PASSWORD }} \
  ${{ secrets.UAT_DB_NAME }} \
  ${{ inputs.table_name }} \
  > data_export.sql

# In "Import to Production" step, replace simulation with:
mysql -h ${{ secrets.PROD_DB_HOST }} \
  -u ${{ secrets.PROD_DB_USER }} \
  -p${{ secrets.PROD_DB_PASSWORD }} \
  ${{ secrets.PROD_DB_NAME }} \
  < data_export.sql
```

## 📊 Workflow Features

✅ **Manual trigger** - Run on-demand with workflow_dispatch  
✅ **Parameter selection** - Choose tables and environment  
✅ **Dry run mode** - Preview before actual migration  
✅ **Safety confirmation** - Requires "CONFIRM" for real migration  
✅ **Data validation** - Checks data integrity before import  
✅ **Data preview** - Shows first 20 lines of export  
✅ **Artifact upload** - Saves export file for 7 days  
✅ **Detailed logging** - See every step of the process  

## 🗄️ Supported Databases

Currently configured for **MySQL/MariaDB**. 

For other databases, modify the workflow:

**PostgreSQL:**
```bash
# Export
pg_dump -h $HOST -U $USER -d $DB -t $TABLE > export.sql

# Import
psql -h $HOST -U $USER -d $DB < export.sql
```

**SQL Server:**
```bash
# Export
sqlcmd -S $HOST -U $USER -P $PASSWORD -Q "SELECT * FROM table" -o export.sql

# Import
sqlcmd -S $HOST -U $USER -P $PASSWORD -i export.sql
```

## ⚠️ Security Best Practices

- ✅ Always use GitHub Secrets for credentials
- ✅ Enable workflow approval for production
- ✅ Use read-only credentials for UAT
- ✅ Limit production write permissions
- ✅ Enable audit logging
- ✅ Review migration data before confirming
- ✅ Test in staging first

## 📝 Example Workflow Run

```
🔄 MIGRATION PLAN
================================================
Table:       users
Target:      production
Dry Run:     true
Confirmed:   false
================================================

📤 Exporting data from UAT database...
✅ Export complete
📊 Export size: 25 lines

📋 DATA PREVIEW (First 20 lines)
================================================
CREATE TABLE IF NOT EXISTS users (...
INSERT INTO users VALUES (1, 'john_doe', ...
...

🔍 Validating data integrity...
✅ Found 10 INSERT statements

ℹ️  DRY RUN MODE - No changes made
================================================
```

---

## 📊 Usage Examples

### Example 1: Test Migration in Staging (No Approval)

Perfect for testing before production:

```yaml
Table: users
Environment: staging
Migration strategy: incremental
Batch size: 1000
Dry run: true ✅
Create backup: true
Validate data: true
```

✅ Runs immediately - no approval needed!

### Example 2: Safe Production Migration (Recommended)

Test first with dry run:

```yaml
Table: products
Environment: production
Migration strategy: incremental
Batch size: 500
Dry run: true ✅
Create backup: true ✅
Validate data: true ✅
Rollback on error: true ✅
Notification email: admin@example.com
```

⏸️ **Requires approval** → Review results → Run again with `dry_run: false`

### Example 3: Migrate Specific Date Range

Migrate only recent orders:

```yaml
Table: orders
Environment: production
Migration strategy: incremental
Batch size: 2000
Date filter start: 2026-03-01
Date filter end: 2026-03-10
Dry run: false
Create backup: true
```

---

## 📋 Migration Strategies Explained

### Full Migration
- Migrates **all records** from source to destination
- Overwrites existing data
- Use when: Starting fresh or need complete sync

### Incremental Migration
- Migrates only **new or updated** records since last migration
- Compares timestamps or IDs
- Use when: Regular updates, large datasets

### Differential Migration
- Migrates records **changed since last full migration**
- More efficient than full, comprehensive than incremental
- Use when: Periodic syncs with moderate changes

---

## 🐛 Troubleshooting

### Common Issues

**Issue:** "Secrets not found" error  
**Solution:** Verify secrets are added to the correct environment (not just repository)

**Issue:** Workflow stuck waiting for approval  
**Solution:** 
- Check reviewers have repository access
- Ensure production environment has required reviewers configured
- Reviewers should check their GitHub notifications

**Issue:** Pre-flight validation fails  
**Solution:**
- Check batch_size is between 1-10,000
- Verify date format is YYYY-MM-DD
- Review the validation error message

**Issue:** Migration times out  
**Solution:**
- Reduce batch_size for large datasets
- Check database connectivity
- Verify network/firewall settings

---

## 🔗 Additional Resources

- **[Complete Approval Setup Guide](APPROVAL_SETUP.md)** - Detailed configuration instructions
- **[GitHub Environments Documentation](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment)**
- **[workflow_dispatch Input Parameters](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#workflow_dispatch)**

---

## 🤝 Contributing

Feel free to customize this workflow for your specific needs! 

To contribute:
1. Fork the repository
2. Create a feature branch
3. Test in staging environment
4. Submit a pull request

---

## 📄 License

MIT License - Use freely for your projects

---

**Version:** 2.0 (Advanced)  
**Last Updated:** March 11, 2026
