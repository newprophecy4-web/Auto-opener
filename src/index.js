const SERVICE_NAME = "Multi Time Link Opener";
const VERSION = "2.0.0";
const DEFAULT_MAX_TEST_COUNT = 20000;
const DEFAULT_TIMEOUT_MS = 10_0000000;
const DEFAULT_RATE_LIMIT_PER_MINUTE = 10;

// Best-effort per-isolate limiter. For production-grade global enforcement,
// also configure a Cloudflare Rate Limiting rule for POST /test.
const rateLimitBuckets = new Map();

export default {
  async fetch(request, env, ctx) {
    return handleRequest(request, env, ctx);
  },
};

async function handleRequest(request, env) {
  const url = new URL(request.url);
  const method = request.method.toUpperCase();

  if (method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders() });
  }

  if (method === "GET" && url.pathname === "/") {
    return json({
      success: true,
      service: SERVICE_NAME,
      status: "online",
      version: VERSION,
    });
  }

  if (method === "GET" && url.pathname === "/health") {
    return json({
      success: true,
      status: "healthy",
      service: SERVICE_NAME,
      timestamp: new Date().toISOString(),
    });
  }

  if (method === "POST" && url.pathname === "/validate") {
    return await handleValidate(request, env);
  }

  if (method === "POST" && url.pathname === "/test") {
    return await handleTest(request, env);
  }

  return errorResponse("Route not found", 404);
}

async function handleValidate(request, env) {
  let body;
  try {
    body = await request.json();
  } catch {
    return errorResponse("Invalid JSON body", 400);
  }

  if (!body || typeof body.url !== "string" || !body.url.trim()) {
    return errorResponse("URL is required", 400);
  }

  const validation = validateTargetUrl(body.url, env);
  if (!validation.ok) {
    return errorResponse(validation.error, validation.status);
  }

  return json({
    success: true,
    allowed: true,
    hostname: validation.url.hostname,
  });
}

async function handleTest(request, env) {
  const limitResult = checkRateLimit(request, env);
  if (!limitResult.allowed) {
    return errorResponse(
      "Too many test requests. Please try again later.",
      429,
      { "Retry-After": String(limitResult.retryAfterSeconds) },
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return errorResponse("Invalid JSON body", 400);
  }

  if (!body || typeof body.url !== "string" || !body.url.trim()) {
    return errorResponse("URL is required", 400);
  }

  const validation = validateTargetUrl(body.url, env);
  if (!validation.ok) {
    return errorResponse(validation.error, validation.status);
  }

  const maxCount = getPositiveInteger(env.MAX_TEST_COUNT, DEFAULT_MAX_TEST_COUNT);
  const count = body.count === undefined ? 1 : body.count;

  if (!Number.isInteger(count) || count < 1) {
    return errorResponse("Count must be at least 1", 400);
  }
  if (count > maxCount) {
    return errorResponse(`Count must not exceed ${maxCount}`, 400);
  }

  const timeoutMs = getPositiveInteger(env.REQUEST_TIMEOUT_MS, DEFAULT_TIMEOUT_MS);
  const results = await startTest(validation.url, count, timeoutMs);
  const statistics = calculateStatistics(results);

  return json({
    success: true,
    target: validation.url.hostname,
    total: count,
    completed: results.length,
    ...statistics,
    results,
  });
}

function validateTargetUrl(rawUrl, env) {
  let targetUrl;
  try {
    targetUrl = new URL(rawUrl.trim());
  } catch {
    return { ok: false, status: 400, error: "Invalid URL" };
  }

  if (!/^https?:$/.test(targetUrl.protocol)) {
    return { ok: false, status: 400, error: "Unsupported protocol" };
  }

  if (targetUrl.username || targetUrl.password) {
    return { ok: false, status: 400, error: "URL credentials are not allowed" };
  }

  if (!targetUrl.hostname || isSuspiciousHostname(targetUrl.hostname)) {
    return { ok: false, status: 400, error: "Invalid URL" };
  }

  if (!isAllowedHost(targetUrl.hostname, env)) {
    return { ok: false, status: 403, error: "Target domain is not allowed" };
  }

  return { ok: true, url: targetUrl };
}

function getAllowedHosts(env) {
  return String(env.ALLOWED_HOSTS || "")
    .split(",")
    .map((host) => host.trim().toLowerCase().replace(/\.$/, ""))
    .filter(Boolean);
}

function isAllowedHost(hostname, env) {
  const normalizedHostname = hostname.toLowerCase().replace(/\.$/, "");
  return getAllowedHosts(env).some((allowedHost) => allowedHost === normalizedHostname);
}

function isSuspiciousHostname(hostname) {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, "");

  const suspiciousNames = new Set([
    "localhost",
    "localhost.localdomain",
    "ip6-localhost",
    "ip6-loopback",
    "0.0.0.0",
    "::1",
    "::",
  ]);
  if (suspiciousNames.has(host) || host.endsWith(".localhost") || host.endsWith(".local")) {
    return true;
  }

  // Reject IPv4 literals, including private, loopback, link-local and
  // unspecified ranges. Authorized targets should be configured as hostnames.
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) {
    const octets = host.split(".").map(Number);
    if (octets.some((octet) => octet < 0 || octet > 255)) return true;
    const [a, b] = octets;
    return (
      a === 0 ||
      a === 10 ||
      a === 127 ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168)
    );
  }

  // Do not permit IPv6 literals in this simple hostname-allowlist service.
  return host.includes(":");
}

