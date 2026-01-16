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
fs.writeFileSync(ANDROID_OUTPUT, generateKotlin(data));

console.log('Generating Web Mock Data...');
fs.writeFileSync(WEB_OUTPUT, generateTypeScript(data));

console.log('✅ Mock Data Synced!');
