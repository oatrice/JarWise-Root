# Implementation Plan - Integrating Koin Dependency Injection (Issue #34)

This plan outlines the steps to integrate the Koin dependency injection framework into the JarWise Android application. The goal is to replace manual dependency instantiation with a robust, testable, and maintainable DI system.

## User Review Required

> [!IMPORTANT]
> This is a significant architectural change that touches the core of the application (Repositories, ViewModels, and App Initialization).
> - **Breaking Change**: The way `ViewModel`s are instantiated will change across the app.
> - **New Application Class**: A new `JarWiseApplication` class will be introduced and set in `AndroidManifest.xml`.

## Proposed Changes

### Build Configuration

#### [MODIFY] [build.gradle.kts](file:///Users/oatrice/Software-projects/JarWise/Android/app/build.gradle.kts)
- Add `koin-android` and `koin-androidx-compose` dependencies.

### Application Initialization

#### [NEW] [JarWiseApplication.kt](file:///Users/oatrice/Software-projects/JarWise/Android/app/src/main/java/com/oatrice/jarwise/JarWiseApplication.kt)
- Create a new class extending `Application`.
- Initialize Koin in `onCreate()` using `startKoin`.
- Load modules: `appModule`, `dataModule`, `repositoryModule`, `viewModelModule`.

#### [MODIFY] [AndroidManifest.xml](file:///Users/oatrice/Software-projects/JarWise/Android/app/src/main/AndroidManifest.xml)
- Update `<application>` tag to point to `.JarWiseApplication`.

### Dependency Injection Modules (New Package: `di`)

#### [NEW] [AppModule.kt](file:///Users/oatrice/Software-projects/JarWise/Android/app/src/main/java/com/oatrice/jarwise/di/AppModule.kt)
- Define general app-wide dependencies (if any).

#### [NEW] [DataModule.kt](file:///Users/oatrice/Software-projects/JarWise/Android/app/src/main/java/com/oatrice/jarwise/di/DataModule.kt)
- Provide `AppDatabase` singleton.
- Provide DAOs: `TransactionDao`, `AllocationDao`, `JarConfigDao`, `WalletDao`.

#### [NEW] [RepositoryModule.kt](file:///Users/oatrice/Software-projects/JarWise/Android/app/src/main/java/com/oatrice/jarwise/di/RepositoryModule.kt)
- Define `single` definitions for all Repositories, injecting their dependencies (DAOs, Context, etc.).

#### [NEW] [ViewModelModule.kt](file:///Users/oatrice/Software-projects/JarWise/Android/app/src/main/java/com/oatrice/jarwise/di/ViewModelModule.kt)
- Define `viewModel` definitions for all ViewModels, injecting Repositories.

### Refactoring Components

#### Repositories
Update the following repositories to accept dependencies via **Constructor Injection** instead of internal instantiation:
- [MODIFY] [WalletRepository.kt](file:///Users/oatrice/Software-projects/JarWise/Android/app/src/main/java/com/oatrice/jarwise/data/repository/WalletRepository.kt)
- [MODIFY] [JarConfigRepository.kt](file:///Users/oatrice/Software-projects/JarWise/Android/app/src/main/java/com/oatrice/jarwise/data/repository/JarConfigRepository.kt)
- [MODIFY] [SlipRepository.kt](file:///Users/oatrice/Software-projects/JarWise/Android/app/src/main/java/com/oatrice/jarwise/data/repository/SlipRepository.kt)
- [MODIFY] [UserPreferencesRepository.kt](file:///Users/oatrice/Software-projects/JarWise/Android/app/src/main/java/com/oatrice/jarwise/data/repository/UserPreferencesRepository.kt)
- [MODIFY] [CurrencyRepository.kt](file:///Users/oatrice/Software-projects/JarWise/Android/app/src/main/java/com/oatrice/jarwise/data/repository/CurrencyRepository.kt)

#### ViewModels
Update the following ViewModels to accept Repositories via **Constructor Injection**:
- [MODIFY] [ManageWalletsViewModel.kt](file:///Users/oatrice/Software-projects/JarWise/Android/app/src/main/java/com/oatrice/jarwise/ui/managewallets/ManageWalletsViewModel.kt)
- [MODIFY] [ManageJarsViewModel.kt](file:///Users/oatrice/Software-projects/JarWise/Android/app/src/main/java/com/oatrice/jarwise/ui/managejars/ManageJarsViewModel.kt)
- [MODIFY] [SlipViewModel.kt](file:///Users/oatrice/Software-projects/JarWise/Android/app/src/main/java/com/oatrice/jarwise/ui/SlipViewModel.kt)
- [MODIFY] [MainViewModel.kt](file:///Users/oatrice/Software-projects/JarWise/Android/app/src/main/java/com/oatrice/jarwise/ui/MainViewModel.kt)

### UI Integration

#### [MODIFY] [MainActivity.kt](file:///Users/oatrice/Software-projects/JarWise/Android/app/src/main/java/com/oatrice/jarwise/MainActivity.kt)
- Replace manual ViewModel instantiation with `koinViewModel()`.
- Ensure `KoinAndroidContext` or proper setup is used if relying on Compose.

## Verification Plan

### Automated Tests
- Run `./gradlew testDebugUnitTest` to ensure no existing logic is broken.
- (Optional) Add a basic Koin check test to verify module configuration graph.

### Manual Verification
1.  **Launch App**: Verify the app starts without crashing (validating `JarWiseApplication` and Koin init).
2.  **Wallet Management**: Navigate to "Manage Wallets", Add/Edit/Delete a wallet. Verifies `WalletRepository` and `ManageWalletsViewModel` injection.
3.  **Jar Management**: Navigate to "Manage Jars", Add/Edit/Delete a jar. Verifies `JarConfigRepository` and `ManageJarsViewModel` injection.
4.  **Transactions**: Add a transaction to verify database interactions through the injected stack.