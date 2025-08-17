#!/usr/bin/env node
/**
 * Cloudflare Pages部署前验证
 * 确保所有修复和优化都已正确实施
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Cloudflare Pages部署前验证...\n');

/**
 * 检查JSON处理器实现
 */
function validateJSONHandler() {
  console.log('📋 验证JSON处理器');
  console.log('==================');
  
  const handlerPath = path.join(process.cwd(), 'src/lib/cloudflare-json-handler.ts');
  
  if (!fs.existsSync(handlerPath)) {
    console.log('❌ CloudflareJSONHandler文件不存在');
    return false;
  }
  
  const content = fs.readFileSync(handlerPath, 'utf8');
  
  const requiredMethods = [
    'createResponse',
    'createErrorResponse',
    'sanitizeForSerialization',
    'validateResponseStructure',
    'test'
  ];
  
  let methodsFound = 0;
  
  requiredMethods.forEach(method => {
    if (content.includes(`static ${method}`) || content.includes(`${method}(`)) {
      console.log(`  ✅ ${method} 方法已实现`);
      methodsFound++;
    } else {
      console.log(`  ❌ ${method} 方法缺失`);
    }
  });
  
  const hasEdgeRuntimeHandling = content.includes('Edge Runtime') || content.includes('edge');
  const hasCircularRefHandling = content.includes('Circular') || content.includes('WeakSet');
  const hasErrorCodeMapping = content.includes('getErrorCode');
  
  console.log(`  ${hasEdgeRuntimeHandling ? '✅' : '❌'} Edge Runtime处理`);
  console.log(`  ${hasCircularRefHandling ? '✅' : '❌'} 循环引用处理`);
  console.log(`  ${hasErrorCodeMapping ? '✅' : '❌'} 错误代码映射`);
  
  const score = methodsFound + (hasEdgeRuntimeHandling ? 1 : 0) + 
                (hasCircularRefHandling ? 1 : 0) + (hasErrorCodeMapping ? 1 : 0);
  const total = requiredMethods.length + 3;
  
  console.log(`\n📊 JSON处理器完整性: ${score}/${total}`);
  return score === total;
}

/**
 * 检查API路由修复
 */
function validateAPIRoutes() {
  console.log('\n📋 验证API路由修复');
  console.log('==================');
  
  const apiRoutes = [
    'src/app/api/analyze/route.ts',
    'src/app/api/test-analyze/route.ts'
  ];
  
  let routesFixed = 0;
  
  apiRoutes.forEach(routePath => {
    const fullPath = path.join(process.cwd(), routePath);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`  ⚠️ ${routePath} 不存在`);
      return;
    }
    
    const content = fs.readFileSync(fullPath, 'utf8');
    
    const hasEdgeRuntime = content.includes("export const runtime = 'edge'");
    const hasJSONHandler = content.includes('CloudflareJSONHandler');
    const hasErrorHandling = content.includes('createErrorResponse');
    const hasValidation = content.includes('validateResponseStructure');
    
    console.log(`\n  ${routePath}:`);
    console.log(`    ${hasEdgeRuntime ? '✅' : '❌'} Edge Runtime配置`);
    console.log(`    ${hasJSONHandler ? '✅' : '❌'} JSON处理器集成`);
    console.log(`    ${hasErrorHandling ? '✅' : '❌'} 错误处理`);
    console.log(`    ${hasValidation ? '✅' : '❌'} 响应验证`);
    
    if (hasEdgeRuntime && hasJSONHandler && hasErrorHandling) {
      routesFixed++;
    }
  });
  
  console.log(`\n📊 API路由修复: ${routesFixed}/${apiRoutes.length}`);
  return routesFixed === apiRoutes.length;
}

/**
 * 检查Next.js配置
 */
function validateNextConfig() {
  console.log('\n📋 验证Next.js配置');
  console.log('==================');
  
  const configPath = path.join(process.cwd(), 'next.config.ts');
  
  if (!fs.existsSync(configPath)) {
    console.log('❌ next.config.ts 不存在');
    return false;
  }
  
  const content = fs.readFileSync(configPath, 'utf8');
  
  const hasStaticExport = content.includes("output: 'export'");
  const hasTrailingSlash = content.includes('trailingSlash: true');
  const hasImageOptimization = content.includes('unoptimized: true');
  const hasEdgeConfig = content.includes('edge') || content.includes('Edge');
  
  console.log(`  ${hasStaticExport ? '✅' : '❌'} 静态导出配置`);
  console.log(`  ${hasTrailingSlash ? '✅' : '❌'} 尾部斜杠配置`);
  console.log(`  ${hasImageOptimization ? '✅' : '❌'} 图片优化配置`);
  console.log(`  ${hasEdgeConfig ? '✅' : '❌'} Edge Runtime配置`);
  
  const configScore = [hasStaticExport, hasTrailingSlash, hasImageOptimization].filter(Boolean).length;
  console.log(`\n📊 Next.js配置: ${configScore}/3`);
  
  return configScore >= 2; // 至少需要静态导出和图片优化
}

