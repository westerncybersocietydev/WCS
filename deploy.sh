#!/bin/bash

# Production Deployment Script for WCS
# This script prepares the application for production deployment

echo "🚀 Starting WCS Production Deployment..."

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ Error: .env.local file not found!"
    echo "Please create .env.local with production environment variables."
    echo "See PRODUCTION_SETUP.md for details."
    exit 1
fi

# Check if required environment variables are set
echo "🔍 Checking environment variables..."

required_vars=(
    "STRIPE_SECRET_KEY"
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
    "STRIPE_PRICE_ID"
    "NEXT_PUBLIC_SITE_URL"
    "MONGODB_URL"
    "JWT_SECRET"
)

missing_vars=()

for var in "${required_vars[@]}"; do
    if ! grep -q "^$var=" .env.local; then
        missing_vars+=("$var")
    fi
done

if [ ${#missing_vars[@]} -ne 0 ]; then
    echo "❌ Missing required environment variables:"
    printf '%s\n' "${missing_vars[@]}"
    echo "Please add these to your .env.local file."
    exit 1
fi

echo "✅ All required environment variables found"

# Run type checking
echo "🔍 Running TypeScript type checking..."
npm run type-check
if [ $? -ne 0 ]; then
    echo "❌ TypeScript errors found. Please fix them before deploying."
    exit 1
fi

# Run linting
echo "🔍 Running ESLint..."
npm run lint
if [ $? -ne 0 ]; then
    echo "❌ ESLint errors found. Please fix them before deploying."
    exit 1
fi

# Build the application
echo "🏗️  Building application for production..."
npm run build:production
if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi

echo "✅ Build completed successfully!"

# Generate sitemap
echo "🗺️  Generating sitemap..."
npm run postbuild
if [ $? -ne 0 ]; then
    echo "⚠️  Sitemap generation failed, but continuing..."
fi

echo "🎉 Production build completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Deploy to Vercel: vercel --prod"
echo "2. Or deploy to your preferred platform"
echo "3. Test the production deployment thoroughly"
echo "4. Monitor Stripe webhooks and payments"
echo ""
echo "🔗 Useful links:"
echo "- Stripe Dashboard: https://dashboard.stripe.com"
echo "- Vercel Dashboard: https://vercel.com/dashboard"
echo "- MongoDB Atlas: https://cloud.mongodb.com"
echo ""
echo "📚 Documentation:"
echo "- Production Setup Guide: PRODUCTION_SETUP.md"
echo "- Environment Setup: ENVIRONMENT_SETUP.md"
