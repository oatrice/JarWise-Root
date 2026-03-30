# แผนการตรวจสอบด้วยตนเอง (Manual Verification Plan)
## ฟีเจอร์: Financial Reports & Charts (#59)

แผนงานนี้ครอบคลุมขั้นตอนการตรวจสอบความถูกต้องของข้อมูล (Data Integrity) และการแสดงผล (User Interface) ของทุก Repository ที่เกี่ยวข้องกับ Issue #59 โดยเน้นที่การทำงานร่วมกันระหว่าง Backend และ Frontend

---

## 🌍 1. ภาพรวมการตรวจสอบ (System Overview)

เป้าหมายสูงสุดคือ **"ความสอดคล้องของข้อมูล (Data Consistency)"** ไม่ว่าจะดูจากแพลตฟอร์มใดก็ตาม
*   **Data Verification:** ยอดเงินรวม (Summary Cards) ใน Web และ Android ต้องตรงกับยอดที่ Backend คำนวณ
*   **Visual Verification:** กราฟใน Web (Recharts) และ Android (Vico) ต้องสื่อความหมายข้อมูลชุดเดียวกัน
*   **Interaction Verification:** การเลือก Filter (วันที่, Jar, Category) ในฝั่ง Frontend ต้องส่งพารามิเตอร์ไปหา Backend ได้ถูกต้อง

---

## 🛠️ 2. การตรวจสอบแยกราย Repository

### 🖥️ Backend (Core Logic & Data Aggregation)
ตรวจสอบความถูกต้องของ API response ก่อนนำไปใช้ใน UI

- [ ] **EP1: Health Check:** ทดสอบยิง `GET /api/reports` โดยไม่มีพารามิเตอร์ (ควรได้ข้อมูลเดือนปัจจุบันโดยค่าเริ่มต้น)
- [ ] **EP2: Param Filtering:**
    - ทดสอบใส่ `from` และ `to` (e.g. `?from=2024-01-01&to=2024-01-31`) ตรวจสอบว่า `trend` มีข้อมูลเฉพาะช่วงนั้น
    - ทดสอบใส่ `wallet_id` หรือ `jar_id` ตรวจสอบความถูกต้องของยอดรวมใน `summary`
- [ ] **EP3: Data Structure:** ตรวจสอบว่า JSON response มี key ครบถ้วนตาม Spec (`summary`, `trend`, `byCategory`, `byJar`)

### 🌐 Web (Dashboard & Recharts)
ตรวจสอบการแสดงผลบนหน้าจอขนาดใหญ่และการตอบสนองของเมาส์

- [ ] **UI1: Page Navigation:** เข้าเมนู Reports (Link: `/reports`) และตรวจสอบว่า `ReportsPage.tsx` โหลดข้อมูลมาแสดง
- [ ] **UI2: Summary Cards:** ยอด Income/Expense/Net ต้องไม่เป็น NaN และแสดงสัญลักษณ์ Currency (฿/$) ถูกต้อง
- [ ] **UI3: Recharts Interaction:**
    - Hover บน **Trend Line:** ต้องแสดง Tooltip พร้อมวันที่และจำนวนเงิน
    - Click บน **Jar Pie Chart:** (ถ้ามี logic) ต้องสามารถเลือกลงไปดู transaction ย่อยใน Jar นั้นๆ ได้
- [ ] **UI4: Responsive Design:** ลองย่อหน้าจอเบราว์เซอร์ กราฟต้องปรับขนาด (Resizble) ให้พอดีกับพื้นที่

### 📱 Android (Mobile UI & Vico Charts)
ตรวจสอบ UX บนมือถือและการแสดงผลกราฟด้วย Library Vico

- [ ] **App1: Screen Entry:** เข้าเมนูรายงานผ่านเมนูหลัก (Check `MainActivity.kt` navigation)
- [ ] **App2: Vico Charts:**
    - สัญลักษณ์และสีของกราฟ (Category Bar) ต้องสีตรงกับที่กำหนดไว้ใน Theme หรือ Jars
    - แตะที่กราฟ (Touch Interaction) เพื่อดูตัวเลขพิกัดข้อมูล
- [ ] **App3: Empty State:** ทดสอบหากไม่มีข้อมูลธุรกรรมในช่วงที่เลือก (เช่น เดือนในอนาคต) แอปต้องแสดงหน้าจอ "No Data" ที่สวยงาม ไม่แครช

---

## 🧪 3. ขั้นตอนการตรวจแบบภาพรวม (Integration Walkthrough)

เพื่อให้มั่นใจว่าข้อมูลไหลลื่นตั้งแต่ต้นจนจบ ให้ลองทำตาม scenario นี้:

1.  **Step 1:** เพิ่ม Transaction ใหม่ 1 รายการผ่านหน้า **Web** (เช่น อาหาร 100 บาท)
2.  **Step 2:** ไปที่หน้า **Reports** บน **Web** -> ตรวจสอบว่า "Food Category" และ "Summary" เพิ่มขึ้นทันที
3.  **Step 3:** เปิดแอป **Android** -> เข้าหน้า **Reports** -> ตรวจสอบว่าเห็นยอดค่าอาหาร 100 บาทนั้นสะท้อนอยู่ในกราฟและ Summary Cards ตรงกันหรือไม่
4.  **Step 4:** ลองกรอง **Date Range** ใน Android ที่ไม่ครอบคลุมวันที่ทำรายการนั้น -> ยอดต้องหายไปทั้งใน Summary และ Graph

---

## 📝 4. สิ่งที่ไม่อยู่ในการตรวจสอบ (Out of Scope for #59)
*   การดาวน์โหลดไฟล์ Excel/CSV (ตรวจสอบใน #89)
*   การสร้างรายงาน PDF (ตรวจสอบใน #90)
*   การสำรองฐานข้อมูล (ตรวจสอบใน #91)

> [!TIP]
> **เคล็ดลับการตรวจ:** หากพบว่าตัวเลขในแอปมือถือไม่ตรงกับเว็บ ให้ตรวจสอบพารามิเตอร์ `timezone` ที่ส่งไปหา Backend เพราะอาจทำให้การตัดยอดวัน/เดือนคาดเคลื่อนได้
