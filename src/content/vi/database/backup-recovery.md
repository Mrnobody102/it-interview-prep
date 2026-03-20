# Chủ đề Backup và Recovery

## 1. Tổng quan về Backup

### 1.1. Tại sao Backup quan trọng?

Backup là lớp phòng thủ cuối cùng trước các rủi ro:

- **Hardware failure**: Ổ cứng hỏng, server chết, data center mất điện.
- **Human error**: Accidental DELETE, DROP TABLE, sửa sai schema.
- **Software corruption**: Bug gây corrupt data, incomplete transactions.
- **Security threats**: Ransomware, hacker tấn công xoá data.
- **Natural disasters**: Thiên tai, hoả hoạn, lũ lụt.
- **Compliance requirements**: Các quy định GDPR, SOC 2, PCI-DSS yêu cầu backup.

> **Thống kê:** Theo nghiên cứu, 93% các công ty không có backup đã phá sản trong vòng 1 năm sau khi mất dữ liệu nghiêm trọng.

### 1.2. Các loại Backup

| Loại | Mô tả | Dung lượng | Thời gian | RPO |
|---|---|---|---|---|
| **Full Backup** | Backup toàn bộ database | Lớn nhất | Dài nhất | Gần như 0 (tại thời điểm backup) |
| **Incremental** | Backup chỉ dữ liệu thay đổi từ lần backup trước | Nhỏ | Nhanh | Bằng khoảng thời gian giữa các lần incremental |
| **Differential** | Backup dữ liệu thay đổi từ lần full backup cuối | Trung gian | Trung bình | Tương đối (tùy backup schedule) |
| **Continuous Backup (CDC)** | Change Data Capture, backup liên tục | Phụ thuộc rate thay đổi | Gần real-time | Rất thấp (có thể seconds) |

```
Timeline:
Day 1: [========== FULL BACKUP ==========]
Day 2: [INCR+][INCR+][INCR+][INCR+]       # Incremental - chỉ changes từ prev
Day 3: [DIFF+        ][DIFF+        ]      # Differential - từ FULL
Day 4: [INCR+][INCR+][INCR+]
Day 5: [========== FULL BACKUP ==========]
```

---

## 2. Chiến lược Backup cho PostgreSQL

### 2.1. Full Backup với pg_dump

```bash
# Full backup - SQL dump (logical backup)
pg_dump -U postgres -Fc -f backup_full.dump mydb

# Backup compressed (nhỏ hơn)
pg_dump -U postgres -Fc mydb | gzip > backup_full.sql.gz

# Backup specific tables
pg_dump -U postgres -t public.orders -t public.users mydb > tables_backup.sql

# Backup with custom format (parallel)
pg_dump -U postgres -Fd -j 4 -f backup_directory mydb
```

```bash
# Restore from dump
# Logical dump - restore to PostgreSQL
psql -U postgres mydb < backup_full.sql

# Custom format dump (đề xuất)
pg_restore -U postgres -d mydb -c backup_full.dump

# Parallel restore from directory format
pg_restore -U postgres -d mydb -j 4 -Fd backup_directory
```

### 2.2. Physical Backup (Base Backup) với pg_basebackup

```bash
# Physical full backup - copy toàn bộ data files
pg_basebackup -U postgres -h localhost -D /backup/base -Ft -P -z

# With WAL files (đầy đủ cho PITR)
pg_basebackup -U postgres -h localhost -D /backup/base -Ft -P -z -X stream

# Restore physical backup
# 1. Stop PostgreSQL
# 2. Copy backup vào data directory
# 3. Create recovery signal
# 4. Start PostgreSQL
```

### 2.3. Incremental Backup (WAL Archiving)

```bash
# Cấu hình WAL archiving (postgresql.conf)
wal_level = replica
max_wal_senders = 3
wal_keep_size = 1GB
archive_mode = on
archive_command = 'test ! -f /backup/wal/%f && cp %p /backup/wal/%f'
archive_timeout = 300  # Force switch WAL every 5 minutes
```

```bash
# Cấu hình continuous archiving (continuous backup)
# WAL = Write-Ahead Log, chứa tất cả changes
archive_command = 'rsync -a %p backup-server:/backup/wal/%f'
```

