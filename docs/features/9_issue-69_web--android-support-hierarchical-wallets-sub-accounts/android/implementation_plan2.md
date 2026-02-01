# Fix Room Migration Test

## Goal Description
Fix the failing `MigrationTest.migrate4To5` which fails due to missing schema files (`FileNotFoundException`). This involves configuring Room to export schemas and ensuring these schemas are available to unit tests.

## User Review Required
- None currently expected.

## Proposed Changes

### Android App Configuration
#### [MODIFY] [build.gradle.kts](file:///Users/oatrice/Software-projects/JarWise/Android/app/build.gradle.kts)
- Fix syntax error for `androidTest` source set configuration in Kotlin DSL.
- Change `androidTest.assets.srcDirs += ...` to `getByName("androidTest") { assets.srcDirs(...) }`.
- Ensure schema directory is correctly added to `test` source set as well.

### Database Configuration
#### [MODIFY] [AppDatabase.kt](file:///Users/oatrice/Software-projects/JarWise/Android/app/src/main/java/com/oatrice/jarwise/data/AppDatabase.kt)
- Ensure `exportSchema = true`.

### Schema Files
- Ensure `app/schemas/com.oatrice.jarwise.data.AppDatabase/4.json` exists.
- If missing, regenerate by looking into git history or rebuilding if the code reflects version 4 (unlikely if current is 5), or manually restoring. Since the current version is likely 5, we expect 4.json to be present from previous commits. If strictly missing, we might need to recover it. *Update: Instruction says "rebuild project to generate schema files" might work if we have build variants or if we just need to trigger the export, but usually export generates the *current* version. If `4.json` is missing, it implies it wasn't checked in when version was 4. I will check file existence first.*

## Verification Plan
### Automated Tests
- Run `./scripts/build_android.sh testDebugUnitTest`
- Run `./scripts/build_android.sh testReleaseUnitTest`
