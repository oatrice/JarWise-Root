# Implementation Plan: Expense Graph for Jar Categories and Sub-categories with Time Period Selection

> **Refers to**: [Spec Link](./spec.md)
> **Status**: Draft

## 1. Architecture & Design
*High-level technical approach.*

The implementation will introduce a new, reusable UI component for displaying expense graphs. Data will be fetched from a new, dedicated backend endpoint that provides pre-aggregated expense data based on a category/sub-category ID and a selected time period (`weekly`, `monthly`, `yearly`). This approach centralizes the complex data aggregation logic on the backend, simplifying the clients and ensuring consistent calculations.

State management on Android will be handled within the existing `CategoryDetailViewModel` and `SubCategoryDetailViewModel`, which will be updated to manage the graph's state, including the selected time period, loading status, and fetched data.

### Component View
> [!IMPORTANT]
> **Platform Scope Policy:**
> - **Android**: Full implementation with production-ready code and tests.
> - **Web**: Mock UI only for this phase.
>
> **Development Order:** Web Mock UI FIRST → Android Full Implementation SECOND.

- **Modified Components**:
    - **Web**: `src/pages/CategoryDetail.tsx`, `src/pages/SubCategoryDetail.tsx` (to include the new mock component).
    - **Android**: `CategoryDetailViewModel.kt`, `SubCategoryDetailViewModel.kt` (to add state management and data fetching logic), `CategoryDetailScreen.kt`, `SubCategoryDetailScreen.kt` (to integrate the new graph composable).

- **New Components**:
    - **Web**: `src/components/graphs/ExpenseGraphMock.tsx` (A static/hardcoded representation of the graph UI for visual prototyping).
    - **Android**:
        - `data/model/GraphDataPointDto.kt` (Data Transfer Object for API response).
        - `data/api/GraphApiService.kt` (Retrofit service definition for the new endpoint).
        - `domain/usecase/GetExpenseGraphDataUseCase.kt` (Business logic to fetch and prepare graph data).
        - `ui/components/ExpenseGraph.kt` (A reusable Jetpack Compose component for the graph, handling states like loading, error, no data, and displaying the chart).

- **Dependencies**:
    - **Android**: We will introduce a new charting library, **Vico**, for its native Jetpack Compose support and flexibility.
      - `com.patrykandpatrick.vico:compose-m3:<latest_version>`
      - `com.patrykandpatrick.vico:core:<latest_version>`

### Data Model Changes

A new API endpoint `/api/graph/expenses` is assumed to be created by the backend team. The client will send a `categoryId` (or `subCategoryId`) and a `period` (`weekly`, `monthly`, `yearly`).

The expected JSON response structure will be:

```json
{
  "data": [
    {
      "label": "September 2023",
      "amount": 2050.50
    },
    {
      "label": "October 2023",
      "amount": 2195.00
    },
    {
      "label": "November 2023",
      "amount": 1500.00
    }
  ]
}
```

This will be mapped to the following Kotlin data class on Android:

```kotlin
// File: data/model/GraphDataPointDto.kt
data class GraphDataResponse(
    val data: List<GraphDataPointDto>
)

data class GraphDataPointDto(
    val label: String, // e.g., "October 2023", "Week of Oct 23"
    val amount: Double
)
```

---

## 2. Step-by-Step Implementation

### Prerequisite: Backend API Endpoint

- **Action**: This plan assumes the backend team will create a new endpoint: `GET /api/graph/expenses`.
- **Params**: `id: String`, `type: ('category'|'subcategory')`, `period: ('weekly'|'monthly'|'yearly')`.
- **Response**: A JSON object as defined in the `Data Model Changes` section.
- **Verification**: The endpoint is deployed and accessible by the mobile client.

### Step 1: Web - Mock UI Implementation

- **Goal**: Create a static, non-functional UI mock of the expense graph on the Web platform to align on visuals.
- **Files to Create**:
    - `src/components/graphs/ExpenseGraphMock.tsx`
