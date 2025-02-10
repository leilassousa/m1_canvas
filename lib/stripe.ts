import Stripe from 'stripe';
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe server-side instance
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'dummy_key', {
  apiVersion: '2024-12-18.acacia',
});

// Initialize Stripe client-side instance
const getStripe = async () => {
  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  return stripePromise;
};

// Helper function to ensure stripe is available
export function getStripeInstance() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not configured');
  }
  return stripe;
}

// Price IDs for different subscription tiers
export const SUBSCRIPTION_TIERS = {
  BASIC: {
    priceId: 'price_1QeGYdGuZVl044CeDa2t5F9M',
    name: 'Basic Plan',
    features: [
      '1 Canvas report and AI assessment',
      '1 year unlimited access to updates and new features',
      'PDF export',
    ],
  },
  PRO: {
    priceId: 'price_1QeJWhGuZVl044CeipeAAySN',
    name: 'Pro Plan',
    features: [
      'Multi-entity support',
      'Advanced AI insights and Analytics',
      'PDF export & sharing',
      'Priority support',
      '1 year unlimited access to updates and new features',
      'PDF export',
    ],
  },
} as const;

// Helper to format price for display
export const formatPrice = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(amount / 100);
};

// Beta codes for direct access (in production, these should be in a database or env vars)
export const BETA_CODES = ['TRAILBLAZERS', 'EARLYACCESS', 'FOUNDER'];

export function isBetaCode(code: string): boolean {
  return BETA_CODES.includes(code.toUpperCase());
}

export { getStripe }; 