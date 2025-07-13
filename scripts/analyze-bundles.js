#!/usr/bin/env node

/**
 * Aether Monorepo Bundle Analysis Script
 * 
 * This script analyzes bundle sizes and composition for all packages
 * to monitor performance and identify optimization opportunities.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { promisify } = require('util');
const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

// Configuration
const PACKAGES_DIR = path.join(__dirname, '../packages');
const REPORT_PATH = path.join(__dirname, '../bundle-analysis-report.md');
const SIZE_LIMITS = {
  small: 50 * 1024,    // 50KB
  medium: 200 * 1024,  // 200KB
  large: 500 * 1024    // 500KB
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function error(message) {
  log(`❌ ${message}`, 'red');
  process.exit(1);
}

function success(message) {
  log(`✅ ${message}`, 'green');
}

function info(message) {
  log(`ℹ️  ${message}`, 'blue');
}

function warn(message) {
  log(`⚠️  ${message}`, 'yellow');
}

/**
 * Format bytes to human readable format
 */
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Get bundle size category
 */
function getSizeCategory(size) {
  if (size <= SIZE_LIMITS.small) return 'small';
  if (size <= SIZE_LIMITS.medium) return 'medium';
  if (size <= SIZE_LIMITS.large) return 'large';
  return 'xlarge';
}

/**
 * Get size category color
 */
function getSizeColor(category) {
  switch (category) {
    case 'small': return 'green';
    case 'medium': return 'yellow';
    case 'large': return 'red';
    case 'xlarge': return 'magenta';
    default: return 'reset';
  }
}

/**
 * Get all package directories
 */
async function getPackages() {
  try {
    const entries = await readdir(PACKAGES_DIR, { withFileTypes: true });
    return entries
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name)
      .filter(name => !name.startsWith('.'));
  } catch (err) {
    error(`Failed to read packages directory: ${err.message}`);
  }
}

/**
 * Read package.json for a specific package
 */
