# Implementation Plan (Web): Hierarchical Jars & Categories (#67)

แผนการพัฒนา Feature สำหรับรองรับ Dynamic Jars พร้อม Nested Structure (Parent → Child hierarchy) บน Web Application

---

## 🗺️ MVP Roadmap (Shared)

```
Phase 1: Foundation          Phase 2: Migration       Phase 3: Usability
#67 Hierarchical Jars ──┐
                        ├──→ #32 Backup ──→ #65 Migration ──→ #68 Report Filter
#57 Custom Wallets ─────┘
```

---

## 📊 Current State Analysis (Web)

### TypeScript Types

| Type | Fields |
|------|--------|
| `Jar` | id, name, current, goal, level, color, bgGlow, icon, barColor, shadowColor |
| `Transaction` | id, merchant, amount, category, date, isTaxDeductible, color, icon |

### Limitations ❌
- **Fixed 6 Jars**: ไม่สามารถเพิ่ม/ลบ Jar ได้
- **Flat Structure**: ไม่มี Parent-Child relationships

---

## Proposed Changes

### Phase 3: Web Implementation

> [!TIP]
> **API Strategy**: Recommend implementing `/v2/allocations` endpoints to handle hierarchy, keeping `/v1/jars` for backward compatibility until all clients migrate.

#### [MODIFY] [generatedMockData.ts](file:///Users/oatrice/Software-projects/JarWise/Web/src/utils/generatedMockData.ts)
- เพิ่ม `parentId` และ `level` fields ใน `Jar` type
- Rename `Jar` → `Allocation` (optional, can alias)

```typescript
export type Allocation = {
    id: string; // Ensure string type for consistency with other web IDs
    name: string;
    parentId: string | null;    // NULL = top-level Jar
    level: number;              // 0 = Jar, 1 = Category
    targetPercent?: number;     // Only for level=0
    // UI fields
    current: number;
    goal: number;
    color: string;
    icon: LucideIcon;
    // ...existing styling fields
}
```

#### [MODIFY] [ManageJars.tsx](file:///Users/oatrice/Software-projects/JarWise/Web/src/pages/ManageJars.tsx)
- รองรับ Add/Delete Jar
- แสดง nested structure (tree view)
- ลบ validation "total must = 100%" (เปลี่ยนเป็น warning)

---

## Verification Plan (Web)

### 🟢 Automated Tests
- `npm test -- ManageJars`: Verify UI component logic.
- `allocation.test.ts`: Test hierarchy utility functions.

### 🔵 Manual Verification
- Verify Tree View UI rendering.
- Test "Add Jar" and "Add Category" interactions.
- Test "Delete" with confirmation modal.