- **Files to Modify**:
    - `src/pages/CategoryDetail.tsx`
    - `src/pages/SubCategoryDetail.tsx`
- **Code**:
    1. In `ExpenseGraphMock.tsx`, create a component that displays a hardcoded bar chart (can be an SVG or composed of divs) and the "Weekly", "Monthly", "Yearly" tabs. The "Monthly" tab will be active by default.
    2. Include a "No data available" message view within the component, which can be toggled with a prop for testing different states.
    3. Import and render `<ExpenseGraphMock />` within the detail pages for categories and sub-categories.
- **Verification**:
    - The mock graph component appears correctly on both the category and sub-category detail pages on the web app.
    - The tabs for time period selection are visible.

### Step 2: Android - Data Layer Setup

- **Goal**: Set up the necessary data models, API service, and repository methods to fetch graph data.
- **Files to Create**:
    - `app/src/main/java/com/jarwise/data/model/GraphDataPointDto.kt`
- **Files to Modify**:
    - `app/build.gradle.kts` (to add Vico dependency).
    - `app/src/main/java/com/jarwise/data/api/ApiService.kt` (or equivalent).
    - `app/src/main/java/com/jarwise/data/repository/TransactionRepository.kt` (or equivalent).
- **Code**:
    1. Add the Vico library dependencies to `app/build.gradle.kts`.
    2. Create the `GraphDataResponse` and `GraphDataPointDto` data classes.
    3. In `ApiService.kt`, add a new suspend function: `getExpenseGraphData(@Query("id") id: String, @Query("type") type: String, @Query("period") period: String): GraphDataResponse`.
    4. In `TransactionRepository.kt`, add a new function that calls the API service method and handles potential exceptions, returning a `Result` or `Flow`.
- **Verification**:
    - The project builds successfully with the new dependency.
    - A unit test for the repository method confirms that it correctly calls the API service and handles success/error responses from a mock service.

### Step 3: Android - Domain & ViewModel Logic

- **Goal**: Implement the use case and update ViewModels to manage the graph's state.
- **Files to Create**:
    - `app/src/main/java/com/jarwise/domain/usecase/GetExpenseGraphDataUseCase.kt`
- **Files to Modify**:
    - `app/src/main/java/com/jarwise/ui/category_detail/CategoryDetailViewModel.kt`
    - `app/src/main/java/com/jarwise/ui/subcategory_detail/SubCategoryDetailViewModel.kt`
- **Code**:
    1. Create `GetExpenseGraphDataUseCase` which takes the repository as a dependency and exposes an `invoke` method to fetch graph data.
    2. In both ViewModels, introduce new `StateFlow`s to hold the graph UI state (e.g., `data`, `isLoading`, `error`, `selectedPeriod`).
    3. Create a function `loadGraphData(period: TimePeriod)` that updates the `isLoading` state, calls the use case, and updates the state with the result (data or error).
    4. Create a function `onPeriodSelected(period: TimePeriod)` that updates the `selectedPeriod` state and triggers a call to `loadGraphData`.
    5. Ensure the default period is "Monthly" and data is fetched on `init`.
- **Verification**:
    - Unit test `GetExpenseGraphDataUseCase` to ensure it calls the repository correctly.
    - Unit test the ViewModels:
        - Verify the initial state is `isLoading=true` and the period is "Monthly".
        - Verify that calling `onPeriodSelected` updates the state and triggers a new data fetch.
        - Verify that a successful fetch updates the state with data and sets `isLoading=false`.
        - Verify that a failed fetch updates the error state and sets `isLoading=false`.

### Step 4: Android - Reusable `ExpenseGraph` Composable

- **Goal**: Build the complete UI component for the graph, capable of rendering all specified states.
- **Files to Create**:
    - `app/src/main/java/com/jarwise/ui/components/ExpenseGraph.kt`
