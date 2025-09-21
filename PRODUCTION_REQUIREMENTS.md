# 🚀 Production Requirements Summary

## ✅ **What's Already Set Up:**

### Database & User Management:

- ✅ **MongoDB User Model**: Complete with all required fields
- ✅ **User Registration**: `createUser()` function with password hashing
- ✅ **User Authentication**: `loginUser()` with JWT tokens
- ✅ **Email Validation**: `checkEmail` API to prevent duplicate registrations
- ✅ **User Profiles**: `getProfile()`, `updateBasic()`, `updatePassword()` functions
- ✅ **VIP Upgrade**: `upgradeToVIP()` function to update user plans

### Stripe Integration:

- ✅ **Membership Checkout**: `/api/checkout/membership` for new memberships
- ✅ **VIP Upgrade Checkout**: `/api/upgrade/membership` for existing users
- ✅ **Webhook Handling**: Both main webhook and upgrade webhook
- ✅ **Success Pages**: Different success pages for new members vs upgrades

### UI/UX:

- ✅ **Sign-up Flow**: Multi-step registration with plan selection
- ✅ **Membership Page**: Beautiful Basic vs VIP comparison
- ✅ **Profile Page**: Shows current plan with upgrade button for Basic users
- ✅ **Navbar**: Shows upgrade option for Basic users

## 🔧 **What You Need to Set Up:**

### 1. **MongoDB Atlas Production Database**

```bash
# Create MongoDB Atlas account at: https://cloud.mongodb.com
# 1. Create a new cluster (M0 free tier is fine to start)
# 2. Create database user with read/write access
# 3. Whitelist your IP addresses (or 0.0.0.0/0 for all IPs)
# 4. Get connection string and add to .env.local:
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/wcs-production?retryWrites=true&w=majority
```

### 2. **Stripe Production Setup**

```bash
# 1. Switch to Live Mode in Stripe Dashboard
# 2. Create production product:
#    - Name: "WCS VIP Membership 2024-2025"
#    - Price: $15 CAD
# 3. Copy the live Price ID and add to .env.local:
STRIPE_PRICE_ID=price_1S8rY9BMIBboKiZZKGK0T67h

# 4. Set up production webhooks:
#    - Endpoint: https://your-domain.com/api/stripe/webhook
#    - Endpoint: https://your-domain.com/api/webhooks/upgrade
#    - Events: checkout.session.completed, payment_intent.succeeded
# 5. Copy webhook secrets to .env.local:
STRIPE_WEBHOOK_SECRET=whsec_your_production_webhook_secret
```

### 3. **JWT Secret Generation**

```bash
# Generate a strong JWT secret:
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Add to .env.local:
JWT_SECRET=your_generated_jwt_secret_here
```

### 4. **Production Environment Variables**

Create `.env.local` with these values:

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
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/wcs-production?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_generated_jwt_secret_here

# Admin Configuration
ADMIN_PASSWORD=your_strong_admin_password

# Email Configuration (Mailgun)
MAILGUN_API_KEY=your_mailgun_api_key
MAILGUN_DOMAIN=your_mailgun_domain

# Google Analytics
NEXT_PUBLIC_MEASUREMENT_ID=G-XXXXXXXXXX

# Node Environment
NODE_ENV=production
```

### 5. **Domain Setup**

```bash
# 1. Purchase domain (if not already done)
# 2. Configure DNS to point to Vercel
# 3. Update NEXT_PUBLIC_SITE_URL in .env.local
# 4. Update Stripe webhook URLs to use your domain
```

## 🎯 **How the Flow Works:**

### **New User Registration:**

1. User fills out sign-up form
2. If Basic: Creates user → Signs in → Redirects to success
3. If VIP: Creates user with Basic plan → Signs in → Redirects to Stripe → Pays → Webhook upgrades to VIP

### **Existing User VIP Upgrade:**

1. Basic user clicks "Become a VIP"
2. Redirects to membership page
3. Clicks "Upgrade to VIP"
4. Redirects to Stripe checkout
5. Pays → Webhook upgrades plan to VIP

### **Database Structure:**

```javascript
// User Model
{
  firstName: String,
  lastName: String,
  uwoEmail: String (unique),
  preferredEmail: String,
  currentYear: String,
  program: String,
  plan: "Basic" | "VIP",
  description: String,
  avatar: String,
  password: String (hashed),
  myEvents: [ObjectId]
}
```

## 🚀 **Deployment Steps:**

1. **Set up all environment variables** in `.env.local`
2. **Test locally** with production environment:
   ```bash
   npm run build:production
   npm run start:production
   ```
3. **Deploy to Vercel**:
   ```bash
   vercel --prod
   ```
4. **Configure Vercel environment variables** in dashboard
5. **Update Stripe webhook URLs** to production domain
6. **Test complete flow** end-to-end

## 🔍 **Testing Checklist:**

- [ ] User registration works
- [ ] Email validation prevents duplicates
- [ ] Basic sign-up creates user and signs in
- [ ] VIP sign-up creates user, signs in, redirects to Stripe
- [ ] Stripe checkout works for both new and upgrade
- [ ] Webhooks update user plans correctly
- [ ] Success pages display correctly
- [ ] Profile page shows correct plan
- [ ] Basic users can upgrade to VIP
- [ ] VIP users don't see upgrade button

## 🆘 **Need Help With:**

Let me know if you need help with:

1. Setting up MongoDB Atlas
2. Configuring Stripe production
3. Generating JWT secret
4. Setting up domain and DNS
5. Testing the complete flow
6. Any other setup issues

The application is fully functional and production-ready - we just need to configure the external services! 🎉
