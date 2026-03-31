# แผนการเปิดใช้งาน NemoClaw ผ่าน Docker

เป้าหมายคือการทำให้ NemoClaw ทำงานได้สมบูรณ์ในระบบของผู้ใช้ โดยใช้สคริปต์ `setup.sh` ที่เตรียมไว้ในซอร์สโค้ด

## ข้อมูลที่ตรวจสอบแล้ว
- ✅ **NVIDIA_API_KEY**: มีการตั้งค่าไว้แล้วในสภาพแวดล้อม
- ✅ **OpenShell CLI**: ติดตั้งอยู่ใน venv ที่ `/Users/oatrice/Public/openshell/venv`
- ✅ **Docker**: กำลังรันอยู่
- ✅ **Dependencies**: สคริปต์ช่วยงาน (`fix-coredns.sh`, `setup-dns-proxy.sh`) และ `ollama` พร้อมใช้งาน

## การเปลี่ยนแปลงที่เสนอ

### [NemoClaw Setup Fix]

แก้ไขบั๊กในสคริปต์ `setup.sh` และรันการติดตั้งใหม่

#### [MODIFY] [setup.sh](file:///Users/oatrice/.nemoclaw/source/scripts/setup.sh)
- เปลี่ยน `OPENSHELL_CLUSTER_IMAGE` เป็น `OPENSHELL_IMAGE` เพื่อให้สอดคล้องกับ `openshell 0.0.18`
- ปรับปรุงการตรวจสอบสถานะ Gateway ให้ยืดหยุ่นขึ้น

#### [EXECUTE] รัน setup.sh อีกครั้ง
```bash
export PATH="/Users/oatrice/Public/openshell/venv/bin:$PATH"
/Users/oatrice/.nemoclaw/source/scripts/setup.sh
```

## ขั้นตอนการดำเนินงาน
1. เตรียมค่าสภาพแวดล้อม (PATH)
2. รัน `setup.sh` และรอจนกว่าจะเสร็จสิ้น (อาจใช้เวลา 2-5 นาทีในการ Build image ครั้งแรก)
3. ตรวจสอบสถานะการทำงานด้วย `nemoclaw status` และ `openshell sandbox list`

## คำถามที่ต้องการการยืนยัน
- **Sandbox Name**: สคริปต์จะใช้ชื่อเริ่มต้นคือ `nemoclaw` หากต้องการเปลี่ยนชื่อเฉพาะเจาะจงสามารถระบุได้ครับ
- **First Run**: การรันครั้งแรกจะมีการดึง Image และ Build ระบบ ซึ่งอาจใช้เวลานิดหน่อยครับ

## แผนการตรวจรับงาน (Verification Plan)

### การทดสอบแบบอัตโนมัติ
- ตรวจสอบสถานะ Gateway: `openshell status` ต้องแสดงสถานะ `Connected`
- ตรวจสอบ Sandbox: `openshell sandbox list` ต้องแสดงสถานะ `Ready`

### การตรวจสอบด้วยตนเอง
- ลองส่งคำถามทดสอบไปยังเอเจนต์ใน Sandbox:
  ```bash
  export PATH="/Users/oatrice/Public/openshell/venv/bin:$PATH"
  nemoclaw nemoclaw connect --command "openclaw agent --agent main --local -m 'hello' --session-id test"
  ```
