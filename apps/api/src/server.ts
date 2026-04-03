import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import path from 'node:path';
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
