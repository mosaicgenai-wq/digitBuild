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
  eventType: 'purchase_initiated' | 'payment_success';
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

async function createAdminNotification(payload: AdminNotification) {
  try {
    await sanityClient.create(payload);
  } catch (error) {
    console.error('Failed to create admin notification:', error);
  }
}

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
  origin: process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
    : true,
  credentials: true,
}));
app.use(compression());
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
      createdAt: new Date().toISOString(),
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
      createdAt: new Date().toISOString(),
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

app.get('/api/admin-payments', async (_request, response) => {
  try {
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
      `*[_type == "adminNotification" && defined(orderId)] | order(coalesce(createdAt, _createdAt) desc){
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

    const paymentsByOrder = new Map<string, {
      id: string;
      orderId: string;
      paymentId?: string;
      status: 'paid' | 'pending';
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
      updatedAt?: string;
      events: Array<{
        id: string;
        type: 'purchase_initiated' | 'payment_success';
        createdAt?: string;
      }>;
    }>();

    for (const item of notifications) {
      if (!item.orderId) continue;

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

    response.json(Array.from(paymentsByOrder.values()));
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