### 2.4. Automated Backup Script cho PostgreSQL

```bash
#!/bin/bash
# PostgreSQL Backup Script

BACKUP_DIR="/var/backups/postgres"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="mydb"
RETENTION_DAYS=30

# Tạo full backup
echo "Starting full backup at $DATE"
pg_dump -U postgres -Fc -f "$BACKUP_DIR/full_${DATE}.dump" $DB_NAME

# Compress
gzip "$BACKUP_DIR/full_${DATE}.dump"

# Xoá backup cũ hơn retention
find $BACKUP_DIR -name "full_*.dump.gz" -mtime +$RETENTION_DAYS -delete

# Backup WAL archives (continuous)
# (WAL archiving phải được enable trong postgresql.conf)

echo "Backup completed"
```

---

## 3. Chiến lược Backup cho MySQL

### 3.1. mysqldump - Logical Backup

```bash
# Full backup toàn bộ database
mysqldump -u root -p --single-transaction \
  --routines --triggers --events \
  --master-data=2 \
  --all-databases > full_backup.sql

# Backup specific database
mysqldump -u root -p --single-transaction \
  mydb > mydb_backup.sql

# Backup với compressed output
mysqldump -u root -p --single-transaction mydb | gzip > mydb_backup.sql.gz

# Backup với parallel (MyDumper)
myloader -u root -p -d /backup/mydb -B mydb
```

### 3.2. Physical Backup với Percona XtraBackup

```bash
# Full backup với XtraBackup
xtrabackup --backup \
  --target-dir=/backup/xtrabackup/full \
  --user=root \
  --password=xxx

# Prepare backup (để có thể restore)
xtrabackup --prepare --target-dir=/backup/xtrabackup/full

# Incremental backup
xtrabackup --backup \
  --target-dir=/backup/xtrabackup/incr1 \
  --incremental-basedir=/backup/xtrabackup/full \
  --user=root --password=xxx

# Restore from backup
xtrabackup --copy-back --target-dir=/backup/xtrabackup/full
```

```bash
# Incremental backup chain
# Full -> Incr1 -> Incr2 -> Incr3
# Restore: Full + Incr1 + Incr2 + Incr3
xtrabackup --backup \
  --target-dir=/backup/xtrabackup/incr2 \
  --incremental-basedir=/backup/xtrabackup/incr1 \
  --user=root --password=xxx
```

### 3.3. Point-in-Time Recovery (PITR) với Binary Logs

```bash
# Enable binary logging (my.cnf)
[mysqld]
server-id = 1
log_bin = /var/log/mysql/mysql-bin
binlog_format = ROW
expire_logs_days = 7
sync_binlog = 1
```

```bash
# Full backup
mysqldump -u root -p --single-transaction \
  --flush-logs --master-data=2 \
  mydb > full_backup.sql

# Recover to point-in-time
# 1. Restore full backup
mysql -u root -p < full_backup.sql

# 2. Apply binary logs đến specific point
mysqlbinlog \
  --start-datetime="2024-01-15 10:00:00" \
  --stop-datetime="2024-01-15 11:30:00" \
  /var/log/mysql/mysql-bin.000001 | mysql -u root -p

# Recover đến specific GTID
mysqlbinlog --gtid-only \
  --start-datetime="2024-01-15 10:00:00" \
  /var/log/mysql/mysql-bin.000001 | mysql -u root -p
```

---

## 4. Point-in-Time Recovery (PITR)

### 4.1. PITR là gì?

Point-in-Time Recovery cho phép khôi phục database đến bất kỳ thời điểm nào trong quá khứ, không chỉ là thời điểm backup gần nhất.

### 4.2. PostgreSQL PITR

```bash
# 1. Full base backup (đã có từ pg_basebackup)
# 2. Configure WAL archiving (đã có từ section 2.3)
# 3. Tạo restore point khi cần
psql -U postgres -c "SELECT pg_create_restore_point('before_major_change');"

# 4. Recovery configuration (postgresql.auto.conf)
restore_command = 'cp /backup/wal/%f %p'
recovery_target_time = '2024-01-15 10:30:00 UTC'
recovery_target_action = 'promote'

# Hoặc recovery đến named restore point
# recovery_target_name = 'before_major_change'

# Hoặc recovery đến LSN cụ thể
# recovery_target_lsn = '0/7000060'
```

