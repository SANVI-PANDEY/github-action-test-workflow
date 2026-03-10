# GitHub Actions Data Migration Demo

This repository demonstrates how to use GitHub Actions to migrate data from UAT to Production databases.

## 📁 Project Structure

```
.
├── .github/
│   └── workflows/
│       └── data-migration.yml    # Main workflow file
├── dummy-data/
│   ├── users.sql                 # Sample users data
│   ├── orders.sql                # Sample orders data
│   └── products.sql              # Sample products data
└── README.md
```

## 🚀 How to Use

### Step 1: Create a GitHub Repository

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .
git commit -m "Initial commit: Data migration workflow"

# Create repository on GitHub and push
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
git branch -M main
git push -u origin main
```

### Step 2: Run the Workflow (Testing with Dummy Data)

1. Go to your GitHub repository
2. Click on **Actions** tab
3. Select **Data Migration - UAT to Prod** workflow
4. Click **Run workflow** button
5. Fill in the parameters:
   - **Table to migrate**: Choose `users`, `orders`, `products`, or `all`
   - **Target environment**: Choose `staging` or `production`
   - **Dry run**: Leave checked for testing
   - **Confirm**: Leave empty for dry run

6. Click **Run workflow**

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

## 🤝 Contributing

Feel free to customize this workflow for your specific needs!

## 📄 License

MIT License - Use freely for your projects
