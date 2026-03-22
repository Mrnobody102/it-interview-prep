# Database -> Database Migration

## Tai sao Database Migration quan trong

Database migration la viec version-control cac thay doi schema (CREATE TABLE, ALTER COLUMN, etc.) cung voi code application. Khong co he thong migration, cac thay doi schema tro thanh nhung script nguy hiem khong the theo doi, review, va roll back.

Cac van de chinh ma no giai quyet:
- **Trang thai schema khong ro rang**: Database production dang o version nao? Nhung thay doi nao dang cho?
- **Drift thu cong**: Developer ap dung thay doi thu cong, dan den moi truong khong nhat quan.
- **Khong co duong lui**: Lam the nao undo mot cot drop o production?
- **Coupling deployment**: Code va thay doi schema phai duoc deploy theo dung thu tu.

Mot cong cu migration theo doi scripts da duoc ap dung, duy tri lich su version, va dam bao migrations chay dung thu tu tren tat ca moi truong.

---

## Flyway

### Khai niem Core

Flyway su dung **versioned migration files** luu tru trong thu muc `db/migration`. Moi file co mot version number doc lap. Flyway theo doi cac versions da ap dung trong bang `flyway_schema_history`.

### Quy uoc dat ten

```
V1__init.sql
V2__add_users_table.sql
V3__add_orders_table.sql
V4__add_user_email_index.sql
V5__rename_user_column.sql
V6__drop_legacy_table.sql
```

- Prefix `V` = versioned migration (chay mot lan, khong chay lai)
- Version phai la duy nhat
- Double underscore (`__`) phan tach version khoi mo ta
- Mo ta su dung underscores hoac camelCase
- Prefix `R__` = repeatable migration (chay lai moi lan, vd: stored procedures)
- Prefix `U__` = undo migration (Flyway Teams/Enterprise)

### Cac lenh

```bash
# Apply tat ca pending migrations
flyway migrate

# Kiem tra trang thai hien tai
flyway info

# Undo migration cuoi cung (Teams/Enterprise)
flyway undo

# Repair metadata table (xu ly interrupted migrations)
flyway repair

# Clean (NGUY HIEM: xoa tat ca objects -- chi dev!)
flyway clean

# Baseline mot database da co
flyway baseline -version=1 -description="Start from existing schema"
```

### Vi du Migration File

```sql
-- V1__init.sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
```

```sql
-- V2__add_roles_table.sql
CREATE TABLE roles (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE user_roles (
    user_id BIGINT NOT NULL REFERENCES users(id),
    role_id BIGINT NOT NULL REFERENCES roles(id),
    PRIMARY KEY (user_id, role_id)
);
```

```sql
-- V3__add_user_status.sql
ALTER TABLE users ADD COLUMN status VARCHAR(20) DEFAULT 'active';

-- Idempotent: an toan khi chay lai
ALTER TABLE users ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active';
```

### Callback Hooks

Callbacks cho phep chay custom SQL tai cac diem cu the trong migration lifecycle:

| Callback | Khi nao |
|---------|---------|
| `beforeMigrate.sql` | Truoc moi migration |
| `afterMigrate.sql` | Sau moi migration thanh cong |
| `beforeEachMigrate.sql` | Truoc moi migration cu the |
| `afterEachMigrate.sql` | Sau moi migration cu the |
| `beforeBaseline.sql` | Truoc baseline operation |
| `beforeClean.sql` | Truoc clean operation |

```sql
-- db/migration/callbacks/beforeMigrate__log.sql
INSERT INTO migration_log (event, timestamp)
VALUES ('migration_start', CURRENT_TIMESTAMP);
```

Flyway config cho callbacks:

```properties
flyway.callbacks=com.example.flyway.CustomCallback
flyway.defaultCallbackLocations=classpath:db/migration/callbacks
```

### Tich hop Spring Boot

```xml
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-core</artifactId>
</dependency>
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-database-postgresql</artifactId>
</dependency>
```

```yaml
spring:
  flyway:
    enabled: true
    locations: classpath:db/migration
    baseline-on-migrate: true
    baseline-version: 0
    validate-on-migrate: true
    out-of-order: false  # set true for hotfix branches
    encoding: UTF-8
```

---

## Liquibase

### Khai niem Core

Liquibase theo doi cac thay doi trong **changelog files** (XML, YAML, JSON, hoac SQL format). Moi thay doi duoc bao trong mot `<changeset>`. Liquibase duy tri bang `databasechangelog` de theo doi changeset nao da duoc ap dung.

### Cac Changelog Formats

