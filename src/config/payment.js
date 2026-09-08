/**
 * PAYMENT CONFIGURATION
 * 
 * Central configuration file for all payment settings.
 * DO NOT hardcode prices or UPI details elsewhere in the codebase.
 * 
 * To change the subscription price:
 * - Update `amount` below (e.g. 599)
 * 
 * To change the recipient UPI ID:
 * - Update `upiId` below (e.g. yourbusiness@icici or yourbusiness@okhdfcbank)
 * 
 * To switch to a real payment gateway (Razorpay / Cashfree / PhonePe PG):
 * - Change `isDemoMode` to false and provide your backend checkout endpoint in `gatewayEndpoint`.
 * - Never place secret API keys in this frontend file!
 */

export const PAYMENT_CONFIG = {
  // Main Subscription Price in INR
  amount: 30,
  currency: 'INR',
  currencySymbol: '₹',
  billingPeriod: 'year',
  planName: 'Verification Assistance',

  // UPI Receiver Settings (Used for Dynamic QR & Direct UPI App Intent)
  upiId: 'paytm.s1x87m2@pty',
  payeeName: 'Verified Badge',
  transactionNote: 'Verified Badge',

  // QR Session Expiry in seconds (02:00 = 120s)
  qrExpirySeconds: 120,

  // Architecture flags
  isDemoMode: false,
  gatewayEndpoint: '/api/create-order', // Real backend API endpoint when deployed
  gatewayWebhookUrl: '/api/webhook/payment-verify',

  // Tax and billing calculation
  taxIncluded: true,
  taxRatePercent: 0, // Included in ₹1
};

export default PAYMENT_CONFIG;