```bash
# Tạo recovery.conf / postgresql.conf cho PITR
# PostgreSQL 12+ (recovery config in postgresql.conf)
# postgresql.conf
restore_command = 'cp /backup/wal/%f %p'
recovery_target_timeline = 'latest'
recovery_target_action = 'promote'

# Trigger file để bắt đầu recovery
# Tạo file này khi muốn kết thúc recovery
# touch /var/lib/postgresql/data/recovery.signal
```

### 4.3. MySQL PITR

```bash
# Recovery flow:
# 1. Restore full backup gần nhất
# 2. Apply all binlog files sau backup đến target time

# Xác định binlog position từ backup
# (Xem trong backup file: --position=12345678)

# Apply binary logs
mysqlbinlog \
  --start-position=12345678 \
  --stop-datetime="2024-01-15 14:30:00" \
  mysql-bin.000001 mysql-bin.000002 mysql-bin.000003 \
  | mysql -u root -p
```

---

## 5. Backup Storage và Retention

### 5.1. Chiến lược 3-2-1

Quy tắc backup phổ biến nhất:

- **3 bản copy** của dữ liệu (production + 2 backups).
- **2 loại storage** khác nhau (ví dụ: disk + cloud).
- **1 bản offsite** (đặt ở location khác, phòng disaster).

```
Production DB
    │
    ├── Local Disk Backup (Daily)
    │       │
    │       └── NAS / Separate Storage
    │               │
    │               └── Cloud Storage (S3 / GCS) ──► Cross-region
    │                       │
    │                       └── Glacier (Archive)
```

### 5.2. Cloud Backup Configuration

```bash
# AWS S3 backup với PostgreSQL
# Cấu hình pg_dump → S3

# Install AWS CLI
pip install awscli

# Backup và upload lên S3
pg_dump -U postgres -Fc mydb | \
  aws s3 cp - s3://my-bucket/backups/postgres/$(date +%Y%m%d).dump

# Upload local backup lên S3
aws s3 cp /backup/full.sql.gz s3://my-bucket/backups/ \
  --storage-class STANDARD_IA \
  --metadata '{"backup-date":"2024-01-15"}'

# Restore từ S3
aws s3 cp s3://my-bucket/backups/$(date +%Y%m%d).dump - | \
  pg_restore -U postgres -d mydb
```

```python
# Python: Automated S3 backup với retention
import boto3, subprocess, datetime

def backup_to_s3():
    s3 = boto3.client('s3')
    date = datetime.datetime.now().strftime('%Y%m%d')
    backup_file = f'/tmp/backup_{date}.dump'

    # Run pg_dump
    subprocess.run([
        'pg_dump', '-U', 'postgres', '-Fc', '-f', backup_file, 'mydb'
    ])

    # Upload to S3
    s3.upload_file(
        backup_file,
        'my-backup-bucket',
        f'postgres/{date}.dump',
        ExtraArgs={
            'StorageClass': 'GLACIER_IR',  # Instant Retrieval
            'Metadata': {'backup-date': date}
        }
    )

def cleanup_old_backups(retention_days=30):
    """Xoá backup cũ hơn retention period"""
    cutoff = datetime.datetime.now() - datetime.timedelta(days=retention_days)

    # List và xoá objects cũ
    paginator = s3.get_paginator('list_objects_v2')
    for page in paginator.paginate(Bucket='my-backup-bucket'):
        for obj in page.get('Contents', []):
            if obj['LastModified'] < cutoff:
                print(f"Deleting: {obj['Key']}")
                s3.delete_object(
                    Bucket='my-backup-bucket',
                    Key=obj['Key']
                )
```

### 5.3. Backup Encryption

```bash
# Mã hoá backup trước khi lưu trữ

# Sử dụng GPG
gpg --batch --yes --symmetric \
  --cipher-algo AES256 \
  --passphrase "your-secure-passphrase" \
  backup.sql

# Upload encrypted backup
aws s3 cp backup.sql.gpg s3://my-bucket/backups/

# Restore: Download → Decrypt → Restore
aws s3 cp s3://my-bucket/backups/backup.sql.gpg - | \
  gpg --batch --decrypt --passphrase "your-secure-passphrase" | \
  psql -U postgres mydb
```

