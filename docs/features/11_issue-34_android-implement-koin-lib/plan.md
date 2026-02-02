# Implementation Plan

| | |
| --- | --- |
| **Title** | [Android] Implement Koin Dependency Injection Library |
| **Feature ID** | `AND-CORE-001` |
| **Status** | `Ready for Implementation` |
| **Author** | `Senior Software Architect` |
| **Technical Lead** | `[Your Name/Team Lead's Name]` |

## 1. Overview
This document outlines the technical steps required to integrate the Koin dependency injection framework into the Android application. The primary objective is to establish a scalable and maintainable dependency management system. This plan covers adding the necessary libraries, setting up the Koin application context, defining modules for core architectural layers (Data, Domain, Presentation), and refactoring a sample feature to demonstrate the new DI pattern.

## 2. Prerequisites
- The Android project is set up with a standard Gradle build system (using `.kts` scripts).
- The project has an established architecture, likely a variation of MVVM, with distinct layers for UI (Activities/Fragments), ViewModels, Repositories, and Data Sources (API/DB).
- Access to modify the `app/build.gradle.kts` and `AndroidManifest.xml` files.

## 3. Architectural Changes
The introduction of Koin will shift the project from manual dependency instantiation (or Service Locator patterns) to the **Inversion of Control (IoC)** principle.

- **Decoupling:** Components will no longer be responsible for creating their own dependencies. Instead, they will declare their required dependencies (primarily through constructors), and Koin will be responsible for providing them.
- **Explicitness:** Dependencies of a class will be clearly visible in its constructor, improving code readability and understanding.
- **Testability:** Replacing real dependencies with mocks or fakes in unit tests will become trivial, as we can provide a different Koin module configuration during testing.
- **Centralized Configuration:** The dependency graph of the entire application will be defined and configured in a centralized set of Koin modules, making it easier to manage and reason about.

## 4. Proposed File Structure
To maintain a clean and organized structure, all Koin-related files will be placed in a new package:

```
app/src/main/java/com/{your_package_name}/
└── di/
    ├── AppModule.kt       // General application-wide dependencies
    ├── ViewModelModule.kt // Definitions for all ViewModels
    ├── RepositoryModule.kt// Definitions for all Repositories
    └── DataModule.kt      // Definitions for DataSources (API, Database DAOs, etc.)
```
This modular structure allows for better separation of concerns and scales well as the application grows.

## 5. Step-by-Step Implementation

### Step 1: Add Koin Dependencies
This step involves adding the required Koin libraries to the project's Gradle configuration.

- **File(s) to Modify:** `app/build.gradle.kts`
- **Implementation Details:**
  Add the following dependencies to the `dependencies` block. It's recommended to define the version in `gradle/libs.versions.toml` or `buildSrc` for consistency.

  ```kotlin
  // Koin for Android
  implementation("io.insert-koin:koin-android:3.5.3") // Check for the latest version

  // Optional: Koin for Jetpack Compose integration
  // implementation("io.insert-koin:koin-androidx-compose:3.5.3")
  ```
- **How to Verify:**
  - Sync the Gradle project in Android Studio. The build should complete successfully without any dependency resolution errors.

### Step 2: Create and Configure the Application Class
Koin needs to be initialized once when the application starts. This is done in a custom `Application` class.

