# 🚀 CI/CD Setup Guide

This guide explains how to set up and configure the CI/CD pipeline for the Aether monorepo, including GitHub Actions, NPM publishing, and deployment automation.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [GitHub Secrets Configuration](#github-secrets-configuration)
- [NPM Configuration](#npm-configuration)
- [GitHub Packages Configuration](#github-packages-configuration)
- [Environment Setup](#environment-setup)
- [Testing the Pipeline](#testing-the-pipeline)
- [Troubleshooting](#troubleshooting)

---

## 🔧 Prerequisites

Before setting up the CI/CD pipeline, ensure you have:

- **GitHub repository** with admin access
- **NPM account** with publish permissions
- **Node.js 18+** and npm 9+ locally
- **Git** configured with proper credentials

### Required Permissions

- **GitHub**: Repository admin access
- **NPM**: Package publishing permissions
- **GitHub Packages**: Package publishing permissions

---

## 🔐 GitHub Secrets Configuration

### Required Secrets

Navigate to your GitHub repository → Settings → Secrets and variables → Actions, then add the following secrets:

#### 1. NPM_TOKEN

```bash
# Generate NPM token
npm login
npm token create --read-only
```

**Purpose**: Authenticates with NPM registry for package publishing

#### 2. SNYK_TOKEN

```bash
# Get from Snyk dashboard
# https://app.snyk.io/account
```

**Purpose**: Security vulnerability scanning

#### 3. CODECOV_TOKEN

```bash
# Get from Codecov dashboard
# https://codecov.io/gh/your-username/aether-monorepo
```

**Purpose**: Code coverage reporting

#### 4. GITHUB_TOKEN

```bash
# Automatically provided by GitHub Actions
# No manual setup required
```

**Purpose**: GitHub Packages authentication

### Optional Secrets

#### 5. DISCORD_WEBHOOK_URL

```bash
# Create Discord webhook for notifications
# Server Settings → Integrations → Webhooks
```

**Purpose**: Release notifications to Discord

#### 6. SLACK_WEBHOOK_URL

```bash
# Create Slack webhook for notifications
# Apps → Custom Integrations → Incoming Webhooks
```

**Purpose**: Release notifications to Slack

---

## 📦 NPM Configuration

### 1. NPM Account Setup

```bash
# Login to NPM
npm login

# Verify authentication
npm whoami
```

### 2. Package Scope Configuration

Ensure your packages use the correct scope:

```json
{
  "name": "@aether/core",
  "publishConfig": {
    "access": "public"
  }
}
```

### 3. NPM Token Permissions

Your NPM token should have:

- **Read packages** (for installation)
- **Publish packages** (for publishing)
- **Manage tokens** (for token management)

---

## 📦 GitHub Packages Configuration

### 1. Repository Configuration

Add the following to your repository settings:

```json
{
  "packages": {
    "@aether/*": {
      "registry": "https://npm.pkg.github.com"
    }
  }
}
```

### 2. Package.json Configuration

Each package should include:

```json
{
  "name": "@aether/core",
  "repository": {
    "type": "git",
    "url": "https://github.com/chosone/aether-monorepo.git"
  },
  "publishConfig": {
    "registry": "https://npm.pkg.github.com"
  }
}
```

---

## 🌍 Environment Setup

### 1. Local Development

```bash
# Clone repository
git clone https://github.com/chosone/aether-monorepo.git
cd aether-monorepo

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### 2. Environment Variables

Create `.env.local` file:

```bash
# NPM Configuration
NPM_TOKEN=your_npm_token_here
NPM_REGISTRY=https://registry.npmjs.org/

# GitHub Configuration
GITHUB_TOKEN=your_github_token_here
GITHUB_PACKAGES_REGISTRY=https://npm.pkg.github.com/

# Security
SNYK_TOKEN=your_snyk_token_here

# Analytics
CODECOV_TOKEN=your_codecov_token_here

# Notifications
DISCORD_WEBHOOK_URL=your_discord_webhook_here
SLACK_WEBHOOK_URL=your_slack_webhook_here
```

### 3. Git Configuration

```bash
# Configure Git user
git config user.name "Your Name"
git config user.email "your.email@example.com"

# Configure Git credentials
git config credential.helper store
```

---

## 🧪 Testing the Pipeline

### 1. Local Testing

```bash
# Test all CI steps locally
npm run validate:all

# Test specific steps
npm run lint
npm run type-check
npm run test
npm run build
npm run analyze:bundles
```

### 2. GitHub Actions Testing

#### Manual Trigger

1. Go to Actions tab in GitHub
2. Select "CI/CD Pipeline"
3. Click "Run workflow"
4. Choose branch and event type
5. Click "Run workflow"

#### Pull Request Testing

1. Create a new branch
2. Make changes
3. Create pull request
4. Verify CI checks pass

### 3. Publishing Test

```bash
# Test publishing locally (dry run)
npm run publish:packages --dry-run

# Test specific registry
npm run publish:packages npm
npm run publish:packages github
```

---

## 🔄 Workflow Configuration

### 1. Branch Protection

Set up branch protection rules:

1. Go to Settings → Branches
2. Add rule for `main` branch
3. Enable:
   - Require status checks to pass
   - Require branches to be up to date
   - Require pull request reviews
   - Require conversation resolution

### 2. Required Status Checks

Configure the following status checks:

- `quality` - Code quality checks
- `test` - Test suite execution
- `build` - Package building
- `security` - Security scanning

### 3. Auto-merge Configuration

Enable auto-merge for:

- Dependabot pull requests
- Documentation updates
- Minor version updates

---

## 📊 Monitoring and Analytics

### 1. GitHub Actions Analytics

Monitor pipeline performance:

- **Build times**: Track build duration trends
- **Success rates**: Monitor failure rates
- **Cache hit rates**: Optimize caching strategy
- **Resource usage**: Monitor compute costs

### 2. Package Analytics

Track package performance:

- **Download counts**: Monitor package popularity
- **Bundle sizes**: Track size changes over time
- **Dependency updates**: Monitor security updates
- **Issue reports**: Track bug reports and feature requests

### 3. Security Monitoring

Monitor security metrics:

- **Vulnerability scans**: Track security issues
- **Dependency updates**: Monitor outdated packages
- **License compliance**: Ensure license compliance
- **Access control**: Monitor access permissions

---

## 🚨 Troubleshooting

### Common Issues

#### 1. Authentication Errors

```bash
# NPM authentication error
npm login --registry=https://registry.npmjs.org/

# GitHub Packages authentication error
npm login --registry=https://npm.pkg.github.com/
```

#### 2. Build Failures

```bash
# Clear cache
npm run clean
rm -rf node_modules
npm install

# Check TypeScript errors
npm run type-check

# Check linting errors
npm run lint
```

#### 3. Publishing Failures

```bash
# Check package.json configuration
npm run validate:packages

# Check registry configuration
npm config list

# Test publishing permissions
npm whoami --registry=https://registry.npmjs.org/
```

#### 4. GitHub Actions Failures

```bash
# Check workflow syntax
# Validate YAML files

# Check secrets configuration
# Verify all required secrets are set

# Check permissions
# Verify repository permissions
```

### Debug Commands

```bash
# Debug NPM configuration
npm config list

# Debug Git configuration
git config --list

# Debug environment variables
env | grep -E "(NPM|GITHUB|SNYK)"

# Debug package.json
npm run validate:packages
```

### Support Resources

- **GitHub Actions**: [docs.github.com/en/actions](https://docs.github.com/en/actions)
- **NPM Publishing**: [docs.npmjs.com/packages-and-modules](https://docs.npmjs.com/packages-and-modules)
- **GitHub Packages**: [docs.github.com/en/packages](https://docs.github.com/en/packages)
- **Turbo**: [turbo.build/repo/docs](https://turbo.build/repo/docs)

---

## 📈 Performance Optimization

### 1. Caching Strategy

```yaml
# Optimize GitHub Actions caching
- name: Cache dependencies
  uses: actions/cache@v3
  with:
    path: |
      **/node_modules
      ~/.npm
      ${{ github.workspace }}/.next/cache
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-
```

### 2. Parallel Execution

```yaml
# Optimize parallel job execution
strategy:
  matrix:
    node-version: [18, 20]
    package: [core, ui, theme, charts]
```

### 3. Resource Optimization

```yaml
# Optimize resource usage
runs-on: ubuntu-latest
timeout-minutes: 30
```

---

## 🔒 Security Best Practices

### 1. Secret Management

- **Rotate secrets regularly**: Update tokens every 90 days
- **Use least privilege**: Grant minimum required permissions
- **Audit access**: Regularly review token usage
- **Monitor for leaks**: Use secret scanning tools

### 2. Dependency Security

- **Regular updates**: Use Dependabot for automated updates
- **Security scanning**: Use Snyk for vulnerability scanning
- **License compliance**: Monitor license compliance
- **Supply chain security**: Use package signing

### 3. Access Control

- **Repository permissions**: Use fine-grained permissions
- **Branch protection**: Protect main branches
- **Code review**: Require code reviews for changes
- **Audit logging**: Monitor access and changes

---

## 📚 Additional Resources

### Documentation

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [NPM Publishing Guide](https://docs.npmjs.com/packages-and-modules)
- [GitHub Packages Guide](https://docs.github.com/en/packages)
- [Turbo Documentation](https://turbo.build/repo/docs)

### Community

- [GitHub Community](https://github.community/)
- [NPM Community](https://www.npmjs.com/support)
- [Turbo Community](https://turbo.build/repo/docs/community)

### Tools

- [GitHub CLI](https://cli.github.com/)
- [NPM CLI](https://docs.npmjs.com/cli/)
- [Turbo CLI](https://turbo.build/repo/docs/reference/command-line-reference)

---

*For additional support, please refer to the [COMMUNITY_GUIDELINES.md](./COMMUNITY_GUIDELINES.md) or create an issue in the repository.*