---

## 6. RTO và RPO

### 6.1. Định nghĩa

| Chỉ số | Viết tắt | Định nghĩa | Mục tiêu |
|---|---|---|---|
| **RTO** | Recovery Time Objective | Thời gian tối đa để khôi phục hệ thống | Thường tính bằng phút/giờ |
| **RPO** | Recovery Point Objective | Lượng dữ liệu tối đa có thể chấp nhận mất | Thường tính bằng phút/giờ/ngày |

```
RPO: Thời gian giữa 2 backup = Dữ liệu có thể mất
RTO: Thời gian restore + Deploy = Thời gian downtime

Backup Schedule    B̶a̶c̶k̶u̶p̶    B̶a̶c̶k̶u̶p̶    B̶a̶c̶k̶u̶p̶    B̶a̶c̶k̶u̶p̶
RPO=1h  ──────────────────────────────────────────►
        |<───── 1 giờ data có thể mất ──────>|

Disaster! ──────►|<── RTO ──>|  ←── Hệ thống online lại
```

### 6.2. Mối quan hệ RTO/RPO với Chiến lược Backup

| RPO | RTO | Chiến lược Backup |
|---|---|---|
| 0 (zero data loss) | Minutes | Synchronous replication, multi-master, continuous backup |
| < 1 minute | < 15 minutes | Async replication + continuous WAL, RAID |
| < 1 hour | < 1 hour | Hourly incremental + daily full |
| < 24 hours | < 4 hours | Daily full backup |
| < 1 week | < 24 hours | Weekly full + daily differential |

### 6.3. Ví dụ tính toán RTO/RPO

```python
# Ví dụ: PostgreSQL với chiến lược backup
config = {
    "full_backup_duration_hours": 2,
    "full_backup_interval_hours": 24,
    "incremental_backup_interval_minutes": 60,
    "restore_speed_gb_per_minute": 5,  # 5GB/phút restore
    "database_size_gb": 500,
    "network_recovery_hours": 1,
}

# Tính RPO
rpo_hours = config["incremental_backup_interval_minutes"] / 60
print(f"RPO: {rpo_hours} giờ")  # 1 giờ

# Tính RTO
restore_time = config["database_size_gb"] / config["restore_speed_gb_per_minute"]
rto_minutes = restore_time + config["network_recovery_hours"] * 60
print(f"RTO ước tính: {rto_minutes} phút")  # ~140 phút
```

---

## 7. Disaster Recovery (DR)

### 7.1. DR Plan Components

Một kế hoạch DR toàn diện bao gồm:

1. **Risk Assessment**: Xác định các rủi ro và impact.
2. **Recovery Objectives**: Xác định RTO/RPO cho từng hệ thống.
3. **Backup Strategy**: Full, incremental, continuous.
4. **Recovery Procedures**: Step-by-step instructions.
5. **Communication Plan**: Ai thông báo cho ai, kênh nào.
6. **Testing Schedule**: DR test thường xuyên.
7. **Roles & Responsibilities**: Ai làm gì trong tình huống khẩn cấp.

### 7.2. DR Architectures

#### Standby Database (Physical Replication)

```
Primary Site                     DR Site
┌────────────────┐              ┌────────────────┐
│  PostgreSQL    │──WAL Stream──►  PostgreSQL   │
│    Primary     │              │    Standby     │
└────────────────┘              └────────────────┘
                                        │
                               Async Replication (có lag)
```

#### Cross-Region Read Replica as DR

```bash
# PostgreSQL: Tạo cross-region standby
pg_basebackup -h primary-db.example.com -U replication \
  -D /var/lib/postgresql/15/main \
  -R -P -Xs -Z

# Replication slots để đảm bảo WAL không bị xoá
psql -h localhost -c "SELECT * FROM pg_create_physical_replication_slot('dr_slot');"
```

#### Cloud-Native DR

```yaml
# AWS RDS PostgreSQL - Multi-AZ Deployment
# (tự động tạo standby ở AZ khác)
DBInstance:
  Type: AWS::RDS::DBInstance
  Properties:
    DBInstanceClass: db.r6g.xlarge
    MultiAZ: true
    StorageType: gp3
    BackupRetentionPeriod: 30
    PreferredBackupWindow: "02:00-03:00"
    PreferredMaintenanceWindow: "Mon:03:00-Mon:04:00"
```

