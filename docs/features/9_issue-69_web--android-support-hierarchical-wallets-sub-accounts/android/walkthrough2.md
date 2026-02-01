# Walkthrough - Fixing ManageWalletsViewModelTest

I have resolved the build errors and functional test failures related to `ManageWalletsViewModelTest`.

## Issues Resolved

### 1. Compilation Errors
- **Inheritance Issue**: `WalletRepository` was a final class, preventing `FakeWalletRepository` from inheriting it.
- **Missing Mockito**: The project lacked `mockito-core` and `mockito-kotlin` dependencies.

### 2. Functional Test Failures
- **Race Conditions**: Tests failed (`AssertionError`, `NullPointerException`) because the `ViewModel`'s `StateFlow` was not collecting updates from the repository fast enough.
- **Max Depth Check**: Failed because previous wallet levels weren't updating correctly in the test environment.

## Changes

### `app/build.gradle.kts`
Added Mockito dependencies for unit testing.
```kotlin
    testImplementation("org.mockito:mockito-core:5.10.0")
    testImplementation("org.mockito.kotlin:mockito-kotlin:5.2.1")
```

### `WalletRepository.kt`
Opened the class and its methods to allow inheritance/mocking.
```kotlin
open class WalletRepository(private val walletDao: WalletDao) {
    open suspend fun insertWallet(...) { ... }
    // ...
}
```

### `ManageWalletsViewModelTest.kt`
1. **Background Collection**: Added `startCollectingWallets()` to ensure `viewModel.wallets` StateFlow remains active and updated.
2. **Dispatcher Fix**: Switched to `UnconfinedTestDispatcher()` to ensure immediate execution of coroutines, solving race conditions where `wallets.value` was stale during `addWallet` calls.

```kotlin
    private val testDispatcher = UnconfinedTestDispatcher()

    private fun kotlinx.coroutines.test.TestScope.startCollectingWallets() {
        backgroundScope.launch(UnconfinedTestDispatcher(testScheduler)) {
            viewModel.wallets.collect()
        }
    }
```

## Verification Results
Ran `./scripts/build_android.sh testDebugUnitTest`:
- ✅ `ManageWalletsViewModelTest`: 5/5 tests PASSED.
- ✅ All other tests: passed.
