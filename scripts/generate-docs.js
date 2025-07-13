#!/usr/bin/env node

/**
 * Aether Monorepo Documentation Generation Script
 * 
 * This script generates comprehensive documentation for all packages
 * including API documentation, examples, and interactive playgrounds.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { promisify } = require('util');
const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);

// Configuration
const PACKAGES_DIR = path.join(__dirname, '../packages');
const DOCS_DIR = path.join(__dirname, '../docs');
const TEMPLATES_DIR = path.join(__dirname, 'templates');

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
 * Generate TypeDoc configuration for a package
 */
function generateTypeDocConfig(packageName, packageJson) {
  const config = {
    entryPoints: [`packages/${packageName}/src/index.ts`],
    out: `docs/${packageName}`,
    name: packageJson.name,
    description: packageJson.description,
    theme: 'default',
    readme: `packages/${packageName}/README.md`,
    excludePrivate: true,
    excludeProtected: true,
    excludeExternals: true,
    includeVersion: true,
    categorizeByGroup: true,
    categoryOrder: [
      'Core',
      'Components',
      'Utilities',
      'Types',
      'Validation',
      'Theme',
      'Charts',
      'Accessibility',
      '*'
    ],
    customCss: path.join(TEMPLATES_DIR, 'custom.css'),
    plugin: ['typedoc-plugin-markdown'],
    markdown: {
      hideInPageTOC: true,
      hideBreadcrumbs: true,
      hidePageTitle: true
    }
  };
  
  return config;
}

/**
 * Generate TypeDoc configuration file
 */
async function writeTypeDocConfig(packageName, config) {
  const configPath = path.join(PACKAGES_DIR, packageName, 'typedoc.json');
  await writeFile(configPath, JSON.stringify(config, null, 2));
  return configPath;
}

/**
 * Generate API documentation for a package
 */
async function generateApiDocs(packageName, packageJson) {
  try {
    const config = generateTypeDocConfig(packageName, packageJson);
    const configPath = await writeTypeDocConfig(packageName, config);
    
    // Run TypeDoc
    execSync(`npx typedoc --options ${configPath}`, { 
      cwd: path.join(__dirname, '..'),
      stdio: 'inherit' 
    });
    
    success(`Generated API docs for ${packageName}`);
    return true;
  } catch (err) {
    warn(`Failed to generate API docs for ${packageName}: ${err.message}`);
    return false;
  }
}

/**
 * Generate package documentation index
 */