```python
# AWS RDS: Automated backups configuration
import boto3

rds = boto3.client('rds')

# Modify DB instance với backup settings
rds.modify_db_instance(
    DBInstanceIdentifier='my-production-db',
    BackupRetentionPeriod=30,
    PreferredBackupWindow='02:00-03:00',
    BackupTarget='region',  # Cross-region backup
    FinalDBSnapshotIdentifier='final-snapshot-before-dr'
)
```

### 7.3. Failover và Switchover

```sql
-- PostgreSQL: Manual failover (pgpool or Patroni)
-- pgpool-II
pgpool -m fast -t 0 stop  # Trigger failover

-- Patroni
patronictl switchover --cluster mydb --candidate replica1

-- MySQL: Manual failover (MySQL Router / Orchestrator)
-- Orchestrator
orchestrator -c move-upstream -i replica1

-- MySQL Router automatic failover
# (Cấu hình MySQL InnoDB Cluster với MySQL Router)
```

---

## 8. Database Snapshot

### 8.1. Database Snapshots là gì?

Snapshot là bản sao trạng thái database tại một thời điểm, sử dụng Copy-on-Write (COW) mechanism.

### 8.2. PostgreSQL Snapshots

```sql
-- PostgreSQL không có native snapshot như Oracle
-- Nhưng có thể dùng transaction isolation

BEGIN;

-- Set transaction snapshot từ pg_export_snapshot
SET TRANSACTION SNAPSHOT '00000003-0000001D-1';

-- Hoặc dùng pg_dump với snapshot
pg_dump -Fd -j 4 -S my_snapshot -f backup_dir mydb
```

### 8.3. Cloud Provider Snapshots

```bash
# AWS EBS Volume Snapshot (cho RDS data volume)
aws ec2 create-snapshot \
  --volume-id vol-0abcdef1234567890 \
  --description "Pre-maintenance snapshot" \
  --tag-specifications 'ResourceType=snapshot,Tags=[{Key=Purpose,Value=DR}]'

# Google Cloud SQL - Automated backups
gcloud sql instances patch my-instance \
  --backup-start-time=02:00 \
  --enable-bin-log \
  --retained-backups-count=30

# Azure SQL - Automated backup
az sql db show --resource-group mygroup \
  --server myserver --name mydb \
  --query "currentBackupRetentionDays"
```

---

## 9. Recovery Testing

### 9.1. Tại sao phải Test Recovery?

Backup không verify = backup không đáng tin cậy.

```
"Backup is only as good as your last successful restore"
```

### 9.2. Recovery Testing Checklist

| Test | Tần suất | Mục tiêu |
|---|---|---|
| Full restore to test DB | Hàng tháng | Verify backup integrity |
| Point-in-time recovery | Hàng quý | Test PITR process |
| DR drill (full failover) | Hàng năm | Test entire DR plan |
| Restore performance test | Hàng quý | Measure actual RTO |
| Cross-region restore | Hàng năm | Verify offsite backup |

### 9.3. DR Test Script

```bash
#!/bin/bash
# DR Test Script - chạy trên isolated environment

STAGING_DB="dr_test_db"
BACKUP_FILE="/backup/latest.sql.gz"

echo "=== DR Recovery Test ==="
echo "Time: $(date)"

# 1. Stop staging application
# kubectl scale deployment myapp --replicas=0

# 2. Drop test database if exists
psql -U postgres -c "DROP DATABASE IF EXISTS $STAGING_DB;"

# 3. Create fresh database
psql -U postgres -c "CREATE DATABASE $STAGING_DB;"

# 4. Restore from backup
echo "Restoring backup..."
time (gunzip -c $BACKUP_FILE | psql -U postgres $STAGING_DB)

# 5. Verify data integrity
echo "Verifying data..."
psql -U postgres -d $STAGING_DB -c "SELECT count(*) FROM users;"
psql -U postgres -d $STAGING_DB -c "SELECT count(*) FROM orders;"

# 6. Run smoke tests
psql -U postgres -d $STAGING_DB -c "SELECT * FROM recent_orders LIMIT 5;"

# 7. Test PITR capability
echo "Testing PITR..."
# (Apply incremental backups if available)

# 8. Generate report
echo "=== DR Test Completed ==="
echo "Duration: $(date)"
echo "Status: SUCCESS"
```

