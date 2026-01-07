# PayPal Integration Guide

This document provides detailed steps for integrating PayPal payment processing for WCS VIP membership payments. The Stripe integration has been disabled (but code preserved) and replaced with PayPal.

## Overview

The PayPal integration uses PayPal's REST API to:

1. Create payment orders
2. Redirect users to PayPal for payment approval
3. Capture payments after approval
4. Handle webhooks for payment completion
5. Automatically upgrade users to VIP status

## Prerequisites

1. PayPal Developer Account (https://developer.paypal.com/)
2. PayPal Sandbox account for testing
3. PayPal Live account for production
4. Environment variables configured

## Step 1: PayPal Developer Account Setup

### 1.1 Create PayPal Developer Account

1. Go to https://developer.paypal.com/
2. Sign up or log in with your PayPal account
3. Navigate to Dashboard

### 1.2 Create Sandbox App (for testing)

1. In PayPal Developer Dashboard, go to "My Apps & Credentials"
2. Click "Create App"
3. Name it (e.g., "WCS Membership Sandbox")
4. Select "Merchant" as the app type
5. Click "Create App"
6. Copy the **Client ID** and **Secret** (you'll need these for environment variables)

### 1.3 Create Live App (for production)

1. Repeat the process above but select "Live" instead of "Sandbox"
2. Copy the **Client ID** and **Secret** for production

## Step 2: Environment Variables

Add the following environment variables to your `.env.local` (development) and production environment:

```env
# PayPal Configuration
PAYPAL_CLIENT_ID=your_sandbox_client_id_here
PAYPAL_CLIENT_SECRET=your_sandbox_secret_here
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_sandbox_client_id_here  # Same as PAYPAL_CLIENT_ID (exposed to browser)
PAYPAL_MODE=sandbox  # Use "sandbox" for testing, "live" for production

# Site URL (should already exist)
NEXT_PUBLIC_SITE_URL=http://localhost:3000  # Development
# NEXT_PUBLIC_SITE_URL=https://yourdomain.com  # Production
```

### For Production:

```env
PAYPAL_CLIENT_ID=your_live_client_id_here
PAYPAL_CLIENT_SECRET=your_live_secret_here
PAYPAL_MODE=live
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

## Step 3: PayPal Webhook Setup

### 3.1 Configure Webhook URL

1. In PayPal Developer Dashboard, go to your app
2. Scroll down to "Webhooks" section
3. Click "Add Webhook"
4. Enter your webhook URL:
   - Development: `http://your-ngrok-url.ngrok.io/api/paypal/webhook`
   - Production: `https://yourdomain.com/api/paypal/webhook`
5. Select the following events:
   - `PAYMENT.CAPTURE.COMPLETED`
   - `CHECKOUT.ORDER.COMPLETED`
6. Click "Save"

### 3.2 Webhook Verification (Production)

For production, you should implement webhook signature verification. The current implementation accepts all webhooks, but for security, you should verify the signature.

**Note:** For local development, use a tool like ngrok to expose your local server:

```bash
ngrok http 3000
```

## Step 4: Testing the Integration

### 4.1 Test Payment Flow

1. Start your development server: `npm run dev`
2. Navigate to `/membership` page
3. Click "Upgrade to VIP"
4. You should be redirected to PayPal Sandbox
5. Log in with a PayPal Sandbox test account
6. Complete the payment
7. You should be redirected back to `/membership/success`

### 4.2 PayPal Sandbox Test Accounts

PayPal provides test accounts in the Sandbox:

1. Go to PayPal Developer Dashboard
2. Click "Sandbox" > "Accounts"
3. Use the provided test buyer account or create a new one
4. Use these accounts to test payments

### 4.3 Verify VIP Upgrade

1. After completing a test payment, check your database
2. The user's plan should be updated to "VIP"
3. Check server logs for webhook events

## Step 5: File Structure

The PayPal integration consists of the following files:

```
app/
├── lib/
│   └── paypal.ts                    # PayPal API helper functions
├── api/
│   ├── paypal/
│   │   ├── create-order/
│   │   │   └── route.ts            # Create PayPal order endpoint
│   │   ├── capture-order/
│   │   │   └── route.ts            # Capture payment endpoint
│   │   └── webhook/
│   │       └── route.ts             # PayPal webhook handler
│   ├── upgrade/
│   │   └── membership/
│   │       └── route.ts            # Updated to use PayPal (Stripe disabled)
│   └── checkout/
│       └── membership/
│           └── route.ts             # Updated to use PayPal (Stripe disabled)
├── membership/
│   ├── page.tsx                     # Updated to use PayPal
│   └── success/
│       └── page.tsx                 # Updated to handle PayPal returns
└── sign-up/
    └── page.tsx                     # Updated to use PayPal
```

## Step 6: Payment Flow

### 6.1 User Initiates Payment

1. User clicks "Upgrade to VIP" on `/membership` or during sign-up
2. Frontend calls `/api/upgrade/membership` with `userId`
3. Backend creates PayPal order via `createPayPalOrder()`
4. Returns approval URL to frontend
5. Frontend redirects user to PayPal

### 6.2 User Completes Payment on PayPal

1. User logs in to PayPal
2. Reviews payment details
3. Approves payment
4. PayPal redirects back to `return_url` with `token` parameter

### 6.3 Payment Capture

1. Success page receives `token` (order ID) from PayPal
2. Frontend calls `/api/paypal/capture-order` with order ID
3. Backend captures the payment via PayPal API
4. Payment is completed

### 6.4 VIP Upgrade

1. PayPal sends webhook event to `/api/paypal/webhook`
2. Webhook handler processes `PAYMENT.CAPTURE.COMPLETED` event
3. Extracts `userId` from `custom_id` in payment details
4. Calls `upgradeToVIP(userId)` to update user plan
5. User is now VIP

## Step 7: Stripe Code Status

All Stripe code has been **disabled but preserved** in the codebase. You can find it commented out with `// STRIPE CODE DISABLED` markers. This allows for easy rollback if needed.

### Files with Disabled Stripe Code:

- `app/api/upgrade/membership/route.ts`
- `app/api/checkout/membership/route.ts`

### Stripe Webhooks (Still Active but Not Used)

- `app/api/stripe/webhook/route.ts` - Still exists but not called
- `app/api/webhooks/upgrade/route.ts` - Still exists but not called

**Note:** You can remove Stripe webhook endpoints if you're certain you won't need them.

## Step 8: Production Deployment Checklist

Before going live:

- [ ] Update environment variables with live PayPal credentials
- [ ] Set `PAYPAL_MODE=live`
- [ ] Configure production webhook URL in PayPal Dashboard
- [ ] Test payment flow in production environment
- [ ] Verify webhook events are being received
- [ ] Monitor PayPal Dashboard for transactions
- [ ] Set up error logging and monitoring
- [ ] Test cancel flow (user cancels payment)
- [ ] Verify VIP upgrades are working correctly
- [ ] Test with real PayPal accounts (small amounts)

## Step 9: Troubleshooting

### Common Issues

1. **"PayPal credentials not configured"**

   - Check that `PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET` are set
   - Verify environment variables are loaded correctly

2. **Webhook not receiving events**

   - Check webhook URL is correct in PayPal Dashboard
   - Verify your server is accessible (use ngrok for local dev)
   - Check server logs for webhook requests

3. **Payment not capturing**

   - Verify order ID is correct
   - Check PayPal Dashboard for order status
   - Review server logs for API errors

4. **User not upgraded to VIP**
   - Check webhook is receiving `PAYMENT.CAPTURE.COMPLETED` event
   - Verify `custom_id` contains valid `userId`
   - Check database logs for upgrade attempts

### Debug Mode

Enable detailed logging by checking:

- Server console logs
- PayPal Dashboard > Transactions
- PayPal Dashboard > Webhooks (event logs)

## Step 10: Security Considerations

1. **Never commit credentials** - Use environment variables only
2. **Webhook verification** - Implement signature verification for production
3. **HTTPS required** - PayPal requires HTTPS for production webhooks
4. **Rate limiting** - Consider rate limiting on webhook endpoint
5. **Idempotency** - Webhook handler should handle duplicate events gracefully

## Step 11: PayPal API Documentation

For more details, refer to:

- PayPal Orders API: https://developer.paypal.com/docs/api/orders/v2/
- PayPal Webhooks: https://developer.paypal.com/docs/api-basics/notifications/webhooks/
- PayPal Sandbox Testing: https://developer.paypal.com/docs/api-basics/sandbox/

## Support

If you encounter issues:

1. Check PayPal Developer Dashboard for API errors
2. Review server logs
3. Test with PayPal Sandbox first
4. Refer to PayPal API documentation
5. Check PayPal status page: https://www.paypal-status.com/

---

**Last Updated:** Integration completed with PayPal REST API
**Status:** Stripe disabled, PayPal active for membership payments
