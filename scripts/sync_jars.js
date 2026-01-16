const fs = require('fs');
const path = require('path');

const JARS_JSON_PATH = path.join(__dirname, '../shared-data/jars.json');
const WEB_CONSTANTS_PATH = path.join(__dirname, '../Web/src/utils/constants.ts');
const ANDROID_CONSTANTS_PATH = path.join(__dirname, '../Android/app/src/main/java/com/oatrice/jarwise/utils/Constants.kt');

function generate() {
    console.log('Reading JARS from ' + JARS_JSON_PATH);
    const jars = JSON.parse(fs.readFileSync(JARS_JSON_PATH, 'utf8'));

    // 1. Generate Web Constants
    const webContent = `export const JARS = [
${jars.map(j => `    { id: '${j.id}', name: '${j.name}', color: '${j.color_tailwind}', icon: '${j.icon}' },`).join('\n')}
] as const;

export const getJarDetails = (id: string) => {
    return JARS.find(j => j.id === id) || JARS[0];
};
`;
    fs.writeFileSync(WEB_CONSTANTS_PATH, webContent);
    console.log('Updated Web constants at ' + WEB_CONSTANTS_PATH);

    // 2. Generate Android Constants
    const androidContent = `package com.oatrice.jarwise.utils

import androidx.compose.ui.graphics.Color

data class JarMetadata(
    val id: String,
    val name: String,
    val icon: String, // Emoji
    val color: Color
)

val JARS_METADATA = listOf(
${jars.map(j => `    JarMetadata("${j.id}", "${j.name}", "${j.icon}", Color(${j.color_hex.replace('0x', '0xFF')})), // ${j.color_tailwind.replace('bg-', '').replace('-500', '')}`).join('\n')}
)

fun getJarDetails(jarId: String): JarMetadata {
    return JARS_METADATA.find { it.id == jarId } ?: JARS_METADATA[0]
}
`;
    // Note: Android file replacement logic is simplified here. 
    // In a real scenario, we might want to be careful about not overwriting other things if the file was larger.
    // But since Constants.kt is dedicated, overwriting is fine.

    // Correcting Hex format for Kotlin Color: Color(0xFF3B82F6)
    // The JSON has 0xFF3B82F6, so j.color_hex is fine? 
    // Wait, in JSON I put "0xFF...", so replace('0x', '0xFF') ?? 
    // if JSON is "0xFF...", replacing '0x' with '0xFF' makes "0xFFFF...".
    // Let's fix the script logic or JSON. JSON has "0xFF...".
    // Kotlin Color expects Long or Int. Color(0xFF3B82F6).
    // So if JSON is "0xFF3B82F6", we can just use it directly or ensure clean format.

    // Actually, let's fix the map logic below to be safer.

    const androidContentFixed = `package com.oatrice.jarwise.utils

import androidx.compose.ui.graphics.Color

data class JarMetadata(
    val id: String,
    val name: String,
    val icon: String, // Emoji
    val color: Color
)

val JARS_METADATA = listOf(
${jars.map(j => `    JarMetadata("${j.id}", "${j.name}", "${j.icon}", Color(${j.color_hex})),`).join('\n')}
)

fun getJarDetails(jarId: String): JarMetadata {
    return JARS_METADATA.find { it.id == jarId } ?: JARS_METADATA[0]
}
`;

    fs.writeFileSync(ANDROID_CONSTANTS_PATH, androidContentFixed);
    console.log('Updated Android constants at ' + ANDROID_CONSTANTS_PATH);
}

generate();