---

## 10. Best Practices và Common Mistakes

### 10.1. Best Practices

| Best Practice | Mô tả |
|---|---|
| **Automate everything** | Backup phải tự động, không phụ thuộc manual process |
| **Verify backups** | Thường xuyên test restore, không chỉ backup thành công |
| **Multiple backup methods** | Dùng ít nhất 2 phương pháp backup khác nhau |
| **Offsite storage** | Backup phải có bản ở location khác |
| **Retention policy** | Có chính sách xoá backup cũ hợp lý |
| **Monitor backup jobs** | Alert khi backup fail hoặc backup quá cũ |
| **Document recovery procedures** | Step-by-step docs, không phải trong đầu người nào đó |
| **Encrypt backups** | Mã hoá backup để bảo mật |
| **Capacity planning** | Monitor backup storage growth |

### 10.2. Common Mistakes

> **Cảnh báo:** Những lỗi phổ biến dưới đây đã khiến nhiều công ty mất dữ liệu.

- **Backup không verify**: Backup thành công nhưng file corrupt.
- **Backup cùng disk với DB**: Disk fail = mất cả DB và backup.
- **Không test restore**: Chỉ chạy backup, không bao giờ thử restore.
- **Retention quá ngắn**: Giữ backup 1 ngày, nhưng bug phát hiện sau 1 tuần.
- **Quên WAL**: Chỉ backup full, không enable WAL archiving -> không PITR được.
- **Backup credentials expired**: Cloud credentials expire, backup không chạy.
- **Single point of failure**: Chỉ có 1 backup storage duy nhất.
- **DR site không tested**: DR site có data nhưng không bao giờ test failover.

### 10.3. Monitoring Backup Health

```sql
-- PostgreSQL: Check backup status
SELECT
    ps.data_type,
    ps.total_size,
    ps.free_size,
    (ps.total_size - ps.free_size) AS used_size
FROM pg_tablespace_size('pg_default') AS ps;

-- Check pg_stat_bgwriter
SELECT * FROM pg_stat_bgwriter;
```

```python
# Python: Backup health monitoring
import boto3, datetime

def check_backup_health(bucket_name, db_name):
    """Kiểm tra backup gần nhất và health"""
    s3 = boto3.client('s3')

    # List backup files
    response = s3.list_objects_v2(
        Bucket=bucket_name,
        Prefix=f'postgres/{db_name}'
    )

    backups = response.get('Contents', [])
    if not backups:
        return {"status": "ERROR", "message": "No backups found!"}

    # Check latest backup age
    latest = max(backups, key=lambda x: x['LastModified'])
    age = datetime.datetime.now(datetime.timezone.utc) - latest['LastModified']

    # Alert if backup older than 25 hours
    if age.total_seconds() > 25 * 3600:
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

## 11. Database Migration với Zero Data Loss

### 11.1. Blue-Green Deployment cho Database

```
Blue Environment          Green Environment (New)
┌──────────────┐          ┌──────────────┐
│ DB Primary   │──sync───►│ DB Replica   │
│   (Write)    │          │   (Standby)  │
└──────────────┘          └──────────────┘
     │                          │
     │ Cutover                   │
     └──────────────────────────┘
         Traffic switch
```

### 11.2. Validate Backup Completeness

```bash
#!/bin/bash
# Validate backup completeness

BACKUP_FILE=$1
EXPECTED_TABLES=("users" "orders" "products" "categories")

echo "Validating backup: $BACKUP_FILE"

# List tables in backup
TABLES=$(pg_restore -l "$BACKUP_FILE" | grep TABLE | awk '{print $3}')

for table in "${EXPECTED_TABLES[@]}"; do
    if echo "$TABLES" | grep -q "$table"; then
        echo "[OK] Table found: $table"
    else
        echo "[ERROR] Table missing: $table"
    fi
done

# Check row counts consistency
pg_restore -d postgres://localhost/test_restore "$BACKUP_FILE"
psql -c "SELECT count(*) FROM users;"

echo "Validation complete"
```
