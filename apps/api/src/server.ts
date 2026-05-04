import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = Number(process.env.PORT ?? 3000);
const isProduction = process.env.NODE_ENV === 'production';

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

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(compression());
app.use(express.json());

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok' });
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
    const usersPath = path.resolve(__dirname, '../users.json');
    const usersData = await fs.readFile(usersPath, 'utf-8');
    const users = JSON.parse(usersData);

    const user = users.find(
      (u: any) => u.username === username && u.password === password
    );

    if (user) {
      return response.status(200).json({
        success: true,
        message: 'Login successful.',
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
    const usersPath = path.resolve(__dirname, '../users.json');
    const usersData = await fs.readFile(usersPath, 'utf-8');
    const users = JSON.parse(usersData);

    if (users.find((u: any) => u.username === newUser.username)) {
      return response.status(409).json({
        message: 'Username already exists.',
      });
    }

    users.push(newUser);
    await fs.writeFile(usersPath, JSON.stringify(users, null, 2));

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
    const coursesPath = path.resolve(__dirname, '../courses.json');
    const coursesData = await fs.readFile(coursesPath, 'utf-8');
    response.json(JSON.parse(coursesData));
  } catch (error) {
    response.status(500).json({ message: 'Failed to fetch courses.' });
  }
});

app.post('/api/courses', async (request, response) => {
  const parsed = courseSchema.safeParse(request.body);
  if (!parsed.success) return response.status(400).json({ message: 'Invalid course data.' });

  try {
    const coursesPath = path.resolve(__dirname, '../courses.json');
    const courses = JSON.parse(await fs.readFile(coursesPath, 'utf-8'));
    const newCourse = { ...parsed.data, id: Date.now().toString() };
    courses.push(newCourse);
    await fs.writeFile(coursesPath, JSON.stringify(courses, null, 2));
    response.status(201).json(newCourse);
  } catch (error) {
    response.status(500).json({ message: 'Failed to add course.' });
  }
});

app.put('/api/courses/:id', async (request, response) => {
  const parsed = courseSchema.safeParse(request.body);
  if (!parsed.success) return response.status(400).json({ message: 'Invalid course data.' });

  try {
    const coursesPath = path.resolve(__dirname, '../courses.json');
    let courses = JSON.parse(await fs.readFile(coursesPath, 'utf-8'));
    const index = courses.findIndex((c: any) => c.id === request.params.id);
    if (index === -1) return response.status(404).json({ message: 'Course not found.' });

    courses[index] = { ...parsed.data, id: request.params.id };
    await fs.writeFile(coursesPath, JSON.stringify(courses, null, 2));
    response.json(courses[index]);
  } catch (error) {
    response.status(500).json({ message: 'Failed to update course.' });
  }
});

app.delete('/api/courses/:id', async (request, response) => {
  try {
    const coursesPath = path.resolve(__dirname, '../courses.json');
    let courses = JSON.parse(await fs.readFile(coursesPath, 'utf-8'));
    courses = courses.filter((c: any) => c.id !== request.params.id);
    await fs.writeFile(coursesPath, JSON.stringify(courses, null, 2));
    response.json({ message: 'Course deleted.' });
  } catch (error) {
    response.status(500).json({ message: 'Failed to delete course.' });
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
  console.log(`DigitBuild API running on port ${port}`);
});
