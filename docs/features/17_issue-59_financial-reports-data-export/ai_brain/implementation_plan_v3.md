# Implementation Plan: 📊 Fix Workflow Summary Duration & Truncation

ปรับปรุงการแสดงผล Workflow Summary ใน `luma_core/metrics_summarizer.py` เพื่อรองรับการแสดงผลระยะเวลาเป็นชั่วโมง และแก้ปัญหาข้อความถูกตัดเมื่อมีข้อมูลจำนวนมาก

## User Review Required

> [!IMPORTANT]
> - การคำนวณระยะเวลาจะถูกเปลี่ยนจาก `Xm Ys` เป็น `Xh Ym Zs` เมื่อระยะเวลาเกิน 60 นาที
> - จะทำการปรับปรุงโครงสร้างข้อความให้กระชับขึ้นเพื่อลดโอกาสที่ Telegram หรือ Backend จะตัดข้อความ (Truncate) ในกรณีที่มีรายการ Sub-actions หรือ Actions จำนวนมาก

## Proposed Changes

### [luma_core/metrics_summarizer.py](file:///Users/oatrice/Software-projects/Luma/luma_core/metrics_summarizer.py)

#### [MODIFY] `_format_duration(ms: int) -> str`
- เพิ่ม Logic ตรวจสอบว่าถ้า `mins >= 60` ให้แปลงเป็น `hours`, `mins`, `secs` (e.g., `1h 43m 18s`)
- ปรับปรุงการปัดเศษวินาทีให้สวยงาม

#### [MODIFY] `format_summary_message(...) -> str`
- แก้ไขปัญหาข้อความถูกตัด:
    - จำกัดจำนวนรายการใน Sub-action Breakdown (หากมีจำนวนมากเกินไป)
    - ย้ายข้อมูลสำคัญ (Total Duration) มาเน้นให้ชัดเจนขึ้น
    - ตรวจสอบความถูกต้องของ `lines.append` เพื่อให้มั่นใจว่าข้อมูลครบถ้วน

## Open Questions

1. ผู้ใช้ต้องการให้แสดงชั่วโมงเฉพาะใน Total Workflow Duration หรือรวมไปถึงใน Sub-action Breakdown ทุกรายการด้วย? (เบื้องต้นจะทำทุกรายการเพื่อให้เป็นระบบเดียวกัน)

## Verification Plan

### Automated Tests
- สร้างไฟล์ `tests/test_metrics_summarizer.py`
- **Red**: เขียน Test Case สำหรับ `_format_duration` ด้วยค่าที่เกิน 1 ชั่วโมง (e.g., 6198000 ms -> `1h 43m 18s`)
- **Green**: แก้ไขโค้ดเพื่อให้ Test ผ่าน
- **Refactor**: ปรับปรุงโค้ดให้สะอาดขึ้น

### Manual Verification
- รัน script ทดสอบการ generate summary message เพื่อดู output ที่ได้
- ตรวจสอบความยาวของข้อความว่าอยู่ในเกณฑ์ที่ยอมรับได้หรือไม่ (Telegram limit 4096 chars)
