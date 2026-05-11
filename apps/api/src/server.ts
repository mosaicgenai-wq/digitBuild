import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';
import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = Number(process.env.PORT ?? 3000);
const isProduction = process.env.NODE_ENV === 'production';

// Initialize Sanity Client
const sanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: process.env.SANITY_API_VERSION || '2025-01-01',
  token: process.env.SANITY_TOKEN,
  useCdn: false, // Set to false to ensure we always get fresh data and can write
});

const contactSchema = z.object({
  name: z.string().trim().min(1),
  email: z.string().trim().email(),
  phone: z.string().trim().optional().default(''),
  subject: z.string().trim().min(1),
  message: z.string().trim().min(1),
});

const loginSchema = z.object({
  username: z.string().trim().min(1),
  password: z.string().trim().min(1),
});

const registerSchema = z.object({
  username: z.string().trim().min(1),
  password: z.string().trim().min(1),
  name: z.string().trim().min(1),
  email: z.string().trim().email(),
  phone: z.string().trim().min(1),
  countryCode: z.string().trim().min(1),
});

const courseSchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(1),
  icon: z.string().trim().min(1),
  cat: z.string().trim().min(1),
  duration: z.string().trim().min(1),
  highlights: z.array(z.string()),
  timeline: z.string().trim().min(1),
  curriculum: z.array(z.string()),
  learn: z.array(z.string()),
  outcomes: z.array(z.string()),
  isVisible: z.boolean().optional().default(true),
});

const blogSectionSchema = z.object({
  heading: z.string().trim().min(1),
  paragraphs: z.array(z.string().trim().min(1)).min(1),
});

const blogPostSchema = z.object({
  title: z.string().trim().min(1),
  cat: z.string().trim().min(1),
  date: z.string().trim().min(1),
  excerpt: z.string().trim().min(1),
  intro: z.string().trim().min(1),
  sections: z.array(blogSectionSchema).min(1),
  isVisible: z.boolean().optional().default(true),
});

const qaEntrySchema = z.object({
  question: z.string().trim().min(1),
  answer: z.string().trim().min(1),
  experienceRange: z.enum(['0-2yr', '3-5yr', '6-8yr', '8+yr']),
  isVisible: z.boolean().optional().default(true),
});

const careerOpeningSchema = z.object({
  title: z.string().trim().min(1),
  type: z.string().trim().min(1),
  location: z.string().trim().min(1),
  mode: z.string().trim().min(1),
  team: z.string().trim().min(1),
  summary: z.string().trim().min(1),
  overview: z.string().trim().min(1),
  responsibilities: z.array(z.string().trim().min(1)).min(1),
  requirements: z.array(z.string().trim().min(1)).min(1),
  perks: z.array(z.string().trim().min(1)),
  applyNote: z.string().trim().min(1),
  isVisible: z.boolean().optional().default(true),
});

const placementPackageSchema = z.object({
  slug: z.string().trim().min(1),
  name: z.string().trim().min(1),
  experience: z.string().trim().min(1),
  price: z.string().trim().min(1),
  amount: z.number().int().positive(),
  currency: z.literal('INR'),
  features: z.array(z.string().trim().min(1)).min(1),
  isVisible: z.boolean().optional().default(true),
});
const testimonialSchema = z.object({
  name: z.string().trim().min(1),
  role: z.string().trim().min(1),
  company: z.string().trim().min(1),
  hike: z.string().trim().min(1),
  quote: z.string().trim().min(1),
  isVisible: z.boolean().optional().default(true),
});
const homeStatSchema = z.object({
  label: z.string().trim().min(1),
  value: z.number().int().nonnegative(),
  suffix: z.string().trim().min(0).max(4).default(''),
  order: z.number().int().nonnegative().optional().default(0),
  isVisible: z.boolean().optional().default(true),
});

const careerPackages = [
  {
    slug: 'fresher-launch',
    name: 'Fresher Launch',
    amount: 199900,
    currency: 'INR',
  },
  {
    slug: 'mid-level-pro',
    name: 'Mid-Level Pro',
    amount: 349900,
    currency: 'INR',
  },
  {
    slug: 'senior-expert',
    name: 'Senior Expert',
    amount: 499900,
    currency: 'INR',
  },
  {
    slug: 'executive-elite',
    name: 'Executive Elite',
    amount: 799900,
    currency: 'INR',
  },
  {
    slug: 'remote-job-placement',
    name: 'Remote Job Placement',
    amount: 999900,
    currency: 'INR',
  },
] as const;

const createOrderSchema = z.object({
  packageSlug: z.string().trim().min(1),
  customer: z.object({
    name: z.string().trim().min(1).max(120),
    email: z.string().trim().email().max(160),
    phone: z.string().trim().min(1).max(30),
    jobRole: z.string().trim().min(1).max(120),
    experience: z.string().trim().min(1).max(80),
  }),
});

const verifyPaymentSchema = z.object({
  packageSlug: z.string().trim().min(1),
  razorpay_order_id: z.string().trim().min(1),
  razorpay_payment_id: z.string().trim().min(1),
  razorpay_signature: z.string().trim().min(1),
});

const paymentOrderSchema = z.object({
  orderId: z.string().trim().min(1),
});

