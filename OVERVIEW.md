## 🏰 JarWise Workspace Overview

JarWise คือระบบบริหารจัดการการเงินส่วนบุคคลตามหลักการ 6 Jars แบบ Cross-Platform

## 📂 Directory Structure

### 🌐 `/Web` (Frontend Playground)
- **Tech**: React, Vite, Tailwind CSS v4
- **Role**: เป็น Sandbox สำหรับทดลอง UI/UX และ Logic ใหม่ๆ ก่อนลง Native
- **Status**: ✅ Active (Dashboard Implemented)

### 📱 `/Mobile` (Cross-Platform)
- **Tech**: Flutter
- **Role**: แอปพลิเคชันหลักสำหรับผู้ใช้ทั่วไป (iOS/Android)
- **Status**: 🚧 In Progress

### 🤖 `/Android` (Native Features)
- **Tech**: Jetpack Compose, Kotlin
- **Role**: สำหรับฟีเจอร์ที่ต้องการ Native Deep Integration (e.g. SMS Reading, Banking App Sync)
- **Status**: 🚧 Initialized

### 🍎 `/iOS` (Native Features)
- **Tech**: SwiftUI
- **Role**: Native iOS Experience
- **Status**: ⏳ Planned

### 🛠 Backend & Shared
- `/shared-logic`: KMP Shared Logic (Proposed)
- `/backend-go`: Go Backend Services
- `/tokens`: Shared Design Tokens (JSON)
- `/scripts`: Utility scripts (Token Sync, Version Bump)

## Getting Started
1.  **Clone**: `git clone ...`
2.  **Web**: `cd Web && npm install && npm run dev`
3.  **Mobile**: `cd Mobile && flutter run`

## Documentation
- Workflows: อ่าน `.agent/workflows/`
- Architecture: อ่าน `SYSTEM_PROMPT.md`