/**
 * 检查构建脚本
 */
function validateBuildScripts() {
  console.log('\n📋 验证构建脚本');
  console.log('================');
  
  const packagePath = path.join(process.cwd(), 'package.json');
  
  if (!fs.existsSync(packagePath)) {
    console.log('❌ package.json 不存在');
    return false;
  }
  
  const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  const hasBuildScript = pkg.scripts && pkg.scripts.build;
  const hasDataProcessing = hasBuildScript && pkg.scripts.build.includes('build-data.js');
  const hasNodeVersion = pkg.engines && pkg.engines.node;
  
  console.log(`  ${hasBuildScript ? '✅' : '❌'} 构建脚本存在`);
  console.log(`  ${hasDataProcessing ? '✅' : '❌'} 数据处理集成`);
  console.log(`  ${hasNodeVersion ? '✅' : '❌'} Node版本指定`);
  
  if (hasBuildScript) {
    console.log(`    构建命令: ${pkg.scripts.build}`);
  }
  
  if (hasNodeVersion) {
    console.log(`    Node版本: ${pkg.engines.node}`);
  }
  
  const buildScore = [hasBuildScript, hasDataProcessing, hasNodeVersion].filter(Boolean).length;
  console.log(`\n📊 构建脚本配置: ${buildScore}/3`);
  
  return buildScore >= 2;
}

/**
 * 检查环境变量配置
 */
function validateEnvironmentConfig() {
  console.log('\n📋 验证环境变量配置');
  console.log('====================');
  
  const envExamplePath = path.join(process.cwd(), '.env.example');
  const envLocalPath = path.join(process.cwd(), '.env.local');
  
  const hasEnvExample = fs.existsSync(envExamplePath);
  const hasEnvLocal = fs.existsSync(envLocalPath);
  
  console.log(`  ${hasEnvExample ? '✅' : '❌'} .env.example 存在`);
  console.log(`  ${hasEnvLocal ? '✅' : '❌'} .env.local 存在`);
  
  if (hasEnvExample) {
    const exampleContent = fs.readFileSync(envExamplePath, 'utf8');
    const hasGeminiKey = exampleContent.includes('GEMINI_API_KEY') || exampleContent.includes('GOOGLE_AI_API_KEY');
    console.log(`    ${hasGeminiKey ? '✅' : '❌'} Gemini API密钥配置`);
  }
  
  // 检查运行时环境变量
  const hasGeminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
  console.log(`  ${hasGeminiKey ? '✅' : '❌'} 运行时API密钥`);
  
  return hasEnvExample && (hasEnvLocal || hasGeminiKey);
}

/**
 * 检查测试覆盖率
 */
function validateTestCoverage() {
  console.log('\n📋 验证测试覆盖率');
  console.log('==================');
  
  const testFiles = [
    'scripts/test-cloudflare-json-handler.js',
    'scripts/test-cloudflare-api-fix.js',
    'scripts/validate-cloudflare-deployment.js'
  ];
  
  let testsFound = 0;
  
  testFiles.forEach(testFile => {
    const testPath = path.join(process.cwd(), testFile);
    const exists = fs.existsSync(testPath);
    console.log(`  ${exists ? '✅' : '❌'} ${testFile}`);
    if (exists) testsFound++;
  });
  
  console.log(`\n📊 测试文件: ${testsFound}/${testFiles.length}`);
  return testsFound >= 2;
}

/**
 * 检查部署准备状态
 */
