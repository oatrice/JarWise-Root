---
description: Workflow สำหรับขั้นตอน Pre-Coding ก่อนเริ่มพัฒนา Feature ใหม่
---

# Pre-Coding Workflow

> 🎯 ขั้นตอนที่ต้องทำก่อนเริ่มเขียน Code เพื่อให้งานมีคุณภาพและลดการแก้ไขซ้ำซ้อน

## Prerequisites

- มี Issue/Ticket ที่ต้องการพัฒนา
- เข้าใจ Requirements เบื้องต้น

## Workflow Steps

### Phase 1: Analysis (วิเคราะห์)

#### Step 1.1: Create Analysis Document

1. สร้างไฟล์ `docs/features/[feature_number]_[feature_name].md`
2. ใช้ Template จาก `docs/templates/analysis_template.md`
3. กรอกข้อมูลในหมวด Analysis ทุกข้อที่เกี่ยวข้อง

```bash
// turbo
cp docs/templates/analysis_template.md "docs/features/[N]_[feature_name].md"
```

#### Step 1.2: Requirement Analysis

- [ ] ระบุ User Stories
- [ ] กำหนด Acceptance Criteria
- [ ] ยืนยันกับ Stakeholders

#### Step 1.3: Feature Analysis

- [ ] วาด User Flow
- [ ] ระบุ Input/Output
- [ ] กำหนด Screens/Pages ที่เกี่ยวข้อง

#### Step 1.4: Impact Analysis

- [ ] ระบุ Components ที่ได้รับผลกระทบ
- [ ] ตรวจสอบ Breaking Changes
- [ ] วางแผน Backward Compatibility

#### Step 1.5: Feasibility Analysis

- [ ] ประเมิน Technical Feasibility
- [ ] ประเมิน Time ที่ต้องใช้
- [ ] ประเมิน Budget (ถ้าเกี่ยวข้อง)

#### Step 1.6: Security Analysis

- [ ] ระบุข้อมูลสำคัญ
- [ ] วิเคราะห์ช่องโหว่
- [ ] กำหนด Auth Strategy

#### Step 1.7: Performance Analysis

- [ ] กำหนด Performance Targets
- [ ] วางแผน Scalability

#### Step 1.8: Risk Analysis

- [ ] ระบุความเสี่ยง
- [ ] กำหนดแผนรับมือ

### Phase 2: Technical Design (ออกแบบ)

#### Step 2.1: Database Schema Design

- [ ] สร้าง ER Diagram
- [ ] กำหนด Tables และ Relationships
- [ ] วางแผน Migration

#### Step 2.2: System Architecture

- [ ] วาด System Diagram
- [ ] กำหนด Service Boundaries
- [ ] ออกแบบ Communication Patterns

#### Step 2.3: API Design

- [ ] กำหนด Endpoints
- [ ] สร้าง Request/Response Schemas
- [ ] เขียน API Documentation

### Phase 3: UI/UX Design

#### Step 3.1: Wireframe/Prototype

- [ ] สร้าง Wireframes
- [ ] Review กับ Team
- [ ] สร้าง High-fidelity Mockups (optional)

### Phase 4: Planning (วางแผน)

#### Step 4.1: Task Breakdown

1. ย่อยงานใหญ่เป็น Tasks ย่อย (แต่ละงาน ≤ 1 วัน)
2. สร้าง Issue/Ticket สำหรับแต่ละ Task

```bash
# Create sub-issues in GitHub
gh issue create --title "[Feature] Task 1" --body "..."
gh issue create --title "[Feature] Task 2" --body "..."
```

#### Step 4.2: Estimation

- [ ] ประเมินเวลาแต่ละ Task
- [ ] ระบุ Dependencies
- [ ] จัดลำดับความสำคัญ

#### Step 4.3: Definition of Done

กำหนด DoD สำหรับ Feature นี้:

- [ ] Code ทำงานได้ตาม Requirements
- [ ] Unit Test Coverage ≥ 80%
- [ ] Integration Tests passed
- [ ] Documentation updated
- [ ] Code Review passed
- [ ] Deployed to Staging

### Phase 5: Review & Approval

#### Step 5.1: Analysis Review

- [ ] Review Analysis Document กับ Team
- [ ] รับ Feedback และปรับปรุง
- [ ] ได้รับ Approval จาก Tech Lead/PM

#### Step 5.2: Design Review

- [ ] Review Technical Design
- [ ] Review UI/UX Design
- [ ] ได้รับ Approval

### Phase 6: Ready for Development

เมื่อผ่านทุกขั้นตอนแล้ว สามารถเริ่ม Coding ได้!

```bash
# Create feature branch
git checkout -b feature/[feature-name]

# Use create-feature skill if available
# /agent skills/create-feature
```

## Checklist Summary

```markdown
## Pre-Coding Checklist

### Analysis
- [ ] Requirement Analysis ✅
- [ ] Feature Analysis ✅
- [ ] Impact Analysis ✅
- [ ] Feasibility Analysis ✅
- [ ] Security Analysis ✅
- [ ] Performance Analysis ✅
- [ ] Risk Analysis ✅

### Design
- [ ] Database Schema ✅
- [ ] System Architecture ✅
- [ ] API Design ✅
- [ ] UI/UX Wireframes ✅

### Planning
- [ ] Task Breakdown ✅
- [ ] Estimation ✅
- [ ] DoD Defined ✅

### Approval
- [ ] Analysis Approved ✅
- [ ] Design Approved ✅

🚀 Ready to Code!
```

## Tips

1. **ไม่จำเป็นต้องทำทุกข้อ** - เลือกใช้ตามความซับซ้อนของงาน
2. **เริ่มจากสิ่งสำคัญ** - Requirement, Feature, Impact Analysis สำคัญที่สุด
3. **Iterate** - สามารถกลับมาปรับปรุงได้เสมอ
4. **Document Everything** - บันทึกทุกการตัดสินใจสำคัญ

## Related Documents

- [Pre-Coding Guideline](../../docs/PRE_CODING_GUIDELINE.md)
- [Analysis Template](../../docs/templates/analysis_template.md)
- [Feature Spec Template](../../docs/templates/feature_spec_template.md)
