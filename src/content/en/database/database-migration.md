# Database -> Database Migration

## Why Database Migration Matters

Database migration is the practice of version-controlling schema changes (CREATE TABLE, ALTER COLUMN, etc.) alongside application code. Without a migration system, schema changes become risky one-off scripts that are hard to track, review, and roll back.

Key problems it solves:
- **Unknown schema state**: What version is the production database on? What changes are pending?
- **Manual drift**: Developers apply changes manually, leading to environment inconsistency.
- **No rollback path**: How do you undo a column drop in production?
- **Deployment coupling**: Code and schema changes must be deployed in exact order.

A migration tool tracks which scripts have been applied, maintains a version history, and ensures migrations run in the correct order across all environments.

---

## Flyway

### Core Concept

Flyway uses **versioned migration files** stored in a `db/migration` directory. Each file has a unique version number. Flyway tracks applied versions in a `flyway_schema_history` table.

### Naming Convention

```
V1__init.sql
V2__add_users_table.sql
V3__add_orders_table.sql
V4__add_user_email_index.sql
V5__rename_user_column.sql
V6__drop_legacy_table.sql
```

- `V` prefix = versioned migration (run once, never re-run)
- Version must be unique
- Double underscore (`__`) separates version from description
- Description uses underscores or camelCase
- `R__` prefix = repeatable migration (re-run every time, e.g., stored procedures)
- `U__` prefix = undo migration (Flyway Teams/Enterprise)

### Commands

```bash
# Apply all pending migrations
flyway migrate

# Check current status
flyway info

# Undo the last migration (Teams/Enterprise)
flyway undo

# Repair metadata table (handles interrupted migrations)
flyway repair

# Clean (DANGER: drops all objects -- dev only!)
flyway clean

# Baseline existing database
flyway baseline -version=1 -description="Start from existing schema"
```

### Migration File Example

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

-- Idempotent: safe to re-run
ALTER TABLE users ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active';
```

### Callback Hooks

Callbacks let you run custom SQL at specific points during the migration lifecycle:

| Callback | When |
|----------|------|
| `beforeMigrate.sql` | Before each migration |
| `afterMigrate.sql` | After each successful migration |
| `beforeEachMigrate.sql` | Before every individual migration |
| `afterEachMigrate.sql` | After every individual migration |
| `beforeBaseline.sql` | Before baseline operation |
| `beforeClean.sql` | Before clean operation |

```sql
-- db/migration/callbacks/beforeMigrate__log.sql
INSERT INTO migration_log (event, timestamp)
VALUES ('migration_start', CURRENT_TIMESTAMP);
```

Flyway config for callbacks:

```properties
flyway.callbacks=com.example.flyway.CustomCallback
flyway.defaultCallbackLocations=classpath:db/migration/callbacks
```

### Spring Boot Integration

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

### Core Concept

Liquibase tracks changes in **changelog files** (XML, YAML, JSON, or SQL format). Each change is wrapped in a `<changeset>`. Liquibase maintains a `databasechangelog` table tracking which changesets have been applied.

### Changelog Formats

#### XML (Primary Format)

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

### Common Change Types

| Change Type | Description |
|------------|-------------|
| `<createTable>` | Creates a new table |
| `<dropTable>` | Drops a table |
| `<addColumn>` | Adds columns to a table |
| `<dropColumn>` | Drops a column |
| `<renameColumn>` | Renames a column |
| `<alterColumn>` | Modifies a column definition |
| `<createIndex>` | Creates an index |
| `<dropIndex>` | Drops an index |
| `<insert>` | Inserts data rows |
| `<update>` | Updates data rows |
| `<delete>` | Deletes data rows |
| `<sql>` | Runs arbitrary SQL |
| `<createSequence>` | Creates a sequence |
| `<addForeignKeyConstraint>` | Adds a FK relationship |
| `<createView>` | Creates a view |

### More Change Types Examples

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

### Contexts and Labels

**Contexts** filter which changesets run in which environments:

```xml
<changeSet id="7" author="huy">
    <addColumn tableName="users">
        <column name="phone" type="VARCHAR(20)"/>
    </addColumn>
    <!-- Only run in test and dev contexts -->
    <validCheckSum>3:d41d8cd98f00b204e9800998ecf8427e</validCheckSum>