async function startTest(targetUrl, count, timeoutMs) {
  const results = [];
  for (let requestNumber = 1; requestNumber <= count; requestNumber += 1) {
    results.push(await performRequest(targetUrl, requestNumber, timeoutMs));
  }
  return results;
}

async function performRequest(targetUrl, requestNumber, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const startedAt = Date.now();

  try {
    const response = await fetch(targetUrl.toString(), {
      method: "GET",
      redirect: "manual",
      signal: controller.signal,
      headers: {
        "User-Agent": "Multi-Time-Link-Opener/2.0",
        "X-Geo-Test": "true",
      },
    });

    const responseTimeMs = Math.max(0, Date.now() - startedAt);
    return {
      request: requestNumber,
      status: response.status,
      success: response.status >= 200 && response.status < 400,
      responseTimeMs,
    };
  } catch (error) {
    const responseTimeMs = Math.min(Math.max(0, Date.now() - startedAt), timeoutMs);
    const timedOut = error?.name === "AbortError";
    return {
      request: requestNumber,
      success: false,
      error: timedOut ? "Request timed out" : "Request failed",
      responseTimeMs,
    };
  } finally {
    clearTimeout(timer);
  }
}

function calculateStatistics(results) {
  const successful = results.filter((result) => result.success).length;
  const failed = results.length - successful;
  const responseTimes = results
    .map((result) => result.responseTimeMs)
    .filter((value) => Number.isFinite(value));

  if (responseTimes.length === 0) {
    return {
      successful,
      failed,
      successRate: 0,
      averageResponseTimeMs: 0,
      minResponseTimeMs: 0,
      maxResponseTimeMs: 0,
    };
  }

  const totalResponseTime = responseTimes.reduce((sum, value) => sum + value, 0);
  return {
    successful,
    failed,
    successRate: Number(((successful / results.length) * 100).toFixed(2)),
    averageResponseTimeMs: Math.round(totalResponseTime / responseTimes.length),
    minResponseTimeMs: Math.min(...responseTimes),
    maxResponseTimeMs: Math.max(...responseTimes),
  };
}

function checkRateLimit(request, env) {
  const limit = getPositiveInteger(
    env.RATE_LIMIT_PER_MINUTE,
    DEFAULT_RATE_LIMIT_PER_MINUTE,
  );
  const now = Date.now();
  const windowMs = 60_000;
  const clientKey = request.headers.get("CF-Connecting-IP") || "unknown-client";
  const bucket = rateLimitBuckets.get(clientKey);

  if (!bucket || now >= bucket.windowStartedAt + windowMs) {
    rateLimitBuckets.set(clientKey, { windowStartedAt: now, count: 1 });
    pruneRateLimitBuckets(now, windowMs);
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (bucket.count >= limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((bucket.windowStartedAt + windowMs - now) / 1000)),
    };
  }

  bucket.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

function pruneRateLimitBuckets(now, windowMs) {
  if (rateLimitBuckets.size < 1000) return;
  for (const [key, bucket] of rateLimitBuckets) {
    if (now >= bucket.windowStartedAt + windowMs) rateLimitBuckets.delete(key);
  }
}

function getPositiveInteger(value, fallback) {
  const parsed = Number.parseInt(String(value ?? ""), 10);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      "Cache-Control": "no-store",
      ...corsHeaders(),
      ...extraHeaders,
    },
  });
}

function errorResponse(error, status, extraHeaders = {}) {
  return json({ success: false, error }, status, extraHeaders);
      }