async function generatePackageIndex(packageName, packageJson) {
  const indexPath = path.join(DOCS_DIR, packageName, 'index.html');
  const readmePath = path.join(PACKAGES_DIR, packageName, 'README.md');
  
  let readmeContent = '';
  try {
    readmeContent = await readFile(readmePath, 'utf8');
  } catch (err) {
    readmeContent = `# ${packageJson.name}\n\n${packageJson.description || 'No description available.'}`;
  }
  
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${packageJson.name} - Documentation</title>
    <link rel="stylesheet" href="assets/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css">
</head>
<body>
    <div class="container">
        <header>
            <h1>${packageJson.name}</h1>
            <p class="version">v${packageJson.version}</p>
            <p class="description">${packageJson.description || ''}</p>
        </header>
        
        <nav>
            <ul>
                <li><a href="#overview">Overview</a></li>
                <li><a href="#installation">Installation</a></li>
                <li><a href="#usage">Usage</a></li>
                <li><a href="#api">API Reference</a></li>
                <li><a href="#examples">Examples</a></li>
            </ul>
        </nav>
        
        <main>
            <section id="overview">
                <h2>Overview</h2>
                <div class="markdown-content">
                    ${readmeContent}
                </div>
            </section>
            
            <section id="installation">
                <h2>Installation</h2>
                <div class="code-block">
                    <pre><code class="language-bash">npm install ${packageJson.name}</code></pre>
                </div>
            </section>
            
            <section id="usage">
                <h2>Usage</h2>
                <div class="code-block">
                    <pre><code class="language-typescript">import { Component } from '${packageJson.name}';

// Basic usage example
const MyComponent = () => {
  return <Component />;
};</code></pre>
                </div>
            </section>
            
            <section id="api">
                <h2>API Reference</h2>
                <p><a href="classes/index.html">View Full API Documentation</a></p>
            </section>
            
            <section id="examples">
                <h2>Examples</h2>
                <div class="examples-grid">
                    <div class="example-card">
                        <h3>Basic Example</h3>
                        <div class="code-block">
                            <pre><code class="language-typescript">// Basic usage</code></pre>
                        </div>
                    </div>
                    <div class="example-card">
                        <h3>Advanced Example</h3>
                        <div class="code-block">
                            <pre><code class="language-typescript">// Advanced usage</code></pre>
                        </div>
                    </div>
                </div>
            </section>
        </main>
        
        <footer>
            <p>&copy; 2024 Aether Team. Licensed under ${packageJson.license || 'MIT'}.</p>
        </footer>
    </div>
    
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-core.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/autoloader/prism-autoloader.min.js"></script>
</body>
</html>`;
  
  await writeFile(indexPath, html);
  success(`Generated index page for ${packageName}`);
}

/**
 * Generate main documentation index
 */
async function generateMainIndex(packages) {
  const indexPath = path.join(DOCS_DIR, 'index.html');
  
  let packagesHtml = '';
  packages.forEach(pkg => {
    packagesHtml += `
        <div class="package-card">
            <h3><a href="${pkg.name}/index.html">${pkg.packageJson.name}</a></h3>
            <p class="version">v${pkg.packageJson.version}</p>
            <p class="description">${pkg.packageJson.description || ''}</p>
            <div class="package-links">
                <a href="${pkg.name}/index.html">Documentation</a>
                <a href="${pkg.name}/classes/index.html">API Reference</a>
                <a href="https://www.npmjs.com/package/${pkg.packageJson.name}" target="_blank">NPM</a>
            </div>
        </div>`;
  });
  
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Aether Monorepo - Documentation</title>
    <link rel="stylesheet" href="assets/style.css">
</head>
<body>
    <div class="container">
        <header>
            <h1>Aether Monorepo</h1>
            <p class="subtitle">A unified, futuristic, and gamified experience across SwiftUI and React Native</p>
        </header>
        
        <main>
            <section class="overview">
                <h2>Overview</h2>
                <p>The Aether monorepo contains a comprehensive collection of cross-platform UI components, utilities, and tools designed to provide a consistent and modern development experience across multiple platforms.</p>
            </section>
            
            <section class="packages">
                <h2>Packages</h2>
                <div class="packages-grid">
                    ${packagesHtml}
                </div>
            </section>
            
            <section class="getting-started">
                <h2>Getting Started</h2>
                <div class="code-block">
                    <pre><code class="language-bash"># Install core package
npm install @aether/core

# Install React Native components
npm install @aether/react-native-ui

# Install web components
npm install @aether/web-ui</code></pre>
                </div>
            </section>
        </main>
        
        <footer>
            <p>&copy; 2024 Aether Team. Licensed under MIT.</p>
        </footer>
    </div>
</body>
</html>`;
  
  await writeFile(indexPath, html);
  success('Generated main documentation index');
}

/**
 * Generate CSS styles for documentation
 */
