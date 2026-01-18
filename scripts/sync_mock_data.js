const fs = require('fs');
const path = require('path');

// Configuration
const SOURCE_JSON = path.join(__dirname, '../shared-spec/data/mockData.json');
const COLORS_JSON = path.join(__dirname, '../tokens/colors.json');
const ANDROID_OUTPUT = path.join(__dirname, '../Android/app/src/main/java/com/oatrice/jarwise/data/GeneratedMockData.kt');
const WEB_OUTPUT = path.join(__dirname, '../Web/src/utils/generatedMockData.ts');

// Read Source Data
const data = JSON.parse(fs.readFileSync(SOURCE_JSON, 'utf8'));
const colors = JSON.parse(fs.readFileSync(COLORS_JSON, 'utf8'));

// ---------------------------------------------------------
// Color Utilities
// ---------------------------------------------------------
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
    ] : null;
}

function extractColorKey(tailwindClass) {
    // 'text-blue-400' → ['blue', '400']
    const match = tailwindClass.match(/(blue|green|pink|yellow|purple|red|gray|cyan|orange|emerald)-(\d+)/);
    return match ? { color: match[1], shade: match[2] } : null;
}

function toGlowShadow(tailwindClass, alpha = 0.3) {
    const key = extractColorKey(tailwindClass);
    if (!key) return `shadow-[0_0_30px_rgba(96,165,250,${alpha})]`;

    const hex = colors[key.color]?.[key.shade];
    const rgb = hexToRgb(hex) || [96, 165, 250];
    return `shadow-[0_0_30px_rgba(${rgb.join(',')},${alpha})]`;
}

// ---------------------------------------------------------
// Generator: Android (Kotlin)
// ---------------------------------------------------------
function generateKotlin(data) {
    // Icon mapping: Lucide -> Material Icons
    const iconMap = {
        'Home': 'Home',
        'DollarSign': 'AttachMoney',
        'Gamepad2': 'Gamepad',
        'GraduationCap': 'School',
        'Plane': 'Flight',
        'Heart': 'Favorite',
        'Headphones': 'Headphones',
        'ShoppingBag': 'ShoppingBag'
    };

    // Color mapping: Tailwind -> Theme colors
    const colorMap = {
        'text-blue-400': 'Blue400',
        'text-green-400': 'Green400',
        'text-pink-400': 'Pink400',
        'text-yellow-400': 'Yellow400',
        'text-purple-400': 'Purple400',
        'text-red-400': 'Red400',
        'text-gray-400': 'Gray400',
        'bg-blue-500': 'Blue500',
        'bg-green-500': 'Green500',
        'bg-pink-500': 'Pink500',
        'bg-yellow-500': 'Yellow500',
        'bg-purple-500': 'Purple500',
        'bg-red-500': 'Red500',
        'bg-gray-500': 'Gray500'
    };

    const timestamp = new Date().toISOString();

    const jars = data.jars.map(jar => `
        Jar(
            id = "${jar.id}",
            name = "${jar.name}",
            current = ${jar.current},
            goal = ${jar.goal}.0,
            level = ${jar.level},
            icon = Icons.Rounded.${iconMap[jar.icon] || jar.icon},
            color = ${colorMap[jar.color] || 'Blue400'},
            shadowColor = ${colorMap[jar.shadowColor] || 'Blue500'},
            barColor = ${colorMap[jar.barColor] || 'Blue500'}
        )`).join(',');

    const transactions = data.transactions.map(t => `
        Transaction(
            id = "${t.id}",
            merchant = "${t.merchant}",
            amount = ${t.amount},
            category = "${t.category}",
            date = "${t.date}",
            icon = Icons.Rounded.${iconMap[t.icon] || t.icon},
            color = ${colorMap[t.color] || 'Green500'}.copy(alpha = 0.1f),
            iconTint = ${colorMap[t.color] || 'Green400'}
        )`).join(',');

    return `package com.oatrice.jarwise.data

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.*
import com.oatrice.jarwise.model.Jar
import com.oatrice.jarwise.model.Transaction
import com.oatrice.jarwise.ui.theme.*

// WARNING: This file is auto-generated. Do not edit directly.
// Generated from: shared-spec/data/mockData.json
// Generated at: ${timestamp}

object GeneratedMockData {
    val jars = listOf(${jars}
    )

    val transactions = listOf(${transactions}
    )
}`;
}

// ---------------------------------------------------------
// Generator: Web (TypeScript)
// ---------------------------------------------------------
function generateTypeScript(data) {
    const iconImports = new Set();

    // Collect icons
    data.jars.forEach(j => iconImports.add(j.icon));
    data.transactions.forEach(t => iconImports.add(t.icon));

    const imports = Array.from(iconImports).join(', ');
    const timestamp = new Date().toISOString();

    // Generate jars with computed colors
    const jarsArray = data.jars.map(jar => {
        const bgGlow = toGlowShadow(jar.color);
        return `    {
        id: '${jar.id}',
        name: '${jar.name}',
        current: ${jar.current},
        goal: ${jar.goal},
        level: ${jar.level},
        color: '${jar.color}',
        bgGlow: '${bgGlow}',
        icon: ${jar.icon},
        barColor: '${jar.barColor}',
        shadowColor: '${jar.barColor}'
    }`;
    }).join(',\n');

    // Generate transactions
    const transactionsArray = data.transactions.map(t => {
        return `    {
        id: '${t.id}',
        merchant: '${t.merchant}',
        amount: ${t.amount},
        category: '${t.category}',
        date: '${t.date}',
        isTaxDeductible: ${t.isTaxDeductible},
        color: '${t.color}',
        icon: ${t.icon}
    }`;
    }).join(',\n');

    return `// WARNING: This file is auto-generated. Do not edit directly.
// Generated at: ${timestamp}
import { ${imports}, type LucideIcon } from 'lucide-react';

export type Jar = {
    id: string;
    name: string;
    current: number;
    goal: number;
    level: number;
    color: string;
    bgGlow: string;
    icon: LucideIcon;
    barColor: string;
    shadowColor: string;
}

export type Transaction = {
    id: string;
    merchant: string;
    amount: number;
    category: string;
    date: string;
    isTaxDeductible: boolean;
    color: string;
    icon: LucideIcon;
}

export const jars: Jar[] = [
${jarsArray}
];

export const transactions: Transaction[] = [
${transactionsArray}
];
`;
}

// Write Files
console.log('Generating Android Mock Data...');
fs.writeFileSync(ANDROID_OUTPUT, generateKotlin(data));

console.log('Generating Web Mock Data...');
fs.writeFileSync(WEB_OUTPUT, generateTypeScript(data));

console.log('✅ Mock Data Synced!');
