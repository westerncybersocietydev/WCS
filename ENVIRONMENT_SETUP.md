# Environment Variables Setup

## Local Development (.env.local)

Create a `.env.local` file in your project root with the following variables:

```bash
# .env.local (local/test)
# Stripe Configuration - TEST MODE
# STRIPE_SECRET_KEY=sk_test_51QDS1rBMIBboKiZZhgSo8s7qfzS2bXi4ZNJanxYGrPDGmmUxrAtjLINV7dPgsM6dODAIfY8PkUW4w0kpx1tB3vH400iFgbG92N  # Get from Stripe Dashboard (Test mode)
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51QDS1rBMIBboKiZZyarjBi8yqibB9kVkotTePldSpyOmwvucwnErZHIA21kdIQEUPdfZJSYpGdJ17Mb1SduqSE5U00JW36pblE  # Get from Stripe Dashboard (Test mode)
# STRIPE_PRICE_ID=price_1S8sqTBMIBboKiZZv8fzT6Xq
  # Create $15 product in Test mode

# Stripe Configuration - LIVE MODE (for production)
STRIPE_SECRET_KEY=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
STRIPE_RESTRICTED_KEY=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
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51QDS1rBMIBboKiZZuv6HqBrWtcyBoLuHTvkNlCOn5g2B0xxjbxjzeqh0B4bNx5DAwmyCY2htCgXiHJs8XT4I3rh800H8TeV4EH
STRIPE_PRICE_ID=price_1S8rY9BMIBboKiZZKGK0T67h


# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Webhook Configuration (to be set after creating webhook in Stripe dashboard)
STRIPE_WEBHOOK_SECRET=whsec_uZpLJteJtPgF9EHi1o1K0ZFjaxw95ivd

# Database Configuration
MONGODB_URL=your_mongodb_connection_string

# JWT Configuration
JWT_SECRET=your_jwt_secret_key

# Admin Configuration
ADMIN_PASSWORD=your_admin_password

# Email Configuration (Mailgun)
MAILGUN_API_KEY=your_mailgun_api_key
MAILGUN_DOMAIN=your_mailgun_domain

# Google Analytics
NEXT_PUBLIC_MEASUREMENT_ID=G-XXXXXXXXXX
```

## Production (Vercel)

In your Vercel dashboard, set the following environment variables:

### Preview Environment:

- `STRIPE_SECRET_KEY` = `sk_test_xxx` (test key)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` = `pk_test_xxx` (test publishable key)
- `STRIPE_PRICE_ID` = `price_test_xxx` (test price ID)
- `NEXT_PUBLIC_SITE_URL` = `https://your-preview-url.vercel.app`
- `STRIPE_WEBHOOK_SECRET` = `whsec_...` (test webhook secret)
- `MONGODB_URL` = `your_mongodb_connection_string`
- `JWT_SECRET` = `your_jwt_secret_key`
- `ADMIN_PASSWORD` = `your_admin_password`
- `MAILGUN_API_KEY` = `your_mailgun_api_key`
- `MAILGUN_DOMAIN` = `your_mailgun_domain`
- `NEXT_PUBLIC_MEASUREMENT_ID` = `G-XXXXXXXXXX`

### Production Environment:

- `STRIPE_SECRET_KEY` = `sk_live_xxx` (live key)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` = `pk_live_xxx` (live publishable key)
- `STRIPE_PRICE_ID` = `price_live_xxx` (live price ID)
- `NEXT_PUBLIC_SITE_URL` = `https://your-domain.com`
- `STRIPE_WEBHOOK_SECRET` = `whsec_...` (live webhook secret)
- `MONGODB_URL` = `your_production_mongodb_connection_string`
- `JWT_SECRET` = `your_production_jwt_secret_key`
- `ADMIN_PASSWORD` = `your_production_admin_password`
- `MAILGUN_API_KEY` = `your_production_mailgun_api_key`
- `MAILGUN_DOMAIN` = `your_production_mailgun_domain`
- `NEXT_PUBLIC_MEASUREMENT_ID` = `G-XXXXXXXXXX`

## Important Notes:

1. **Never commit `.env.local`** to version control
2. **Use test keys** for local development and preview deployments
3. **Use live keys** only for production
4. **Set webhook secrets** after creating webhooks in Stripe dashboard
5. **Update price IDs** when you change pricing in Stripe

## Getting Stripe Keys:

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Developers > API Keys**
3. Copy the **Secret key** (starts with `sk_test_` or `sk_live_`)
4. Navigate to **Products** and create a product with price $15
5. Copy the **Price ID** (starts with `price_`)

## Setting up Webhooks:

1. Go to **Developers > Webhooks** in Stripe Dashboard
2. Add endpoint: `https://your-domain.com/api/webhook`
3. Select events: `checkout.session.completed`, `payment_intent.succeeded`
4. Copy the **Webhook signing secret** (starts with `whsec_`)
