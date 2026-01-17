# Analysis: Issue #31 Auto Transcribe Data from Slip Paper Folders

เอกสารนี้วิเคราะห์ความต้องการและแนวทางการพัฒนาสำหรับฟีเจอร์ "Auto Transcribe Data from Slip Paper Folders" ตาม Issue #31 และ Additional Requirements

## 1. ความเข้าใจ Requirements (Requirements Analysis)

จาก Issue Description และ User Feedback สรุปความต้องการหลักได้ดังนี้:

1.  **Multiple Folder Selection**: ผู้ใช้ต้องสามารถเลือก Source Folder ได้ "หลายโฟลเดอร์" พร้อมกัน (เช่น Folder รูปจาก Line, Folder รูปจาก Camera)
2.  **Smart Filtering (กรองรูปฉลาด)**:
    -   **Positive Logic**: เลือกเฉพาะรูปที่เป็น Slip หรือ E-slip
    -   **Negative Logic**: ข้ามรูปถ่ายทั่วไป (เช่น วิว, สัตว์, อาหาร, คน) ที่ไม่เกี่ยวข้อง
3.  **Deep Data Extraction**: ดึงข้อมูลสำคัญเชิงลึก:
    -   **Standard**: Date, Time, Amount, Bank
    -   **Jar Context**: พยายามระบุ Jar Name และ Note อัตโนมัติ
    -   **Transfer Details**: บัญชีต้นทาง (Source) และ บัญชีปลายทาง (Destination) กรณีโอนข้ามบัญชี
4.  **Manageable Sub-tasks**: แตกงานออกเป็น Sub-tasks ย่อยๆ เพื่อให้ง่ายต่อการติดตามและทดสอบ (Testability)
5.  **Future Phase (Auto-Learning)**: ระบบควรจดจำรูปแบบสลิปได้ว่า Pattern นี้คือบัตรใบไหน หรือค่าใช้จ่ายประเภทไหน

## 2. การวิเคราะห์ทางเทคนิค (Technical Analysis)

### 2.1 Platform Support & Folder Selection
-   **Android Strategy**: ใช้ `Intent.ACTION_OPEN_DOCUMENT_TREE` (SAF) และ Allow ให้ user pick multiple trees หรือ Add folder ทีละอันเข้ามาใน List การสแกน
-   **Web Strategy**: ใช้ `<input type="file" multiple webkitdirectory />` (อาจจะเลือกได้ทีละ folder แต่ user สามารถทำซ้ำเพื่อ add เข้า list ได้)

### 2.2 Smart Slip Detection & Filtering Strategy
ใช้หลักการ **"Positive Filtering"** เป็นหลักเพื่อความแม่นยำและ Performance:

1.  **QR Code Detection (First Pass)**:
    -   ถ้าเจอ QR Code ที่มี Payload format ของ Bank Standard -> **CONFIRMED SLIP** (100%)
2.  **Text Keyword Detection (OCR Pass)**:
    -   ถ้าไม่เจอ QR, ให้ run OCR (ML Kit Text Recognition)
    -   Check Keywords: "Transfer", "โอนเงินสำเร็จ", "Baht", "บาท", "Ref.", "Slip", "Transaction ID"
    -   **Heuristic Score**: ถ้าเจอ Keyword >= 3 คำ -> **CONFIRMED SLIP**
    -   *Note*: รูปวิว/สัตว์ จะไม่มี keyword พวกนี้ ทำให้ถูกกรองออกอัตโนมัติโดยปริยาย

### 2.3 Data Extraction Logic (Regex & Parsing)

| Data Field | Strategies |
| :--- | :--- |
| **Amount** | Regex หาตัวเลขที่มีทศนิยม 2 ตำแหน่ง ใกล้คำว่า "Amount/จำนวนเงิน/บาท" (e.g., `\d{1,3}(,\d{3})*\.\d{2}`) |
| **Date/Time** | Regex Pattern `DD/MM/YY` หรือ `DD MMM YY` และ `HH:mm` |
| **Bank/Provider** | Keyword matching: "KBANK", "SCB", "Kasikorn", "Krungthai", "TrueMoney" |
| **Source/Dest Account** | หา Pattern `XXX-X-XXXXX-X` หรือ `Account No.` (อาจจะยากถ้าสลิปเซ็นเซอร์) |
| **Jar Name/Category** | **(Hard)** ใช้ Keyword mapping จาก Note (เช่น "KFC" -> Food Jar) หรือ User ต้อง map เองครั้งแรกแล้วระบบจำ (Phase 2) |
| **Note** | Text บรรทัดล่างสุด หรือ หลังคำว่า "Note/บันทึกช่วยจำ" |

## 3. แผนการพัฒนาแบบละเอียด (Implementation Plan - Sub-tasks)

