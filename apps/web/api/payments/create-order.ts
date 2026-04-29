import { getCareerPackageBySlug } from '../../src/lib/payment';

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
    const payload = (await request.json()) as CreateOrderPayload;
    const selectedPackage = getCareerPackageBySlug(payload.packageSlug ?? null);

    if (!selectedPackage) {
      return json({ message: 'Invalid package selected.' }, 400);
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
      return json({ message: 'Unable to create Razorpay order.', details: errorText }, 502);
    }

    const order = await orderResponse.json();

    return json({
      keyId,
      orderId: order.id,
      amount: selectedPackage.amount,
      currency: selectedPackage.currency,
      packageName: selectedPackage.name,
    });
  } catch (error) {
    return json(
      {
        message: error instanceof Error ? error.message : 'Unexpected error while creating order.',
      },
      500,
    );
  }
}