const paymentFailureSchema = paymentOrderSchema.extend({
  paymentId: z.string().trim().optional(),
  code: z.string().trim().optional(),
  description: z.string().trim().optional(),
  reason: z.string().trim().optional(),
  source: z.string().trim().optional(),
  step: z.string().trim().optional(),
});
const notificationReadSchema = z.object({
  read: z.boolean(),
});

async function getCareerPackageBySlug(slug: string): Promise<{
  slug: string;
  name: string;
  amount: number;
  currency: 'INR';
} | null> {
  const sanityPackage = await sanityClient.fetch(
    `*[_type == "placementPackage" && slug == $slug][0]{
      slug,
      name,
      amount,
      currency
    }`,
    { slug }
  );

  if (sanityPackage) {
    return {
      slug: String(sanityPackage.slug),
      name: String(sanityPackage.name),
      amount: Number(sanityPackage.amount),
      currency: sanityPackage.currency === 'INR' ? 'INR' : 'INR',
    };
  }

  return careerPackages.find((pkg) => pkg.slug === slug) ?? null;
}

function getRequiredEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

function signaturesMatch(actualSignature: string, expectedSignature: string) {
  const actual = Buffer.from(actualSignature, 'hex');
  const expected = Buffer.from(expectedSignature, 'hex');

  return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
}

type AdminNotification = {
  _type: 'adminNotification';
  title: string;
  message: string;
  eventType: 'purchase_initiated' | 'payment_success' | 'payment_failed' | 'payment_cancelled' | 'payment_refunded';
  packageSlug: string;
  packageName: string;
  amount?: number;
  currency?: 'INR';
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  jobRole: string;
  experience: string;
  orderId?: string;
  paymentId?: string;
  isRead: boolean;
  createdAt: string;
};

type PaymentStatus = 'pending' | 'paid' | 'failed' | 'cancelled' | 'refunded';

type PaymentLog = {
  _id: string;
  _type: 'paymentLog';
  orderId: string;
  paymentId?: string;
  status: PaymentStatus;
  packageSlug: string;
  packageName: string;
  amount: number;
  currency: 'INR';
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  jobRole: string;
  experience: string;
  createdAt: string;
  updatedAt: string;
  paidAt?: string;
  failedAt?: string;
  cancelledAt?: string;
  refundedAt?: string;
  failureCode?: string;
  failureDescription?: string;
  failureReason?: string;
  failureSource?: string;
  failureStep?: string;
};

async function createAdminNotification(payload: AdminNotification) {
  try {
    await sanityClient.create(payload);
  } catch (error) {
    console.error('Failed to create admin notification:', error);
  }
}

function getPaymentLogId(orderId: string) {
  return `paymentLog-${orderId.replace(/[^a-zA-Z0-9_-]/g, '-')}`;
}

async function getPaymentLogByOrderId(orderId: string) {
  return await sanityClient.fetch<PaymentLog | null>(
    `*[_type == "paymentLog" && orderId == $orderId][0]`,
    { orderId },
  );
}

async function upsertPaymentLog(payload: Omit<PaymentLog, '_id' | '_type'>) {
  const now = new Date().toISOString();
  const existing = await getPaymentLogByOrderId(payload.orderId);

  if (existing) {
    return await sanityClient
      .patch(existing._id)
      .set({
        ...payload,
        updatedAt: now,
      })
      .commit();
  }

  return await sanityClient.create({
    _id: getPaymentLogId(payload.orderId),
    _type: 'paymentLog',
    ...payload,
    updatedAt: payload.updatedAt || now,
  });
}

async function updatePaymentLogStatus(
  orderId: string,
  status: PaymentStatus,
  updates: Partial<PaymentLog> = {},
) {
  const existing = await getPaymentLogByOrderId(orderId);
  if (!existing) return null;

  if ((existing.status === 'paid' || existing.status === 'refunded' || existing.status === 'failed') && status === 'cancelled') {
    return existing;
  }

  return await sanityClient
    .patch(existing._id)
    .set({
      ...updates,
      status,
      updatedAt: new Date().toISOString(),
    })
    .commit();
}

function getDisplayStatus(status: PaymentStatus, createdAt?: string) {
  if (status !== 'pending') return status;

  const createdTime = new Date(createdAt || '').getTime();
  if (Number.isNaN(createdTime)) return status;

  const twentyFourHours = 24 * 60 * 60 * 1000;
  return Date.now() - createdTime > twentyFourHours ? 'expired' : status;
}

function formatInvoiceAmount(amount: number) {
  return `INR ${Math.round(amount / 100).toLocaleString('en-IN')}`;
}