- **File(s) to Create/Modify:**
  - `app/src/main/java/com/{your_package_name}/MainApplication.kt` (Create if it doesn't exist)
  - `app/src/main/AndroidManifest.xml` (Modify)
- **Implementation Details:**
  1.  Create a class that extends `android.app.Application`.
  2.  In the `onCreate()` method, initialize Koin with all the defined modules.

      ```kotlin
      // In MainApplication.kt
      package com.your_package_name

      import android.app.Application
      import com.your_package_name.di.appModule
      import com.your_package_name.di.dataModule
      import com.your_package_name.di.repositoryModule
      import com.your_package_name.di.viewModelModule
      import org.koin.android.ext.koin.androidContext
      import org.koin.android.ext.koin.androidLogger
      import org.koin.core.context.startKoin
      import org.koin.core.logger.Level

      class MainApplication : Application() {
          override fun onCreate() {
              super.onCreate()

              startKoin {
                  // Use androidLogger for logging Koin events (Level.ERROR for production)
                  androidLogger(Level.DEBUG)
                  // Use the Android context provided by this Application
                  androidContext(this@MainApplication)
                  // Load modules
                  modules(listOf(
                      appModule,
                      viewModelModule,
                      repositoryModule,
                      dataModule
                  ))
              }
          }
      }
      ```
  3.  Register this class in the manifest file.

      ```xml
      <!-- In AndroidManifest.xml -->
      <application
          android:name=".MainApplication"
          ... >
          ...
      </application>
      ```
- **How to Verify:**
  - Run the application.
  - Check Logcat for Koin initialization logs (e.g., `[Koin] loaded 15 definitions`). The app should start without crashing.

### Step 3: Define Koin Modules
Create the module files that will declare how to construct the application's components.

- **File(s) to Create:**
  - `app/src/main/java/com/{your_package_name}/di/AppModule.kt`
  - `app/src/main/java/com/{your_package_name}/di/DataModule.kt`
  - `app/src/main/java/com/{your_package_name}/di/RepositoryModule.kt`
  - `app/src/main/java/com/{your_package_name}/di/ViewModelModule.kt`
- **Implementation Details:**
  Create placeholder modules in each file. We will populate them in the subsequent steps.

  ```kotlin
  // In di/ViewModelModule.kt
  import org.koin.dsl.module
  val viewModelModule = module {
      // ViewModel definitions will go here
  }

  // In di/RepositoryModule.kt
  import org.koin.dsl.module
  val repositoryModule = module {
      // Repository definitions will go here
  }

  // In di/DataModule.kt
  import org.koin.dsl.module
  val dataModule = module {
      // DataSource (API, DB) definitions will go here
  }

  // In di/AppModule.kt
  import org.koin.dsl.module
  val appModule = module {
      // General app-wide singletons (e.g., SharedPreferences) will go here
  }
  ```
- **How to Verify:**
  - The project should compile successfully after these files are created and referenced in `MainApplication.kt`.

### Step 4: Populate Modules and Refactor Dependencies
Following the example from the specification (`TransactionHistory`), we will now populate the modules and refactor the classes to use constructor injection. We'll work from the bottom of the dependency graph upwards (Data -> Repository -> ViewModel).

#### 4.1 Data Layer (`DataModule.kt`)
- **File(s) to Modify:** `app/src/main/java/com/{your_package_name}/di/DataModule.kt`
- **Implementation Details:**
  Define how to create single instances of `ApiService` and `TransactionDao`.

  ```kotlin
  val dataModule = module {
      // Provides a singleton instance of ApiService
      single { ApiClient.create() } // Assuming ApiClient.create() returns a Retrofit service

      // Provides a singleton instance of TransactionDao
      single { AppDatabase.getDatabase(androidContext()).transactionDao() }
  }
  ```
- **How to Verify:**
  - The project compiles. The logic for creating these instances is now centralized.

#### 4.2 Repository Layer (`RepositoryModule.kt`)
- **File(s) to Modify:**
  - `app/src/main/java/com/{your_package_name}/di/RepositoryModule.kt`
  - `app/src/main/java/com/{your_package_name}/data/repository/TransactionRepositoryImpl.kt`
- **Implementation Details:**
  1.  Refactor `TransactionRepositoryImpl` to accept its dependencies via its primary constructor.

      ```kotlin
      // BEFORE
      // class TransactionRepositoryImpl {
      //     private val dao = AppDatabase.getDatabase(...).transactionDao()
      //     private val api = ApiClient.create()
      // }

      // AFTER
      class TransactionRepositoryImpl(
          private val dao: TransactionDao,
          private val api: ApiService
      ) : TransactionRepository { ... }
      ```
  2.  Define how to create the repository in the Koin module. Koin's `get()` function will resolve and provide the dependencies defined in `DataModule`.

      ```kotlin
      // In di/RepositoryModule.kt
      val repositoryModule = module {
          single<TransactionRepository> { TransactionRepositoryImpl(get(), get()) }
      }
      ```
- **How to Verify:**
  - The project compiles. The repository is now decoupled from the creation of its data sources.

#### 4.3 ViewModel Layer (`ViewModelModule.kt`)
- **File(s) to Modify:**
  - `app/src/main/java/com/{your_package_name}/di/ViewModelModule.kt`
  - `app/src/main/java/com/{your_package_name}/ui/transaction/TransactionHistoryViewModel.kt`
- **Implementation Details:**
  1.  Refactor `TransactionHistoryViewModel` to accept `TransactionRepository` via its constructor.

      ```kotlin
      // BEFORE
      // class TransactionHistoryViewModel : ViewModel() {
      //     private val repository = TransactionRepositoryImpl(...)
      // }

      // AFTER
      class TransactionHistoryViewModel(
          private val transactionRepository: TransactionRepository
      ) : ViewModel() { ... }
      ```
  2.  Define the ViewModel in its Koin module using the `viewModel` factory.

      ```kotlin
      // In di/ViewModelModule.kt
      import org.koin.androidx.viewmodel.dsl.viewModel
      import org.koin.dsl.module

      val viewModelModule = module {
          viewModel { TransactionHistoryViewModel(get()) }
      }
      ```
- **How to Verify:**
  - The project compiles. The ViewModel is now decoupled from the creation of its repository.

### Step 5: Refactor UI Layer to Inject ViewModel
This is the final step where we consume the `ViewModel` in the UI layer using Koin's delegate property.

- **File(s) to Modify:** `app/src/main/java/com/{your_package_name}/ui/transaction/TransactionHistoryFragment.kt`
- **Implementation Details:**
  1.  Replace the manual `ViewModelProvider` instantiation with Koin's `by viewModel()` delegate.
  2.  Remove any old `ViewModelFactory` classes associated with this ViewModel, as Koin now handles factory logic.

      ```kotlin
      // In TransactionHistoryFragment.kt
      import org.koin.androidx.viewmodel.ext.android.viewModel

      class TransactionHistoryFragment : Fragment() {
          // BEFORE
          // private lateinit var viewModel: TransactionHistoryViewModel
          // ...
          // override fun onViewCreated(...) {
          //     val factory = TransactionViewModelFactory(...)
          //     viewModel = ViewModelProvider(this, factory).get(TransactionHistoryViewModel::class.java)
          // }

          // AFTER
          private val viewModel: TransactionHistoryViewModel by viewModel()

          override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
              super.onViewCreated(view, savedInstanceState)
              // The viewModel is ready to be used immediately.
              viewModel.loadTransactions()
          }
      }
      ```
- **How to Verify:**
  - Build and run the application on an emulator or physical device.
  - Navigate to the "Transaction History" screen.
  - **The screen must load and function exactly as it did before the refactoring.** There should be no `NoBeanDefFoundException` or other Koin-related crashes.

## 6. Verification Plan
The overall success of this implementation will be verified by confirming that all acceptance criteria from the specification are met.

| # | Action | Expected Result |
|---|---|---|
| 1 | Check `app/build.gradle.kts` | The `koin-android` dependency is present. |
| 2 | Run the app and check Logcat | Koin initialization logs are visible on app startup. |
| 3 | Inspect the `di` package | Module files for ViewModel, Repository, and Data layers exist and are populated. |
| 4 | Review `TransactionHistoryFragment.kt` | The `ViewModel` is injected using `by viewModel()`. Old factory code is removed. |
| 5 | Review `TransactionHistoryViewModel.kt` | Dependencies are injected via the primary constructor. |
| 6 | Full feature test | Launch the app, navigate to the refactored screen, and confirm full functionality without any crashes. |

## 7. Rollback Plan
In the event of critical issues (e.g., unsolvable runtime crashes, build failures), the changes can be rolled back by:
1.  Reverting all changes in the feature branch using `git revert` or `git reset`.
2.  The changes are self-contained within a specific feature branch, so a rollback will not affect the `main` or `develop` branches.
3.  If issues are found post-merge, an immediate revert of the merge commit will be performed, and a new branch will be created to address the issues.

## 8. Future Considerations
- **Testing:** With DI in place, the next logical step is to implement unit tests for ViewModels and Repositories by providing mock dependencies using `KoinTest`.
- **Scoping:** For features that have a specific lifecycle (e.g., a user login session or a multi-step flow), Koin scopes can be introduced to manage dependencies tied to that lifecycle.
- **Further Refactoring:** Gradually refactor other features and components of the application to use Koin for dependency injection, ensuring consistency across the codebase.