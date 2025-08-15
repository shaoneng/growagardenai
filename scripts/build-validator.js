#!/usr/bin/env node

/**
 * Cloudflare Pages 构建验证工具
 * 验证构建配置和输出是否符合 Cloudflare Pages 要求
 */

const fs = require('fs');
const path = require('path');

class BuildValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
  }

  /**
   * 验证 Edge Runtime 配置
   */
  validateEdgeRuntime() {
    console.log('🔍 Validating Edge Runtime configuration...');
    
    const dynamicRoutes = [
      'src/app/crops/[crop]/page.tsx',
      'src/app/pets/[pet]/page.tsx',
      'src/app/reports/[id]/page.tsx',
      'src/app/not-found.tsx',
    ];
    
    const apiRoutes = [
      'src/app/api/analyze/route.ts',
    ];
    
    const allRoutes = [...dynamicRoutes, ...apiRoutes];
    
    allRoutes.forEach(route => {
      const filePath = path.join(process.cwd(), route);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        if (!content.includes("export const runtime = 'edge'")) {
          this.errors.push(`Missing Edge Runtime config in ${route}`);
        }
      } else {
        this.warnings.push(`Route file not found: ${route}`);
      }
    });
    
    return this.errors.length === 0;
  }

  /**
   * 验证环境变量
   */
  validateEnvironmentVariables() {
    console.log('🔍 Validating environment variables...');
    
    const required = [
      'NEXT_PUBLIC_APP_URL',
    ];
    
    const optional = [
      'GOOGLE_AI_API_KEY',
      'SENTRY_ORG',
      'SENTRY_PROJECT',
    ];
    
    required.forEach(key => {
      if (!process.env[key]) {
        this.errors.push(`Missing required environment variable: ${key}`);
      }
    });
    
    optional.forEach(key => {
      if (!process.env[key]) {
        this.warnings.push(`Optional environment variable not set: ${key}`);
      }
    });
    
    return this.errors.length === 0;
  }

  /**
   * 验证构建输出
   */
  validateBuildOutput() {
    console.log('🔍 Validating build output...');
    
    const outputDir = '.vercel/output/static';
    if (!fs.existsSync(outputDir)) {
      this.errors.push('Build output directory not found. Run "npm run build:cf" first.');
      return false;
    }
    
    const requiredFiles = [
      'index.html',
      '_next',
    ];
    
    requiredFiles.forEach(file => {
      const filePath = path.join(outputDir, file);
      if (!fs.existsSync(filePath)) {
        this.errors.push(`Missing required file in build output: ${file}`);
      }
    });
    
    // 检查静态资源
    const nextStaticDir = path.join(outputDir, '_next/static');
    if (fs.existsSync(nextStaticDir)) {
      const staticFiles = fs.readdirSync(nextStaticDir);
      if (staticFiles.length === 0) {
        this.warnings.push('No static files found in _next/static directory');
      }
    }
    
    return this.errors.length === 0;
  }

  /**
   * 验证配置文件
   */
  validateConfigFiles() {
    console.log('🔍 Validating configuration files...');
    
    const configFiles = [
      { file: 'wrangler.toml', required: true },
      { file: '_headers', required: true },
      { file: '_redirects', required: true },
      { file: 'next.config.ts', required: true },
      { file: 'package.json', required: true },
    ];
    
    configFiles.forEach(({ file, required }) => {
      const filePath = path.join(process.cwd(), file);
      if (!fs.existsSync(filePath)) {
        if (required) {
          this.errors.push(`Missing required configuration file: ${file}`);
        } else {
          this.warnings.push(`Optional configuration file not found: ${file}`);
        }
      }
    });
    
    // 验证 package.json 中的脚本
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      const requiredScripts = ['build:cf', 'preview:cf', 'deploy:cf'];
      
      requiredScripts.forEach(script => {
        if (!packageJson.scripts || !packageJson.scripts[script]) {
          this.errors.push(`Missing required script in package.json: ${script}`);
        }
      });
      
      // 检查依赖
      const requiredDeps = ['@cloudflare/next-on-pages'];
      requiredDeps.forEach(dep => {
        if (!packageJson.devDependencies || !packageJson.devDependencies[dep]) {
          this.errors.push(`Missing required dependency: ${dep}`);
        }
      });
    }
    
    return this.errors.length === 0;
  }

  /**
   * 验证文件大小限制
   */
  validateFileSizes() {
    console.log('🔍 Validating file sizes...');
    
    const outputDir = '.vercel/output/static';
    if (!fs.existsSync(outputDir)) {
      return true; // 如果没有构建输出，跳过此检查
    }
    
    const maxFileSize = 25 * 1024 * 1024; // 25MB Cloudflare Pages 限制
    
    function checkDirectory(dir) {
      const files = fs.readdirSync(dir);
      
      files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
          checkDirectory(filePath);
        } else if (stat.size > maxFileSize) {
          this.errors.push(`File too large for Cloudflare Pages: ${filePath} (${Math.round(stat.size / 1024 / 1024)}MB)`);
        }
      });
    }
    
    try {
      checkDirectory(outputDir);
    } catch (error) {
      this.warnings.push(`Could not check file sizes: ${error.message}`);
    }
    
    return this.errors.length === 0;
  }

  /**
   * 运行所有验证
   */
  validateAll() {
    console.log('🚀 Starting Cloudflare Pages build validation...\n');
    
    const validations = [
      this.validateConfigFiles(),
      this.validateEdgeRuntime(),
      this.validateEnvironmentVariables(),
      this.validateBuildOutput(),
      this.validateFileSizes(),
    ];
    
    const allValid = validations.every(v => v);
    
    console.log('\n📊 Validation Summary:');
    console.log(`❌ Errors: ${this.errors.length}`);
    console.log(`⚠️  Warnings: ${this.warnings.length}`);
    
    if (this.errors.length > 0) {
      console.log('\n❌ Errors found:');
      this.errors.forEach(error => console.log(`  - ${error}`));
    }
    
    if (this.warnings.length > 0) {
      console.log('\n⚠️  Warnings:');
      this.warnings.forEach(warning => console.log(`  - ${warning}`));
    }
    
    if (allValid) {
      console.log('\n✅ All validations passed! Ready for Cloudflare Pages deployment.');
    } else {
      console.log('\n❌ Validation failed. Please fix the errors above before deploying.');
      process.exit(1);
    }
    
    return allValid;
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  const validator = new BuildValidator();
  validator.validateAll();
}

module.exports = BuildValidator;