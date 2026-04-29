import { getCareerPackageBySlug } from '../../src/lib/payment.js';

type VercelRequestLike = {
  method?: string;
  body?: unknown;
};

type VercelResponseLike = {
  status: (code: number) => VercelResponseLike;
  json: (body: unknown) => void;
};

type CreateOrderPayload = {
  packageSlug?: string;
  customer?: {
    name?: string;
    email?: string;
    phone?: string;
    jobRole?: string;
    experience?: string;
  };
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
    return JSON.parse(body) as CreateOrderPayload;
  }

  return (body ?? {}) as CreateOrderPayload;
}

async function handleCreateOrder(payload: CreateOrderPayload, response: VercelResponseLike) {
  const selectedPackage = getCareerPackageBySlug(payload.packageSlug ?? null);

  if (!selectedPackage) {
    response.status(400).json({ message: 'Invalid package selected.' });
    return;
  }

  const keyId = getRequiredEnv('RAZORPAY_KEY_ID');
  const keySecret = getRequiredEnv('RAZORPAY_KEY_SECRET');
  const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
  const receipt = `digitbuild_${selectedPackage.slug}_${Date.now()}`;

  const orderResponse = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: selectedPackage.amount,
      currency: selectedPackage.currency,
      receipt,
      notes: {
        packageSlug: selectedPackage.slug,
        packageName: selectedPackage.name,
        customerName: payload.customer?.name ?? '',
        customerEmail: payload.customer?.email ?? '',
        customerPhone: payload.customer?.phone ?? '',
        jobRole: payload.customer?.jobRole ?? '',
        experience: payload.customer?.experience ?? '',
      },
    }),
  });

  if (!orderResponse.ok) {
    const errorText = await orderResponse.text();
    response.status(502).json({ message: 'Unable to create Razorpay order.', details: errorText });
    return;
  }

  const order = await orderResponse.json();

  response.status(200).json({
    keyId,
    orderId: order.id,
    amount: selectedPackage.amount,
    currency: selectedPackage.currency,
    packageName: selectedPackage.name,
  })
}

export default async function handler(request: VercelRequestLike, response: VercelResponseLike) {
  try {
    if (request.method !== 'POST') {
      response.status(405).json({ message: 'Method not allowed.' });
      return;
    }

    await handleCreateOrder(getJsonBody(request.body), response);
  } catch (error) {
    response.status(500).json({
      message: error instanceof Error ? error.message : 'Unexpected error while creating order.',
    });
  }
}
