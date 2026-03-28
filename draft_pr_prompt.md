# PR Draft Prompt

You are an AI assistant helping to create a Pull Request description.
    
TASK: [Web | Android] Financial Reports & Data Export
ISSUE: {
  "title": "[Web | Android] Financial Reports & Data Export",
  "number": 59,
  "body": "# \ud83c\udfaf Objective\nImplement comprehensive financial reporting with charts, graphs, and data export capabilities.\n\n## \ud83e\udde0 AI Brain Context\n- [task_v2.md](https://raw.githubusercontent.com/oatrice/JarWise-Root/feat/59-financial-reports-export/docs/features/17_issue-59_financial-reports-data-export/ai_brain/task_v2.md)\n- [walkthrough_v2.md](https://raw.githubusercontent.com/oatrice/JarWise-Root/feat/59-financial-reports-export/docs/features/17_issue-59_financial-reports-data-export/ai_brain/walkthrough_v2.md)\n- [implementation_plan_v2.md](https://raw.githubusercontent.com/oatrice/JarWise-Root/feat/59-financial-reports-export/docs/features/17_issue-59_financial-reports-data-export/ai_brain/implementation_plan_v2.md)\n\n\nCloses #59",
  "url": "https://github.com/oatrice/JarWise-Root/issues/59"
}

