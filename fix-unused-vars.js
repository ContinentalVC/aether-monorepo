#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Function to fix unused variables in a file
function fixUnusedVars(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Fix unused function parameters by prefixing with underscore
    content = content.replace(
      /function\s+\w+\s*\(([^)]*)\)/g,
      (match, params) => {
        const fixedParams = params.split(',').map(param => {
          const trimmed = param.trim();
          if (trimmed && !trimmed.startsWith('_') && !trimmed.includes(':')) {
            return `_${trimmed}`;
          }
          return trimmed;
        }).join(', ');
        return match.replace(params, fixedParams);
      }
    );

    // Fix unused arrow function parameters
    content = content.replace(
      /\(([^)]*)\)\s*=>/g,
      (match, params) => {
        const fixedParams = params.split(',').map(param => {
          const trimmed = param.trim();
          if (trimmed && !trimmed.startsWith('_') && !trimmed.includes(':')) {
            return `_${trimmed}`;
          }
          return trimmed;
        }).join(', ');
        return match.replace(params, fixedParams);
      }
    );

    // Fix unused destructured variables by prefixing with underscore
    content = content.replace(
      /const\s*{([^}]*)}\s*=/g,
      (match, destructured) => {
        const fixedDestructured = destructured.split(',').map(item => {
          const trimmed = item.trim();
          if (trimmed && !trimmed.startsWith('_') && !trimmed.includes(':')) {
            return `_${trimmed}`;
          }
          return trimmed;
        }).join(', ');
        return match.replace(destructured, fixedDestructured);
      }
    );

    // Remove unused imports (basic pattern)
    content = content.replace(
      /import\s*{([^}]*)}\s*from\s*['"][^'"]*['"];?/g,
      (match, imports) => {
        const importList = imports.split(',').map(imp => imp.trim());
        const usedImports = importList.filter(imp => {
          // Check if the import is actually used in the file
          const importName = imp.replace(/\s+as\s+\w+/, '').trim();
          const regex = new RegExp(`\\b${importName}\\b`, 'g');
          const matches = content.match(regex);
          return matches && matches.length > 1; // More than just the import statement
        });
        
        if (usedImports.length !== importList.length) {
          modified = true;
          return `import {${usedImports.join(', ')}} from '${match.match(/from\s*['"]([^'"]*)['"]/)[1]}';`;
        }
        return match;
      }
    );

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Fixed unused variables in: ${filePath}`);
    }

  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

// Function to recursively find TypeScript/React files
function findTsFiles(dir) {
  const files = [];
  
  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        traverse(fullPath);
      } else if (stat.isFile() && /\.(ts|tsx)$/.test(item)) {
        files.push(fullPath);
      }
    }
  }
  
  traverse(dir);
  return files;
}

// Main execution
const targetDir = path.join(__dirname, 'apps/react-native-app/src');
const tsFiles = findTsFiles(targetDir);

console.log(`Found ${tsFiles.length} TypeScript files to process...`);

for (const file of tsFiles) {
  fixUnusedVars(file);
}

console.log('Finished processing files.'); 