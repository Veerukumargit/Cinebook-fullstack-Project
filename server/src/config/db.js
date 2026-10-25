import mongoose from 'mongoose';
import { env } from './env.js';

mongoose.set('strictQuery', true);

export async function connectDB() {
  mongoose.connection.on('connected', () => {
    // eslint-disable-next-line no-console
    console.log('[cinebook] MongoDB connected');
  });
  mongoose.connection.on('error', (err) => {
    // eslint-disable-next-line no-console
    console.error('[cinebook] MongoDB connection error:', err.message);
  });

  await mongoose.connect(env.mongodbUri);
}

export async function disconnectDB() {
  await mongoose.disconnect();
}
