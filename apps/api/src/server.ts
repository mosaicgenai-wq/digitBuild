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

function getCareerPackageBySlug(slug: string) {
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
      return response.status(200).json({
        success: true,
        message: 'Login successful.',
        username: user.username,
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

app.post('/api/payments/create-order', async (request, response) => {
  const parsed = createOrderSchema.safeParse(request.body);

  if (!parsed.success) {
    return response.status(400).json({
      message: 'Invalid payment details.',
      errors: parsed.error.flatten(),
    });
  }

  const selectedPackage = getCareerPackageBySlug(parsed.data.packageSlug);

  if (!selectedPackage) {
    return response.status(400).json({ message: 'Invalid package selected.' });
  }

  try {
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

app.post('/api/payments/verify', (request, response) => {
  const parsed = verifyPaymentSchema.safeParse(request.body);

  if (!parsed.success) {
    return response.status(400).json({
      message: 'Missing payment verification details.',
      errors: parsed.error.flatten(),
    });
  }

  const selectedPackage = getCareerPackageBySlug(parsed.data.packageSlug);

  if (!selectedPackage) {
    return response.status(400).json({ message: 'Invalid package selected.' });
  }

  try {
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
