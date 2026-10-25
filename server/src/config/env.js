import 'dotenv/config';

function required(name, fallback) {
  const v = process.env[name] ?? fallback;
  return v;
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 5000,
  clientOrigins: (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),

  mongodbUri: required('MONGODB_URI', 'mongodb://127.0.0.1:27017/cinebook'),

  jwtSecret: process.env.JWT_SECRET || '',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  jwtRememberExpiresIn: process.env.JWT_REMEMBER_EXPIRES_IN || '30d',
  cookieSecure: process.env.COOKIE_SECURE === 'true',
  // 'lax' works for local dev and same-domain deploys. If the frontend and
  // API live on different domains in production, set this to 'none' (and
  // COOKIE_SECURE=true, which browsers require alongside SameSite=None).
  cookieSameSite: process.env.COOKIE_SAME_SITE || 'lax',

  tmdbApiKey: process.env.TMDB_API_KEY || '',
};

export const isProd = env.nodeEnv === 'production';

if (!env.jwtSecret) {
  // The server can still boot (handy for a first `npm install && npm run dev`),
  // but every signed-in request will fail until a real secret is set.
  // eslint-disable-next-line no-console
  console.warn(
    '[cinebook] WARNING: JWT_SECRET is not set in server/.env — set it before accepting real logins.'
  );
}
