let dotenv;
try {
  dotenv = await import('dotenv');
} catch {
  // Do nothing if dotenv is not available
}

dotenv?.config();

export const port = parseEnvPort('QIMG_PORT') ?? parseEnvPort('PORT') ?? 3000;

export const config = {
  port,
  env: process.env.NODE_ENV ?? "development",
  databaseUrl: process.env.QIMG_DATABASE_URL ?? "postgres://localhost/qimg",
  adminToken: process.env.QIMG_ADMIN_TOKEN,
  imageQuota: parseEnvInt('QIMG_IMAGE_QUOTA', 1, 100) ?? 10,
  maxImageSize: parseEnvInt('QIMG_IMAGE_MAX_SIZE', 1024 * 1024) ?? 2 * 1024 * 1024,
  baseUrl: process.env.QIMG_BASE_URL || `http://localhost:${port}`
};

if (!config.adminToken) {
  throw new Error(`Environment variable $QIMG_ADMIN_TOKEN is required.`);
}

function parseEnvPort(name) {
  return parseEnvInt(name, 1, 65_535);
}

function parseEnvInt(name, min, max) {
  const value = process.env[name];
  if (value === undefined) {
    return undefined;
  }

  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) {
    throw new Error(`Environment variable $${name} must be an integer`);
  } else if (min !== undefined && parsed < min
    || max !== undefined && parsed > max) {
    throw new Error(`Environment variable $${name} must be between ${min ?? '-Infinity'} and ${max ?? 'Infinity'}`);
  }

  return parsed;
}
