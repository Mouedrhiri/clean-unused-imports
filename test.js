import fs from "fs";
import path from "path";

console.log("🧪 Test du package clean-unused-imports...");

// Créer un dossier de test
const testDir = "./test-project";
const srcDir = path.join(testDir, "src");

// Créer la structure de test
fs.mkdirSync(srcDir, { recursive: true });

// Fichier 1 avec des imports non utilisés
const file1Content = `import fs from "fs";
import path from "path"; // Non utilisé
import { join } from "path"; // Non utilisé
import { sum, multiply, divide } from "./math"; // multiply et divide non utilisés

const data = fs.readFileSync("./dummy.txt", "utf-8");
console.log("Somme :", sum(2, 3));`;

// Fichier 2 avec des exports
const file2Content = `export function sum(a, b) {
    return a + b;
}

export function multiply(a, b) {
    return a * b;
}

export function divide(a, b) {
    return a / b;
}`;

fs.writeFileSync(path.join(srcDir, "file1.js"), file1Content);
fs.writeFileSync(path.join(srcDir, "math.js"), file2Content);

console.log("✅ Fichiers de test créés");
console.log("📁 Dossier de test: test-project/src");
console.log("🚀 Exécutez: node index.js test-project/src");