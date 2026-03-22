# Database -> Backup & Recovery

## Why Backup Matters

Backup is your last line of defense against data loss from hardware failures, human error (accidental DELETE, DROP TABLE), software corruption, security threats (ransomware, hacker attacks), natural disasters, and compliance requirements (GDPR, SOC 2, PCI-DSS).

> **Statistic**: 93% of companies without a backup solution go out of business within one year of a major data loss event.

---

## Backup Types

### Full Backup

Backs up the entire database. Largest in size, longest to complete, but simplest to restore.

```bash
# PostgreSQL - pg_dump
pg_dump -U postgres -Fc -f backup_full.dump mydb

# MySQL - mysqldump
mysqldump -u root -p --single-transaction \
  --routines --triggers --events \
  --all-databases > full_backup.sql
```

### Incremental Backup

Backs up only data changed since the last backup (full or incremental). Smaller, faster, but requires a chain of backups to restore.

```bash
# PostgreSQL WAL archiving (continuous incremental)
# postgresql.conf
wal_level = replica
max_wal_senders = 3
archive_mode = on
archive_command = 'test ! -f /backup/wal/%f && cp %p /backup/wal/%f'
archive_timeout = 300
```

### Differential Backup

Backs up data changed since the last full backup. Falls between full and incremental in size and restore complexity.

```
Timeline:
Day 1: [========== FULL BACKUP ==========]
Day 2: [INCR+][INCR+][INCR+][INCR+]
Day 3: [DIFF+        ][DIFF+        ]
Day 4: [INCR+][INCR+][INCR+]
Day 5: [========== FULL BACKUP ==========]
```

### Backup Type Comparison

| Type | Size | Time | RPO | Restore Complexity |
|------|------|------|-----|--------------------|
| **Full** | Largest | Longest | At backup time | Simplest |
| **Incremental** | Smallest | Fastest | Gap between increments | Requires chain |
| **Differential** | Medium | Medium | Gap from last full | Intermediate |

---

## Logical Backup

Logical backups export data as SQL statements (INSERT, CREATE TABLE, etc.). They are portable across database versions and even across different database engines (with limitations).

### PostgreSQL with pg_dump

```bash
# Custom format (compressed, parallel restore)
pg_dump -U postgres -Fc -f backup_full.dump mydb

# Compressed with gzip
pg_dump -U postgres -Fc mydb | gzip > backup_full.sql.gz

# Directory format (parallel, faster for large DBs)
pg_dump -U postgres -Fd -j 4 -f backup_directory mydb

# Restore from dump
pg_restore -U postgres -d mydb -c backup_full.dump

# Parallel restore from directory
pg_restore -U postgres -d mydb -j 4 -Fd backup_directory
```

### MySQL with mysqldump

```bash
# Full backup with all options
mysqldump -u root -p --single-transaction \
  --routines --triggers --events \
  --master-data=2 \
  --all-databases > full_backup.sql

# Backup specific database
mysqldump -u root -p --single-transaction mydb > mydb_backup.sql

# Compressed backup
mysqldump -u root -p --single-transaction mydb | gzip > mydb_backup.sql.gz

# Parallel dump with MyDumper
myloader -u root -p -d /backup/mydb -B mydb
```

### SELECT INTO OUTFILE (MySQL)

```sql
-- Export table data to file
SELECT * FROM users INTO OUTFILE '/tmp/users.csv'
  FIELDS TERMINATED BY ','
  ENCLOSED BY '"'
  LINES TERMINATED BY '\n';

-- Load data back
LOAD DATA INFILE '/tmp/users.csv'
  INTO TABLE users
  FIELDS TERMINATED BY ','
  ENCLOSED BY '"'
  LINES TERMINATED BY '\n';
```

> **Note**: Logical backups can be slow for large databases because they read and format all data. For TB-scale databases, physical backups are faster.

---

## Physical Backup

Physical backups copy the actual database files (data files, WAL files, configuration). They are faster than logical backups for large databases and necessary for PITR.

### PostgreSQL with pg_basebackup

```bash
# Full physical backup
pg_basebackup -U postgres -h localhost -D /backup/base -Ft -P -z

# With WAL files (for PITR)
pg_basebackup -U postgres -h localhost -D /backup/base -Ft -P -z -X stream

# Restore physical backup
# 1. Stop PostgreSQL
# 2. Copy backup to data directory
# 3. Create recovery signal file
# 4. Start PostgreSQL
```

### MySQL with Percona XtraBackup

```bash
# Full backup
xtrabackup --backup \
  --target-dir=/backup/xtrabackup/full \
  --user=root --password=xxx

# Prepare backup (required before restore)
xtrabackup --prepare --target-dir=/backup/xtrabackup/full

# Incremental backup
xtrabackup --backup \
  --target-dir=/backup/xtrabackup/incr1 \
  --incremental-basedir=/backup/xtrabackup/full \
  --user=root --password=xxx

# Restore
xtrabackup --copy-back --target-dir=/backup/xtrabackup/full
```

### Filesystem Snapshots

