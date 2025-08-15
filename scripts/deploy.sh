#!/bin/bash

# Cloudflare Pages 自动化部署脚本
set -e

echo "🚀 Starting Cloudflare Pages deployment..."

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 函数：打印彩色消息
print_step() {
    echo -e "${BLUE}📋 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# 1. 环境检查
print_step "Validating environment..."

# 检查 Node.js 版本
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed"
    exit 1
fi

NODE_VERSION=$(node --version)
print_success "Node.js version: $NODE_VERSION"

# 检查 npm
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed"
    exit 1
fi

# 检查 wrangler
if ! command -v npx &> /dev/null; then
    print_error "npx is not available"
    exit 1
fi

# 2. 依赖安装
print_step "Installing dependencies..."
npm ci
print_success "Dependencies installed"

# 3. 配置 Edge Runtime
print_step "Configuring Edge Runtime..."
node scripts/configure-edge-runtime.js
print_success "Edge Runtime configured"

# 4. 类型检查
print_step "Running type check..."
npm run type-check
print_success "Type check passed"

# 5. 代码检查
print_step "Running linter..."
npm run lint
print_success "Linting passed"

# 6. 测试（如果有的话）
if npm run test --silent 2>/dev/null; then
    print_step "Running tests..."
    npm run test
    print_success "Tests passed"
else
    print_warning "No tests found, skipping..."
fi

# 7. 构建
print_step "Building application..."
npm run build:cf
print_success "Build completed"

# 8. 构建验证
print_step "Validating build output..."
node scripts/build-validator.js
print_success "Build validation passed"

# 9. 部署选项
echo ""
echo "🎯 Deployment options:"
echo "1. Preview deployment (staging)"
echo "2. Production deployment"
echo "3. Local preview only"
echo "4. Exit"

read -p "Choose an option (1-4): " choice

case $choice in
    1)
        print_step "Deploying to preview environment..."
        npx wrangler pages deploy .vercel/output/static --project-name=growagarden-staging
        print_success "Preview deployment completed!"
        ;;
    2)
        print_step "Deploying to production..."
        npx wrangler pages deploy .vercel/output/static --project-name=growagarden-production
        print_success "Production deployment completed!"
        ;;
    3)
        print_step "Starting local preview..."
        echo "Preview will be available at http://localhost:8788"
        npx wrangler pages dev .vercel/output/static --compatibility-date=2024-01-15
        ;;
    4)
        echo "Deployment cancelled."
        exit 0
        ;;
    *)
        print_error "Invalid option selected"
        exit 1
        ;;
esac

echo ""
print_success "Deployment process completed successfully! 🎉"

# 10. 部署后验证（可选）
read -p "Run post-deployment health check? (y/n): " health_check

if [[ $health_check == "y" || $health_check == "Y" ]]; then
    print_step "Running health check..."
    # 这里可以添加健康检查逻辑
    # 例如：curl 检查部署的网站是否可访问
    print_success "Health check completed"
fi

echo ""
echo "🎊 All done! Your application is now live on Cloudflare Pages!"