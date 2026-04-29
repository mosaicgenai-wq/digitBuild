import crypto from 'node:crypto';

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

function getRequiredEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

async function handleWebhook(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get('x-razorpay-signature');

  if (!signature) {
    return json({ message: 'Missing Razorpay signature header.' }, 400);
  }

  const expectedSignature = crypto
    .createHmac('sha256', getRequiredEnv('RAZORPAY_WEBHOOK_SECRET'))
    .update(rawBody)
    .digest('hex');

  if (expectedSignature !== signature) {
    return json({ success: false, message: 'Invalid webhook signature.' }, 400);
  }

  return json({ success: true });
}

export default {
  async fetch(request: Request) {
    try {
      if (request.method !== 'POST') {
        return json({ message: 'Method not allowed.' }, 405);
      }

      return await handleWebhook(request);
    } catch (error) {
      return json(
        {
          message: error instanceof Error ? error.message : 'Unexpected webhook error.',
        },
        500,
      );
    }
  },
}
