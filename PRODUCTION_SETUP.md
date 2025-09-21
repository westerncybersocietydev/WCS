# Production Setup Guide

## 🚀 Production Deployment Checklist

### 1. Environment Variables Setup

Create a `.env.local` file with these production values:

```bash
# Stripe Configuration - LIVE MODE
STRIPE_SECRET_KEY=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
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51QDS1rBMIBboKiZZuv6HqBrWtcyBoLuHTvkNlCOn5g2B0xxjbxjzeqh0B4bNx5DAwmyCY2htCgXiHJs8XT4I3rh800H8TeV4EH
STRIPE_PRICE_ID=price_1S8rY9BMIBboKiZZKGK0T67h

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# Webhook Configuration
STRIPE_WEBHOOK_SECRET=whsec_your_production_webhook_secret

# Database Configuration
MONGODB_URL=your_production_mongodb_connection_string

# JWT Configuration
JWT_SECRET=your_production_jwt_secret_key

# Admin Configuration
ADMIN_PASSWORD=your_production_admin_password

# Email Configuration (Mailgun)
MAILGUN_API_KEY=your_production_mailgun_api_key
MAILGUN_DOMAIN=your_production_mailgun_domain

# Google Analytics
NEXT_PUBLIC_MEASUREMENT_ID=G-XXXXXXXXXX

# Node Environment
NODE_ENV=production
```

### 2. Stripe Production Setup

1. **Switch to Live Mode** in Stripe Dashboard
2. **Create Production Product**:
   - Go to Products → Create Product
   - Name: "WCS VIP Membership 2024-2025"
   - Price: $15 CAD
   - Copy the Price ID (starts with `price_`)
3. **Set up Production Webhooks**:
   - Go to Developers → Webhooks
   - Add endpoint: `https://your-domain.com/api/stripe/webhook`
   - Select events: `checkout.session.completed`, `payment_intent.succeeded`
   - Copy the webhook secret (starts with `whsec_`)

### 3. MongoDB Production Setup

1. **Create MongoDB Atlas Account** (if not already done)
2. **Create Production Cluster**:
   - Choose M0 (Free) or M2+ for production
   - Set up network access (allow all IPs or specific IPs)
3. **Create Database User**:
   - Username: `wcs-production`
   - Password: Generate strong password
4. **Get Connection String**:
   - Replace `<password>` with actual password
   - Replace `<dbname>` with `wcs-production`

### 4. JWT Secret Generation

Generate a strong JWT secret:

```bash
# Option 1: Using Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Option 2: Using OpenSSL
openssl rand -hex 64

# Option 3: Online generator
# https://generate-secret.vercel.app/64
```

### 5. Domain Setup

1. **Purchase Domain** (if not already done)
2. **Configure DNS**:
   - Point A record to Vercel IP
   - Or use CNAME to point to Vercel deployment
3. **SSL Certificate**: Automatically handled by Vercel

### 6. Vercel Deployment

1. **Connect Repository** to Vercel
2. **Set Environment Variables** in Vercel Dashboard:
   - Go to Project Settings → Environment Variables
   - Add all variables from `.env.local`
3. **Deploy**:
   - Push to main branch
   - Vercel will auto-deploy

### 7. Testing Production Flow

1. **Test Registration**:
   - Create new account
   - Verify email validation works
2. **Test VIP Upgrade**:
   - Sign in with Basic account
   - Click "Become a VIP"
   - Complete Stripe checkout
3. **Test Webhooks**:
   - Check Stripe Dashboard for webhook deliveries
   - Verify user plan updates in database

### 8. Security Checklist

- [ ] All environment variables set
- [ ] JWT secret is strong and unique
- [ ] Stripe webhook secret configured
- [ ] MongoDB access restricted
- [ ] HTTPS enabled (automatic with Vercel)
- [ ] Admin password is strong
- [ ] No development bypasses in code

### 9. Monitoring Setup

1. **Stripe Dashboard**: Monitor payments and webhooks
2. **Vercel Analytics**: Monitor site performance
3. **MongoDB Atlas**: Monitor database performance
4. **Google Analytics**: Track user behavior

### 10. Backup Strategy

1. **Database Backups**: MongoDB Atlas automatic backups
2. **Code Backups**: Git repository
3. **Environment Variables**: Documented and stored securely

## 🚨 Important Notes

1. **Never commit** `.env.local` to version control
2. **Test thoroughly** in staging environment first
3. **Monitor** first few transactions carefully
4. **Keep backups** of all configuration
5. **Update webhook URLs** if domain changes

## 🔧 Troubleshooting

### Common Issues:

1. **Webhook failures**: Check webhook URL and secret
2. **Database connection**: Verify MongoDB connection string
3. **JWT errors**: Ensure JWT_SECRET is set
4. **Stripe errors**: Verify live keys are correct

### Support:

- Stripe Documentation: https://stripe.com/docs
- Vercel Documentation: https://vercel.com/docs
- MongoDB Atlas Documentation: https://docs.atlas.mongodb.com
