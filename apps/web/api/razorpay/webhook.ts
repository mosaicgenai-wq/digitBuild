import crypto from 'node:crypto';

function json(data: unknown, status = 200) {
  return Response.json(data, { status });
}

function getRequiredEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

export async function POST(request: Request) {
  try {
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
  } catch (error) {
    return json(
      {
        message: error instanceof Error ? error.message : 'Unexpected webhook error.',
      },
      500,
    );
  }
}