function validateDeploymentReadiness() {
  console.log('\n📋 验证部署准备状态');
  console.log('====================');
  
  // 检查关键文件
  const criticalFiles = [
    'src/lib/cloudflare-json-handler.ts',
    'src/app/api/analyze/route.ts',
    'next.config.ts',
    'package.json'
  ];
  
  let filesReady = 0;
  
  criticalFiles.forEach(file => {
    const exists = fs.existsSync(path.join(process.cwd(), file));
    console.log(`  ${exists ? '✅' : '❌'} ${file}`);
    if (exists) filesReady++;
  });
  
  // 检查构建输出目录
  const buildDirs = ['.next', 'out'];
  let buildReady = false;
  
  buildDirs.forEach(dir => {
    const exists = fs.existsSync(path.join(process.cwd(), dir));
    if (exists) {
      console.log(`  ✅ ${dir} 目录存在`);
      buildReady = true;
    }
  });
  
  if (!buildReady) {
    console.log('  ⚠️ 构建输出目录不存在，需要运行构建');
  }
  
  console.log(`\n📊 关键文件: ${filesReady}/${criticalFiles.length}`);
  console.log(`📊 构建状态: ${buildReady ? '✅' : '⚠️'}`);
  
  return filesReady === criticalFiles.length;
}

/**
 * 生成部署报告
 */
function generateDeploymentReport(results) {
  console.log('\n📊 生成部署报告');
  console.log('================');
  
  const report = {
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    status: 'ready',
    results,
    recommendations: []
  };
  
  const passedChecks = Object.values(results).filter(Boolean).length;
  const totalChecks = Object.keys(results).length;
  
  if (passedChecks === totalChecks) {
    report.status = 'ready';
    report.recommendations.push('✅ 所有检查通过，可以部署到Cloudflare Pages');
  } else if (passedChecks >= totalChecks * 0.8) {
    report.status = 'warning';
    report.recommendations.push('⚠️ 大部分检查通过，建议修复剩余问题后部署');
  } else {
    report.status = 'not_ready';
    report.recommendations.push('❌ 多项检查失败，需要修复后再部署');
  }
  
  // 添加具体建议
  if (!results.jsonHandler) {
    report.recommendations.push('- 完善JSON处理器实现');
  }
  if (!results.apiRoutes) {
    report.recommendations.push('- 修复API路由配置');
  }
  if (!results.nextConfig) {
    report.recommendations.push('- 优化Next.js配置');
  }
  if (!results.buildScripts) {
    report.recommendations.push('- 完善构建脚本');
  }
  if (!results.environment) {
    report.recommendations.push('- 配置环境变量');
  }
  
  // 保存报告
  try {
    fs.writeFileSync(
      path.join(process.cwd(), 'cloudflare-deployment-validation-report.json'),
      JSON.stringify(report, null, 2)
    );
    console.log('✅ 部署报告已保存到 cloudflare-deployment-validation-report.json');
  } catch (error) {
    console.log('⚠️ 保存部署报告失败:', error.message);
  }
  
  return report;
}

/**
 * 运行所有验证
 */
function runAllValidations() {
  console.log('🔍 开始Cloudflare Pages部署前验证');
  console.log('==================================');
  
  const results = {
    jsonHandler: validateJSONHandler(),
    apiRoutes: validateAPIRoutes(),
    nextConfig: validateNextConfig(),
    buildScripts: validateBuildScripts(),
    environment: validateEnvironmentConfig(),
    testCoverage: validateTestCoverage(),
    deploymentReadiness: validateDeploymentReadiness()
  };
  
  const report = generateDeploymentReport(results);
  
  console.log('\n📊 验证总结');
  console.log('============');
  
  const passedChecks = Object.values(results).filter(Boolean).length;
  const totalChecks = Object.keys(results).length;
  
  Object.entries(results).forEach(([check, passed]) => {
    console.log(`${passed ? '✅' : '❌'} ${check}: ${passed ? '通过' : '失败'}`);
  });
  
  console.log(`\n总体结果: ${passedChecks}/${totalChecks} 验证通过`);
  console.log(`部署状态: ${report.status}`);
  
  console.log('\n📋 建议:');
  report.recommendations.forEach(rec => console.log(rec));
  
  if (report.status === 'ready') {
    console.log('\n🎉 验证完成！可以安全部署到Cloudflare Pages。');
    console.log('\n🚀 部署命令:');
    console.log('npm run build');
    console.log('# 然后在Cloudflare Pages中触发部署');
    return true;
  } else {
    console.log('\n⚠️ 验证未完全通过，建议修复问题后再部署。');
    return false;
  }
}

// 运行验证
const success = runAllValidations();
process.exit(success ? 0 : 1);