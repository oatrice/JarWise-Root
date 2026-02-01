# Logic Flow: Data Integration (Android)

## 1. Data Sources
- **Configuration**: `JarConfig` (Room DB) from `JarConfigRepository`
  - Name, Color, Icon, Percentage
- **Balances**: Calculated from `TransactionDao` + `JarConfig`
  - Currently `MainViewModel` calculates `totalBalance` from transactions.
  - Per-jar balance is calculated by filtering transactions by `jarId`.

## 2. Integration Strategy (MainViewModel)

Modify `MainViewModel` to observe both `JarConfig` and `Transactions` using `combine`.

```kotlin
val jars: StateFlow<List<Jar>> = combine(
    jarConfigRepository.getAllJarConfigsFlow(),
    transactionDao.getAll()
) { configs, transactions ->
    if (configs.isEmpty()) return emptyList()
    
    configs.map { config ->
        val balance = transactions.filter { it.jarId == config.id }.sumOf { it.amount }
        Jar(
            id = config.id,
            name = config.name,
            current = balance,
            goal = calculateGoal(config.percentage),
            level = calculateLevel(balance),
            icon = getIconFromName(config.iconName),
            color = getColorFromName(config.colorName),
            // ...
        )
    }
}
```

## 3. Changes Required

1.  **MainViewModel.kt**: Inject `JarConfigRepository`, Add `jars` StateFlow logic.
2.  **MainActivity.kt**: Pass `jarConfigRepository` to Factory.
3.  **DashboardScreen.kt**: Consume real `jars` data.

## 4. Edge Cases
- **Empty DB**: `JarConfigRepository` initializes defaults on access.
- **Initial Launch**: Empty list handling required.

## Status: ✅ Integrated
