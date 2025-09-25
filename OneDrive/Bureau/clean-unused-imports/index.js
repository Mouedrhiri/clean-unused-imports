#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import dynamique pour mieux gérer les erreurs
async function main() {
    try {
        const { parse } = await import("@babel/parser");
        const traverseModule = await import("@babel/traverse");
        const { default: generate } = await import("@babel/generator");
        const t = await import("@babel/types");
        
        const traverse = traverseModule.default.default || traverseModule.default;

        function cleanFile(filePath) {
            if (!fs.existsSync(filePath)) {
                console.error(`Fichier non trouvé: ${filePath}`);
                return false;
            }

            const code = fs.readFileSync(filePath, "utf-8");
            
            try {
                const ast = parse(code, {
                    sourceType: "module",
                    plugins: ["jsx", "typescript"]
                });

                const usedIdentifiers = new Set();

                // Premier parcours : collecter les identifiants utilisés
                traverse(ast, {
                    Identifier(path) {
                        if (!path.findParent(p => p.isImportDeclaration())) {
                            usedIdentifiers.add(path.node.name);
                        }
                    },
                    MemberExpression(path) {
                        if (t.isIdentifier(path.node.object)) {
                            usedIdentifiers.add(path.node.object.name);
                        }
                    },
                });

                // Deuxième parcours : nettoyer les imports
                traverse(ast, {
                    ImportDeclaration(path) {
                        const specifiers = path.node.specifiers;
                        const usedSpecifiers = specifiers.filter(spec => 
                            usedIdentifiers.has(spec.local.name)
                        );

                        if (usedSpecifiers.length === 0) {
                            path.remove();
                        } else if (usedSpecifiers.length < specifiers.length) {
                            path.node.specifiers = usedSpecifiers;
                        }
                    },
                });

                const output = generate(ast, {}, code);
                
                if (output.code !== code) {
                    fs.writeFileSync(filePath, output.code, "utf-8");
                    console.log(`✓ Nettoyé: ${filePath}`);
                    return true;
                }
                return false;
                
            } catch (error) {
                console.error(`Erreur avec ${filePath}:`, error.message);
                return false;
            }
        }

        function cleanSrc(srcDir = process.cwd()) {
            if (!fs.existsSync(srcDir)) {
                console.error(`Dossier non trouvé: ${srcDir}`);
                return;
            }

            function scanDirectory(dir) {
                const files = fs.readdirSync(dir);
                let cleanedCount = 0;

                files.forEach(file => {
                    const fullPath = path.join(dir, file);
                    
                    try {
                        const stat = fs.statSync(fullPath);
                        
                        if (stat.isDirectory()) {
                            cleanedCount += scanDirectory(fullPath);
                        } else if (/\.(js|jsx|ts|tsx)$/.test(fullPath)) {
                            if (cleanFile(fullPath)) {
                                cleanedCount++;
                            }
                        }
                    } catch (error) {
                        console.error(`Erreur avec ${fullPath}:`, error.message);
                    }
                });

                return cleanedCount;
            }

            const cleanedCount = scanDirectory(srcDir);
            console.log(`\n🎉 Nettoyage terminé ! ${cleanedCount} fichiers modifiés.`);
        }

        // Gestion des arguments
        const args = process.argv.slice(2);
        const targetDir = args[0] || process.cwd();
        
        console.log("🧹 Clean Unused Imports - Démarrage...");
        cleanSrc(targetDir);

    } catch (error) {
        console.error("❌ Erreur de chargement des dépendances:", error.message);
        console.log("Assurez-vous d'avoir installé les dépendances avec: npm install");
        process.exit(1);
    }
}

main();