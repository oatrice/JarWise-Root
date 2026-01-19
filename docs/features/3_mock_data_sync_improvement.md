# Mock Data Sync Script Improvement

**Created:** 2026-01-18  
**Status:** Planned

## Overview

Improve `scripts/sync_mock_data.js` to generate Web mock data matching original format, using dynamic color values from `tokens/colors.json`.

## Problem

Generated output differs from original:

| Field | Original | Current |
|-------|----------|---------|
| `bgGlow` | `shadow-[0_0_30px_rgba(96,165,250,0.3)]` | `bg-blue-500/10` |
| Quotes | Single `'value'` | Double `"value"` |

## Solution

**Read colors from `tokens/colors.json`** - no hardcoded mapping!

### 1. Load Tokens
```javascript
const colors = JSON.parse(fs.readFileSync('tokens/colors.json', 'utf8'));
// colors.blue['400'] = '#60A5FA'
```

### 2. HEX to RGB Converter
```javascript
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
    ] : null;
}
```

### 3. Generate Glow Shadow
```javascript
function toGlowShadow(tailwindClass, alpha = 0.3) {
    // 'text-blue-400' → colors.blue['400'] → '#60A5FA' → [96, 165, 250]
    const match = tailwindClass.match(/(blue|green|pink|yellow|purple|red|gray)-(\d+)/);
    if (!match) return `shadow-[0_0_30px_rgba(96,165,250,${alpha})]`;
    
    const hex = colors[match[1]]?.[match[2]];
    const rgb = hexToRgb(hex) || [96, 165, 250];
    return `shadow-[0_0_30px_rgba(${rgb.join(',')},${alpha})]`;
}
```

### 4. Add Timestamp
```javascript
// Generated at: 2026-01-18T13:12:45+07:00
```

## Files Changed

| File | Description |
|------|-------------|
| `scripts/sync_mock_data.js` | Add token-based color computation |

## Verification

1. Run `node scripts/sync_mock_data.js`
2. Verify `bgGlow` uses `shadow-[...]` format
3. Verify timestamp is present
4. Compare with `git diff`
