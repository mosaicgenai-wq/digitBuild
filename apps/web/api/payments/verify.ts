import crypto from 'node:crypto';
import { getCareerPackageBySlug } from '../../src/lib/payment';

type VerifyPayload = {
  packageSlug?: string;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
};

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

async function handleVerify(request: Request) {
  const payload = (await request.json()) as VerifyPayload;
  const selectedPackage = getCareerPackageBySlug(payload.packageSlug ?? null);

  if (!selectedPackage || !payload.razorpay_order_id || !payload.razorpay_payment_id || !payload.razorpay_signature) {
    return json({ message: 'Missing payment verification details.' }, 400);
  }

  const generatedSignature = crypto
    .createHmac('sha256', getRequiredEnv('RAZORPAY_KEY_SECRET'))
    .update(`${payload.razorpay_order_id}|${payload.razorpay_payment_id}`)
    .digest('hex');

  if (generatedSignature !== payload.razorpay_signature) {
    return json({ success: false, message: 'Payment signature verification failed.' }, 400);
  }

  return json({
    success: true,
    message: 'Payment verified successfully.',
    packageName: selectedPackage.name,
    amount: selectedPackage.amount,
    paymentId: payload.razorpay_payment_id,
    orderId: payload.razorpay_order_id,
  });
}

export default {
  async fetch(request: Request) {
    try {
      if (request.method !== 'POST') {
        return json({ message: 'Method not allowed.' }, 405);
      }

      return await handleVerify(request);
    } catch (error) {
      return json(
        {
          message: error instanceof Error ? error.message : 'Unexpected verification error.',
        },
        500,
      );
    }
  },
}
