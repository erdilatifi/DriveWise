
const PADDLE_API_URL = process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT === 'production' 
  ? 'https://api.paddle.com' 
  : 'https://sandbox-api.paddle.com';

const PADDLE_API_KEY = process.env.PADDLE_API_KEY;

export interface PaddleSubscription {
  id: string;
  status: 'active' | 'paused' | 'canceled' | 'past_due' | 'trialing';
  customer_id: string;
  address_id: string;
  business_id: string | null;
  currency_code: string;
  created_at: string;
  updated_at: string;
  started_at: string | null;
  first_billed_at: string | null;
  next_billed_at: string | null;
  paused_at: string | null;
  canceled_at: string | null;
  discount: any | null;
  collection_mode: 'automatic' | 'manual';
  billing_cycle: {
    interval: 'day' | 'week' | 'month' | 'year';
    frequency: number;
  };
  current_billing_period: {
    starts_at: string;
    ends_at: string;
  } | null;
  billing_details: any | null;
  scheduled_change: any | null;
  management_urls: {
    update_payment_method: string | null;
    cancel: string | null;
  } | null;
  items: Array<{
    price: {
      id: string;
      product_id: string;
      description: string;
      unit_price: {
        amount: string;
        currency_code: string;
      };
    };
    quantity: number;
    recurring: boolean;
    created_at: string;
    updated_at: string;
    previously_billed_at: string | null;
    next_billed_at: string | null;
    trial_dates: any | null;
  }>;
  custom_data?: Record<string, any> | null;
}

export async function getPaddleSubscription(subscriptionId: string): Promise<PaddleSubscription | null> {
  if (!PADDLE_API_KEY) {
    console.error('❌ PADDLE_API_KEY is missing');
    return null;
  }

  try {
    const response = await fetch(`${PADDLE_API_URL}/subscriptions/${subscriptionId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${PADDLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 60 }, // Cache for 60 seconds
    });

    if (!response.ok) {
      console.error(`❌ Failed to fetch subscription ${subscriptionId}: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.error('Error details:', errorText);
      return null;
    }

    const data = await response.json();
    return data.data as PaddleSubscription;
  } catch (error) {
    console.error('❌ Error fetching Paddle subscription:', error);
    return null;
  }
}

// Optional: Cancel subscription immediately (not requested as primary, but good to have)
// However, the requirement is "cancel at period end", which is done via PATCH with scheduled_change usually or effective_from
export async function cancelPaddleSubscription(subscriptionId: string, effectiveFrom: 'next_billing_period' | 'immediately' = 'next_billing_period') {
  if (!PADDLE_API_KEY) return { error: 'Configuration error' };

  try {
    const response = await fetch(`${PADDLE_API_URL}/subscriptions/${subscriptionId}/cancel`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PADDLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        effective_from: effectiveFrom,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { error: errorData.error?.detail || 'Failed to cancel subscription' };
    }

    const data = await response.json();
    return { success: true, data: data.data };
  } catch (error) {
    return { error: 'Network error during cancellation' };
  }
}