```bash
# LVM snapshot (Linux)
lvcreate --size 10G --snapshot --name db_snap /dev/vg0/lv_data

# Create backup from snapshot
mount /dev/vg0/db_snap /mnt/snap
tar -czf /backup/db_snapshot_$(date +%Y%m%d).tar.gz -C /mnt/snap .
umount /mnt/snap

# Remove snapshot
lvconvert --splitmirrors /dev/vg0/db_snap
```

---

## Point-in-Time Recovery (PITR)

PITR lets you restore a database to any point in time, not just the last backup. It combines a base backup with replayed WAL (Write-Ahead Log) or binary logs.

### PostgreSQL PITR

```bash
# 1. Create named restore point
psql -U postgres -c "SELECT pg_create_restore_point('before_major_change');"

# 2. Recovery configuration (postgresql.auto.conf or recovery.conf for PG < 12)
restore_command = 'cp /backup/wal/%f %p'
recovery_target_time = '2024-01-15 10:30:00 UTC'
recovery_target_action = 'promote'

# 3. Recovery targets options:
# recovery_target_name = 'before_major_change'
# recovery_target_lsn = '0/7000060'
# recovery_target_xid = '12345'
```

```bash
# Enable WAL archiving for continuous backup
# postgresql.conf
wal_level = replica
max_wal_senders = 3
archive_mode = on
archive_command = 'rsync -a %p backup-server:/backup/wal/%f'
archive_timeout = 300  # Force switch WAL every 5 minutes
```

### MySQL PITR with Binary Logs

```ini
# my.cnf - enable binary logging
[mysqld]
server-id = 1
log_bin = /var/log/mysql/mysql-bin
binlog_format = ROW
expire_logs_days = 7
sync_binlog = 1
```

```bash
# 1. Full backup with position recorded
mysqldump -u root -p --single-transaction \
  --flush-logs --master-data=2 \
  mydb > full_backup.sql

# 2. Restore full backup
mysql -u root -p < full_backup.sql

# 3. Apply binary logs to specific point
mysqlbinlog \
  --start-datetime="2024-01-15 10:00:00" \
  --stop-datetime="2024-01-15 11:30:00" \
  /var/log/mysql/mysql-bin.000001 | mysql -u root -p

# 4. Recover to specific GTID
mysqlbinlog --gtid-only \
  --start-datetime="2024-01-15 10:00:00" \
  /var/log/mysql/mysql-bin.000001 | mysql -u root -p
```

```
PITR Flow:
Base Backup ──► WAL/Binlog Replay ──► Point-in-Time
  Jan 1              Jan 1 → Jan 15 10:30    Jan 15 10:30
```

---

## RTO and RPO

### Definitions

| Metric | Full Form | Definition | Unit |
|--------|-----------|------------|------|
| **RTO** | Recovery Time Objective | Maximum acceptable downtime | Minutes/Hours |
| **RPO** | Recovery Point Objective | Maximum acceptable data loss | Minutes/Hours/Days |

```
RPO: Time between backups = Data that can be lost

Backup Schedule    Backup    Backup    Backup    Backup
RPO=1h  ──────────────────────────────────────────►
        |<───── 1 hour of data can be lost ──────>|

Disaster! ──────►|<── RTO ──>|  ←── System online again
```

### RTO/RPO Strategy Matrix

| RPO | RTO | Backup Strategy |
|-----|-----|-----------------|
| 0 (zero data loss) | Minutes | Synchronous replication, multi-master |
| < 1 minute | < 15 minutes | Async replication + continuous WAL |
| < 1 hour | < 1 hour | Hourly incremental + daily full |
| < 24 hours | < 4 hours | Daily full backup |
| < 1 week | < 24 hours | Weekly full + daily differential |

---

## Backup Validation and Testing

> **"A backup that has never been restored is not a backup."**

### Recovery Testing Checklist

| Test | Frequency | Purpose |
|------|-----------|---------|
| Full restore to test DB | Monthly | Verify backup integrity |
| Point-in-time recovery | Quarterly | Test PITR process |
| DR drill (full failover) | Annually | Test entire DR plan |
| Restore performance test | Quarterly | Measure actual RTO |
| Cross-region restore | Annually | Verify offsite backup |

### DR Test Script

```bash
#!/bin/bash
# DR Recovery Test Script

STAGING_DB="dr_test_db"
BACKUP_FILE="/backup/latest.sql.gz"

echo "=== DR Recovery Test ==="

# 1. Drop and recreate test database
psql -U postgres -c "DROP DATABASE IF EXISTS $STAGING_DB;"
psql -U postgres -c "CREATE DATABASE $STAGING_DB;"

# 2. Restore from backup
echo "Restoring backup..."
time (gunzip -c $BACKUP_FILE | psql -U postgres $STAGING_DB)

# 3. Verify data integrity
echo "Verifying data..."
psql -U postgres -d $STAGING_DB -c "SELECT count(*) FROM users;"
psql -U postgres -d $STAGING_DB -c "SELECT count(*) FROM orders;"

# 4. Smoke tests
psql -U postgres -d $STAGING_DB -c "SELECT * FROM recent_orders LIMIT 5;"

echo "=== DR Test Completed Successfully ==="
```

