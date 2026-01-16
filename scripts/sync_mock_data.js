const fs = require('fs');
const path = require('path');

// Configuration
const SOURCE_JSON = path.join(__dirname, '../shared-spec/data/mockData.json');
const ANDROID_OUTPUT = path.join(__dirname, '../Android/app/src/main/java/com/oatrice/jarwise/data/GeneratedMockData.kt');
const WEB_OUTPUT = path.join(__dirname, '../Web/src/utils/generatedMockData.ts');

// Read Source Data
const data = JSON.parse(fs.readFileSync(SOURCE_JSON, 'utf8'));

// ---------------------------------------------------------
// Generator: Android (Kotlin)
// ---------------------------------------------------------
function generateKotlin(data) {
    const jars = data.jars.map(jar => `
        Jar(
            id = "${jar.id}",
            name = "${jar.name}",
            current = ${jar.current},
            goal = ${jar.goal},
            level = ${jar.level},
            icon = Icons.Rounded.${jar.icon}, // Requires mapping
            color = Color(0xFF${jar.color.replace('text-', '').toUpperCase()}) // Simple mock mapping
        )`).join(',');

    const transactions = data.transactions.map(t => `
        Transaction(
            id = "${t.id}",
            merchant = "${t.merchant}",
            amount = ${t.amount},
            category = "${t.category}",
            date = "${t.date}",
            isTaxDeductible = ${t.isTaxDeductible},
            icon = Icons.Rounded.${t.icon} // Requires mapping
        )`).join(',');

    return `package com.oatrice.jarwise.data

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.*
import androidx.compose.ui.graphics.Color
// WARNING: This file is auto-generated. Do not edit directly.

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

    return `// WARNING: This file is auto-generated. Do not edit directly.
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
};

export type Transaction = {
    id: string;
    merchant: string;
    amount: number;
    category: string;
    date: string;
    isTaxDeductible: boolean;
    color: string;
    icon: LucideIcon;
};

export const jars: Jar[] = ${JSON.stringify(data.jars, null, 4).replace(/"icon": "(\w+)"/g, '"icon": $1')};

export const transactions: Transaction[] = ${JSON.stringify(data.transactions, null, 4).replace(/"icon": "(\w+)"/g, '"icon": $1')};
`;
}

// Write Files
console.log('Generating Android Mock Data...');
// fs.writeFileSync(ANDROID_OUTPUT, generateKotlin(data)); // Commented out until directory exists/verified

console.log('Generating Web Mock Data...');
fs.writeFileSync(WEB_OUTPUT, generateTypeScript(data));

console.log('✅ Mock Data Synced!');
