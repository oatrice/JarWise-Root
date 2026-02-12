# Changelog

## [0.8.0] - 2026-02-18

### Added
- **[Feature] Multi-Select Report Filters:** Implemented the ability for users to select multiple categories and accounts simultaneously when generating financial reports. This provides greater flexibility and allows for more powerful, customized data analysis.
- **[Docs]** Added extensive new planning, analysis, and specification documents for the multi-select filter feature.

### Changed
- **[Docs]** Updated the project `ROADMAP.md` to reflect the completion of the multi-select filter feature and to add a draft review for the next development phase.

## [0.7.0] - 2026-02-11

### Added
- **[Feature] Transaction Linking for Transfers:** Implemented a system to link the debit and credit transactions when transferring funds between user-owned accounts (e.g., from a Wallet to a Jar). This provides a clearer financial overview by treating internal transfers as a single, unified event, preventing them from being incorrectly counted in income or expense reports.
- **[Docs]** Added extensive new planning, analysis, and specification documents for the transaction linking feature.

### Changed
- **[Docs]** Updated the project `ROADMAP.md` to reflect the completion of new features.

## [0.6.0] - 2026-02-04

### Added
- **[Feature] Data Migration from Money Manager:** Implemented a comprehensive tool to import complete financial history from the "Money Manager" app using `.mmbak` backup files.
- **[Android]** Added a new UI flow for users to select and upload their `.mmbak` file to start the migration process.
- **[Backend]** Developed a new service in Go to parse `.mmbak` files, mapping and importing all accounts, categories, and transactions into the user's JarWise profile.

## [0.5.0] - 2026-02-01

### Added
- **[Feature] Hierarchical Jars & Wallets:** Implemented support for nested "sub-jars" and "sub-wallets", allowing for more granular financial organization and tracking.
- **[Web & Android]** Introduced a new UI for managing hierarchical structures, including creating, editing, and viewing nested jars and wallets.
- **[Web & Android]** Enhanced the "Add Transaction" form to include date and wallet selection, providing more control over transaction details.
- **[Android]** Implemented a draft transaction review screen, allowing users to verify details from imported slips before saving.
- **[Docs]** Introduced comprehensive pre-coding guidelines, feature analysis templates, and a project glossary to improve development workflow.

### Changed
- **[Docs]** The project `ROADMAP.md` has been significantly updated with detailed feature statuses, dependencies, and a phased execution plan.

## [0.4.0] - 2026-01-18

### Added
- **[System]** Enhanced the mock data sync script to generate more vibrant and visually distinct colors for Jars, improving the default developer experience.
- **[Docs]** Added documentation outlining the mock data sync improvements.

### Changed
- **[System]** Reorganized utility scripts into a central `scripts/` directory for better project maintainability.

## [0.3.0] - 2026-01-18

### Added
- **[Feature]** Currency Support (THB, USD, EUR, GBP, JPY) across Web and Android.
- **[Web]** Mobile Parity: Import Slip UI, Settings Overlay, and responsive header.
- **[Docs]** Updated readme and implementation plans for currency features.

## [0.2.0] - 2026-01-15

### 🎨 Design System & Alignment

- **[System]** Implemented **Shared Design Tokens** (`tokens/colors.json`) as
  the single source of truth for colors across all platforms.
- **[System]** Added `scripts/sync_tokens.js` to auto-generate Android
  (`Color.kt`) and Web (`tailwind.theme.js`) theme files.

### 📱 Android

- **[Fix]** Synced `MockData.kt` (Jars & Transactions) to match Web content 1:1.
- **[UI]** Updated `TransactionCard` to support dynamic Icon Tints (Background
  alpha + Foreground solid) to match Web styling.
- **[Docs]** Added warning about auto-generated files in README.

### 🌐 Web

- **[Config]** Migrated `tailwind.config.js` to use generated tokens from
  `tailwind.theme.js`.
- **[Docs]** Updated README to reference the root repository for design tokens.

## [0.1.0] - 2026-01-15

### Initial Release

- **Architecture**: Established Monorepo structure (Web, Mobile, Android, iOS).
- **Web**: Deployed "MagicPatterns" design system with Tailwind v4.
- **Design**: Integrated MagicPatterns 6-Jars design system.
- **Docs**: Added comprehensive workflows for Build Fixes, New Features, and
  standard Changelogs.
