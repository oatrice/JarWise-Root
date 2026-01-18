# Changelog

## [0.4.0] - 2026-01-18

### Added
- **[System]** Enhanced the mock data sync script to generate more vibrant and visually distinct colors for Jars, improving the default developer experience.
- **[Docs]** Added documentation outlining the mock data sync improvements.

### Changed
- **[System]** Reorganized utility scripts into a central `scripts/` directory for better project maintainability.

# JarWise Project Changelog

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
