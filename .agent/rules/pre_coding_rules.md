# Pre-Coding Rules

> 📋 กฎที่ต้องปฏิบัติตามก่อนเริ่มเขียน Code สำหรับ Feature ใหม่

## 🔴 MUST DO (ต้องทำ)

### 1. Requirement Confirmation

- **MUST** ยืนยัน Requirements กับ User/Stakeholder ก่อนเริ่มงาน
- **MUST** มี Acceptance Criteria ที่ชัดเจนและ Testable
- **MUST** บันทึก User Stories หรือ Use Cases

### 2. Impact Assessment

- **MUST** วิเคราะห์ Impact ต่อระบบเดิมก่อนเริ่ม Code
- **MUST** ระบุ Breaking Changes และวางแผนรับมือ
- **MUST** ตรวจสอบ Dependencies ที่อาจได้รับผลกระทบ

### 3. Task Documentation

- **MUST** สร้าง Issue/Ticket สำหรับทุก Feature
- **MUST** ย่อยงานใหญ่เป็น Tasks ย่อยที่จัดการได้ (≤ 1 วัน/task)
- **MUST** ประเมินเวลาที่ต้องใช้ก่อนเริ่มงาน

### 4. Definition of Done

- **MUST** กำหนด DoD ก่อนเริ่มงาน
- **MUST** รวม Test และ Documentation ใน DoD เสมอ

---

## 🟡 SHOULD DO (ควรทำ)

### 1. Technical Design

- **SHOULD** วาด Architecture Diagram สำหรับ Feature ที่ซับซ้อน
- **SHOULD** ออกแบบ Database Schema ก่อน Implement
- **SHOULD** เขียน API Specification ก่อนสร้าง Endpoints

### 2. Risk Analysis

- **SHOULD** ระบุความเสี่ยงและแผนรับมือ
- **SHOULD** พิจารณา Technical Debt ที่อาจเกิดขึ้น

### 3. Security Review

- **SHOULD** ตรวจสอบข้อมูลสำคัญที่เกี่ยวข้อง
- **SHOULD** วางแผน Authentication/Authorization

### 4. Performance Consideration

- **SHOULD** กำหนด Performance Targets
- **SHOULD** พิจารณา Caching Strategy

---

## 🟢 NICE TO HAVE (ถ้าทำได้จะดี)

### 1. UI/UX Design

- **NICE** มี Wireframes หรือ Mockups ก่อน Implement
- **NICE** ทดสอบ Usability กับ Users จริง

### 2. Detailed Documentation

- **NICE** สร้าง Flowcharts สำหรับ Complex Logic
- **NICE** เขียน Sequence Diagrams สำหรับ Multi-service Interactions

### 3. Team Review

- **NICE** Review Design กับ Team ก่อน Implement
- **NICE** ได้รับ Approval จาก Tech Lead

---

## ❌ DON'T DO (ห้ามทำ)

### 1. Code Without Understanding

- **DON'T** เริ่ม Code โดยไม่เข้าใจ Requirements ครบถ้วน
- **DON'T** ข้าม Impact Analysis สำหรับ Feature ที่ touch หลาย Components

### 2. Skip Planning

- **DON'T** เริ่มงานใหญ่โดยไม่ย่อย Tasks
- **DON'T** ประเมินเวลาแบบ "น่าจะเสร็จ"

### 3. Ignore Security

- **DON'T** ข้าม Security Consideration สำหรับ Features ที่เกี่ยวกับ User Data
- **DON'T** Hardcode Credentials หรือ Secrets

### 4. Over-Engineer

- **DON'T** ออกแบบเกินความจำเป็น (YAGNI Principle)
- **DON'T** สร้าง Abstractions ที่ไม่จำเป็นในตอนแรก

---

## 📊 Complexity-Based Guidelines

### Small Feature (1-3 days)

- ✅ Requirement Confirmation
- ✅ Impact Assessment (quick review)
- ✅ Task Documentation
- ⬜ Technical Design (optional)
- ⬜ UI/UX Design (if applicable)

### Medium Feature (1-2 weeks)

- ✅ Requirement Confirmation
- ✅ Impact Assessment
- ✅ Task Documentation (with breakdown)
- ✅ Technical Design (basic)
- ✅ DoD Definition
- ⬜ Risk Analysis (recommended)

### Large Feature (> 2 weeks)

- ✅ **ALL** Analysis items
- ✅ **ALL** Technical Design items
- ✅ UI/UX Design
- ✅ Team Review
- ✅ Detailed Documentation

---

## 📝 Enforcement

| Rule Level | Consequence of Violation |
|------------|-------------------------|
| 🔴 MUST | Block PR Merge |
| 🟡 SHOULD | Warning in Code Review |
| 🟢 NICE | Suggestion for Improvement |
| ❌ DON'T | Require Immediate Fix |

---

## 🔗 Related Documents

- [Pre-Coding Guideline](../../docs/PRE_CODING_GUIDELINE.md)
- [Pre-Coding Workflow](../workflows/pre_coding.md)
- [Analysis Template](../../docs/templates/analysis_template.md)
