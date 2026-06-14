import express from 'express';
import prisma from './config/db.ts';

import { ensureUploadDir, uploadDir } from './middlewares/upload.middleware.ts';

import { materialRoutes } from './routes/material.routes.ts';
import { programRoutes } from './routes/program.routes.ts';
import { studentRoutes } from './routes/student.routes.ts';
import { teacherRoutes } from './routes/teacher.routes.ts';

declare const process: any;

const app = express();
const port = Number(process.env.PORT ?? 5000);

// Middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(ensureUploadDir);
app.use('/uploads', express.static(uploadDir));

// Health check
app.get('/health', (_req: any, res: any) => {
  res.json({ ok: true, service: 'IndraCyber Institute API' });
});

// Routes
app.use('/teachers', teacherRoutes);
app.use('/students', studentRoutes);
app.use('/materials', materialRoutes);
app.use('/programs', programRoutes);

// 404 handler
app.use((_req: any, res: any) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((error: unknown, _req: any, res: any, _next: any) => {
  console.error(error);

  const message = error instanceof Error ? error.message : 'Internal server error';

  res.status(500).json({ message });
});

// Start server
const server = app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});

// Graceful shutdown
async function shutdown(signal: string) {
  console.log(`Received ${signal}, shutting down...`);

  server.close(async () => {
    try {
      await prisma.$disconnect();
      console.log('Prisma disconnected');
      process.exit(0);
    } catch (err) {
      console.error('Shutdown error:', err);
      process.exit(1);
    }
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
