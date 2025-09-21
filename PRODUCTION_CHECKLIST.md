# 🚀 Production Deployment Checklist

## Pre-Deployment Checklist

### ✅ Code Preparation

- [ ] All development mode bypasses removed
- [ ] DEV_MODE flags set to `false`
- [ ] No console.log statements in production code
- [ ] TypeScript compilation passes (`npm run type-check`)
- [ ] ESLint passes (`npm run lint`)
- [ ] All tests pass (if any)

### ✅ Environment Variables

- [ ] `.env.local` created with production values
- [ ] `STRIPE_SECRET_KEY` set to live key (`sk_live_...`)
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` set to live key (`pk_live_...`)
- [ ] `STRIPE_PRICE_ID` set to production price ID
- [ ] `NEXT_PUBLIC_SITE_URL` set to production domain
- [ ] `STRIPE_WEBHOOK_SECRET` configured
- [ ] `MONGODB_URL` set to production database
- [ ] `JWT_SECRET` set to strong, unique value
- [ ] `ADMIN_PASSWORD` set to strong password
- [ ] `MAILGUN_API_KEY` and `MAILGUN_DOMAIN` configured
- [ ] `NEXT_PUBLIC_MEASUREMENT_ID` set for Google Analytics

### ✅ Stripe Configuration

- [ ] Switched to Live Mode in Stripe Dashboard
- [ ] Created production product: "WCS VIP Membership 2024-2025"
- [ ] Set price to $15 CAD
- [ ] Copied production Price ID
- [ ] Set up production webhook endpoint
- [ ] Webhook events configured: `checkout.session.completed`, `payment_intent.succeeded`
- [ ] Webhook secret copied and configured

### ✅ Database Setup

- [ ] MongoDB Atlas production cluster created
- [ ] Production database user created
- [ ] Network access configured
- [ ] Connection string obtained and configured
- [ ] Database backups enabled

### ✅ Domain & SSL

- [ ] Production domain purchased/configured
- [ ] DNS records pointing to deployment platform
- [ ] SSL certificate configured (automatic with Vercel)

### ✅ Security

- [ ] Strong JWT secret generated
- [ ] Admin password is secure
- [ ] MongoDB access restricted
- [ ] No sensitive data in code
- [ ] Security headers configured in `next.config.mjs`

## Deployment Steps

### 1. Build & Test Locally

```bash
# Windows
deploy.bat

# Unix/Linux/Mac
./deploy.sh
```

### 2. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### 3. Configure Vercel Environment Variables

- Go to Vercel Dashboard → Project Settings → Environment Variables
- Add all variables from `.env.local`
- Set for Production environment

### 4. Update Stripe Webhook URL

- Go to Stripe Dashboard → Developers → Webhooks
- Update endpoint URL to: `https://your-domain.com/api/stripe/webhook`

## Post-Deployment Testing

### ✅ Authentication Flow

- [ ] User registration works
- [ ] Email validation works
- [ ] Sign-in works
- [ ] JWT tokens work correctly
- [ ] Protected routes redirect properly

### ✅ Membership Flow

- [ ] Basic membership signup works
- [ ] VIP membership checkout works
- [ ] Stripe payment processing works
- [ ] Webhook updates user plan
- [ ] Success page displays correctly
- [ ] Email receipts sent

### ✅ VIP Upgrade Flow

- [ ] Basic users see "Become a VIP" button
- [ ] VIP users don't see upgrade button
- [ ] Upgrade checkout works
- [ ] Webhook updates plan to VIP
- [ ] Profile page reflects new plan

### ✅ Database Operations

- [ ] User creation works
- [ ] Profile updates work
- [ ] Plan updates work
- [ ] Data persistence verified

### ✅ Error Handling

- [ ] Invalid email handling
- [ ] Payment failures handled
- [ ] Network errors handled
- [ ] 404 pages work
- [ ] 500 errors handled gracefully

## Monitoring Setup

### ✅ Stripe Dashboard

- [ ] Monitor payment success rate
- [ ] Check webhook delivery status
- [ ] Review failed payments
- [ ] Monitor chargebacks/disputes

### ✅ Application Monitoring

- [ ] Vercel Analytics enabled
- [ ] Google Analytics configured
- [ ] Error tracking setup (optional)
- [ ] Performance monitoring (optional)

### ✅ Database Monitoring

- [ ] MongoDB Atlas monitoring enabled
- [ ] Database performance metrics
- [ ] Connection monitoring
- [ ] Backup verification

## Security Verification

### ✅ Production Security

- [ ] HTTPS enforced
- [ ] Security headers present
- [ ] No sensitive data exposed
- [ ] Input validation working
- [ ] SQL injection protection (MongoDB)
- [ ] XSS protection enabled

### ✅ Access Control

- [ ] Admin routes protected
- [ ] User data isolation
- [ ] API rate limiting (if applicable)
- [ ] CORS properly configured

## Performance Optimization

### ✅ Frontend Performance

- [ ] Images optimized
- [ ] Code splitting working
- [ ] Bundle size reasonable
- [ ] Lighthouse score > 90

### ✅ Backend Performance

- [ ] Database queries optimized
- [ ] API response times < 500ms
- [ ] Caching implemented (if needed)
- [ ] CDN configured (Vercel automatic)

## Backup & Recovery

### ✅ Data Backup

- [ ] MongoDB Atlas backups enabled
- [ ] Code repository backed up
- [ ] Environment variables documented
- [ ] Database dumps scheduled (optional)

### ✅ Recovery Plan

- [ ] Rollback procedure documented
- [ ] Emergency contacts listed
- [ ] Recovery time objectives defined
- [ ] Backup restoration tested

## Go-Live Checklist

### ✅ Final Verification

- [ ] All tests pass
- [ ] Performance meets requirements
- [ ] Security audit completed
- [ ] Documentation updated
- [ ] Team trained on new system

### ✅ Launch Day

- [ ] Monitor system closely
- [ ] Watch for errors
- [ ] Verify payments processing
- [ ] Check user feedback
- [ ] Monitor server resources

## Post-Launch Tasks

### ✅ Week 1

- [ ] Daily monitoring
- [ ] User feedback collection
- [ ] Performance optimization
- [ ] Bug fixes as needed

### ✅ Month 1

- [ ] Analytics review
- [ ] User behavior analysis
- [ ] Performance metrics review
- [ ] Security audit
- [ ] Backup verification

---

## 🚨 Emergency Contacts

- **Stripe Support**: https://support.stripe.com
- **Vercel Support**: https://vercel.com/support
- **MongoDB Support**: https://support.mongodb.com
- **Domain Provider**: [Your domain provider support]

## 📚 Documentation Links

- **Production Setup Guide**: PRODUCTION_SETUP.md
- **Environment Setup**: ENVIRONMENT_SETUP.md
- **API Documentation**: [Create if needed]
- **User Manual**: [Create if needed]

---

**Remember**: Test everything thoroughly in staging before going live!