#### XML (Format chinh)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<databaseChangeLog
    xmlns="http://www.liquibase.org/xml/ns/dbchangelog"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.liquibase.org/xml/ns/dbchangelog
        http://www.liquibase.org/xml/ns/dbchangelog/dbchangelog-4.25.xsd">

    <changeSet id="1" author="huy">
        <createTable tableName="users">
            <column name="id" type="BIGINT" autoIncrement="true">
                <constraints primaryKey="true"/>
            </column>
            <column name="username" type="VARCHAR(100)">
                <constraints nullable="false" unique="true"/>
            </column>
            <column name="email" type="VARCHAR(255)">
                <constraints nullable="false" unique="true"/>
            </column>
            <column name="created_at" type="TIMESTAMP" defaultValueComputed="CURRENT_TIMESTAMP"/>
        </createTable>
    </changeSet>

    <changeSet id="2" author="huy">
        <createIndex tableName="users" indexName="idx_users_email">
            <column name="email"/>
        </createIndex>
    </changeSet>

</databaseChangeLog>
```

#### YAML

```yaml
databaseChangeLog:
  - changeSet:
      id: 1
      author: huy
      changes:
        - createTable:
            tableName: users
            columns:
              - column:
                  name: id
                  type: BIGINT
                  autoIncrement: true
                  constraints:
                    primaryKey: true
              - column:
                  name: username
                  type: VARCHAR(100)
                  constraints:
                    nullable: false
              - column:
                  name: email
                  type: VARCHAR(255)
                  constraints:
                    nullable: false
```

### Cac Change Types pho bien

| Change Type | Mo ta |
|------------|-------|
| `<createTable>` | Tao bang moi |
| `<dropTable>` | Xoa bang |
| `<addColumn>` | Them cot vao bang |
| `<dropColumn>` | Xoa cot |
| `<renameColumn>` | Doi ten cot |
| `<alterColumn>` | Sua doi dinh nghia cot |
| `<createIndex>` | Tao index |
| `<dropIndex>` | Xoa index |
| `<insert>` | Chen du lieu |
| `<update>` | Cap nhat du lieu |
| `<delete>` | Xoa du lieu |
| `<sql>` | Chay SQL tuy y |
| `<createSequence>` | Tao sequence |
| `<addForeignKeyConstraint>` | Them FK relationship |
| `<createView>` | Tao view |

### Them vi du ve Change Types

```xml
<!-- Add column -->
<changeSet id="3" author="huy">
    <addColumn tableName="users">
        <column name="status" type="VARCHAR(20)" defaultValue="active"/>
    </addColumn>
</changeSet>

<!-- Insert data -->
<changeSet id="4" author="huy">
    <insert tableName="roles">
        <column name="id" valueNumeric="1"/>
        <column name="name" value="admin"/>
    </insert>
    <insert tableName="roles">
        <column name="id" valueNumeric="2"/>
        <column name="name" value="user"/>
    </insert>
</changeSet>

<!-- Arbitrary SQL -->
<changeSet id="5" author="huy">
    <sql>
        UPDATE users SET status = 'active'
        WHERE status IS NULL;
    </sql>
    <rollback>
        UPDATE users SET status = NULL WHERE status = 'active';
    </rollback>
</changeSet>

<!-- Rename column -->
<changeSet id="6" author="huy">
    <renameColumn tableName="users" oldColumnName="user_name"
                  newColumnName="username"/>
</changeSet>
```

### Contexts va Labels

**Contexts** loc changesets nao chay trong moi truong nao:

```xml
<changeSet id="7" author="huy">
    <addColumn tableName="users">
        <column name="phone" type="VARCHAR(20)"/>
    </addColumn>
</changeSet>
```

Chay voi context:
```bash
liquibase update --contexts=test,dev
liquibase update --contexts=prod
```

**Labels** cung cap mot cach loc khac:

```xml
<changeSet id="8" author="huy" labels="release-2.0,feature-users">
    <addColumn tableName="users">
        <column name="avatar_url" type="VARCHAR(500)"/>
    </addColumn>
</changeSet>
```

```bash
liquibase update --labels="release-2.0"
```

### Rollback

```xml
<changeSet id="9" author="huy">
    <createTable tableName="audit_log">
        <column name="id" type="BIGINT" autoIncrement="true">
            <constraints primaryKey="true"/>
        </column>
        <column name="action" type="VARCHAR(100)"/>
    </createTable>
    <rollback>
        <dropTable tableName="audit_log"/>
    </rollback>
</changeSet>
```

```bash
# Generate rollback SQL
liquibase rollback-sql --count=1

# Rollback one version
liquibase rollback --changeset 9:huy

# Rollback to a tag
liquibase rollback --tag=v1.0.0
```

### Tich hop Spring Boot

```xml
<dependency>
    <groupId>org.liquibase</groupId>
    <artifactId>liquibase-core</artifactId>
</dependency>
```

```yaml
spring:
  liquibase:
    enabled: true
    change-log: classpath:db/changelog/db.changelog-master.xml
    contexts: dev
    labels: release-1.0
    drop-first: false
    default-schema: public