</changeSet>
```

Run with context:
```bash
liquibase update --contexts=test,dev
liquibase update --contexts=prod
```

**Labels** provide another filtering dimension:

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

### Spring Boot Integration

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
   LiquibaseSchema: null
```

---

## Flyway vs Liquibase Comparison

| Aspect | Flyway | Liquibase |
|--------|--------|-----------|
| **Approach** | Versioned SQL scripts | Declarative change definitions |
| **SQL Control** | Full SQL (you write it) | Generated from change types |
| **Rollback** | Undo migrations (paid) or manual | Built-in via `<rollback>` blocks |
| **Format** | Raw SQL files | XML, YAML, JSON, or SQL |
| **Flexibility** | High (pure SQL) | Medium (constrained DSL) |
| **Learning Curve** | Low (just SQL) | Medium (DSL + formats) |
| **Complexity** | Simple for straightforward migrations | Better for complex conditional logic |
| **Commercial** | Paid: Undo, Baseline,Callbacks | Paid: Pro/Enterprise features |
| **Best For** | SQL-centric teams, DBA involvement | Cross-DB portability, declarative desired |

> **Tip**: Choose Flyway if your team writes SQL fluently and wants simplicity. Choose Liquibase if you need cross-database compatibility (Oracle, SQL Server, PostgreSQL) or prefer declarative change definitions.

---

## Version-Based vs State-Based Migration

### Version-Based (Migration-Based)

Every change is a sequential version. You apply changes incrementally from the baseline.

- **Flyway** is the canonical example.
- Each file represents a delta between states.
- Rollback is explicit (undo scripts or manual).
- Linear history -- easy to understand what changed.

```
V1 -> V2 -> V3 -> V4 -> V5
```

### State-Based (Model-Based)

You define the **desired end state**, and the tool computes the diff between your model and the current database state.

- Tools like Liquibase (with `<diff>`), Rails migrations, Django migrations.
- You write the target schema, the tool generates the changeset.
- Better when the schema definition is the source of truth.

### Hybrid Approach

Many teams use both: state-based for initial scaffolding (Liquibase diff), version-based for ongoing changes.

---

## Best Practices

### 1. Idempotent Scripts

Always write migrations that can be re-run safely:

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

### 2. Never Mix Schema and Data Migration

Bad:
```sql
-- DON'T do this
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

### 3. Keep Migrations Small and Focused

Each migration should do one thing:
- One new table per migration
- One column addition per migration
- Group related index creations together

### 4. Use Transactional Migrations

```sql
BEGIN;

CREATE TABLE orders (...);
CREATE INDEX idx_orders_user ON orders(user_id);

COMMIT;
```

If the DB supports DDL in transactions (PostgreSQL), the migration fails atomically. MySQL's DDL is auto-committed, so be careful.

### 5. Backup Before Migration

Always take a backup before running migrations on production:

```bash
pg_dump -U postgres mydb > pre_migration_$(date +%Y%m%d).sql
```

### 6. Test Migrations on Production-Sized Data

A migration that works on 100 rows may timeout on 10 million rows. Always test on a data clone.

---

## Common Interview Questions

> **How do you handle database migrations in a zero-downtime deployment?**
>
> Use **expand-contract pattern**: first expand the schema (add nullable columns, new tables), deploy the application, then contract the schema (add constraints, drop old columns) in a separate migration. Use blue-green deployments with a read-only window. Never drop columns or constraints in the same migration that removes their usage from code.

> **How do you recover from a failed migration?**
>
> For Flyway: use `flyway repair` to fix metadata, then re-run the migration or manually fix and mark as applied. For Liquibase: use `liquibase rollback` or manually correct the state. Always have a tested rollback plan before applying to production.

> **Flyway or Liquibase: which do you prefer and why?**
>
> Flyway is preferred for SQL-centric teams because it uses raw SQL (minimal learning curve, full control). Liquibase is preferred when you need cross-database compatibility, declarative change tracking, or sophisticated rollback logic. The choice often comes down to team familiarity with SQL versus XML/YAML.
