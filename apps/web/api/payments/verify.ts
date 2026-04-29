import crypto from 'node:crypto';
import { getCareerPackageBySlug } from '../../src/lib/payment';

type VercelRequestLike = {
  method?: string;
  body?: unknown;
};

type VercelResponseLike = {
  status: (code: number) => VercelResponseLike;
  json: (body: unknown) => void;
};

type VerifyPayload = {
  packageSlug?: string;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
};

function getRequiredEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

function getJsonBody(body: unknown) {
  if (typeof body === 'string') {
    return JSON.parse(body) as VerifyPayload;
  }

  return (body ?? {}) as VerifyPayload;
}

async function handleVerify(payload: VerifyPayload, response: VercelResponseLike) {
  const selectedPackage = getCareerPackageBySlug(payload.packageSlug ?? null);

  if (!selectedPackage || !payload.razorpay_order_id || !payload.razorpay_payment_id || !payload.razorpay_signature) {
    response.status(400).json({ message: 'Missing payment verification details.' });
    return;
  }

  const generatedSignature = crypto
    .createHmac('sha256', getRequiredEnv('RAZORPAY_KEY_SECRET'))
    .update(`${payload.razorpay_order_id}|${payload.razorpay_payment_id}`)
    .digest('hex');

  if (generatedSignature !== payload.razorpay_signature) {
    response.status(400).json({ success: false, message: 'Payment signature verification failed.' });
    return;
  }

  response.status(200).json({
    success: true,
    message: 'Payment verified successfully.',
    packageName: selectedPackage.name,
    amount: selectedPackage.amount,
    paymentId: payload.razorpay_payment_id,
    orderId: payload.razorpay_order_id,
  })
}

export default async function handler(request: VercelRequestLike, response: VercelResponseLike) {
  try {
    if (request.method !== 'POST') {
      response.status(405).json({ message: 'Method not allowed.' });
      return;
    }

    await handleVerify(getJsonBody(request.body), response);
  } catch (error) {
    response.status(500).json({
      message: error instanceof Error ? error.message : 'Unexpected verification error.',
    });
  }
}