GIT CONTEXT:
COMMITS:
1ff2d09 docs: sync AI brain artifacts
e9d7530 feat: exclude .luma_metrics.json from git tracking
3db0b24 feat(reports): Release v0.10.0 with enhanced financial reporting
b72d6a0 docs: add implementation plan for financial reports & data export (#59)
b13dd8e chore(release): prepare v0.9.1 with financial reporting features

STATS:
.gitignore                                         |    2 +
 .luma_metrics.json                                 | 1496 ++++++++++++++++++++
 CHANGELOG.md                                       |   12 +
 README.md                                          |    2 +-
 VERSION                                            |    2 +-
 docs/ROADMAP.md                                    |  260 +++-
 .../ai_brain/android_reports_sync_plan.md          |   52 +
 .../ai_brain/implementation_plan.md                |   26 +
 .../ai_brain/implementation_plan2.md               |   51 +
 .../ai_brain/implementation_plan_fix_income.md     |   25 +
 .../implementation_plan_income_comparison.md       |   41 +
 .../ai_brain/implementation_plan_refactor_viz.md   |   36 +
 .../ai_brain/implementation_plan_styling_sync.md   |   41 +
 .../ai_brain/implementation_plan_v2.md             |   44 +
 .../ai_brain/task.md                               |    8 +
 .../ai_brain/task2.md                              |   13 +
 .../ai_brain/task_v2.md                            |   10 +
 .../ai_brain/walkthrough.md                        |   37 +
 .../ai_brain/walkthrough2.md                       |   42 +
 .../ai_brain/walkthrough_android_sync.md           |   36 +
 .../ai_brain/walkthrough_area_chart.md             |   27 +
 .../ai_brain/walkthrough_income_chart.md           |   23 +
 .../ai_brain/walkthrough_refactor_viz.md           |   33 +
 .../ai_brain/walkthrough_reports_final.md          |   28 +
 .../ai_brain/walkthrough_seeding.md                |   32 +
 .../ai_brain/walkthrough_v2.md                     |   37 +
 .../implementation_plan.md                         |   73 +
 .../manual_verification_plan.md                    |   66 +
 .../task.md                                        |   10 +
 .../walkthrough.md                                 |   52 +
 30 files changed, 2614 insertions(+), 3 deletions(-)

KEY FILE DIFFS:
diff --git a/.gitignore b/.gitignore
index e9d8525..2dd8e03 100644
--- a/.gitignore
+++ b/.gitignore
@@ -21,3 +21,5 @@ Backend/
 project_items.json
 .luma_state.json
 .luma_dev.json
+# .luma_metrics.json
+luma_failed_prompt_*.md
diff --git a/.luma_metrics.json b/.luma_metrics.json
new file mode 100644
index 0000000..3a67c6a
--- /dev/null
+++ b/.luma_metrics.json
@@ -0,0 +1,1496 @@
+{
+  "version": "1.0",
+  "issues": {
+    "oatrice/JarWise-Root#17": {
+      "issue_key": "oatrice/JarWise-Root#17",
+      "issue_number": 17,
+      "issue_title": "[Web | Android] Manage Jars (Edit %, Name, Icon)",
+      "issue_url": "https://github.com/oatrice/JarWise-Root/issues/17",
+      "repository": "oatrice/JarWise-Root",
+      "project_name": "JarWise-Root",
+      "issue_status": "✅ Done",
+      "estimate_points": 2,
+      "estimated_mandays": 2.0,
+      "start_datetime": "2026-01-16T08:14:33",
+      "actual_mandays": 15.0,
+      "due_date": "2026-03-17T23:59:59",
+      "actual_completion_date": "2026-01-31T06:43:58",
+      "effort_level": "Low",
+      "notes": null,
+      "gh_closed_at": "2026-01-31T06:43:58Z",
+      "gh_mandays": 15.0,
+      "created_at": "2026-01-16T08:12:00Z",
+      "updated_at": "2026-03-28T23:55:32.184842"
+    },
+    "oatrice/JarWise-Root#26": {
+      "issue_key": "oatrice/JarWise-Root#26",
+      "issue_number": 26,
+      "issue_title": "[Phase 5] Currency Support & Balance Refinement",
+      "issue_url": "https://github.com/oatrice/JarWise-Root/issues/26",
+      "repository": "oatrice/JarWise-Root",
+      "project_name": "JarWise-Root",
+      "issue_status": "✅ Done",
+      "estimate_points": 2,
+      "estimated_mandays": 2.0,
+      "start_datetime": "2026-01-16T14:14:57",
+      "actual_mandays": 1.5,
+      "due_date": "2026-03-17T23:59:59",
+      "actual_completion_date": "2026-01-18T04:49:55",
+      "effort_level": "Low",
+      "notes": null,
+      "gh_closed_at": "2026-01-18T04:49:55Z",
+      "gh_mandays": 1.5,
+      "created_at": "2026-01-16T14:14:56Z",
+      "updated_at": "2026-03-28T23:55:33.117857"
+    },
+    "oatrice/JarWise-Root#31": {
+      "issue_key": "oatrice/JarWise-Root#31",
+      "issue_number": 31,
+      "issue_title": "[Android] Auto Transcribe Slips (Smart Scan & Filter)",
+      "issue_url": "https://github.com/oatrice/JarWise-Root/issues/31",
+      "repository": "oatrice/JarWise-Root",
+      "project_name": "JarWise-Root",
+      "issue_status": "✅ Done",
+      "estimate_points": 1,
+      "estimated_mandays": 1.0,
+      "start_datetime": "2026-01-16T16:13:41",
+      "actual_mandays": 1.5,
+      "due_date": "2026-03-17T23:59:59",
+      "actual_completion_date": "2026-01-17T23:03:13",
+      "effort_level": "Low",
+      "notes": null,
+      "gh_closed_at": "2026-01-17T23:03:13Z",
+      "gh_mandays": 1.5,
+      "created_at": "2026-01-16T16:13:40Z",
+      "updated_at": "2026-03-28T23:55:34.127650"
+    },
+    "oatrice/JarWise-Root#32": {
+      "issue_key": "oatrice/JarWise-Root#32",
+      "issue_number": 32,
+      "issue_title": "Google Login & Cloud Backup",
+      "issue_url": "https://github.com/oatrice/JarWise-Root/issues/32",
+      "repository": "oatrice/JarWise-Root",
+      "project_name": "JarWise-Root",
+      "issue_status": "✅ Done (v0.7.0) - Implemented Google Login & Drive Backup.",
+      "estimate_points": 1,
+      "estimated_mandays": 1.0,
+      "start_datetime": "2026-01-16T16:16:24",
+      "actual_mandays": 17.5,
+      "due_date": "2026-02-03T23:59:59",
+      "actual_completion_date": "2026-02-03T05:00:27",
+      "effort_level": "Low",
+      "notes": null,
+      "gh_closed_at": "2026-02-03T05:00:27Z",
+      "gh_mandays": 17.5,
+      "created_at": "2026-01-16T16:16:24Z",
+      "updated_at": "2026-03-28T23:55:35.258658"
+    },
+    "oatrice/JarWise-Root#34": {
+      "issue_key": "oatrice/JarWise-Root#34",
+      "issue_number": 34,
+      "issue_title": "Implement Koin (Dependency Injection)",
+      "issue_url": "https://github.com/oatrice/JarWise-Root/issues/34",
+      "repository": "oatrice/JarWise-Root",
+      "project_name": "JarWise-Root",
+      "issue_status": "✅ Done (v0.5.0) - Android Implementation Complete.",
+      "estimate_points": 1,
+      "estimated_mandays": 1.0,
+      "start_datetime": "2026-01-17T05:07:47",
+      "actual_mandays": 16.0,
+      "due_date": "2026-02-02T23:59:59",
+      "actual_completion_date": "2026-02-02T05:54:37",
+      "effort_level": "Low",
+      "notes": null,
+      "gh_closed_at": "2026-02-02T05:54:37Z",
+      "gh_mandays": 16.0,
+      "created_at": "2026-01-17T05:07:46Z",
+      "updated_at": "2026-03-28T23:55:36.223274"
+    },
+    "oatrice/JarWise-Root#46": {
+      "issue_key": "oatrice/JarWise-Root#46",
+      "issue_number": 46,
+      "issue_title": "Draft Transaction Review (Android)",
+      "issue_url": "https://github.com/oatrice/JarWise-Root/issues/46",
+      "repository": "oatrice/JarWise-Root",
+      "project_name": "JarWise-Root",
+      "issue_status": "✅ Complete",
+      "estimate_points": 2,
+      "estimated_mandays": 2.0,
+      "start_datetime": "2026-01-18T16:01:14",
+      "actual_mandays": 11.5,
+      "due_date": "2026-03-17T23:59:59",
+      "actual_completion_date": "2026-01-30T08:35:06",
+      "effort_level": "Low",
+      "notes": null,
+      "gh_closed_at": "2026-01-30T08:35:06Z",
+      "gh_mandays": 11.5,
+      "created_at": "2026-01-18T16:01:14Z",
+      "updated_at": "2026-03-28T23:55:37.162296"
+    },
+    "oatrice/JarWise-Root#47": {
+      "issue_key": "oatrice/JarWise-Root#47",
+      "issue_number": 47,
+      "issue_title": "Draft Transaction Review (Web Mock)",
+      "issue_url": "https://github.com/oatrice/JarWise-Root/issues/47",
+      "repository": "oatrice/JarWise-Root",
+      "project_name": "JarWise-Root",
+      "issue_status": "✅ Complete",
+      "estimate_points": 2,
+      "estimated_mandays": 2.0,
+      "start_datetime": "2026-01-18T16:01:56",
+      "actual_mandays": 11.0,
+      "due_date": "2026-03-17T23:59:59",
+      "actual_completion_date": "2026-01-29T15:12:15",
+      "effort_level": "Low",
+      "notes": null,
+      "gh_closed_at": "2026-01-29T15:12:15Z",
+      "gh_mandays": 11.0,
+      "created_at": "2026-01-18T16:01:41Z",
+      "updated_at": "2026-03-28T23:55:37.930576"
+    },
+    "oatrice/JarWise-Root#48": {
+      "issue_key": "oatrice/JarWise-Root#48",
+      "issue_number": 48,
+      "issue_title": "[Android | Web]:  แสดงกราฟใน jar cat, jar sub cat ที่เลือกได้ว่าแต่ละเดือน/สัปดา/ปี ใช้ไปเท่าไหร่",
+      "issue_url": "https://github.com/oatrice/JarWise-Root/issues/48",
+      "repository": "oatrice/JarWise-Root",
+      "project_name": "JarWise-Root",
+      "issue_status": "✅ Done",
+      "estimate_points": 2,
+      "estimated_mandays": 2.0,
+      "start_datetime": "2026-01-19T06:29:55",
+      "actual_mandays": 50.0,
+      "due_date": "2026-03-10T23:59:59",
+      "actual_completion_date": "2026-03-10T06:17:36",
+      "effort_level": "Low",
+      "notes": null,
+      "gh_closed_at": "2026-03-10T06:17:36Z",
+      "gh_mandays": 50.0,
+      "created_at": "2026-01-19T06:29:54Z",
+      "updated_at": "2026-03-28T23:55:39.162313"
+    },
+    "oatrice/JarWise-Root#56": {
+      "issue_key": "oatrice/JarWise-Root#56",
+      "issue_number": 56,
+      "issue_title": "[Web | Android] Enhance Add Transaction (Date & Wallet)",
+      "issue_url": "https://github.com/oatrice/JarWise-Root/issues/56",
+      "repository": "oatrice/JarWise-Root",
+      "project_name": "JarWise-Root",
+      "issue_status": "✅ Done",
+      "estimate_points": 2,
+      "estimated_mandays": 2.0,
+      "start_datetime": "2026-01-30T09:19:50",
+      "actual_mandays": 0.5,
+      "due_date": "2026-03-17T23:59:59",
+      "actual_completion_date": "2026-01-30T15:06:12",
+      "effort_level": "Low",
+      "notes": null,
+      "gh_closed_at": "2026-01-30T15:06:12Z",
+      "gh_mandays": 0.5,
+      "created_at": "2026-01-30T09:17:41Z",
+      "updated_at": "2026-03-28T23:55:39.976521"
+    },
+    "oatrice/JarWise-Root#57": {
+      "issue_key": "oatrice/JarWise-Root#57",
+      "issue_number": 57,
+      "issue_title": "Custom Wallets & Jars",
+      "issue_url": "https://github.com/oatrice/JarWise-Root/issues/57",
+      "repository": "oatrice/JarWise-Root",
+      "project_name": "JarWise-Root",
+      "issue_status": "✅ Done (v0.5.0) - Foundation for Hierarchy.",
+      "estimate_points": 1,
+      "estimated_mandays": 1.0,
+      "start_datetime": "2026-01-31T08:48:57",
+      "actual_mandays": 1.0,
+      "due_date": "2026-02-11T23:59:59",
+      "actual_completion_date": "2026-02-01T13:06:02",
+      "effort_level": "Low",
+      "notes": null,
+      "gh_closed_at": "2026-02-01T13:06:02Z",
+      "gh_mandays": 1.0,
+      "created_at": "2026-01-30T10:13:50Z",
+      "updated_at": "2026-03-28T23:55:40.744314"
+    },
+    "oatrice/JarWise-Root#59": {
+      "issue_key": "oatrice/JarWise-Root#59",
+      "issue_number": 59,
+      "issue_title": "Financial Reports & Data Export",
+      "issue_url": "https://github.com/oatrice/JarWise-Root/issues/59",
+      "repository": "oatrice/JarWise-Root",
+      "project_name": "JarWise-Root",
+      "issue_status": "In Progress",
+      "estimate_points": 1,
+      "estimated_mandays": 1.0,
+      "start_datetime": "2026-01-31T08:49:36",
+      "actual_mandays": 0.0,
+      "due_date": "2026-03-10T23:59:59",
+      "actual_completion_date": "2026-03-28T15:14:14",
+      "effort_level": "Low",
+      "notes": null,
+      "gh_closed_at": null,
+      "gh_mandays": null,
+      "created_at": "2026-01-30T15:01:05Z",
+      "updated_at": "2026-03-28T23:55:42.466844"
+    },
+    "oatrice/JarWise-Root#65": {
+      "issue_key": "oatrice/JarWise-Root#65",
+      "issue_number": 65,
+      "issue_title": "Legacy Data Migration",
+      "issue_url": "https://github.com/oatrice/JarWise-Root/issues/65",
+      "repository": "oatrice/JarWise-Root",
+      "project_name": "JarWise-Root",
+      "issue_status": "✅ Done (v0.6.0) - Android Implementation Complete.",
+      "estimate_points": 2,
+      "estimated_mandays": 2.0,
+      "start_datetime": "2026-01-31T08:49:09",
+      "actual_mandays": 4.0,
+      "due_date": "2026-02-04T23:59:59",
+      "actual_completion_date": "2026-02-04T05:07:01",
+      "effort_level": "Low",
+      "notes": null,
+      "gh_closed_at": "2026-02-04T05:07:01Z",
+      "gh_mandays": 4.0,
+      "created_at": "2026-01-31T07:41:24Z",
+      "updated_at": "2026-03-28T23:55:44.197044"
+    },
+    "oatrice/JarWise-Root#67": {
+      "issue_key": "oatrice/JarWise-Root#67",
+      "issue_number": 67,
+      "issue_title": "Hierarchy (Full Implementation)",
+      "issue_url": "https://github.com/oatrice/JarWise-Root/issues/67",
+      "repository": "oatrice/JarWise-Root",
+      "project_name": "JarWise-Root",
+      "issue_status": "✅ Done (v0.5.0) - Hierarchical Jars implemented.",
+      "estimate_points": 1,
+      "estimated_mandays": 1.0,
+      "start_datetime": "2026-01-31T08:48:38",
+      "actual_mandays": 0.5,
+      "due_date": "2026-03-10T23:59:59",
+      "actual_completion_date": "2026-02-01T02:18:23",
+      "effort_level": "Low",
+      "notes": null,
+      "gh_closed_at": "2026-02-01T02:18:23Z",
+      "gh_mandays": 0.5,
+      "created_at": "2026-01-31T08:12:49Z",
+      "updated_at": "2026-03-28T23:55:45.819616"
+    },
+    "oatrice/JarWise-Root#68": {
+      "issue_key": "oatrice/JarWise-Root#68",
+      "issue_number": 68,
+      "issue_title": "Report Filters",
+      "issue_url": "https://github.com/oatrice/JarWise-Root/issues/68",
+      "repository": "oatrice/JarWise-Root",
+      "project_name": "JarWise-Root",
+      "issue_status": "✅ Done (v1.8.0)",
+      "estimate_points": 1,
+      "estimated_mandays": 1.0,
+      "start_datetime": "2026-01-31T08:49:16",
+      "actual_mandays": 12.0,
+      "due_date": "2026-02-18T23:59:59",
+      "actual_completion_date": "2026-02-12T02:52:58",
+      "effort_level": "Low",
+      "notes": null,
+      "gh_closed_at": "2026-02-12T02:52:58Z",
+      "gh_mandays": 12.0,
+      "created_at": "2026-01-31T08:13:05Z",
+      "updated_at": "2026-03-28T23:55:46.985038"
+    },
+    "oatrice/JarWise-Root#69": {
+      "issue_key": "oatrice/JarWise-Root#69",
+      "issue_number": 69,
+      "issue_title": "Hierarchical Wallets (Android & Web Mock)",
+      "issue_url": "https://github.com/oatrice/JarWise-Root/issues/69",
+      "repository": "oatrice/JarWise-Root",
+      "project_name": "JarWise-Root",
+      "issue_status": "✅ Done (v0.5.0) - Android Implementation Complete.",
+      "estimate_points": 2,
+      "estimated_mandays": 2.0,
+      "start_datetime": "2026-01-31T16:07:49",
+      "actual_mandays": 1.0,
+      "due_date": "2026-02-01T23:59:59",
+      "actual_completion_date": "2026-02-01T13:01:57",
+      "effort_level": "Low",
+      "notes": null,
+      "gh_closed_at": "2026-02-01T13:01:57Z",
+      "gh_mandays": 1.0,
+      "created_at": "2026-01-31T16:07:32Z",
+      "updated_at": "2026-03-28T23:55:48.133106"
+    },
+    "oatrice/JarWise-Root#71": {
+      "issue_key": "oatrice/JarWise-Root#71",
+      "issue_number": 71,
+      "issue_title": "Transaction Linking (Transfers)",
+      "issue_url": "https://github.com/oatrice/JarWise-Root/issues/71",
+      "repository": "oatrice/JarWise-Root",
+      "project_name": "JarWise-Root",
+      "issue_status": "✅ Done (v0.7.0)",
+      "estimate_points": 1,
+      "estimated_mandays": 1.0,
+      "start_datetime": "2026-02-01T13:57:01",
+      "actual_mandays": 3.0,
+      "due_date": "2026-02-11T23:59:59",
+      "actual_completion_date": "2026-02-04T14:10:19",
+      "effort_level": "Low",
+      "notes": null,
+      "gh_closed_at": "2026-02-04T14:10:19Z",
+      "gh_mandays": 3.0,
+      "created_at": "2026-02-01T13:51:10Z",
+      "updated_at": "2026-03-28T23:55:48.921550"
+    },
+    "oatrice/JarWise-Root#38": {
+      "issue_key": "oatrice/JarWise-Root#38",
+      "issue_number": 38,
+      "issue_title": "Note",
+      "issue_url": "https://github.com/oatrice/JarWise-Root/issues/38",
+      "repository": "oatrice/JarWise-Root",
+      "project_name": "JarWise-Root",
+      "issue_status": "Backlog",
+      "estimate_points": 1,
+      "estimated_mandays": 0.5,
+      "start_datetime": "2026-01-17T10:18:56",
+      "actual_mandays": 0.0,
+      "due_date": "2026-04-04T23:59:59",
+      "actual_completion_date": null,
+      "effort_level": "Low",
+      "notes": null,
+      "gh_closed_at": null,
+      "gh_mandays": null,
+      "created_at": "2026-01-17T10:18:55Z",
+      "updated_at": "2026-03-28T23:55:49.589663"
+    },
+    "oatrice/JarWise-Root#20": {
+      "issue_key": "oatrice/JarWise-Root#20",
+      "issue_number": 20,
+      "issue_title": "[Web | Android] Migrate data from google sheet to this app",
+      "issue_url": "https://github.com/oatrice/JarWise-Root/issues/20",
+      "repository": "oatrice/JarWise-Root",
+      "project_name": "JarWise-Root",
+      "issue_status": "Backlog",
+      "estimate_points": 2,
+      "estimated_mandays": 1.0,
+      "start_datetime": "2026-01-16T13:31:32",
+      "actual_mandays": 0.0,
+      "due_date": "2026-04-04T23:59:59",
+      "actual_completion_date": null,
+      "effort_level": "Low",
+      "notes": null,
+      "gh_closed_at": null,
+      "gh_mandays": null,
+      "created_at": "2026-01-16T13:31:31Z",
+      "updated_at": "2026-03-28T23:55:50.312606"
+    },
+    "oatrice/JarWise-Root#23": {
+      "issue_key": "oatrice/JarWise-Root#23",
+      "issue_number": 23,
+      "issue_title": "[Platform] Sematic version display",
+      "issue_url": "https://github.com/oatrice/JarWise-Root/issues/23",
+      "repository": "oatrice/JarWise-Root",
+      "project_name": "JarWise-Root",
+      "issue_status": "Backlog",
+      "estimate_points": 2,
+      "estimated_mandays": 1.0,
+      "start_datetime": "2026-01-16T13:49:02",
+      "actual_mandays": 0.0,
+      "due_date": "2026-04-04T23:59:59",
+      "actual_completion_date": null,
+      "effort_level": "Low",
+      "notes": null,
+      "gh_closed_at": null,
+      "gh_mandays": null,
+      "created_at": "2026-01-16T13:49:01Z",
+      "updated_at": "2026-03-28T23:55:50.948838"
+    },
+    "oatrice/JarWise-Root#9": {
+      "issue_key": "oatrice/JarWise-Root#9",
+      "issue_number": 9,
+      "issue_title": "[DevOps] Setup Auto-Tag for iOS & Mobile",
+      "issue_url": "https://github.com/oatrice/JarWise-Root/issues/9",
+      "repository": "oatrice/JarWise-Root",
+      "project_name": "JarWise-Root",
+      "issue_status": "Backlog",
+      "estimate_points": 1,
+      "estimated_mandays": 0.5,
+      "start_datetime": "2026-01-16T03:38:33",
+      "actual_mandays": 0.0,
+      "due_date": "2026-04-04T23:59:59",
+      "actual_completion_date": null,
+      "effort_level": "Low",
+      "notes": null,
+      "gh_closed_at": null,
+      "gh_mandays": null,
+      "created_at": "2026-01-16T03:35:26Z",
+      "updated_at": "2026-03-28T23:55:51.615618"
+    },
+    "oatrice/JarWise-Root#24": {
+      "issue_key": "oatrice/JarWise-Root#24",
+      "issue_number": 24,
+      "issue_title": "[Platform] Task Name Desktop UI version",
+      "issue_url": "https://github.com/oatrice/JarWise-Root/issues/24",
+      "repository": "oatrice/JarWise-Root",
+      "project_name": "JarWise-Root",
+      "issue_status": "Backlog",
+      "estimate_points": 3,
+      "estimated_mandays": 1.5,
+      "start_datetime": "2026-01-16T13:50:03",
+      "actual_mandays": 0.0,
+      "due_date": "2026-04-04T23:59:59",
+      "actual_completion_date": null,
+      "effort_level": "Medium",
+      "notes": null,
+      "gh_closed_at": null,
+      "gh_mandays": null,
+      "created_at": "2026-01-16T13:50:03Z",
+      "updated_at": "2026-03-28T23:55:52.259131"
+    },
+    "oatrice/JarWise-Root#2": {
+      "issue_key": "oatrice/JarWise-Root#2",
+      "issue_number": 2,
+      "issue_title": "Implement Mobile/Flutter UI",
+      "issue_url": "https://github.com/oatrice/JarWise-Root/issues/2",
+      "repository": "oatrice/JarWise-Root",
+      "project_name": "JarWise-Root",
+      "issue_status": "Backlog",
+      "estimate_points": 2,
+      "estimated_mandays": 1.0,
+      "start_datetime": "2026-01-19T06:54:01",
+      "actual_mandays": 0.0,
+      "due_date": "2026-04-04T23:59:59",
+      "actual_completion_date": null,
+      "effort_level": "Low",
+      "notes": null,
+      "gh_closed_at": null,
+      "gh_mandays": null,
+      "created_at": "2026-01-16T00:36:08Z",
+      "updated_at": "2026-03-28T23:55:52.922262"
+    },
+    "oatrice/JarWise-Root#25": {
+      "issue_key": "oatrice/JarWise-Root#25",
+      "issue_number": 25,
+      "issue_title": "[Web | Android] Implement UI test (integration, instrumented, E2E)",
+      "issue_url": "https://github.com/oatrice/JarWise-Root/issues/25",
+      "repository": "oatrice/JarWise-Root",
+      "project_name": "JarWise-Root",
+      "issue_status": "Backlog",
+      "estimate_points": 2,
+      "estimated_mandays": 1.0,
+      "start_datetime": "2026-01-16T13:59:09",
+      "actual_mandays": 0.0,
+      "due_date": "2026-04-04T23:59:59",
+      "actual_completion_date": null,
+      "effort_level": "Low",
+      "notes": null,
+      "gh_closed_at": null,
+      "gh_mandays": null,
+      "created_at": "2026-01-16T13:59:08Z",
+      "updated_at": "2026-03-28T23:55:53.581137"
+    },
+    "oatrice/JarWise-Root#30": {
+      "issue_key": "oatrice/JarWise-Root#30",
+      "issue_number": 30,
+      "issue_title": "[Platform] Task Name ย้ายวันที่เป็น sticky group by date สำหรับ tx history จะได้มีพื้นที่แสดง note เยอะขึ้นด้วย",
+      "issue_url": "https://github.com/oatrice/JarWise-Root/issues/30",
+      "repository": "oatrice/JarWise-Root",
+      "project_name": "JarWise-Root",
+      "issue_status": "Backlog",
+      "estimate_points":
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
6. IMPORTANT: Always use the exact FULL URL for closing issues. You must write `Closes https://github.com/oatrice/JarWise-Root/issues/59`. Do NOT use short syntax (e.g., #123) and do not invent an owner/repo.
