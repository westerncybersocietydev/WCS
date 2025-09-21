@echo off
REM Production Deployment Script for WCS (Windows)
REM This script prepares the application for production deployment

echo 🚀 Starting WCS Production Deployment...

REM Check if .env.local exists
if not exist .env.local (
    echo ❌ Error: .env.local file not found!
    echo Please create .env.local with production environment variables.
    echo See PRODUCTION_SETUP.md for details.
    pause
    exit /b 1
)

echo ✅ .env.local file found

REM Run type checking
echo 🔍 Running TypeScript type checking...
call npm run type-check
if %errorlevel% neq 0 (
    echo ❌ TypeScript errors found. Please fix them before deploying.
    pause
    exit /b 1
)

REM Run linting
echo 🔍 Running ESLint...
call npm run lint
if %errorlevel% neq 0 (
    echo ❌ ESLint errors found. Please fix them before deploying.
    pause
    exit /b 1
)

REM Build the application
echo 🏗️  Building application for production...
set NODE_ENV=production
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed. Please check the errors above.
    pause
    exit /b 1
)

echo ✅ Build completed successfully!

REM Generate sitemap
echo 🗺️  Generating sitemap...
call npm run postbuild
if %errorlevel% neq 0 (
    echo ⚠️  Sitemap generation failed, but continuing...
)

echo 🎉 Production build completed successfully!
echo.
echo 📋 Next steps:
echo 1. Deploy to Vercel: vercel --prod
echo 2. Or deploy to your preferred platform
echo 3. Test the production deployment thoroughly
echo 4. Monitor Stripe webhooks and payments
echo.
echo 🔗 Useful links:
echo - Stripe Dashboard: https://dashboard.stripe.com
echo - Vercel Dashboard: https://vercel.com/dashboard
echo - MongoDB Atlas: https://cloud.mongodb.com
echo.
echo 📚 Documentation:
echo - Production Setup Guide: PRODUCTION_SETUP.md
echo - Environment Setup: ENVIRONMENT_SETUP.md
pause
