# 🎯 Quick Reference Card - Data Migration Workflow

> **Print this guide for quick reference when running migrations!**

---

## ⚡ Quick Start Checklist

### Before First Use
- [ ] Create `staging` environment in GitHub
- [ ] Create `production` environment in GitHub
- [ ] Add 2+ reviewers to production environment
- [ ] Enable "Prevent self-review" for production
- [ ] Add all required secrets (UAT, STAGING, PROD)
- [ ] Test in staging first

### Before Each Migration
- [ ] Review what data will be migrated
- [ ] Check batch size is appropriate
- [ ] Enable backup (especially for production)
- [ ] Start with dry_run: true
- [ ] Review logs before running with dry_run: false

---

## 📊 Parameter Quick Guide

### Environment Selection
| Environment | Approval Required | Best For |
|-------------|------------------|----------|
| **staging** | ❌ No | Testing, validation, experiments |
| **production** | ✅ Yes | Real data migrations |

### Migration Strategy
| Strategy | What It Does | When to Use |
|----------|--------------|-------------|
| **full** | Migrates all records | Fresh start, complete sync |
| **incremental** | Only new/updated records | Regular updates, large datasets |
| **differential** | Changes since last full | Periodic syncs |

### Batch Size Guide
| Data Volume | Recommended Batch Size |
|-------------|----------------------|
| Small (<10K records) | 1000 |
| Medium (10K-100K) | 500 |
| Large (100K-1M) | 250 |
| Very Large (>1M) | 100 |

---

## 🚦 Safety Levels

### 🟢 Safest (Recommended for First Time)
```yaml
environment: staging
dry_run: true
create_backup: true
validate_data: true
rollback_on_error: true
```

### 🟡 Safe (After Testing in Staging)
```yaml
environment: production
dry_run: true  ← Still preview mode
create_backup: true
validate_data: true
rollback_on_error: true
```

### 🟠 Live (After Dry Run Review)
```yaml
environment: production
dry_run: false  ← Real changes!
create_backup: true
validate_data: true
rollback_on_error: true
notification_email: your@email.com
```

### 🔴 Dangerous (Only if you know what you're doing)
```yaml
environment: production
dry_run: false
create_backup: false  ← No backup!
validate_data: false  ← No validation!
rollback_on_error: false  ← No safety net!
```

**⚠️ Never use the 🔴 configuration unless absolutely necessary!**

---

## 📋 Common Scenarios

### Scenario 1: "I want to test safely"
```
Table: users
Environment: staging
Strategy: incremental
Batch size: 1000
Dry run: true ✅
```

### Scenario 2: "Ready for production, but want preview first"
```
Table: products
Environment: production
Strategy: incremental
Batch size: 500
Dry run: true ✅
Create backup: true
Validate: true
```

### Scenario 3: "I've tested, ready to go live"
```
Table: products
Environment: production
Strategy: incremental
Batch size: 500
Dry run: false ⚠️
Create backup: true
Validate: true
Rollback on error: true
Email: admin@example.com
```

### Scenario 4: "Migrate specific date range"
```
Table: orders
Environment: production
Strategy: incremental
Date start: 2026-03-01
Date end: 2026-03-10
Dry run: true
```

### Scenario 5: "Emergency: migrate everything NOW"
```
Table: all
Environment: production
Strategy: full
Batch size: 500
Dry run: false
Backup: true ← CRITICAL!
Validate: true
Rollback: true
```

---

## ✅ Pre-Migration Checklist

Before clicking "Run workflow":

- [ ] **Double-check environment** (staging vs production)
- [ ] **Verify dry_run setting** (true for testing, false for real)
- [ ] **Confirm table selection** (specific table or all)
- [ ] **Check batch size** (appropriate for data volume)
- [ ] **Enable backup** (especially for production)
- [ ] **Review date filters** (if migrating partial data)
- [ ] **Add notification email** (for production migrations)
- [ ] **Have reviewers ready** (for production approval)

---

## 🔍 Approval Process

### Staging
1. Click "Run workflow"
2. Fill parameters
3. Click "Run workflow"
4. ✅ **Runs immediately** - no waiting!

### Production
1. Click "Run workflow"
2. Fill parameters
3. Click "Run workflow"
4. ⏸️ **Workflow pauses** for approval
5. Reviewers receive notification
6. Reviewer clicks "Review deployment"
7. Reviewer reviews configuration
8. Reviewer clicks "Approve deployment"
9. ✅ **Migration starts**

**Tip:** Have reviewers ready before starting production migrations!

---

## 🎯 Decision Tree

```
Do you need to migrate data?
 │
 ├─ Testing/Learning? 
 │   └─ Use staging, dry_run:true
 │
 ├─ First production run?
 │   └─ Use production, dry_run:true
 │       Wait for approval → Review logs
 │       Then run again with dry_run:false
 │
 ├─ Routine migration?
 │   └─ Use production, dry_run:false
 │       Batch:500, Backup:true, Validate:true
 │
 └─ Emergency/Rollback?
     └─ Check with DBA first
         Use backup:true, rollback:true
```

---

## 🚨 If Something Goes Wrong

### Pre-flight validation fails
- Check batch size (must be 1-10,000)
- Check date format (must be YYYY-MM-DD)
- Read error message carefully

### Workflow stuck on approval
- Check reviewers have access
- Notify reviewers via Slack/email
- Check GitHub notifications

### Migration fails
- If rollback enabled: data automatically restored
- Check migration logs (download artifact)
- Review error messages
- Contact DBA if needed

### Can't see secrets in logs
- **This is normal!** GitHub masks secrets
- You'll see `***` instead of values
- This is a security feature

---

## 📞 Quick Contact Guide

| Issue | Contact |
|-------|---------|
| Secrets not working | DevOps team |
| Approval stuck | Reviewers |
| Database errors | DBA team |
| Workflow errors | DevOps team |
| Data validation fails | Data team + DBA |

---

## 💡 Pro Tips

1. **Always test in staging first** - it's free and risk-free
2. **Use dry_run for production preview** - see what will happen
3. **Review logs before going live** - catch issues early
4. **Keep batch sizes reasonable** - prevents timeouts
5. **Enable all safety features** - backup, validate, rollback
6. **Add notification email** - know when it's done
7. **Have reviewers ready** - don't waste time waiting
8. **Document your migrations** - helps future debugging

---

## 📅 Recommended Schedule

### Daily Updates (Small Changes)
```
Strategy: incremental
Batch: 1000
Environment: Production after staging test
```

### Weekly Syncs (Medium Changes)
```
Strategy: differential
Batch: 500
Environment: Production with backup
```

### Monthly Full Sync
```
Strategy: full
Batch: 250
Environment: Production with backup
Schedule: During maintenance window
```

---

## 🔗 More Help

- Full setup guide: [APPROVAL_SETUP.md](APPROVAL_SETUP.md)
- Main documentation: [README.md](README.md)
- GitHub docs: [environments](https://docs.github.com/en/actions/deployment)

---

**Keep this guide handy!** 🎯

*Version 2.0 | Last Updated: March 11, 2026*