function formatInvoiceDate(value?: string) {
  if (!value) return 'Not available';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Not available';

  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function escapePdfText(value: string) {
  return value.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

function createInvoicePdf(payment: PaymentLog) {
  const invoiceNumber = `DB-${payment.orderId}`;
  const status = getDisplayStatus(payment.status, payment.createdAt).toUpperCase();
  const lines = [
    'DigitBuild',
    'Payment Invoice',
    '',
    `Invoice No: ${invoiceNumber}`,
    `Status: ${status}`,
    `Issued: ${formatInvoiceDate(payment.updatedAt || payment.createdAt)}`,
    '',
    'Customer',
    `Name: ${payment.customerName}`,
    `Email: ${payment.customerEmail}`,
    `Phone: ${payment.customerPhone}`,
    '',
    'Package',
    `Package: ${payment.packageName}`,
    `Job Role: ${payment.jobRole}`,
    `Experience: ${payment.experience}`,
    '',
    'Payment',
    `Amount: ${formatInvoiceAmount(payment.amount)}`,
    `Order ID: ${payment.orderId}`,
    `Payment ID: ${payment.paymentId || 'Not available'}`,
    `Paid At: ${formatInvoiceDate(payment.paidAt)}`,
    '',
    'This computer-generated invoice confirms the payment status recorded by DigitBuild.',
  ];

  const content = [
    'BT',
    '/F1 22 Tf',
    '72 760 Td',
    `(${escapePdfText(lines[0])}) Tj`,
    '/F1 14 Tf',
    '0 -30 Td',
    `(${escapePdfText(lines[1])}) Tj`,
    '/F1 10 Tf',
    ...lines.slice(2).map((line) => `0 -18 Td (${escapePdfText(line)}) Tj`),
    'ET',
  ].join('\n');

  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    `<< /Length ${Buffer.byteLength(content, 'utf8')} >>\nstream\n${content}\nendstream`,
  ];

  let pdf = '%PDF-1.4\n';
  const offsets = [0];

  objects.forEach((object, index) => {
    offsets.push(Buffer.byteLength(pdf, 'utf8'));
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefOffset = Buffer.byteLength(pdf, 'utf8');
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += '0000000000 65535 f \n';
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, '0')} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return Buffer.from(pdf, 'utf8');
}

function toPublicReceipt(payment: PaymentLog) {
  return {
    invoiceNumber: `DB-${payment.orderId}`,
    orderId: payment.orderId,
    paymentId: payment.paymentId,
    status: getDisplayStatus(payment.status, payment.createdAt),
    packageName: payment.packageName,
    amount: payment.amount,
    currency: payment.currency,
    customerName: payment.customerName,
    customerEmail: payment.customerEmail,
    customerPhone: payment.customerPhone,
    jobRole: payment.jobRole,
    experience: payment.experience,
    createdAt: payment.createdAt,
    updatedAt: payment.updatedAt,
    paidAt: payment.paidAt,
    failedAt: payment.failedAt,
    cancelledAt: payment.cancelledAt,
    failureDescription: payment.failureDescription,
  };
}

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
  origin: process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
    : true,
  credentials: true,
}));
app.use(compression());

app.post('/api/razorpay/webhook', express.raw({ type: 'application/json' }), async (request, response) => {
  try {
    const webhookSecret = getRequiredEnv('RAZORPAY_WEBHOOK_SECRET');
    const signature = request.header('x-razorpay-signature');

    if (!signature) {
      return response.status(400).json({ message: 'Missing Razorpay signature header.' });
    }

    const rawBody = Buffer.isBuffer(request.body) ? request.body : Buffer.from(JSON.stringify(request.body ?? {}));
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');

    if (!signaturesMatch(signature, expectedSignature)) {
      return response.status(400).json({ success: false, message: 'Invalid webhook signature.' });
    }

    const payload = JSON.parse(rawBody.toString('utf8')) as {
      event?: string;
      payload?: {
        payment?: {
          entity?: {
            id?: string;
            order_id?: string;
            error_code?: string;
            error_description?: string;
            error_reason?: string;
            error_source?: string;
            error_step?: string;
          };
        };
        refund?: {
          entity?: {
            payment_id?: string;
          };
        };
      };
    };

    const payment = payload.payload?.payment?.entity;
    const orderId = payment?.order_id;

    if (payload.event === 'payment.captured' && orderId) {
      await updatePaymentLogStatus(orderId, 'paid', {
        paymentId: payment.id,
        paidAt: new Date().toISOString(),
      });
    }

    if (payload.event === 'payment.failed' && orderId) {
      await updatePaymentLogStatus(orderId, 'failed', {
        paymentId: payment.id,
        failedAt: new Date().toISOString(),
        failureCode: payment.error_code,
        failureDescription: payment.error_description,
        failureReason: payment.error_reason,
        failureSource: payment.error_source,
        failureStep: payment.error_step,
      });
    }

    response.status(200).json({ success: true });
  } catch (error) {
    console.error('Razorpay webhook error:', error);
    response.status(500).json({
      message: error instanceof Error ? error.message : 'Unexpected webhook error.',
    });
  }
});

app.use(express.json());

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok', storage: 'sanity' });
});

app.post('/api/contact', (request, response) => {
  const parsed = contactSchema.safeParse(request.body);

  if (!parsed.success) {
    return response.status(400).json({
      message: 'Invalid contact payload.',
      errors: parsed.error.flatten(),
    });
  }

  return response.status(200).json({
    success: true,
    message: 'Message received.',
  });
});

app.post('/api/login', async (request, response) => {
  const parsed = loginSchema.safeParse(request.body);

  if (!parsed.success) {
    return response.status(400).json({
      message: 'Username and password are required.',
    });
  }

  const { username, password } = parsed.data;

  try {
    const user = await sanityClient.fetch(
      `*[_type == "user" && username == $username && password == $password][0]`,
      { username, password }
    );

    if (user) {
      const role = user.role || (user.username === 'admin' ? 'admin' : 'user');

      return response.status(200).json({
        success: true,
        message: 'Login successful.',
        username: user.username,
        role,
      });
    }

    return response.status(401).json({
      success: false,
      message: 'Invalid username or password.',
    });
  } catch (error) {
    console.error('Login error:', error);
    return response.status(500).json({
      message: 'Internal server error.',
    });
  }
});

