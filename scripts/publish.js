#!/usr/bin/env node

/**
 * Aether Monorepo Publishing Script
 * 
 * This script handles publishing all packages to NPM and GitHub Packages
 * with proper versioning, changelog generation, and validation.
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
const REGISTRY_NPM = 'https://registry.npmjs.org/';
const REGISTRY_GITHUB = 'https://npm.pkg.github.com/';

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
 * Check if package should be published
 */
function shouldPublish(packageJson) {
  return !packageJson.private && packageJson.name && packageJson.version;
}

/**
 * Validate package before publishing
 */
function validatePackage(packageName, packageJson) {
  const errors = [];

  if (!packageJson.name) {
    errors.push('Missing package name');
  }

  if (!packageJson.version) {
    errors.push('Missing package version');
  }

  if (!packageJson.main && !packageJson.exports) {
    errors.push('Missing main entry point or exports');
  }

  if (!packageJson.description) {
    errors.push('Missing package description');
  }

  if (!packageJson.keywords || packageJson.keywords.length === 0) {
    errors.push('Missing keywords');
  }

  if (!packageJson.author) {
    errors.push('Missing author information');
  }

  if (!packageJson.license) {
    errors.push('Missing license');
  }

  if (errors.length > 0) {
    warn(`Package ${packageName} has validation issues:`);
    errors.forEach(error => warn(`  - ${error}`));
    return false;
  }

  return true;
}

/**
 * Generate changelog for a package
 */
function generateChangelog(packageName, version) {
  const date = new Date().toISOString().split('T')[0];
  return `## [${version}] - ${date}

### Added
- Initial release of ${packageName}

### Changed
- N/A

### Fixed
- N/A

### Breaking Changes
- N/A
`;
}

/**
 * Update changelog file
 */
async function updateChangelog(packageName, version) {
  const changelogPath = path.join(PACKAGES_DIR, packageName, 'CHANGELOG.md');
  const newChangelog = generateChangelog(packageName, version);
  
  try {
    let existingContent = '';
    try {
      existingContent = await readFile(changelogPath, 'utf8');
    } catch (err) {
      // File doesn't exist, that's okay
    }

    const updatedContent = newChangelog + '\n' + existingContent;
    await writeFile(changelogPath, updatedContent);
    success(`Updated CHANGELOG.md for ${packageName}`);
  } catch (err) {
    warn(`Failed to update changelog for ${packageName}: ${err.message}`);
  }
}

/**
 * Publish package to NPM
 */
function publishToNpm(packageName, packageJson) {
  try {
    const packagePath = path.join(PACKAGES_DIR, packageName);
    
    // Set NPM registry
    execSync(`npm config set registry ${REGISTRY_NPM}`, { cwd: packagePath, stdio: 'inherit' });
    
    // Publish to NPM
    execSync('npm publish --access public', { cwd: packagePath, stdio: 'inherit' });
    
    success(`Published ${packageJson.name}@${packageJson.version} to NPM`);
    return true;
  } catch (err) {
    error(`Failed to publish ${packageName} to NPM: ${err.message}`);
  }
}

/**
 * Publish package to GitHub Packages
 */
function publishToGitHub(packageName, packageJson) {
  try {
    const packagePath = path.join(PACKAGES_DIR, packageName);
    
    // Set GitHub Packages registry
    execSync(`npm config set registry ${REGISTRY_GITHUB}`, { cwd: packagePath, stdio: 'inherit' });
    
    // Publish to GitHub Packages
    execSync('npm publish', { cwd: packagePath, stdio: 'inherit' });
    
    success(`Published ${packageJson.name}@${packageJson.version} to GitHub Packages`);
    return true;
  } catch (err) {
    error(`Failed to publish ${packageName} to GitHub Packages: ${err.message}`);
  }
}

/**
 * Main publishing function
 */
async function publishPackages(target = 'both') {
  log('🚀 Starting Aether Monorepo Publishing Process', 'bright');
  
  const packages = await getPackages();
  const publishablePackages = [];
  
  // Validate and collect publishable packages
  for (const packageName of packages) {
    const packageJson = await readPackageJson(packageName);
    
    if (!shouldPublish(packageJson)) {
      info(`Skipping ${packageName} (private or invalid package)`);
      continue;
    }
    
    if (!validatePackage(packageName, packageJson)) {
      continue;
    }
    
    publishablePackages.push({ name: packageName, packageJson });
  }
  
  if (publishablePackages.length === 0) {
    error('No packages to publish');
  }
  
  log(`Found ${publishablePackages.length} packages to publish:`, 'bright');
  publishablePackages.forEach(({ name, packageJson }) => {
    log(`  - ${packageJson.name}@${packageJson.version}`, 'cyan');
  });
  
  // Publish packages
  for (const { name, packageJson } of publishablePackages) {
    log(`\n📦 Publishing ${packageJson.name}@${packageJson.version}`, 'bright');
    
    // Update changelog
    await updateChangelog(name, packageJson.version);
    
    // Publish based on target
    if (target === 'npm' || target === 'both') {
      publishToNpm(name, packageJson);
    }
    
    if (target === 'github' || target === 'both') {
      publishToGitHub(name, packageJson);
    }
  }
  
  success('🎉 All packages published successfully!');
}

/**
 * CLI argument parsing
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const target = args[0] || 'both';
  
  if (!['npm', 'github', 'both'].includes(target)) {
    error('Invalid target. Use: npm, github, or both');
  }
  
  return { target };
}

// Main execution
if (require.main === module) {
  const { target } = parseArgs();
  publishPackages(target).catch(error);
}

module.exports = {
  publishPackages,
  getPackages,
  readPackageJson,
  validatePackage,
  generateChangelog
}; 