### Automated Backup Health Check

```python
import boto3, datetime

def check_backup_health(bucket_name, db_name):
    """Check latest backup age and health"""
    s3 = boto3.client('s3')

    response = s3.list_objects_v2(
        Bucket=bucket_name,
        Prefix=f'postgres/{db_name}'
    )

    backups = response.get('Contents', [])
    if not backups:
        return {"status": "ERROR", "message": "No backups found!"}

    latest = max(backups, key=lambda x: x['LastModified'])
    age = datetime.datetime.now(datetime.timezone.utc) - latest['LastModified']

    if age.total_seconds() > 25 * 3600:  # Alert if older than 25 hours
        return {
            "status": "ALERT",
            "message": f"Latest backup is {age} old",
            "latest_backup": latest['Key'],
            "size_mb": latest['Size'] / (1024 * 1024)
        }

    return {
        "status": "OK",
        "latest_backup": latest['Key'],
        "age_hours": round(age.total_seconds() / 3600, 2),
        "total_backups": len(backups)
    }
```

---

## Cloud Backup Solutions

### AWS S3 with PostgreSQL

```bash
# Backup and upload to S3
pg_dump -U postgres -Fc mydb | \
  aws s3 cp - s3://my-bucket/backups/postgres/$(date +%Y%m%d).dump

# Upload with storage class
aws s3 cp /backup/full.sql.gz s3://my-bucket/backups/ \
  --storage-class STANDARD_IA

# Restore from S3
aws s3 cp s3://my-bucket/backups/$(date +%Y%m%d).dump - | \
  pg_restore -U postgres -d mydb
```

### AWS RDS Automated Backups

```yaml
# RDS PostgreSQL backup configuration
DBInstance:
  Type: AWS::RDS::DBInstance
  Properties:
    DBInstanceClass: db.r6g.xlarge
    MultiAZ: true
    BackupRetentionPeriod: 30
    PreferredBackupWindow: "02:00-03:00"
    PreferredMaintenanceWindow: "Mon:03:00-Mon:04:00"
```

### 3-2-1 Backup Rule

The gold standard of backup strategy:

- **3 copies** of data (production + 2 backups)
- **2 different storage types** (e.g., disk + cloud)
- **1 offsite copy** (in a different location for disaster recovery)

```
Production DB
    │
    ├── Local Disk Backup (Daily)
    │       │
    │       └── NAS / Separate Storage
    │               │
    │               └── Cloud Storage (S3/GCS) ──► Cross-region
    │                       │
    │                       └── Glacier (Archive)
```

---

## Best Practices and Common Mistakes

### Best Practices

| Practice | Description |
|----------|-------------|
| **Automate everything** | Backup must be automatic, not manual |
| **Verify backups** | Regularly test restore, not just backup success |
| **Multiple methods** | Use at least 2 different backup methods |
| **Offsite storage** | Always have a backup in a different location |
| **Retention policy** | Define and enforce backup retention |
| **Monitor backup jobs** | Alert when backup fails or is too old |
| **Document procedures** | Step-by-step recovery docs |
| **Encrypt backups** | Encrypt backups for security |
| **Capacity planning** | Monitor backup storage growth |

### Common Mistakes

> **Warning**: These mistakes have caused data loss at many companies.

- **Not testing restores**: Backup succeeds but file is corrupt.
- **Backing up to the same disk**: If the disk fails, you lose both DB and backup.
- **Skipping WAL archiving**: Full backup only, no PITR capability.
- **Cloud credentials expired**: Backup job silently fails.
- **Single point of failure**: Only one backup storage location.
- **Retention too short**: Bug discovered 1 week later, but retention was only 1 day.
- **DR site not tested**: DR site has data but failover never tested.

---

## Common Interview Questions

> **What is the difference between logical and physical backups?**
>
> Logical backups export data as SQL statements (INSERT, CREATE TABLE) using pg_dump or mysqldump. They are portable and work for any data size, but can be slow for TB-scale databases because they read, format, and serialize all data. Physical backups copy the raw database files (data files, WAL), which is much faster for large databases. Physical backups are required for Point-in-Time Recovery.

> **How do you achieve zero data loss (RPO = 0)?**
>
> Zero data loss requires synchronous replication where the primary waits for confirmation from replicas before acknowledging writes. This ensures every committed write exists on multiple nodes. Alternatively, use shared-storage replication with fencing. Zero data loss comes at the cost of higher write latency (network round-trip to replica).

> **How often should you test backup restoration?**
>
> At minimum, test full restore monthly to a test environment. Test PITR quarterly. Run a full DR drill annually. Every test should be documented with timing, data verification, and lessons learned. If you are not testing, you do not have a backup strategy -- you have a backup hope.

> **What is the difference between RTO and RPO?**
>
> RPO (Recovery Point Objective) measures how much data you can afford to lose -- it defines your backup frequency. RTO (Recovery Time Objective) measures how long the system can be down -- it defines your recovery speed requirements. RPO is about data; RTO is about time.