```

---

## Flyway vs Liquibase - So sanh

| Khia canh | Flyway | Liquibase |
|-----------|--------|-----------|
| **Cach tien** | Versioned SQL scripts | Declarative change definitions |
| **Kiem soat SQL** | Full SQL (ban tu viet) | Generated tu change types |
| **Rollback** | Undo migrations (tra phi) hoac thu cong | Built-in qua `<rollback>` blocks |
| **Format** | Raw SQL files | XML, YAML, JSON, hoac SQL |
| **Linh hoat** | Cao (pure SQL) | Trung binh (constrained DSL) |
| **Duong cong hoc** | Thap (chi SQL) | Trung binh (DSL + formats) |
| **Do phuc tap** | Don gian cho migrations tuan thu | Tot hon cho logic co dieu kien phuc tap |
| **Thuong mai** | Tra phi: Undo, Baseline, Callbacks | Tra phi: Pro/Enterprise features |
| **Tot nhat cho** | Teams viet SQL, DBA tham gia | Cross-DB portability, declarative mong muon |

> **Tip**: Chon Flyway neu team viet SQL tot va muon su don gian. Chon Liquibase neu can cross-database compatibility (Oracle, SQL Server, PostgreSQL) hoac muon declarative change definitions.

---

## Version-Based vs State-Based Migration

### Version-Based (Migration-Based)

Moi thay doi la mot version tuan tu. Ban apply changes tu incremental tu baseline.

- **Flyway** la vi du chinh.
- Moi file dai dien cho mot delta giua cac trang thai.
- Rollback la explicit (undo scripts hoac thu cong).
- Lich su tuyen tinh -- de hieu da thay doi gi.

```
V1 -> V2 -> V3 -> V4 -> V5
```

### State-Based (Model-Based)

Ban dinh nghia **desired end state**, va tool tinh toan diff giua model va trang thai database hien tai.

- Tools nhu Liquibase (voi `<diff>`), Rails migrations, Django migrations.
- Ban viet target schema, tool generate changeset.
- Tot hon khi schema definition la source of truth.

### Hybrid Approach

Nhieu teams dung ca hai: state-based cho initial scaffolding (Liquibase diff), version-based cho ongoing changes.

---

## Best Practices

### 1. Idempotent Scripts

Luon viet migrations co the chay lai an toan:

```sql
-- Bad
CREATE TABLE users (...);

-- Good (idempotent)
CREATE TABLE IF NOT EXISTS users (...);
ALTER TABLE users ADD COLUMN IF NOT EXISTS status VARCHAR(20);
```

```xml
<!-- Liquibase: preConditions -->
<changeSet id="5" author="huy">
    <preConditions onFail="MARK_RAN">
        <not>
            <columnExists tableName="users" columnName="status"/>
        </not>
    </preConditions>
    <addColumn tableName="users">
        <column name="status" type="VARCHAR(20)"/>
    </addColumn>
</changeSet>
```

### 2. Khong tron Schema va Data Migration

Bad:
```sql
-- KHONG lam dieu nay
CREATE TABLE new_users (...);
INSERT INTO new_users SELECT * FROM old_users;
DROP TABLE old_users;
```

Good:
```sql
-- V1: Schema change only
CREATE TABLE new_users (...);
```

```sql
-- V2: Data migration only
INSERT INTO new_users SELECT * FROM old_users WHERE deleted = false;
```

### 3. Giu Migrations Nho va Tập trung

Moi migration nen lam mot viec:
- Mot bang moi per migration
- Mot cot addition per migration
- Group related index creations cung nhau

### 4. Su dung Transactional Migrations

```sql
BEGIN;

CREATE TABLE orders (...);
CREATE INDEX idx_orders_user ON orders(user_id);

COMMIT;
```

Neu DB ho tro DDL trong transactions (PostgreSQL), migration that bai atomic. MySQL's DDL auto-committed, nen can than.

### 5. Backup truoc Migration

Luon take backup truoc khi chay migrations tren production:

```bash
pg_dump -U postgres mydb > pre_migration_$(date +%Y%m%d).sql
```

### 6. Test Migrations tren Production-Sized Data

Migration hoat dong tren 100 rows co the timeout tren 10 triệu rows. Luon test tren mot data clone.

---

## Cau hoi phong van thuong gap

> **Làm thế nào xử lý database migrations trong zero-downtime deployment?**
>
> Su dung **expand-contract pattern**: dau tien expand schema (them cot nullable, bang moi), deploy application, sau do contract schema (them constraints, drop cot cu) trong migration riêng. Su dung blue-green deployments voi read-only window. Tuyet doi khong drop cot hoac constraints trong cung migration ma remove usage khoi code.

> **Làm thế nào phục hồi từ migration that bai?**
>
> Voi Flyway: su dung `flyway repair` de sua metadata, sau do chay lai migration hoac thu cong fix va mark as applied. Voi Liquibase: su dung `liquibase rollback` hoac thu cong sua lai trang thai. Luon co rollback plan da test truoc khi apply len production.

> **Flyway hay Liquibase: ban thich cai nao va tai sao?**
>
> Flyway duoc ua chuong hon cho SQL-centric teams vi no su dung raw SQL (duong cong hoc thap, kiem soat day du). Liquibase duoc ua chuong khi can cross-database compatibility, declarative change tracking, hoac sophisticated rollback logic. Lua chon thuong phu thuoc vao team quen voi SQL hay XML/YAML.
