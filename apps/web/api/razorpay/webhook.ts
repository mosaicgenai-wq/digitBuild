import crypto from 'node:crypto';

type VercelRequestLike = {
  method?: string;
  body?: unknown;
  headers?: Record<string, string | string[] | undefined>;
};

type VercelResponseLike = {
  status: (code: number) => VercelResponseLike;
  json: (body: unknown) => void;
};

function getRequiredEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

function getHeader(headers: VercelRequestLike['headers'], name: string) {
  const value = headers?.[name] ?? headers?.[name.toLowerCase()];
  return Array.isArray(value) ? value[0] : value;
}

function getRawBody(body: unknown) {
  if (typeof body === 'string') return body;
  return JSON.stringify(body ?? {});
}

async function handleWebhook(request: VercelRequestLike, response: VercelResponseLike) {
  const rawBody = getRawBody(request.body);
  const signature = getHeader(request.headers, 'x-razorpay-signature');

  if (!signature) {
    response.status(400).json({ message: 'Missing Razorpay signature header.' });
    return;
  }

  const expectedSignature = crypto
    .createHmac('sha256', getRequiredEnv('RAZORPAY_WEBHOOK_SECRET'))
    .update(rawBody)
    .digest('hex');

  if (expectedSignature !== signature) {
    response.status(400).json({ success: false, message: 'Invalid webhook signature.' });
    return;
  }

  response.status(200).json({ success: true });
}

export default async function handler(request: VercelRequestLike, response: VercelResponseLike) {
  try {
    if (request.method !== 'POST') {
      response.status(405).json({ message: 'Method not allowed.' });
      return;
    }

    await handleWebhook(request, response);
  } catch (error) {
    response.status(500).json({
      message: error instanceof Error ? error.message : 'Unexpected webhook error.',
    });
  }
}