ตามกฎ **"Break it down"** เราจะแบ่งงานเป็น Part ย่อยๆ:

### Phase 1: Foundation & Smart Filter (Part 1)
*Goal: เลือกโฟลเดอร์ได้ และแตปออกมาได้ว่ารูปไหนคือ Slip*
-   [ ] **Part 1.1**: Setup ML Kit Dependencies (Android) & File Picker UI
-   [ ] **Part 1.2**: Implement `SlipDetectorService` (รับ Image -> ตอบ Yes/No) โดยใช้ QR Check Logic
-   [ ] **Part 1.3**: Implement Keyword Check Logic (Basic OCR) สำหรับสลิปไม่มี QR

### Phase 2: Data Extraction (Part 2)
*Goal: ดึง Text ออกมาจาก Slip ที่ Identify แล้ว*
-   [ ] **Part 2.1**: Implement `TextExtractor` สำหรับ Basic Info (Date, Time, Amount)
-   [ ] **Part 2.2**: Implement `AccountExtractor` สำหรับ Source/Dest Account
-   [ ] **Part 2.3**: Implement `ContextExtractor` สำหรับ Note & Bank Name

### Phase 3: Transaction Creation & UI (Part 3)
*Goal: หน้าจอ Review และ Save*
-   [ ] **Part 3.1**: UI หน้า "Review Imports" (List ของ Transaction ที่ Draft ไว้)
-   [ ] **Part 3.2**: Logic "Auto-Match Jar" (ลองเดา Jar จาก Note/Amount ถ้ามีประวัติ)
-   [ ] **Part 3.3**: Bulk Save to Database

## 4. Workflows & User Journey Guidelines

### 4.1 Auto-Detect / Smart Scan Workflow
ระบบควรทำงานเชิงรุก (Proactive) ในการหาสลิปใหม่ๆ โดยที่ User ไม่ต้องกด Share:
*   **Behavior**:
    1.  User ถ่ายรูปสลิปด้วยกล้องปกติ (Camera App)
    2.  เมื่อ User เปิดแอป JarWise (Foreground Service/OnResume):
    3.  **Auto-Scan**: ระบบตรวจสอบรูปภาพใหม่ล่าสุดในโฟลเดอร์ที่ Monitor ไว้ (Top N latest images)
    4.  **Quiet Analysis**: วิเคราะห์ว่าเป็น Slip หรือไม่ (QR/OCR) อย่างรวดเร็ว
    5.  **Suggestion**: ถ้าเจอสลิปใหม่ -> เด้ง Prompt "Found new slip from [Time], import?"
*   **Background (Optional for later)**: ใช้ WorkManager นานๆ ทีตื่นมาเช็ค แต่เน้น On-App-Launch เพื่อประหยัดแบตเตอรี่

### 4.2 Database Schema Update (Unified Account)
ต้องการรวม Source/Dest/Provider เป็น Field เดียวที่ User customize ได้:
*   **New Field**: `account` (String) หรือ `payment_method`
*   **Concept**: User ตั้งชื่อเองได้ เช่น "Cash", "KBank", "TrueMoney", "YouTrip", "Rabbit"
*   **Behavior**:
    1.  User ถ่ายรูปด้วย App กล้องปกติ
    2.  รูปถูก save ลง Gallery
    3.  **Auto-Detect**: เมื่อเปิดแอป JarWise ระบบจะ Check Recent Photos อัตโนมัติ (Background Analysis)
    4.  **Smart Suggestion**: ถ้าเจอรูปที่เป็น Slip -> ขึ้น Pop-up/Notification ในแอปว่า "พบสลิปใหม่ 2 รายการ"
    5.  **Review**: User กดดูเพื่อ Review และ Save

## 5. Future Roadmap (Beyond MVP)

### Phase 4: AI Financial Assistant (AI Chat)
*   **Goal**: ระบบ chat ที่ตอบคำถามสุขภาพการเงินได้
*   **Capabilities**: Simulation / Forecasting (ตามที่ระบุไว้ก่อนหน้า)

### Phase 5: Pattern Recognition & Contextual Learning
*   **Deep Context Learning**: ไม่ใช่แค่จำ Keyword แต่จำ "บริบท" การแก้ของ User
    *   *Example*: AI Suggest "KFC" -> "Food" (Normal)
    *   *User Correction*: แก้เป็น "Play-Extra" (Eating out/Party)
    *   *Learning*: ระบบจำว่าถ้าเป็นยอดสูงผิดปกติ หรือ เวลาดึก อาจจะเป็น "Play-Extra" ได้
*   **Backup**: Backup Data การเรียนรู้นี้เพื่อ restore ได้

## 6. Documentation Update
-   เพิ่มกฎ "Break down tasks into sub-tasks" ลงใน `CONTRIBUTING.md`