app.post('/api/register', async (request, response) => {
  const parsed = registerSchema.safeParse(request.body);

  if (!parsed.success) {
    return response.status(400).json({
      message: 'Invalid registration details.',
      errors: parsed.error.flatten(),
    });
  }

  const newUser = parsed.data;

  try {
    // Check if user exists
    const existing = await sanityClient.fetch(
      `*[_type == "user" && username == $username][0]`,
      { username: newUser.username }
    );

    if (existing) {
      return response.status(409).json({
        message: 'Username already exists.',
      });
    }

    // Create user in Sanity
    await sanityClient.create({
      _type: 'user',
      ...newUser,
    });

    return response.status(201).json({
      success: true,
      message: 'Registration successful.',
    });
  } catch (error) {
    console.error('Registration error:', error);
    return response.status(500).json({
      message: 'Internal server error.',
    });
  }
});

app.get('/api/courses', async (_request, response) => {
  try {
    const courses = await sanityClient.fetch(`*[_type == "course"] | order(_createdAt desc)`);
    response.json(courses);
  } catch (error) {
    response.status(500).json({ message: 'Failed to fetch courses.' });
  }
});

app.post('/api/courses', async (request, response) => {
  const parsed = courseSchema.safeParse(request.body);
  if (!parsed.success) return response.status(400).json({ message: 'Invalid course data.' });

  try {
    const newCourse = await sanityClient.create({
      _type: 'course',
      ...parsed.data,
    });
    response.status(201).json(newCourse);
  } catch (error) {
    response.status(500).json({ message: 'Failed to add course.' });
  }
});

app.put('/api/courses/:id', async (request, response) => {
  const parsed = courseSchema.safeParse(request.body);
  if (!parsed.success) return response.status(400).json({ message: 'Invalid course data.' });

  try {
    const updated = await sanityClient
      .patch(request.params.id)
      .set(parsed.data)
      .commit();
    response.json(updated);
  } catch (error) {
    response.status(500).json({ message: 'Failed to update course.' });
  }
});

app.delete('/api/courses/:id', async (request, response) => {
  try {
    await sanityClient.delete(request.params.id);
    response.json({ message: 'Course deleted.' });
  } catch (error) {
    response.status(500).json({ message: 'Failed to delete course.' });
  }
});

app.post('/api/blog-posts', async (request, response) => {
  const parsed = blogPostSchema.safeParse(request.body);
  if (!parsed.success) return response.status(400).json({ message: 'Invalid blog post data.' });

  try {
    const newPost = await sanityClient.create({
      _type: 'blogPost',
      ...parsed.data,
    });
    response.status(201).json(newPost);
  } catch (error) {
    response.status(500).json({ message: 'Failed to add blog post.' });
  }
});

app.put('/api/blog-posts/:id', async (request, response) => {
  const parsed = blogPostSchema.safeParse(request.body);
  if (!parsed.success) return response.status(400).json({ message: 'Invalid blog post data.' });

  try {
    const updated = await sanityClient.patch(request.params.id).set(parsed.data).commit();
    response.json(updated);
  } catch (error) {
    response.status(500).json({ message: 'Failed to update blog post.' });
  }
});

app.delete('/api/blog-posts/:id', async (request, response) => {
  try {
    await sanityClient.delete(request.params.id);
    response.json({ message: 'Blog post deleted.' });
  } catch (error) {
    response.status(500).json({ message: 'Failed to delete blog post.' });
  }
});

app.post('/api/qa-entries', async (request, response) => {
  const parsed = qaEntrySchema.safeParse(request.body);
  if (!parsed.success) return response.status(400).json({ message: 'Invalid Q&A data.' });

  try {
    const created = await sanityClient.create({
      _type: 'qaEntry',
      ...parsed.data,
    });
    response.status(201).json(created);
  } catch (error) {
    response.status(500).json({ message: 'Failed to add Q&A entry.' });
  }
});

app.put('/api/qa-entries/:id', async (request, response) => {
  const parsed = qaEntrySchema.safeParse(request.body);
  if (!parsed.success) return response.status(400).json({ message: 'Invalid Q&A data.' });

  try {
    const updated = await sanityClient.patch(request.params.id).set(parsed.data).commit();
    response.json(updated);
  } catch (error) {
    response.status(500).json({ message: 'Failed to update Q&A entry.' });
  }
});

app.delete('/api/qa-entries/:id', async (request, response) => {
  try {
    await sanityClient.delete(request.params.id);
    response.json({ message: 'Q&A entry deleted.' });
  } catch (error) {
    response.status(500).json({ message: 'Failed to delete Q&A entry.' });
  }
});

app.post('/api/placement-packages', async (request, response) => {
  const parsed = placementPackageSchema.safeParse(request.body);
  if (!parsed.success) return response.status(400).json({ message: 'Invalid placement package data.' });

  try {
    const existing = await sanityClient.fetch(`*[_type == "placementPackage" && slug == $slug][0]`, { slug: parsed.data.slug });
    if (existing) {
      return response.status(409).json({ message: 'Package slug already exists.' });
    }

    const created = await sanityClient.create({
      _type: 'placementPackage',
      ...parsed.data,
    });
    response.status(201).json(created);
  } catch (error) {
    response.status(500).json({ message: 'Failed to add placement package.' });
  }
});

