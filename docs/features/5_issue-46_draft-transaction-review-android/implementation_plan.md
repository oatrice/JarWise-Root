# Implementation Plan: Draft Transaction Review - Phase 1 (Android)

> 🎯 Issue: [#46](https://github.com/oatrice/JarWise-Root/issues/46) | Platform: Android | Branch: `feat/draft-transaction-review`

---

## Goal

เพิ่มฟีเจอร์ **Save Draft** บน Android ให้ผู้ใช้สามารถบันทึก transaction เป็น draft ไว้ก่อนได้ โดยอ้างอิง UI/UX จาก JarWise-Web ที่ implement เสร็จแล้ว

---

## User Review Required

> [!IMPORTANT]
> **Database Migration**: จะเพิ่ม `status` และ `type` fields ใน `Transaction` entity และทำ database migration (version 1 → 2)

> [!NOTE]
> **Offline-First**: Phase นี้เก็บข้อมูลใน Room Database เท่านั้น Backend API จะทำแยก (Issue [#55](https://github.com/oatrice/JarWise-Root/issues/55))

---

## Proposed Changes

### Data Layer

#### [MODIFY] [Transaction.kt](file:///Users/oatrice/Software-projects/JarWise/Android/app/src/main/java/com/oatrice/jarwise/data/Transaction.kt)

เพิ่ม fields ใหม่ให้ตรงกับ Web:
```diff
 data class Transaction(
     @PrimaryKey(autoGenerate = true) val id: Long = 0,
     val amount: Double,
     val note: String,
     val jarId: String,
-    val date: String
+    val date: String,
+    val type: String = "expense",  // "income" | "expense"
+    val status: String = "completed"  // "draft" | "completed"
 )
```

---

#### [MODIFY] [TransactionDao.kt](file:///Users/oatrice/Software-projects/JarWise/Android/app/src/main/java/com/oatrice/jarwise/data/TransactionDao.kt)

เพิ่ม query methods สำหรับ drafts:
```kotlin
@Query("SELECT * FROM transactions WHERE status = 'draft' ORDER BY date DESC")
fun getDrafts(): Flow<List<Transaction>>

@Query("SELECT COUNT(*) FROM transactions WHERE status = 'draft'")
fun getDraftCount(): Flow<Int>

@Update
suspend fun update(transaction: Transaction)

@Query("UPDATE transactions SET status = :status WHERE id = :id")
suspend fun updateStatus(id: Long, status: String)
```

---

#### [MODIFY] [AppDatabase.kt](file:///Users/oatrice/Software-projects/JarWise/Android/app/src/main/java/com/oatrice/jarwise/data/AppDatabase.kt)

เพิ่ม database migration:
```diff
-@Database(entities = [Transaction::class], version = 1, exportSchema = false)
+@Database(entities = [Transaction::class], version = 2, exportSchema = false)
 abstract class AppDatabase : RoomDatabase() {
     abstract fun transactionDao(): TransactionDao
+    
+    companion object {
+        val MIGRATION_1_2 = object : Migration(1, 2) {
+            override fun migrate(database: SupportSQLiteDatabase) {
+                database.execSQL("ALTER TABLE transactions ADD COLUMN type TEXT NOT NULL DEFAULT 'expense'")
+                database.execSQL("ALTER TABLE transactions ADD COLUMN status TEXT NOT NULL DEFAULT 'completed'")
+            }
+        }
+    }
 }
```

---

### UI Layer

#### [MODIFY] [SlipImportScreen.kt](file:///Users/oatrice/Software-projects/JarWise/Android/app/src/main/java/com/oatrice/jarwise/ui/SlipImportScreen.kt)

เพิ่ม "Save as Draft" button ใน `SlipEditDialog` (reference: Web's `ImportSlip.tsx` line 164-183):
```kotlin
// After Jar Selection Dropdown (around line 508)
Spacer(modifier = Modifier.height(16.dp))

Button(
    onClick = { onSaveDraft(parsedSlip, selectedJarId) },
    colors = ButtonDefaults.buttonColors(
        containerColor = Color(0xFF422006).copy(alpha = 0.2f),
        contentColor = Color(0xFFFBBF24)  // Yellow-400
    ),
    border = BorderStroke(1.dp, Color(0xFFFBBF24).copy(alpha = 0.2f)),
    modifier = Modifier.fillMaxWidth()
) {
    Text("Save as Draft")
}
```

---

#### [MODIFY] [TransactionCard.kt](file:///Users/oatrice/Software-projects/JarWise/Android/app/src/main/java/com/oatrice/jarwise/ui/components/TransactionCard.kt)

เพิ่ม Draft badge (reference: Web's `TransactionCard.tsx` line 49):
```kotlin
// In title Row, after displayTitle text
if (transaction.status == "draft") {
    Surface(
        color = Color(0xFFFBBF24).copy(alpha = 0.2f),
        shape = RoundedCornerShape(4.dp)
    ) {
        Text(
            text = "DRAFT",
            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp),
            style = MaterialTheme.typography.labelSmall.copy(
                color = Color(0xFFFBBF24),
                fontWeight = FontWeight.Bold
            )
        )
    }
}
```

เปลี่ยน background สำหรับ draft:
```diff
 Row(
     modifier = Modifier
         .fillMaxWidth()
         .clip(RoundedCornerShape(16.dp))
-        .background(Gray900.copy(alpha = 0.4f))
-        .border(1.dp, Gray800.copy(alpha = 0.5f), RoundedCornerShape(16.dp))
+        .background(
+            if (transaction.status == "draft") 
+                Color(0xFF422006).copy(alpha = 0.2f) 
+            else Gray900.copy(alpha = 0.4f)
+        )
+        .border(
+            1.dp, 
+            if (transaction.status == "draft") 
+                Color(0xFFFBBF24).copy(alpha = 0.3f) 
+            else Gray800.copy(alpha = 0.5f), 
+            RoundedCornerShape(16.dp)
+        )
```

---

### Test Layer

#### [NEW] [TransactionDraftTest.kt](file:///Users/oatrice/Software-projects/JarWise/Android/app/src/test/java/com/oatrice/jarwise/data/TransactionDraftTest.kt)

Unit tests สำหรับ draft logic (TDD approach):
```kotlin
class TransactionDraftTest {
    @Test
    fun `transaction with status draft should be identified as draft`()
    
    @Test
    fun `transaction default status should be completed`()
    
    @Test
    fun `transaction default type should be expense`()
}
```

---

## Verification Plan

### Automated Tests

| Test | Command | หมายเหตุ |
|------|---------|----------|
| Unit Tests | `./gradlew :app:testDebugUnitTest` | รวม `TransactionDraftTest.kt` |
| Existing Tests | `./gradlew :app:testDebugUnitTest --tests "TransactionValidatorTest"` | ตรวจสอบว่า test เดิมไม่พัง |

### Manual Verification

1. **Build & Install**
   ```bash
   cd Android && ./gradlew installDebug
   ```

2. **ทดสอบ Save Draft**
   - เปิดแอป → Dashboard → กด Scan → เลือกรูป slip
   - ใน Review Dialog → กด "Save as Draft"
   - ควรเห็น Toast "Draft Saved"
   - กลับไป Dashboard → ควรเห็น transaction มี badge "DRAFT" สีเหลือง

3. **ทดสอบ Draft Styling**
   - Draft card ควรมี background สีเหลืองเข้ม
   - Draft card ควรมี border สีเหลือง

4. **ทดสอบ Migration**
   - ติดตั้งเวอร์ชันเก่า (ถ้ามี) แล้วอัพเกรดเป็นเวอร์ชันใหม่
   - ข้อมูลเก่าควรยังอยู่และมี `status = 'completed'` โดย default
