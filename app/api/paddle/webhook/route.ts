import { NextRequest, NextResponse } from 'next/server';
import * as crypto from 'crypto';

// Force dynamic to allow reading request body
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // 1. Read raw body and signature
    const signature = req.headers.get('paddle-signature');
    const rawBody = await req.text();
    const secret = process.env.PADDLE_WEBHOOK_SECRET;

    if (!secret) {
      console.error('❌ PADDLE_WEBHOOK_SECRET is missing in environment variables');
      // Do NOT break the build, just return error
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
    }

    if (!signature) {
      console.error('❌ Missing Paddle signature header');
      return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
    }

    // 2. Verify Signature (HMAC SHA256)
    // Paddle signature format: ts=1234567890;h1=hash
    const parts = signature.split(';');
    const tsPart = parts.find((p) => p.startsWith('ts='));
    const h1Part = parts.find((p) => p.startsWith('h1='));

    if (!tsPart || !h1Part) {
      console.error('❌ Invalid Paddle signature format');
      return NextResponse.json({ error: 'Invalid signature format' }, { status: 401 });
    }

    const ts = tsPart.split('=')[1];
    const h1 = h1Part.split('=')[1];
    const payload = `${ts}:${rawBody}`;

    const calculatedHash = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    if (calculatedHash !== h1) {
      console.error('❌ Paddle signature verification failed');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    console.log('✅ Paddle signature verified');

    // 3. Parse Event
    const event = JSON.parse(rawBody);
    const eventType = event.event_type; 
    
    console.log(`🔔 Paddle Event Received: ${eventType}`);

    // 4. Log Events Only (No DB updates yet)
    switch (eventType) {
      case 'transaction.completed':
        console.log('📝 Event: transaction.completed', JSON.stringify(event.data, null, 2));
        break;

      case 'subscription.created':
        console.log('📝 Event: subscription.created', JSON.stringify(event.data, null, 2));
        break;

      case 'subscription.updated':
        console.log('📝 Event: subscription.updated', JSON.stringify(event.data, null, 2));
        break;

      case 'subscription.canceled':
        console.log('📝 Event: subscription.canceled', JSON.stringify(event.data, null, 2));
        break;
        
      case 'transaction.payment_failed':
        console.warn('⚠️ Event: transaction.payment_failed', JSON.stringify(event.data, null, 2));
        break;

      default:
        console.log(`ℹ️ Unhandled event type: ${eventType}`);
    }

    // 5. Return success
    return NextResponse.json({ received: true });

  } catch (error: any) {
    console.error('❌ Webhook Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
