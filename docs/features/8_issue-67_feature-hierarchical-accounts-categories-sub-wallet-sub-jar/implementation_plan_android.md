# Implementation Plan (Android): Hierarchical Jars & Categories (#67)

แผนการพัฒนา Feature สำหรับรองรับ Dynamic Jars พร้อม Nested Structure (Parent → Child hierarchy) บน Android

> [!IMPORTANT]
> Feature นี้เป็น **Foundation** สำหรับ Migration (#65) - ต้องทำให้เสร็จก่อน Import ข้อมูลจาก Money Manager

---

## 🗺️ MVP Roadmap (Shared)

```
Phase 1: Foundation          Phase 2: Migration       Phase 3: Usability
#67 Hierarchical Jars ──┐
                        ├──→ #32 Backup ──→ #65 Migration ──→ #68 Report Filter
#57 Custom Wallets ─────┘
```

---

## 📊 Current State Analysis (Android)

### Room Database v4

| Table | Fields |
|-------|--------|
| `jar_configs` | id, name, percentage, colorName, iconName |
| `transactions` | id, amount, note, jarId (FK), walletId, date, type, status |

### Limitations ❌
- **Fixed 6 Jars**: ไม่สามารถเพิ่ม/ลบ Jar ได้
- **Flat Structure**: ไม่มี Parent-Child relationships

---

## Proposed Changes

### Phase 1: Unified Allocations Schema

สร้าง table ใหม่ `allocations` ที่รองรับ:
- **Dynamic Jars**: เพิ่ม/ลบได้ไม่จำกัด 6
- **Nested Structure**: Jar → Category → Sub-Category (limit 3 levels for UX)

```sql
CREATE TABLE allocations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id VARCHAR(50) NOT NULL,   -- 🔒 Added for Security (IDOR Prevention)
    name VARCHAR(50) NOT NULL,
    parent_id INTEGER,              -- NULL = top-level Jar
    level INTEGER DEFAULT 0,        -- 0 = Jar, 1 = Category, 2 = Sub-Category
    target_percent INTEGER,         -- Only for level=0 (Jars), nullable
    icon VARCHAR(50),
    color VARCHAR(20),
    sort_order INTEGER DEFAULT 0,
    is_system_default BOOLEAN DEFAULT 0,  -- For default 6 jars
    is_active BOOLEAN DEFAULT 1,
    FOREIGN KEY (parent_id) REFERENCES allocations(id) ON DELETE CASCADE
);
CREATE INDEX idx_allocations_user_parent ON allocations(user_id, parent_id);
```

### Phase 2: Android Implementation

#### [MODIFY] [AppDatabase.kt](file:///Users/oatrice/Software-projects/JarWise/Android/app/src/main/java/com/oatrice/jarwise/data/AppDatabase.kt)
- เพิ่ม `Allocation` entity
- เพิ่ม `MIGRATION_4_5` สำหรับ migrate jar_configs → allocations
- **Security**: Ensure `user_id` is populated (default to 'local_user' for offline mode)
- Keep `jar_configs` table for backward compatibility (deprecate)

#### [NEW] [Allocation.kt](file:///Users/oatrice/Software-projects/JarWise/Android/app/src/main/java/com/oatrice/jarwise/data/Allocation.kt)
- Entity definition with Foreign Keys and Indices.

#### [NEW] [AllocationDao.kt](file:///Users/oatrice/Software-projects/JarWise/Android/app/src/main/java/com/oatrice/jarwise/data/AllocationDao.kt)
- CRUD operations
- Hierarchy queries: `getTopLevelJars()`, `getChildrenOf(parentId)`
- Hierarchy modifications: `promoteToJar()`, `demoteToCategory()`

#### [MODIFY] [ManageJarsViewModel.kt](file:///Users/oatrice/Software-projects/JarWise/Android/app/src/main/java/com/oatrice/jarwise/ui/managejars/ManageJarsViewModel.kt)
- เปลี่ยนจากใช้ `JarConfigDao` เป็น `AllocationDao`

---

## 🛡️ Security & Risk Analysis

### Security Considerations
- **IDOR Protection**: `user_id` MUST be included in `allocations` table and checked in every query.

### Data Migration Risks
- **Risk**: Data loss during v4->v5 migration.
- **Mitigation**: Unit tests for migration logic (Mocked).

---

## Verification Plan (Android)

### 🟢 Automated Tests
- `AllocationDaoTest.kt`: Test CRUD and hierarchy queries.
- `MigrationTest.kt`: Test MIGRATION_4_5 logic.

### 🔵 Manual Verification
- Fresh Install verification (Seed Data check).
- Database Inspector check for `allocations` table.