- **Code**:
    1. Create a composable function `ExpenseGraph(state: GraphUiState, onPeriodSelected: (TimePeriod) -> Unit, onRetry: () -> Unit)`.
    2. Use a `TabRow` to display the "Weekly", "Monthly", "Yearly" options. The selected tab should be derived from `state.selectedPeriod`. Tapping a tab calls `onPeriodSelected`.
    3. Use a `when` statement to render the UI based on the state:
        - **Loading**: Show a `CircularProgressIndicator` or a skeleton loader.
        - **Error**: Show an error message and a "Retry" button that calls `onRetry`.
        - **Success with no data**: Show the "No spending data available..." message.
        - **Success with data**: Render the bar chart using the Vico library's `Chart` composable.
    4. Configure the Vico chart:
        - Set up the `ChartModelProducer` to feed data from the state.
        - Customize axes: bottom axis for labels (`state.data.label`), start axis for amounts.
        - Implement tooltips on bar tap/press, formatting the display string as required.
- **Verification**:
    - Create a preview for each state (loading, error, no data, success) using `@Preview` annotations in `ExpenseGraph.kt`.
    - Manually interact with the previews to ensure the tabs are selectable and the chart looks correct with sample data.

### Step 5: Android - Integration into Screens

- **Goal**: Place the `ExpenseGraph` component into the detail screens and connect it to the ViewModels.
- **Files to Modify**:
    - `app/src/main/java/com/jarwise/ui/category_detail/CategoryDetailScreen.kt`
    - `app/src/main/java/com/jarwise/ui/subcategory_detail/SubCategoryDetailScreen.kt`
- **Code**:
    1. In both screen composables, collect the graph UI state from the respective ViewModel.
    2. Add the `ExpenseGraph` component to the screen's layout.
    3. Pass the collected state and the ViewModel's event handler functions (`onPeriodSelected`, `loadGraphData`) to the `ExpenseGraph` composable.
- **Verification**:
    - Run the app on an emulator or device.
    - The integration is complete and the graph is now a live, data-driven component on the detail screens.

---

## 3. Verification Plan
*How will we verify success?*

> [!IMPORTANT]
> **Android Build Policy**: MUST use scripts in `Android/scripts/` (e.g., `build_android.sh`) instead of direct `./gradlew` to ensure correct JDK version (Java 21).

### Automated Tests
- [X] **Unit Tests**:
    - `CategoryDetailViewModelTest.kt`: Verify graph state management logic.
    - `SubCategoryDetailViewModelTest.kt`: Verify graph state management logic.
    - `GetExpenseGraphDataUseCaseTest.kt`: Verify interaction with the repository.
    - `TransactionRepositoryTest.kt`: Verify API calling logic with a mock web server.
- [ ] **Integration Tests**: (Optional) An end-to-end test could navigate to a detail screen and assert that the graph component is displayed.

### Manual Verification
- [ ] **AC1 (Graph Display)**: Navigate to a Jar Category and a Sub-category detail screen. Verify a bar chart is displayed on both.
- [ ] **AC7 (Default View)**: On first load of either screen, confirm the "Monthly" time period is selected by default.
- [ ] **AC2 (Time Period Selection)**: Tap on "Weekly" and "Yearly". Verify the graph data updates accordingly for each selection.
- [ ] **AC3 (Data Accuracy)**: Using the data from "Specification by Example", manually add the transactions and verify the graph bars show the correct total amounts for September, October, and November in the "Monthly" view.
- [ ] **AC4 (Axis Representation)**: Check that the X-axis shows time labels (e.g., "Oct 2023") and the Y-axis shows currency amounts.
- [ ] **AC5 (Tooltips)**: Tap and hold on a bar in the chart. Verify a tooltip appears showing the exact period and total amount (e.g., "October 2023: ฿2,195.00").
- [ ] **AC6 (No Data State)**: Navigate to a category with no transactions. Verify the graph area shows the message "No spending data available for this period."
- [ ] **Error Handling (Loading)**: While data is loading (use network throttle), verify a loading indicator is shown.
- [ ] **Error Handling (API Failure)**: Simulate a network error. Verify the graph area shows an error message with a "Retry" button, and that the button works.