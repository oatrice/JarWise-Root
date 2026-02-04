# PR Draft Prompt

You are an AI assistant helping to create a Pull Request description.
    
TASK: [Feature] Migrate Data from Money Manager App (.mmbak)
ISSUE: {
  "title": "[Feature] Migrate Data from Money Manager App (.mmbak)",
  "number": 65
}

GIT CONTEXT:
COMMITS:
a73463d ✨ feat(migration): Add Money Manager data migration feature
2e0eddd ✨ feat(android): implement full migration feature for Money Manager data
48df385 ✨ feat(migration): implement data migration UI and backend scaffolding
c21c310 ✨ feat(migration): complete backend implementation in Go and update plan
854a7aa ✨ feat(migration): add data migration analysis and implementation plan

STATS:
.gitignore                                         |   1 +
 .luma_rules.json                                   |  10 +
 CHANGELOG.md                                       |   7 +
 README.md                                          |  10 +
 VERSION                                            |   2 +-
 .../analysis.md                                    | 282 +++++++++++++++++++++
 .../plan.md                                        | 225 ++++++++++++++++
 .../plan_android.md                                |  48 ++++
 .../spec.md                                        | 179 +++++++++++++
 .../task.md                                        |  28 ++
 .../walkthrough_android.md                         |  48 ++++
 .../walkthrough_backend.md                         |  49 ++++
 .../walkthrough_web.md                             |  27 ++
 13 files changed, 915 insertions(+), 1 deletion(-)

KEY FILE DIFFS:
diff --git a/.gitignore b/.gitignore
index 1587b73..639ff07 100644
--- a/.gitignore
+++ b/.gitignore
@@ -4,6 +4,7 @@ Mobile/
 Flutter/
 /Android/
 iOS/
+Backend/
 
 # System Files
 .DS_Store
diff --git a/.luma_rules.json b/.luma_rules.json
index 911e230..0eb7ed6 100644
--- a/.luma_rules.json
+++ b/.luma_rules.json
@@ -9,6 +9,16 @@
             "trigger": "when running tests",
             "action": "use './Android/scripts/run_tests.sh'",
             "reason": "ensures correct environment for Robolectric and Room schemas"
+        },
+        {
+            "trigger": "when working on Web Frontend",
+            "action": "implement as UI Mock / Prototype only. Do NOT integrate real API endpoints unless explicitly requested.",
+            "reason": "Web is currently for UX visualization only."
+        },
+        {
+            "trigger": "when working on Android Mobile",
+            "action": "implement full functionality with real API integrations.",
+            "reason": "Android is the primary platform for production features."
         }
     ]
 }
\ No newline at end of file
diff --git a/CHANGELOG.md b/CHANGELOG.md
index 2d35cd7..382df7c 100644
--- a/CHANGELOG.md
+++ b/CHANGELOG.md
@@ -1,5 +1,12 @@
 # Changelog
 
+## [0.6.0] - 2026-02-04
+
+### Added
+- **[Feature] Data Migration from Money Manager:** Implemented a comprehensive tool to import complete financial history from the "Money Manager" app using `.mmbak` backup files.
+- **[Android]** Added a new UI flow for users to select and upload their `.mmbak` file to start the migration process.
+- **[Backend]** Developed a new service in Go to parse `.mmbak` files, mapping and importing all accounts, categories, and transactions into the user's JarWise profile.
+
 ## [0.5.0] - 2026-02-01
 
 ### Added