app.put('/api/placement-packages/:id', async (request, response) => {
  const parsed = placementPackageSchema.safeParse(request.body);
  if (!parsed.success) return response.status(400).json({ message: 'Invalid placement package data.' });

  try {
    const updated = await sanityClient.patch(request.params.id).set(parsed.data).commit();
    response.json(updated);
  } catch (error) {
    response.status(500).json({ message: 'Failed to update placement package.' });
  }
});

app.delete('/api/placement-packages/:id', async (request, response) => {
  try {
    await sanityClient.delete(request.params.id);
    response.json({ message: 'Placement package deleted.' });
  } catch (error) {
    response.status(500).json({ message: 'Failed to delete placement package.' });
  }
});

app.post('/api/testimonials', async (request, response) => {
  const parsed = testimonialSchema.safeParse(request.body);
  if (!parsed.success) return response.status(400).json({ message: 'Invalid testimonial data.' });

  try {
    const created = await sanityClient.create({
      _type: 'testimonial',
      ...parsed.data,
    });
    response.status(201).json(created);
  } catch (error) {
    response.status(500).json({ message: 'Failed to add testimonial.' });
  }
});

app.put('/api/testimonials/:id', async (request, response) => {
  const parsed = testimonialSchema.safeParse(request.body);
  if (!parsed.success) return response.status(400).json({ message: 'Invalid testimonial data.' });

  try {
    const updated = await sanityClient.patch(request.params.id).set(parsed.data).commit();
    response.json(updated);
  } catch (error) {
    response.status(500).json({ message: 'Failed to update testimonial.' });
  }
});

app.delete('/api/testimonials/:id', async (request, response) => {
  try {
    await sanityClient.delete(request.params.id);
    response.json({ message: 'Testimonial deleted.' });
  } catch (error) {
    response.status(500).json({ message: 'Failed to delete testimonial.' });
  }
});

app.post('/api/home-stats', async (request, response) => {
  const parsed = homeStatSchema.safeParse(request.body);
  if (!parsed.success) return response.status(400).json({ message: 'Invalid home stat data.' });

  try {
    const created = await sanityClient.create({
      _type: 'homeStat',
      ...parsed.data,
    });
    response.status(201).json(created);
  } catch (error) {
    response.status(500).json({ message: 'Failed to add home stat.' });
  }
});

app.put('/api/home-stats/:id', async (request, response) => {
  const parsed = homeStatSchema.safeParse(request.body);
  if (!parsed.success) return response.status(400).json({ message: 'Invalid home stat data.' });

  try {
    const updated = await sanityClient.patch(request.params.id).set(parsed.data).commit();
    response.json(updated);
  } catch (error) {
    response.status(500).json({ message: 'Failed to update home stat.' });
  }
});

app.delete('/api/home-stats/:id', async (request, response) => {
  try {
    await sanityClient.delete(request.params.id);
    response.json({ message: 'Home stat deleted.' });
  } catch (error) {
    response.status(500).json({ message: 'Failed to delete home stat.' });
  }
});

app.post('/api/payments/create-order', async (request, response) => {
  const parsed = createOrderSchema.safeParse(request.body);

  if (!parsed.success) {
    return response.status(400).json({
      message: 'Invalid payment details.',
      errors: parsed.error.flatten(),
    });
  }

  try {
    const selectedPackage = await getCareerPackageBySlug(parsed.data.packageSlug);

    if (!selectedPackage) {
      return response.status(400).json({ message: 'Invalid package selected.' });
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
          customerName: parsed.data.customer.name,
          customerEmail: parsed.data.customer.email,
          customerPhone: parsed.data.customer.phone,
          jobRole: parsed.data.customer.jobRole,
          experience: parsed.data.customer.experience,
        },
      }),
    });

    if (!orderResponse.ok) {
      console.error('Razorpay order creation failed:', await orderResponse.text());
      return response.status(502).json({ message: 'Unable to create Razorpay order.' });
    }

    const order = await orderResponse.json() as { id?: string };

    if (!order.id) {
      return response.status(502).json({ message: 'Razorpay did not return an order ID.' });
    }

    const createdAt = new Date().toISOString();

    await upsertPaymentLog({
      orderId: order.id,
      status: 'pending',
      packageSlug: selectedPackage.slug,
      packageName: selectedPackage.name,
      amount: selectedPackage.amount,
      currency: selectedPackage.currency,
      customerName: parsed.data.customer.name,
      customerEmail: parsed.data.customer.email,
      customerPhone: parsed.data.customer.phone,
      jobRole: parsed.data.customer.jobRole,
      experience: parsed.data.customer.experience,
      createdAt,
      updatedAt: createdAt,
    });

    await createAdminNotification({
      _type: 'adminNotification',
      title: 'New Placement Purchase Initiated',
      message: `${parsed.data.customer.name} started checkout for ${selectedPackage.name}.`,
      eventType: 'purchase_initiated',
      packageSlug: selectedPackage.slug,
      packageName: selectedPackage.name,
      amount: selectedPackage.amount,
      currency: selectedPackage.currency,
      customerName: parsed.data.customer.name,
      customerEmail: parsed.data.customer.email,
      customerPhone: parsed.data.customer.phone,
      jobRole: parsed.data.customer.jobRole,
      experience: parsed.data.customer.experience,
      orderId: order.id,
      isRead: false,
      createdAt,
    });

    return response.status(200).json({
      keyId,
      orderId: order.id,
      amount: selectedPackage.amount,
      currency: selectedPackage.currency,
      packageName: selectedPackage.name,
    });
  } catch (error) {
    console.error('Payment order error:', error);
    return response.status(500).json({
      message: error instanceof Error ? error.message : 'Unexpected error while creating order.',
    });
  }
});

