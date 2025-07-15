# Stripe Integration Guide

This document provides a complete guide for the Stripe integration in the e-commerce application.

## 🚀 Features Implemented

- ✅ Stripe checkout session creation for fixed $15 product
- ✅ Webhook endpoint with signature verification
- ✅ Session details retrieval
- ✅ Health check endpoint
- ✅ Frontend service integration
- ✅ Error handling and logging
- ✅ Ready for production use

## 📋 Prerequisites

1. **Stripe Account**: Create a Stripe account at [stripe.com](https://stripe.com)
2. **API Keys**: Get your test API keys from the Stripe Dashboard
3. **Webhook Endpoint**: Set up a webhook endpoint in your Stripe Dashboard

## 🔧 Environment Variables

Make sure your `.env` file contains the following Stripe variables:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

## 🛠️ Backend Setup

### 1. Dependencies

All required dependencies are already installed:

- `stripe`: Stripe Node.js library
- `dotenv`: Environment variable management
- `express`: Web framework

### 2. API Endpoints

#### Create Checkout Session

```
POST /api/stripe/create-checkout-session
Content-Type: application/json

{
  "email": "customer@example.com"
}
```

**Response:**

```json
{
  "success": true,
  "sessionId": "cs_test_...",
  "url": "https://checkout.stripe.com/..."
}
```

#### Webhook Endpoint

```
POST /api/stripe/webhook
Content-Type: application/json
Stripe-Signature: t=...,v1=...
```

#### Get Session Details

```
GET /api/stripe/session/:sessionId
```

#### Health Check

```
GET /api/stripe/health
```

## 🌐 Frontend Integration

### 1. Stripe Service

The `stripeService.js` provides methods for:

- Creating checkout sessions
- Retrieving session details
- Health checks
- Loading Stripe.js

### 2. Test Component

Use the `StripeTest.js` component to test the integration:

```jsx
import StripeTest from "./components/StripeTest";

// In your app
<StripeTest />;
```

## 🧪 Testing

### 1. Start the Backend

```bash
cd backend
npm run dev
```

### 2. Start the Frontend

```bash
cd frontend
npm start
```

### 3. Test the Integration

1. **Health Check**: Visit `http://localhost:5000/api/stripe/health`
2. **Frontend Test**: Navigate to the StripeTest component
3. **Create Session**: Click "Test $15 Checkout"
4. **Complete Payment**: Use test card `4242 4242 4242 4242`

### 4. Test Cards

| Card Number         | Description        |
| ------------------- | ------------------ |
| 4242 4242 4242 4242 | Successful payment |
| 4000 0000 0000 0002 | Declined payment   |
| 4000 0000 0000 9995 | Insufficient funds |

## 🔗 Webhook Setup

### 1. Local Testing with Stripe CLI

Install Stripe CLI and run:

```bash
stripe listen --forward-to localhost:5000/api/stripe/webhook
```

### 2. Production Webhook

In your Stripe Dashboard:

1. Go to Developers → Webhooks
2. Add endpoint: `https://yourdomain.com/api/stripe/webhook`
3. Select events: `checkout.session.completed`, `payment_intent.succeeded`
4. Copy the webhook secret to your `.env` file

## 📊 Monitoring

### Backend Logs

The integration includes comprehensive logging:

- ✅ Session creation
- ✅ Webhook verification
- ✅ Payment completion
- ✅ Error handling

### Webhook Events Handled

- `checkout.session.completed`: Payment successful
- `payment_intent.succeeded`: Payment intent succeeded
- `payment_intent.payment_failed`: Payment failed

## 🔒 Security

### 1. Webhook Verification

All webhooks are verified using the `STRIPE_WEBHOOK_SECRET`

### 2. Error Handling

- Invalid signatures return 400
- Processing errors return 500
- Detailed logging in development

### 3. Environment Variables

- Never commit API keys to version control
- Use different keys for test/production

## 🚀 Production Deployment

### 1. Update Environment Variables

```env
STRIPE_SECRET_KEY=sk_live_your_live_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_live_webhook_secret
NODE_ENV=production
```

### 2. Webhook Configuration

- Set up production webhook endpoint
- Configure all required events
- Test webhook delivery

### 3. SSL/TLS

- Ensure HTTPS for webhook endpoints
- Stripe requires secure connections

## 🐛 Troubleshooting

### Common Issues

1. **"Stripe is not properly configured"**

   - Check `STRIPE_SECRET_KEY` in `.env`
   - Ensure key is not a placeholder

2. **"Webhook signature verification failed"**

   - Verify `STRIPE_WEBHOOK_SECRET`
   - Check webhook endpoint URL

3. **"Failed to create checkout session"**

   - Check Stripe account status
   - Verify API key permissions

4. **Frontend errors**
   - Check network requests
   - Verify API endpoint URLs

### Debug Mode

Set `NODE_ENV=development` for detailed error messages.

## 📚 Additional Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Checkout](https://stripe.com/docs/payments/checkout)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Stripe Test Cards](https://stripe.com/docs/testing#cards)

## ✅ Checklist

- [ ] Stripe account created
- [ ] API keys configured in `.env`
- [ ] Webhook endpoint set up
- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] Health check passing
- [ ] Test payment successful
- [ ] Webhook events received
- [ ] Error handling tested
- [ ] Production keys ready (when deploying)