diff --git a/README.md b/README.md
index 291d371..3a5a5f3 100644
--- a/README.md
+++ b/README.md
@@ -4,6 +4,7 @@ Welcome to the **JarWise** project landing page!
 ![Version](https://img.shields.io/badge/version-0.0.1-blue.svg)
 
 
+
 JarWise is a comprehensive personal finance management system based on the **6
 Jars money management method** by T. Harv Eker. It is built as a multi-platform
 solution with distinct specialized squads.
@@ -18,12 +19,15 @@ solution with distinct specialized squads.
   
 ![React](https://img.shields.io/badge/React-19.2.0-20232a?style=for-the-badge&logo=react&logoColor=%2361DAFB)
 
+
   
 ![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)
 
+
   
 ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4.1.18-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
 
+
 * **Key Responsibilities**:
   * Developing the Core Design System (Neon Theme).
   * Prototyping new features and logic.
@@ -37,6 +41,7 @@ solution with distinct specialized squads.
   
 ![Flutter](https://img.shields.io/badge/Flutter-%2302569B.svg?style=for-the-badge&logo=Flutter&logoColor=white)
 
+
 * **Key Responsibilities**:
   * Delivering the iOS & Android application.
   * Implementing features defined by the Web squad.
@@ -49,11 +54,14 @@ solution with distinct specialized squads.
   
 ![Kotlin](https://img.shields.io/badge/Kotlin-1.9.24-7F52FF?style=for-the-badge&logo=kotlin&logoColor=white)
 
+
   
 ![Jetpack Compose](https://img.shields.io/badge/Compose_BOM-2024.02.01-4285F4?style=for-the-badge&logo=android&logoColor=white)
 
+
 * **Key Responsibilities**:
   * SMS reading automation.
+  * Data migration from Money Manager app.
   * Native OS widgets and background services.
   * Specific Android platform optimizations.
 
@@ -65,9 +73,11 @@ solution with distinct specialized squads.
   
 ![Swift](https://img.shields.io/badge/swift-F54A2A?style=for-the-badge&logo=swift&logoColor=white)
 
+
   
 ![SwiftUI](https://img.shields.io/badge/SwiftUI-007AFF?style=for-the-badge&logo=swift&logoColor=white)
 
+
 * **Key Responsibilities**:
   * Siri Shortcuts.
   * iOS Widgets & App Clips.
diff --git a/VERSION b/VERSION
index 8f0916f..a918a2a 100644
--- a/VERSION
+++ b/VERSION
@@ -1 +1 @@
-0.5.0
+0.6.0
diff --git a/docs/features/13_issue-65_feature-migrate-data-from-money-manager-app-mmbak/analysis.md b/docs/features/13_issue-65_feature-migrate-data-from-money-manager-app-mmbak/analysis.md
new file mode 100644
index 0000000..e48435a
--- /dev/null
+++ b/docs/features/13_issue-65_feature-migrate-data-from-money-manager-app-mmbak/analysis.md
@@ -0,0 +1,282 @@
+# Analysis Template
+
+> 📋 Template สำหรับการวิเคราะห์ก่อนเริ่มพัฒนา Feature
+
+---
+
+## 📌 Feature Information
+
+| รายการ | รายละเอียด |
+|--------|-----------|
+| **Feature Name** | Migrate Data from Money Manager App |
+| **Issue URL** | [#65](https://github.com/owner/repo/issues/65) |
+| **Date** | 2023-10-27 |
+| **Analyst** | Luma AI (Senior Technical Analyst) |
+| **Priority** | 🔴 High |
+| **Status** | 📝 Draft |
+
+---
+
+## 1. Requirement Analysis
+
+### 1.1 Problem Statement
+
+> อธิบายปัญหาที่ต้องการแก้ไข
+
+```
+ผู้ใช้ใหม่ที่ต้องการย้ายจากแอปพลิเคชัน "Money Manager" มายัง "JarWise" ไม่สามารถนำข้อมูลธุรกรรมในอดีตมาด้วยได้ ทำให้การเริ่มต้นใช้งาน JarWise เป็นเรื่องยากและต้องป้อนข้อมูลใหม่ทั้งหมด ซึ่งเป็นอุปสรรคสำคัญในการดึงดูดผู้ใช้กลุ่มใหม่และทำให้ผู้ใช้ลังเลที่จะเปลี่ยนมาใช้แอปพลิเคชันของเรา
+```
+
+### 1.2 User Stories
+
+| # | As a | I want to | So that |
+|---|------|-----------|---------|
+| 1 | New user from Money Manager | import my complete transaction history (accounts, categories, transactions) | I can seamlessly switch to JarWise without losing my financial data and continue tracking my finances immediately. |
+| 2 | New user | have the imported data validated for accuracy | I can trust that my financial history in JarWise is correct and matches what I had in the old app. |
+
+### 1.3 Acceptance Criteria
+
+- [ ] **AC1:** The system must provide a user interface for uploading both a `.mmbak` (SQLite) file and an `.xls` file from Money Manager.
+- [ ] **AC2:** The system must successfully parse the `.mmbak` file to extract accounts, categories, and all associated transactions with their details (date, amount, type, etc.).
+- [ ] **AC3:** The system must parse the `.xls` file to extract summary totals for income and expenses.
+- [ ] **AC4:** Before final import, the system must cross-validate the total income and expense calculated from the `.mmbak` data against the totals from the `.xls` file.
+- [ ] **AC5:** If a significant discrepancy is found during validation, the system must notify the user and allow them to either cancel or proceed with the import.
+- [ ] **AC6:** The system must correctly map Money Manager "Accounts" to JarWise "Wallets".
+- [ ] **AC7:** The system must correctly map Money Manager "Categories" to JarWise "Jars".
+- [ ] **AC8:** All parsed transactions must be successfully and accurately saved to the user's JarWise database, linked to the correct wallets and jars.
+- [ ] **AC9:** The import process must be handled asynchronously in the background to prevent UI blocking and request timeouts for large datasets.
+
+---
+
+## 2. Feature Analysis
+
+### 2.1 User Flow
+
+```mermaid
+flowchart TD
+    A["User navigates to Import Data page"] --> B["Selects Import from Money Manager"]
+    B --> C["Uploads .mmbak and .xls files"]
+    C --> D["System starts background import job"]
+    D --> E["Parse .mmbak file"]
+    D --> F["Parse .xls file"]
+    E & F --> G{"Cross-validate totals"}
+    G -->|"✅ Match"| H["Map schema and import data"]
+    G -->|"❌ Mismatch"| I["Notify user of discrepancy"]
+    I --> J{"User action"}
+    J -->|"Proceed anyway"| H
+    J -->|"Cancel"| K["End process"]
+    H --> L["Notify user of successful import"]
+    L --> K
+```
+
+### 2.2 Screen/Page Requirements
+
+| หน้าจอ | Actions | Components |
+|--------|---------|------------|
+| **Data Import** | - Select "Money Manager" as source<br>- Upload `.mmbak` file<br>- Upload `.xls` file<br>- Click "Start Import" button | - Source selection dropdown<br>- File input for `.mmbak`<br>- File input for `.xls`<br>- Submit button<br>- Instructional text |
+| **Import Status** | - View import progress<br>- View final result (success/failure)<br>- View summary of imported data<br>- View validation errors | - Progress bar/spinner<br>- Status message text area (e.g., "Parsing files...", "Validating...", "Success!")<br>- Summary card (e.g., "5 Wallets, 30 Jars, 2500 Transactions imported")<br>- Error details section (if applicable) |
+
+### 2.3 Input/Output Specification
+
+#### Inputs
+
+| Field | Type | Required | Validation |
+|-------|------|----------|------------|
+| `mmbakFile` | File | ✅ | Must be a valid SQLite DB with `.mmbak` extension. Max size 50MB. |
+| `xlsFile` | File | ✅ | Must be a valid `.xls` file. Max size 20MB. |
+
+#### Outputs
+
+(API Response for initiating the import job)
+| Field | Type | Description |
+|-------|------|-------------|
+| `jobId` | string | An identifier for the background import job to check its status. |
+| `status` | string | Initial status, e.g., "QUEUED". |
+| `message` | string | Confirmation message, e.g., "Import process has started." |
+
+---
+
+## 3. Impact Analysis
+
+### 3.1 Affected Components
+
+| Component | Impact Level | Description |
+|-----------|--------------|-------------|
+| **Backend API** | 🔴 High | Requires new endpoints for file upload, job status polling, and the entire business logic for parsing, validating, mapping, and importing data. |
+| **Database (JarWise)** | 🔴 High | New data will be inserted in bulk into `wallets`, `jars`, and `transactions` tables. Requires careful handling of transactions and potential performance tuning for bulk inserts. |
+| **Background Worker Service** | 🔴 High | A new type of job for data migration needs to be created. This component is critical for handling the processing asynchronously. |
+| **Frontend (Web/Mobile)** | 🟡 Medium | New screens and components are needed for the import user flow. State management for polling job status is required. |
+| **Authentication Service** | 🟢 Low | No changes needed, but existing authentication must be enforced on new endpoints to ensure data is imported for the correct user. |
+
+### 3.2 Breaking Changes
+
+- [ ] **BC1:** None. This is an additive feature and does not alter existing APIs or user flows.
+
+### 3.3 Backward Compatibility Plan
+
+```
+Not applicable as this is a new feature. It will not affect existing users who do not use the import functionality.
+```
+
+---
+
+## 4. Feasibility Analysis
+
+### 4.1 Technical Feasibility
+
+| คำถาม | คำตอบ | หมายเหตุ |
+|-------|-------|----------|
+| เทคโนโลยีรองรับหรือไม่? | ✅ | Standard libraries for SQLite parsing (e.g., `sqlite3`) and XLS/HTML parsing (e.g., `pandas`, `SheetJS`) are readily available and mature. |
+| ทีมมี Skills เพียงพอหรือไม่? | ✅ | The task requires standard backend development skills: file handling, database operations, and asynchronous job processing. This is within the capabilities of a typical development team. |
+| Infrastructure รองรับหรือไม่? | ✅ | The architecture must include a background job queue (e.g., Celery, BullMQ, AWS SQS) to handle asynchronous processing. This is a standard component for scalable applications. |
+
+### 4.2 Time Feasibility
+
+| ประเด็น | รายละเอียด |
+|--------|-----------|
+| **Estimated Effort** | 4 weeks (1 Sprint) |
+| **Deadline** | N/A |
+| **Buffer Time** | 1 week |
+| **Feasible?** | ✅ | The timeline is reasonable for a feature of this complexity, assuming a dedicated developer or pair. |
+
+### 4.3 Budget Feasibility
+
+| รายการ | ค่าใช้จ่าย | หมายเหตุ |
+|--------|-----------|----------|
+| Development Hours | Covered by existing budget | Estimated at ~160 hours of development and testing time. |
+| Infrastructure | Minimal / None | Potential minor cost increase for background worker usage if scaling is required, but likely covered by existing infrastructure budget. |
+| **Total** | **Covered by existing budget** | |
+
+---
+
+## 5. Security Analysis
+
+### 5.1 Sensitive Data
+
+| ข้อมูล | Sensitivity Level | Protection Method |
+|--------|------------------|-------------------|
+| User Financial Data (`.mmbak`, `.xls` files) | 🔴 Critical | - Enforce HTTPS for file uploads.<br>- Scan files for malware upon upload.<br>- Process files in an isolated, temporary storage.<br>- Delete the uploaded files immediately after the import job is completed or fails. |
+| User ID | 🟡 Sensitive | Standard API authentication and authorization to ensure a user can only import data into their own account. |
+
+### 5.2 Attack Vectors
+
+| Vector | Risk Level | Mitigation |
+|--------|-----------|------------|
+| Malicious File Upload | 🟡 Medium | A user could upload a crafted file to exploit vulnerabilities in the parsers. Mitigation: Use up-to-date, secure libraries. Run the parsing process in a sandboxed or containerized environment with limited permissions. Enforce strict file type and size validation. |
+| Data Leakage | 🔴 High | Uploaded financial data files are highly sensitive. Mitigation: Implement a strict lifecycle policy for uploaded files—they must be deleted immediately after processing. Limit access to the temporary storage location. |
+| Denial of Service (DoS) | 🟡 Medium | Users could upload very large files or trigger many imports simultaneously. Mitigation: Implement rate limiting on the import endpoint. Enforce strict file size limits. Isolate import jobs in a queue to prevent them from overwhelming the main application servers. |
+
+### 5.3 Authentication & Authorization
+
+```
+All API endpoints related to the import feature (`/import/start`, `/import/status/{jobId}`) must be protected and require a valid user authentication token. The business logic must ensure that the data is only ever inserted into the database under the ID of the authenticated user who initiated the job.
+```
+
+---
+
+## 6. Performance & Scalability Analysis
+
+### 6.1 Performance Targets
+
+| Metric | Target | Current |
+|--------|--------|---------|
+| API Response Time (Job Start) | < 500ms | N/A |
+| Background Job Execution Time | < 5 minutes for 5 years of data | N/A |
+| Database Insert Throughput | 1000 transactions/sec | N/A |
+| Error Rate | < 0.5% | N/A |
+
+### 6.2 Scalability Plan
+
+| Scenario | Expected Users | Scaling Strategy |
+|----------|---------------|------------------|
+| Normal | ~10 concurrent imports | A small, fixed pool of 2-3 background workers. |
+| Peak | ~100+ concurrent imports | The background worker service should be configured to auto-scale based on the length of the job queue. |
+| Growth (1yr) | Consistent import traffic | Optimize database inserts by using bulk operations (`BULK INSERT`, `COPY`, etc.) instead of single-row inserts to improve efficiency. |
+
+---
+
+## 7. Gap Analysis
+
+| ด้าน | As-Is (ปัจจุบัน) | To-Be (ต้องการ) | Gap |
+|------|-----------------|-----------------|-----|
+| **Data Import Functionality** | The application has no mechanism to import data from any external source. Users must start from scratch. | The application can import a user's complete financial history from the Money Manager app via `.mmbak` and `.xls` files. | The entire import module needs to be designed and built, including file handling, parsing, validation, schema mapping, and data insertion logic. |
+| **User Onboarding** | The onboarding flow is generic for all new users and assumes they have no prior data. | A new onboarding path exists for users migrating from Money Manager, guiding them through the import process. | The frontend needs a new UI flow specifically for data migration, which can be integrated into the initial user onboarding experience. |
+
+---
+
+## 8. Risk Analysis
+
+| Risk | Probability | Impact | Score | Mitigation Plan |
+|------|-------------|--------|-------|-----------------|
+| **Incorrect Schema Mapping** | 🟡 Medium | 🔴 High | 6 | Create a detailed mapping document based on analysis of multiple sample `.mmbak` files. Implement a comprehensive suite of unit and integration tests using these files to verify data integrity post-import. |
+| **Performance Bottlenecks with Large Files** | 🟡 Medium | 🟡 Medium | 4 | Design the process to be fully asynchronous from the start. Use efficient parsing methods and database bulk-insert operations. Load test with realistically large data files. |
+| **Inconsistent Data Between Sources** | 🟡 Medium | 🟡 Medium | 4 | The cross-validation step is designed to catch this. Provide clear feedback to the user about any discrepancies and give them the option to proceed if the difference is minor. Log all validation failures for analysis. |
+| **Parser Failure on Different App Versions** | 🟢 Low | 🔴 High | 3 | The schema of the `.mmbak` file may vary slightly between Money Manager versions. Mitigation: Research common schema versions. Implement robust error handling in the parser. Initially, state which versions of Money Manager are officially supported. |
+
+> **Risk Score:** Probability × Impact (High=3, Medium=2, Low=1)
+
+---
+
+## 9. Summary & Recommendations
+
+### 9.1 Analysis Summary
+
+| หมวด | Status | Key Findings |
+|------|--------|--------------|
+| Requirement | ✅ Clear | The objective and specifications are well-defined in the issue. |
+| Feature | ✅ Defined | The user flow, UI, and I/O are clearly outlined. |
+| Impact | 🟡 Medium | High impact on the backend and database, but it's an isolated, new feature. |
+| Feasibility | ✅ Feasible | Technically feasible with standard technologies and within a reasonable timeframe. |
+| Security | ⚠️ Needs Review | Handling of sensitive financial files requires strict security measures for storage and processing. |
+| Performance | ✅ Acceptable | An asynchronous, job-based architecture is required and will meet performance needs. |
+| Risk | 🟡 Medium | The primary risks are data corruption due to incorrect mapping and poor user experience from validation failures. |
+
+### 9.2 Recommendations
+
+1.  **Build a Secure, Asynchronous Foundation:** Prioritize creating a robust background job system for the import. Ensure temporary file handling is secure and files are deleted immediately after use.
+2.  **Schema Mapping First:** Before writing import code, create a detailed schema mapping document (`Money Manager Table/Column` -> `JarWise Table/Column`). This document should be peer-reviewed.
+3.  **Develop with Test Data:** Obtain or create a variety of sample `.mmbak` and `.xls` files (e.g., small, large, different currencies, complex categories) to use for development and testing.
+
+### 9.3 Next Steps
+
+- [ ] Create a detailed technical design document for the import service, including API contracts and database schema mapping.
+- [ ] Set up the initial backend boilerplate for file uploads and queuing background jobs.
+- [ ] Begin development of the SQLite (`.mmbak`) parser module.
+
+---
+
+## 📎 Appendix
+
+### Related Documents
+
+- [Link to PRD]
+- [Link to Design Docs]
+- [Link to API Specs]
+
+
+### 9.4 Implementation Strategy (Updated 2026-02-04)
+
+> **IMPORTANT: Platform Logic Separation**
+
+Based on technical decisions during development, the implementation scope is defined as:
+
+1.  **Web Frontend:**
+    - **Scope:** **UI Mock / Prototype Only.**
+    - **Purpose:** To visualize the User Experience (UX), flow, and design of the migration process.
+    - **Functionality:** No API integration required. Does not need to handle actual file uploads or processing.
+
+2.  **Android Mobile:**
+    - **Scope:** **Full Implementation.**
+    - **Purpose:** The primary platform for the migration feature.
+    - **Functionality:** Must fully integrate with the Backend API (`POST /migrations/money-manager`). Handles real file picker, file upload, status polling (if applicable), error handling, and completion flow.
+
+3.  **Backend (Go):**
+    - **Scope:** **Full Implementation (Completed).**
+    - **Status:** Scaffolding, Parsers (SQLite & XLS), Validator, and Mock Importer logic 
... (Diff truncated for size) ...

PR TEMPLATE:
# 📋 Monorepo Update Summary
<!-- 
Brief description of changes affecting the project structure or multiple 
platforms 
-->

## ✅ Checklist
- [ ] 🏗️ I have moved the related issue to "In Progress" on the Kanban board

## 🎯 Type

- [ ] 📦 Monorepo Structure
- [ ] 📄 Documentation (Root)
- [ ] 🔄 Workflow/CI Update
- [ ] 🚀 Release Management
- [ ] 💥 Breaking change

## 🔗 Affected Platforms

- [ ] Web
- [ ] Android
- [ ] iOS
- [ ] Mobile (Flutter)

## 📝 Detailed Changes

<!-- Describe the high-level purpose of this PR -->

## 📸 Screenshots (if applicable)
<!-- 
IMPORTANT: Always use width="400" for screenshots
Use HTML <img> tag for width control:

<img src="https://raw.githubusercontent.com/oatrice/JarWise-Root/branch-name/path/to/image.png" width="400" />
-->

## 🧪 Testing
- [ ] Changes verified locally
- [ ] Documentation reviewed for accuracy

## 🚀 Migration/Deployment

- [ ] Environment variables updated
- [ ] Global Dependencies installed

```bash
# Migration commands if applicable
```

## 🔗 Related Issues

<!-- 
Use 'Resolves' keyword with FULL repo reference for auto-linking.
This makes the PR appear in the Issue's "Development" sidebar:

Development
├── oatrice/JarWise-Web#6
└── oatrice/JarWise-Android#7

Example: Resolves oatrice/JarWise-Root#16
-->
- Resolves oatrice/JarWise-Root#

**Breaking Changes**: <!-- Yes/No -->
**Migration Required**: <!-- Yes/No -->


INSTRUCTIONS:
1. Generate a comprehensive PR description in Markdown format.
2. If a template is provided, fill it out intelligently.
3. If no template, use a standard structure: Summary, Changes, Impact.
4. Focus on 'Why' and 'What'.
5. Do not include 'Here is the PR description' preamble. Just the body.
6. IMPORTANT: Always use FULL URLs for links to issues and other PRs (e.g., https://github.com/owner/repo/issues/123), do NOT use short syntax (e.g., #123) to ensuring proper linking across platforms.
