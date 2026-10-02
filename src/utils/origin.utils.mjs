import envConstant from '../constant/env.constant.mjs';

export const DEFAULT_FALLBACK_ORIGIN = 'https://www.growrichmindset.in';

export const DEFAULT_ALLOWED_ORIGINS = Object.freeze([
  'https://www.growrichmindset.in',
  'http://localhost:1420',
  'tauri://localhost',
  'http://tauri.localhost',
]);

/**
 * Checks if a string is a valid non-placeholder origin.
 * @param {string} val
 * @returns {boolean}
 */
export const isValidOriginFormat = (val) => {
  if (!val || typeof val !== 'string') return false;
  const trimmed = val.trim();
  if (trimmed.startsWith('#') || trimmed.includes(' ') || trimmed === 'null' || trimmed === 'undefined') {
    return false;
  }
  return /^https?:\/\/|^tauri:\/\//i.test(trimmed);
};

/**
 * Normalizes an origin string by trimming whitespace and removing trailing slashes.
 * @param {string} origin
 * @returns {string}
 */
export const normalizeOrigin = (origin) => {
  if (!origin || typeof origin !== 'string') return '';
  return origin.trim().replace(/\/+$/, '');
};

/**
 * Resolves the primary fallback URL, ensuring placeholders are replaced with DEFAULT_FALLBACK_ORIGIN.
 * @returns {string}
 */
export const getFallbackOrigin = () => {
  const envUrl = process.env.FRONTEND_URL || envConstant.FRONTEND_URL || '';
  if (isValidOriginFormat(envUrl)) {
    return normalizeOrigin(envUrl);
  }
  return DEFAULT_FALLBACK_ORIGIN;
};

/**
 * Retrieves the list of allowed origins parsed from ALLOWED_ORIGINS env variable,
 * falling back to defaults if not set.
 * @returns {string[]}
 */
export const getAllowedOrigins = () => {
  const rawAllowed = process.env.ALLOWED_ORIGINS || envConstant.ALLOWED_ORIGINS || '';
  const fallbackUrl = getFallbackOrigin();

  let origins = [];
  if (rawAllowed && typeof rawAllowed === 'string') {
    origins = rawAllowed
      .split(',')
      .map((entry) => normalizeOrigin(entry))
      .filter((entry) => isValidOriginFormat(entry));
  }

  if (origins.length === 0) {
    origins = [...DEFAULT_ALLOWED_ORIGINS];
  }

  // Ensure the fallback URL is also recognized if explicitly configured
  const cleanFallback = normalizeOrigin(fallbackUrl);
  if (cleanFallback && !origins.includes(cleanFallback)) {
    origins.push(cleanFallback);
  }

  // Deduplicate origins while preserving order
  return Array.from(new Set(origins));
};

/**
 * Checks if a given origin is present in the allowlist.
 * @param {string} origin
 * @returns {boolean}
 */
export const isOriginAllowed = (origin) => {
  if (!origin || typeof origin !== 'string') return false;
  const cleanOrigin = normalizeOrigin(origin);
  if (!cleanOrigin || cleanOrigin === 'null') return false;

  const allowedOrigins = getAllowedOrigins();
  return allowedOrigins.some((allowed) => normalizeOrigin(allowed) === cleanOrigin);
};

/**
 * Reads the request's Origin header, validates it against ALLOWED_ORIGINS, and returns it.
 * Falls back to https://www.growrichmindset.in (or FRONTEND_URL) when the header is absent,
 * or when an unvalidated/disallowed origin is provided (preventing open-redirect vulnerabilities).
 *
 * @param {import('express').Request|object} req
 * @returns {string}
 */
export const resolveFrontendOrigin = (req) => {
  const fallback = getFallbackOrigin();

  if (!req) return fallback;

  // Extract Origin header (case-insensitive across HTTP frameworks)
  const originHeader =
    (typeof req.get === 'function' ? req.get('origin') : null) ||
    req.headers?.origin ||
    req.headers?.Origin;

  if (originHeader && typeof originHeader === 'string') {
    const cleanOrigin = normalizeOrigin(originHeader);
    if (isOriginAllowed(cleanOrigin)) {
      return cleanOrigin;
    }

    // Log rejected origins in development
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        `[Origin Resolution] Rejected untrusted origin header "${originHeader}". Safe fallback used: "${fallback}"`
      );
    }
    return fallback;
  }

  // When no Origin header is present (e.g. curl, SSR, native calls)
  return fallback;
};

/**
 * Creates options object for the express `cors` middleware.
 * @returns {import('cors').CorsOptions}
 */
export const createCorsOptions = () => {
  return {
    origin: (origin, callback) => {
      // Requests with no Origin header (e.g. server-to-server, curl, mobile, SSR)
      if (!origin) {
        return callback(null, true);
      }

      if (isOriginAllowed(origin)) {
        return callback(null, true);
      }

      // Log rejected origins in development (including Origin: null from custom-scheme pages)
      if (process.env.NODE_ENV !== 'production') {
        console.warn(
          `[CORS] Rejected origin: "${origin}" | Allowed origins: [${getAllowedOrigins().join(', ')}]`
        );
      }

      // Disallow origin (CORS middleware will omit Access-Control-Allow-Origin header)
      return callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-App-Version',
      'x-access-token',
      'token',
      'Accept',
      'Origin',
      'X-Requested-With',
    ],
    exposedHeaders: ['set-cookie'],
    optionsSuccessStatus: 204,
  };
};

export default {
  DEFAULT_FALLBACK_ORIGIN,
  DEFAULT_ALLOWED_ORIGINS,
  normalizeOrigin,
  getAllowedOrigins,
  isOriginAllowed,
  resolveFrontendOrigin,
  createCorsOptions,
};