async function generateStyles() {
  const stylesPath = path.join(DOCS_DIR, 'assets', 'style.css');
  
  // Ensure assets directory exists
  await mkdir(path.dirname(stylesPath), { recursive: true });
  
  const css = `/* Aether Documentation Styles */

:root {
  --primary-color: #6366f1;
  --secondary-color: #8b5cf6;
  --background-color: #ffffff;
  --text-color: #1f2937;
  --border-color: #e5e7eb;
  --code-background: #f3f4f6;
  --link-color: #3b82f6;
  --success-color: #10b981;
  --warning-color: #f59e0b;
  --error-color: #ef4444;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
  color: var(--text-color);
  background-color: var(--background-color);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

header {
  text-align: center;
  padding: 60px 0;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  margin-bottom: 40px;
}

header h1 {
  font-size: 3rem;
  margin-bottom: 10px;
}

.subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
}

.version {
  display: inline-block;
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  margin: 10px 0;
}

nav {
  background: var(--background-color);
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 40px;
}

nav ul {
  display: flex;
  list-style: none;
  gap: 30px;
  padding: 20px 0;
}

nav a {
  text-decoration: none;
  color: var(--text-color);
  font-weight: 500;
  transition: color 0.2s;
}

nav a:hover {
  color: var(--primary-color);
}

main {
  margin-bottom: 60px;
}

section {
  margin-bottom: 40px;
}

h2 {
  font-size: 2rem;
  margin-bottom: 20px;
  color: var(--text-color);
}

h3 {
  font-size: 1.5rem;
  margin-bottom: 15px;
  color: var(--text-color);
}

.description {
  font-size: 1.1rem;
  color: #6b7280;
  margin-bottom: 20px;
}

.code-block {
  background: var(--code-background);
  border-radius: 8px;
  padding: 20px;
  margin: 20px 0;
  overflow-x: auto;
}

.code-block pre {
  margin: 0;
}

.code-block code {
  font-family: 'Fira Code', 'Monaco', 'Consolas', monospace;
  font-size: 0.9rem;
}

.packages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-top: 30px;
}

.package-card {
  background: white;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 30px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.package-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.package-card h3 {
  margin-bottom: 10px;
}

.package-card h3 a {
  color: var(--primary-color);
  text-decoration: none;
}

.package-card h3 a:hover {
  text-decoration: underline;
}

.package-links {
  display: flex;
  gap: 15px;
  margin-top: 20px;
}

.package-links a {
  padding: 8px 16px;
  background: var(--primary-color);
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.package-links a:hover {
  background: var(--secondary-color);
}

.examples-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 30px;
  margin-top: 30px;
}

.example-card {
  background: white;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 20px;
}

.example-card h3 {
  margin-bottom: 15px;
  color: var(--primary-color);
}

footer {
  text-align: center;
  padding: 40px 0;
  border-top: 1px solid var(--border-color);
  color: #6b7280;
}

/* Responsive Design */
@media (max-width: 768px) {
  header h1 {
    font-size: 2rem;
  }
  
  nav ul {
    flex-direction: column;
    gap: 15px;
  }
  
  .packages-grid {
    grid-template-columns: 1fr;
  }
  
  .examples-grid {
    grid-template-columns: 1fr;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  :root {
    --background-color: #1f2937;
    --text-color: #f9fafb;
    --border-color: #374151;
    --code-background: #111827;
  }
  
  .package-card {
    background: #374151;
  }
  
  .example-card {
    background: #374151;
  }
}`;
  
  await writeFile(stylesPath, css);
  success('Generated documentation styles');
}

/**
 * Main documentation generation function
 */
async function generateDocumentation() {
  log('📚 Starting Documentation Generation', 'bright');
  
  // Ensure docs directory exists
  await mkdir(DOCS_DIR, { recursive: true });
  
  // Generate styles
  await generateStyles();
  
  const packages = await getPackages();
  const packageData = [];
  
  // Generate documentation for each package
  for (const packageName of packages) {
    const packageJson = await readPackageJson(packageName);
    
    if (packageJson.private) {
      info(`Skipping private package: ${packageName}`);
      continue;
    }
    
    log(`\n📦 Generating docs for ${packageJson.name}`, 'cyan');
    
    // Generate API documentation
    const apiSuccess = await generateApiDocs(packageName, packageJson);
    
    // Generate package index
    await generatePackageIndex(packageName, packageJson);
    
    packageData.push({
      name: packageName,
      packageJson,
      apiSuccess
    });
  }
  
  // Generate main index
  await generateMainIndex(packageData);
  
  // Summary
  const successful = packageData.filter(pkg => pkg.apiSuccess).length;
  const total = packageData.length;
  
  log(`\n📊 Documentation Generation Summary:`, 'bright');
  log(`Total packages: ${total}`, 'cyan');
  log(`Successful API docs: ${successful}`, 'green');
  log(`Failed API docs: ${total - successful}`, 'red');
  log(`Documentation location: ${DOCS_DIR}`, 'cyan');
  
  if (total - successful > 0) {
    log('\n⚠️  Packages with failed API documentation:', 'yellow');
    packageData
      .filter(pkg => !pkg.apiSuccess)
      .forEach(pkg => log(`  - ${pkg.packageJson.name}`, 'yellow'));
  }
  
  success('🎉 Documentation generation completed!');
}

// Main execution
if (require.main === module) {
  generateDocumentation().catch(error);
}

module.exports = {
  generateDocumentation,
  generateApiDocs,
  generatePackageIndex,
  generateMainIndex
}; 