async function readPackageJson(packageName) {
  const packagePath = path.join(PACKAGES_DIR, packageName, 'package.json');
  try {
    const content = await readFile(packagePath, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    error(`Failed to read package.json for ${packageName}: ${err.message}`);
  }
}

/**
 * Get bundle size for a package
 */
function getBundleSize(packageName) {
  const distPath = path.join(PACKAGES_DIR, packageName, 'dist');
  const mainFile = path.join(distPath, 'index.js');
  const typesFile = path.join(distPath, 'index.d.ts');
  
  let totalSize = 0;
  let files = [];
  
  try {
    // Check main bundle
    if (fs.existsSync(mainFile)) {
      const stats = fs.statSync(mainFile);
      totalSize += stats.size;
      files.push({ name: 'index.js', size: stats.size });
    }
    
    // Check types
    if (fs.existsSync(typesFile)) {
      const stats = fs.statSync(typesFile);
      totalSize += stats.size;
      files.push({ name: 'index.d.ts', size: stats.size });
    }
    
    // Check other files in dist
    if (fs.existsSync(distPath)) {
      const distFiles = fs.readdirSync(distPath);
      for (const file of distFiles) {
        if (file !== 'index.js' && file !== 'index.d.ts') {
          const filePath = path.join(distPath, file);
          const stats = fs.statSync(filePath);
          totalSize += stats.size;
          files.push({ name: file, size: stats.size });
        }
      }
    }
    
    return { totalSize, files };
  } catch (err) {
    warn(`Failed to analyze bundle for ${packageName}: ${err.message}`);
    return { totalSize: 0, files: [] };
  }
}

/**
 * Analyze dependencies for a package
 */
function analyzeDependencies(packageJson) {
  const deps = {
    dependencies: packageJson.dependencies || {},
    devDependencies: packageJson.devDependencies || {},
    peerDependencies: packageJson.peerDependencies || {}
  };
  
  const totalDeps = Object.keys(deps.dependencies).length;
  const totalDevDeps = Object.keys(deps.devDependencies).length;
  const totalPeerDeps = Object.keys(deps.peerDependencies).length;
  
  return {
    dependencies: deps,
    counts: {
      dependencies: totalDeps,
      devDependencies: totalDevDeps,
      peerDependencies: totalPeerDeps,
      total: totalDeps + totalDevDeps + totalPeerDeps
    }
  };
}

/**
 * Generate bundle analysis report
 */
async function generateReport() {
  log('📊 Starting Bundle Analysis', 'bright');
  
  const packages = await getPackages();
  const analysis = [];
  
  for (const packageName of packages) {
    const packageJson = await readPackageJson(packageName);
    const bundleInfo = getBundleSize(packageName);
    const depsInfo = analyzeDependencies(packageJson);
    
    const sizeCategory = getSizeCategory(bundleInfo.totalSize);
    
    analysis.push({
      name: packageName,
      packageName: packageJson.name,
      version: packageJson.version,
      size: bundleInfo.totalSize,
      sizeFormatted: formatBytes(bundleInfo.totalSize),
      sizeCategory,
      files: bundleInfo.files,
      dependencies: depsInfo
    });
  }
  
  // Sort by size (largest first)
  analysis.sort((a, b) => b.size - a.size);
  
  // Generate markdown report
  let report = `# 📦 Bundle Analysis Report

Generated on: ${new Date().toISOString()}

## Summary

| Package | Size | Category | Dependencies |
|---------|------|----------|--------------|
`;

  analysis.forEach(pkg => {
    const sizeColor = getSizeColor(pkg.sizeCategory);
    const sizeEmoji = pkg.sizeCategory === 'small' ? '🟢' : 
                     pkg.sizeCategory === 'medium' ? '🟡' : 
                     pkg.sizeCategory === 'large' ? '🔴' : '🟣';
    
    report += `| ${pkg.packageName} | ${pkg.sizeFormatted} | ${sizeEmoji} ${pkg.sizeCategory} | ${pkg.dependencies.counts.total} |
`;
  });
  
  report += `
## Detailed Analysis

`;

  analysis.forEach(pkg => {
    const sizeColor = getSizeColor(pkg.sizeCategory);
    const sizeEmoji = pkg.sizeCategory === 'small' ? '🟢' : 
                     pkg.sizeCategory === 'medium' ? '🟡' : 
                     pkg.sizeCategory === 'large' ? '🔴' : '🟣';
    
    report += `### ${pkg.packageName}@${pkg.version}

- **Size**: ${pkg.sizeFormatted} (${sizeEmoji} ${pkg.sizeCategory})
- **Files**: ${pkg.files.length}
- **Dependencies**: ${pkg.dependencies.counts.dependencies} direct, ${pkg.dependencies.counts.devDependencies} dev, ${pkg.dependencies.counts.peerDependencies} peer

#### Bundle Files
`;

    pkg.files.forEach(file => {
      report += `- \`${file.name}\`: ${formatBytes(file.size)}
`;
    });
    
    if (pkg.dependencies.counts.dependencies > 0) {
      report += `
#### Dependencies
`;
      Object.entries(pkg.dependencies.dependencies).forEach(([name, version]) => {
        report += `- \`${name}\`: ${version}
`;
      });
    }
    
    report += `
---
`;
  });
  
  // Write report
  await writeFile(REPORT_PATH, report);
  success(`Bundle analysis report generated: ${REPORT_PATH}`);
  
  // Console output
  log('\n📊 Bundle Analysis Results:', 'bright');
  analysis.forEach(pkg => {
    const sizeColor = getSizeColor(pkg.sizeCategory);
    log(`${pkg.packageName}: ${pkg.sizeFormatted} (${pkg.sizeCategory})`, sizeColor);
  });
  
  // Summary statistics
  const totalSize = analysis.reduce((sum, pkg) => sum + pkg.size, 0);
  const avgSize = totalSize / analysis.length;
  const largePackages = analysis.filter(pkg => pkg.sizeCategory === 'large' || pkg.sizeCategory === 'xlarge');
  
  log(`\n📈 Summary:`, 'bright');
  log(`Total packages: ${analysis.length}`, 'cyan');
  log(`Total bundle size: ${formatBytes(totalSize)}`, 'cyan');
  log(`Average bundle size: ${formatBytes(avgSize)}`, 'cyan');
  log(`Large packages (>${formatBytes(SIZE_LIMITS.medium)}): ${largePackages.length}`, 'cyan');
  
  if (largePackages.length > 0) {
    log('\n⚠️  Large packages that may need optimization:', 'yellow');
    largePackages.forEach(pkg => {
      log(`  - ${pkg.packageName}: ${pkg.sizeFormatted}`, 'yellow');
    });
  }
  
  return analysis;
}

// Main execution
if (require.main === module) {
  generateReport().catch(error);
}

module.exports = {
  generateReport,
  getBundleSize,
  analyzeDependencies,
  formatBytes,
  getSizeCategory
}; 