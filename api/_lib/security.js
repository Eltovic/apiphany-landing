// Shared helpers for the /api serverless functions. Filename starts with an
// underscore so Vercel does not turn this into a route of its own.

// Escapes the 5 characters that matter for HTML-context injection. Every
// field interpolated into an email's htmlContent must go through this —
// these functions build raw HTML via template literals, so unescaped input
// is a direct HTML/script injection into the email body.
export function escapeHtml(value) {
  if (value === null || value === undefined) return "";
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function truncate(value, maxLength) {
  if (value === null || value === undefined) return "";
  return String(value).slice(0, maxLength);
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export function isValidEmail(value) {
  return typeof value === "string" && value.length <= 254 && EMAIL_RE.test(value);
}

// Best-effort in-memory sliding-window limiter. State is per warm serverless
// instance only (resets on cold start, not shared across regions) — this is
// not a substitute for a real rate limiter, but it stops naive single-source
// spam scripts from hammering these public, unauthenticated endpoints for
// free at zero added infra.
const _hits = new Map();
export function isRateLimited(key, limit, windowMs) {
  const now = Date.now();
  const timestamps = (_hits.get(key) || []).filter((t) => now - t < windowMs);
  if (timestamps.length >= limit) {
    _hits.set(key, timestamps);
    return true;
  }
  timestamps.push(now);
  _hits.set(key, timestamps);
  return false;
}

export function getClientIp(req) {
  const fwd = req.headers["x-forwarded-for"];
  if (typeof fwd === "string" && fwd.length) return fwd.split(",")[0].trim();
  return req.socket?.remoteAddress || "unknown";
}