app.post('/api/payments/verify', async (request, response) => {
  const parsed = verifyPaymentSchema.safeParse(request.body);

  if (!parsed.success) {
    return response.status(400).json({
      message: 'Missing payment verification details.',
      errors: parsed.error.flatten(),
    });
  }

  try {
    const selectedPackage = await getCareerPackageBySlug(parsed.data.packageSlug);

    if (!selectedPackage) {
      return response.status(400).json({ message: 'Invalid package selected.' });
    }

    const generatedSignature = crypto
      .createHmac('sha256', getRequiredEnv('RAZORPAY_KEY_SECRET'))
      .update(`${parsed.data.razorpay_order_id}|${parsed.data.razorpay_payment_id}`)
      .digest('hex');

    if (!signaturesMatch(parsed.data.razorpay_signature, generatedSignature)) {
      return response.status(400).json({
        success: false,
        message: 'Payment signature verification failed.',
      });
    }

    const orderMeta = await sanityClient.fetch<{
      notes?: {
        customerName?: string;
        customerEmail?: string;
        customerPhone?: string;
        jobRole?: string;
        experience?: string;
      };
    }>(
      `*[_type == "adminNotification" && orderId == $orderId && eventType == "purchase_initiated"] | order(_createdAt desc)[0]{
        "notes": {
          "customerName": customerName,
          "customerEmail": customerEmail,
          "customerPhone": customerPhone,
          "jobRole": jobRole,
          "experience": experience
        }
      }`,
      { orderId: parsed.data.razorpay_order_id },
    );

    const paidAt = new Date().toISOString();

    await updatePaymentLogStatus(parsed.data.razorpay_order_id, 'paid', {
      paymentId: parsed.data.razorpay_payment_id,
      paidAt,
    });

    await createAdminNotification({
      _type: 'adminNotification',
      title: 'Placement Payment Completed',
      message: `Payment received for ${selectedPackage.name}.`,
      eventType: 'payment_success',
      packageSlug: selectedPackage.slug,
      packageName: selectedPackage.name,
      amount: selectedPackage.amount,
      currency: selectedPackage.currency,
      customerName: orderMeta?.notes?.customerName || 'Unknown',
      customerEmail: orderMeta?.notes?.customerEmail || 'Unknown',
      customerPhone: orderMeta?.notes?.customerPhone || 'Unknown',
      jobRole: orderMeta?.notes?.jobRole || 'Unknown',
      experience: orderMeta?.notes?.experience || 'Unknown',
      orderId: parsed.data.razorpay_order_id,
      paymentId: parsed.data.razorpay_payment_id,
      isRead: false,
      createdAt: paidAt,
    });

    return response.status(200).json({
      success: true,
      message: 'Payment verified successfully.',
      packageName: selectedPackage.name,
      amount: selectedPackage.amount,
      paymentId: parsed.data.razorpay_payment_id,
      orderId: parsed.data.razorpay_order_id,
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    return response.status(500).json({
      message: error instanceof Error ? error.message : 'Unexpected verification error.',
    });
  }
});

app.post('/api/payments/cancel', async (request, response) => {
  const parsed = paymentOrderSchema.safeParse(request.body);

  if (!parsed.success) {
    return response.status(400).json({ message: 'Missing payment order ID.' });
  }

  try {
    const cancelledAt = new Date().toISOString();
    const updated = await updatePaymentLogStatus(parsed.data.orderId, 'cancelled', {
      cancelledAt,
    });

    if (!updated) {
      return response.status(404).json({ message: 'Payment log not found.' });
    }

    await createAdminNotification({
      _type: 'adminNotification',
      title: 'Placement Payment Cancelled',
      message: `${updated.customerName || 'A customer'} closed checkout for ${updated.packageName || 'a placement package'}.`,
      eventType: 'payment_cancelled',
      packageSlug: updated.packageSlug,
      packageName: updated.packageName,
      amount: updated.amount,
      currency: updated.currency,
      customerName: updated.customerName,
      customerEmail: updated.customerEmail,
      customerPhone: updated.customerPhone,
      jobRole: updated.jobRole,
      experience: updated.experience,
      orderId: parsed.data.orderId,
      paymentId: updated.paymentId,
      isRead: false,
      createdAt: cancelledAt,
    });

    response.status(200).json({ success: true });
  } catch (error) {
    console.error('Payment cancellation tracking error:', error);
    response.status(500).json({ message: 'Failed to track cancelled payment.' });
  }
});

app.post('/api/payments/failure', async (request, response) => {
  const parsed = paymentFailureSchema.safeParse(request.body);

  if (!parsed.success) {
    return response.status(400).json({ message: 'Invalid payment failure details.' });
  }

  try {
    const failedAt = new Date().toISOString();
    const updated = await updatePaymentLogStatus(parsed.data.orderId, 'failed', {
      paymentId: parsed.data.paymentId,
      failedAt,
      failureCode: parsed.data.code,
      failureDescription: parsed.data.description,
      failureReason: parsed.data.reason,
      failureSource: parsed.data.source,
      failureStep: parsed.data.step,
    });

    if (!updated) {
      return response.status(404).json({ message: 'Payment log not found.' });
    }

    await createAdminNotification({
      _type: 'adminNotification',
      title: 'Placement Payment Failed',
      message: `${updated.customerName || 'A customer'} had a failed payment for ${updated.packageName || 'a placement package'}.`,
      eventType: 'payment_failed',
      packageSlug: updated.packageSlug,
      packageName: updated.packageName,
      amount: updated.amount,
      currency: updated.currency,
      customerName: updated.customerName,
      customerEmail: updated.customerEmail,
      customerPhone: updated.customerPhone,
      jobRole: updated.jobRole,
      experience: updated.experience,
      orderId: parsed.data.orderId,
      paymentId: parsed.data.paymentId,
      isRead: false,
      createdAt: failedAt,
    });

    response.status(200).json({ success: true });
  } catch (error) {
    console.error('Payment failure tracking error:', error);
    response.status(500).json({ message: 'Failed to track failed payment.' });
  }
});

app.get('/api/payments/:orderId/receipt', async (request, response) => {
  try {
    const payment = await getPaymentLogByOrderId(request.params.orderId);

    if (!payment) {
      return response.status(404).json({ message: 'Receipt not found.' });
    }

    response.json(toPublicReceipt(payment));
  } catch (error) {
    console.error('Receipt fetch error:', error);
    response.status(500).json({ message: 'Failed to fetch receipt.' });
  }
});

app.get('/api/payments/:orderId/invoice.pdf', async (request, response) => {
  try {
    const payment = await getPaymentLogByOrderId(request.params.orderId);

    if (!payment) {
      return response.status(404).json({ message: 'Invoice not found.' });
    }

    const pdf = createInvoicePdf(payment);
    response.setHeader('Content-Type', 'application/pdf');
    response.setHeader('Content-Disposition', `attachment; filename="digitbuild-invoice-${payment.orderId}.pdf"`);
    response.send(pdf);
  } catch (error) {
    console.error('Invoice PDF error:', error);
    response.status(500).json({ message: 'Failed to generate invoice.' });
  }
});

app.get('/api/admin-payments', async (_request, response) => {
  try {
    const paymentLogs = await sanityClient.fetch<Array<PaymentLog & { _createdAt?: string }>>(
      `*[_type == "paymentLog"] | order(coalesce(updatedAt, createdAt, _createdAt) desc){
        _id,
        orderId,
        paymentId,
        status,
        packageSlug,
        packageName,
        amount,
        currency,
        customerName,
        customerEmail,
        customerPhone,
        jobRole,
        experience,
        createdAt,
        updatedAt,
        paidAt,
        failedAt,
        cancelledAt,
        refundedAt,
        failureCode,
        failureDescription,
        failureReason,
        failureSource,
        failureStep,
        _createdAt
      }`
    );

    const notifications = await sanityClient.fetch<Array<{
      _id: string;
      eventType: 'purchase_initiated' | 'payment_success';
      packageSlug?: string;
      packageName?: string;
      amount?: number;
      currency?: 'INR';
      customerName?: string;
      customerEmail?: string;
      customerPhone?: string;
      jobRole?: string;
      experience?: string;
      orderId?: string;
      paymentId?: string;
      createdAt?: string;
      _createdAt?: string;
    }>>(
      `*[_type == "adminNotification" && defined(orderId) && eventType in ["purchase_initiated", "payment_success"]] | order(coalesce(createdAt, _createdAt) desc){
        _id,
        eventType,
        packageSlug,
        packageName,
        amount,
        currency,
        customerName,
        customerEmail,
        customerPhone,
        jobRole,
        experience,
        orderId,
        paymentId,
        createdAt,
        _createdAt
      }`
    );

    const loggedOrderIds = new Set(paymentLogs.map((log) => log.orderId));
    const paymentsByOrder = new Map<string, {
      id: string;
      orderId: string;
      paymentId?: string;
      status: PaymentStatus | 'expired';
      packageSlug: string;
      packageName: string;
      amount: number | null;
      currency: 'INR';
      customerName: string;
      customerEmail: string;
      customerPhone: string;
      jobRole: string;
      experience: string;
      initiatedAt?: string;
      paidAt?: string;
      failedAt?: string;
      cancelledAt?: string;
      refundedAt?: string;
      updatedAt?: string;
      failureCode?: string;
      failureDescription?: string;
      failureReason?: string;
      failureSource?: string;
      failureStep?: string;
      events: Array<{
        id: string;
        type: string;
        createdAt?: string;
      }>;
    }>();

    for (const log of paymentLogs) {
      paymentsByOrder.set(log.orderId, {
        id: log.orderId,
        orderId: log.orderId,
        paymentId: log.paymentId,
        status: getDisplayStatus(log.status, log.createdAt || log._createdAt),
        packageSlug: log.packageSlug,
        packageName: log.packageName,
        amount: log.amount,
        currency: log.currency,
        customerName: log.customerName,
        customerEmail: log.customerEmail,
        customerPhone: log.customerPhone,
        jobRole: log.jobRole,
        experience: log.experience,
        initiatedAt: log.createdAt || log._createdAt,
        paidAt: log.paidAt,
        failedAt: log.failedAt,
        cancelledAt: log.cancelledAt,
        refundedAt: log.refundedAt,
        updatedAt: log.updatedAt || log.createdAt || log._createdAt,
        failureCode: log.failureCode,
        failureDescription: log.failureDescription,
        failureReason: log.failureReason,
        failureSource: log.failureSource,
        failureStep: log.failureStep,
        events: [{
          id: log._id,
          type: log.status,
          createdAt: log.updatedAt || log.createdAt || log._createdAt,
        }],
      });
    }

    for (const item of notifications) {
      if (!item.orderId) continue;
      if (loggedOrderIds.has(item.orderId)) continue;

      const packageFallback = item.packageSlug
        ? careerPackages.find((pkg) => pkg.slug === item.packageSlug)
        : undefined;
      const createdAt = item.createdAt || item._createdAt;
      const existing = paymentsByOrder.get(item.orderId);
      const current = existing ?? {
        id: item.orderId,
        orderId: item.orderId,
        status: 'pending' as const,
        packageSlug: item.packageSlug || '',
        packageName: item.packageName || packageFallback?.name || 'Unknown package',
        amount: typeof item.amount === 'number' ? item.amount : packageFallback?.amount ?? null,
        currency: item.currency || packageFallback?.currency || 'INR',
        customerName: item.customerName || 'Unknown',
        customerEmail: item.customerEmail || 'Unknown',
        customerPhone: item.customerPhone || 'Unknown',
        jobRole: item.jobRole || 'Unknown',
        experience: item.experience || 'Unknown',
        initiatedAt: item.eventType === 'purchase_initiated' ? createdAt : undefined,
        paidAt: item.eventType === 'payment_success' ? createdAt : undefined,
        updatedAt: createdAt,
        events: [],
      };

      if (item.eventType === 'payment_success') {
        current.status = 'paid';
        current.paymentId = item.paymentId || current.paymentId;
        current.paidAt = createdAt || current.paidAt;
      }

      if (item.eventType === 'purchase_initiated') {
        current.initiatedAt = createdAt || current.initiatedAt;
      }

      current.packageSlug = current.packageSlug || item.packageSlug || '';
      current.packageName = item.packageName || current.packageName;
      current.amount = typeof item.amount === 'number' ? item.amount : current.amount;
      current.currency = item.currency || current.currency;
      current.customerName = item.customerName || current.customerName;
      current.customerEmail = item.customerEmail || current.customerEmail;
      current.customerPhone = item.customerPhone || current.customerPhone;
      current.jobRole = item.jobRole || current.jobRole;
      current.experience = item.experience || current.experience;
      current.updatedAt = current.updatedAt || createdAt;
      current.events.push({
        id: item._id,
        type: item.eventType,
        createdAt,
      });

      paymentsByOrder.set(item.orderId, current);
    }

    response.json(Array.from(paymentsByOrder.values()).sort((a, b) => {
      const bTime = new Date(b.updatedAt || b.paidAt || b.initiatedAt || '').getTime();
      const aTime = new Date(a.updatedAt || a.paidAt || a.initiatedAt || '').getTime();
      return (Number.isNaN(bTime) ? 0 : bTime) - (Number.isNaN(aTime) ? 0 : aTime);
    }));
  } catch (error) {
    console.error('Failed to fetch admin payments:', error);
    response.status(500).json({ message: 'Failed to fetch payments.' });
  }
});

app.get('/api/admin-notifications', async (_request, response) => {
  try {
    const notifications = await sanityClient.fetch(
      `*[_type == "adminNotification"] | order(coalesce(createdAt, _createdAt) desc)[0...50]{
        _id,
        title,
        message,
        eventType,
        packageSlug,
        packageName,
        customerName,
        customerEmail,
        customerPhone,
        jobRole,
        experience,
        orderId,
        paymentId,
        isRead,
        createdAt,
        _createdAt
      }`
    );
    response.json(notifications);
  } catch (error) {
    response.status(500).json({ message: 'Failed to fetch notifications.' });
  }
});

app.patch('/api/admin-notifications/:id/read', async (request, response) => {
  const parsed = notificationReadSchema.safeParse(request.body);
  if (!parsed.success) return response.status(400).json({ message: 'Invalid read payload.' });

  try {
    const updated = await sanityClient.patch(request.params.id).set({ isRead: parsed.data.read }).commit();
    response.json(updated);
  } catch (error) {
    response.status(500).json({ message: 'Failed to update notification.' });
  }
});

if (isProduction) {
  const webDistPath = path.resolve(__dirname, '../../web/dist');
  app.use(express.static(webDistPath));

  app.get('*', (_request, response) => {
    response.sendFile(path.join(webDistPath, 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`DigitBuild API (Sanity-backed) running on port ${port}`);
});
