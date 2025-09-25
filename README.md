# Clean Unused Imports 🧹

A smart CLI tool that automatically detects and removes unused imports from your JavaScript/TypeScript files. Keep your codebase clean and optimized with zero effort!

[![npm version](https://img.shields.io/npm/v/clean-unused-imports.svg)](https://www.npmjs.com/package/clean-unused-imports)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)](https://nodejs.org/)

## ✨ Features

- 🔍 **Smart Detection**: Uses Babel AST parsing for accurate import analysis
- 🗑️ **Complete Removal**: Removes entirely unused imports
- ✂️ **Partial Cleaning**: Keeps used imports, removes unused ones from named imports
- 📁 **Recursive Processing**: Scans entire directory structures automatically
- 🔧 **Multi-Format Support**: Works with JavaScript, JSX, TypeScript, and TSX files
- 💾 **Format Preservation**: Maintains your original code formatting
- ⚡ **Zero Configuration**: Works out of the box with sensible defaults

## 📦 Installation

### Global Installation (Recommended)
```bash
npm install -g clean-unused-imports
# Nettoyer le dossier courant
clean-unused-imports

# Nettoyer un dossier spécifique
clean-unused-imports ./src

# Avec npx (sans installation)
npx clean-unused-imports ./project/src

```
### Fonctionnalités
✅ Supprime les imports entièrement non utilisés

✅ Nettoie les imports partiellement utilisés

✅ Supporte JavaScript, JSX, TypeScript, TSX

✅ Traitement récursif des dossiers

✅ Préservation de la formatage

## Exemple
### Avant :

```
import fs from "fs";
import path from "path"; // Non utilisé
import { sum, multiply } from "./math"; // multiply non utilisé

console.log(fs.readFileSync("file.txt"));
console.log(sum(1, 2));
```
### Après :

```
import fs from "fs";
import { sum } from "./math";

console.log(fs.readFileSync("file.txt"));
console.log(sum(1, 2));
```
## Développement
```
# Cloner le repo
git clone https://github.com/votreusername/clean-unused-imports

# Installer les dépendances
npm install

# Tester localement
node index.js
```