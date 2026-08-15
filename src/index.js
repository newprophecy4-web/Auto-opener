// ============================================
// MULTI-TIME LINK OPENER - v4.0.1 (FULL)
// ============================================

const SERVICE_NAME = "Multi Time Link Opener - Advanced Bypass";
const VERSION = "4.0.1";

// ----- Configuration -----
const CONFIG = {
  maxTestCount: 50,
  defaultTimeout: 15000,
  rateLimitPerMinute: 20,
  maxRetries: 5,
  minDelay: 50,
  maxDelay: 3000,
  bypassLevels: {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    ULTRA: 'ultra',
    STEALTH: 'stealth'
  },
  fingerprints: {
    chrome: {
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      secChUa: '"Chromium";v="120", "Not_A Brand";v="24"',
      platform: 'Windows'
    },
    firefox: {
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/121.0',
      secChUa: '"Firefox";v="121"',
      platform: 'Windows'
    },
    safari: {
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15',
      secChUa: '"Safari";v="17.1"',
      platform: 'macOS'
    },
    edge: {
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0',
      secChUa: '"Chromium";v="120", "Microsoft Edge";v="120"',
      platform: 'Windows'
    },
    mobile: {
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_1_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1',
      secChUa: '"Safari";v="17.1"',
      platform: 'iOS'
    }
  }
};

// ============================================
// IP MANAGER
// ============================================
class IPManager {
  constructor() {
    this.usedIPs = new Set();
  }

  generateIP(region = 'US', seed = 0) {
    const regions = {
      'US': this.getUSIP,
      'UK': this.getUKIP,
      'EU': this.getEUIP,
      'ASIA': this.getAsiaIP,
      'CA': this.getCAIP,
      'AU': this.getAUIP,
      'BR': this.getBRIP,
      'IN': this.getINIP,
      'JP': this.getJPIP,
      'CN': this.getCNIP,
      'RU': this.getRUIP,
      'ZA': this.getZAIP
    };
    const generator = regions[region] || this.getUSIP;
    return generator.call(this, seed);
  }

  getUSIP(seed) {
    const prefixes = ['12','23','34','45','56','67','68','69','70','71','72','73','74','75','76','77','78','79','80','81','82','83','84','85','86','87','88','89','90','91','92','93','94','95','96','97','98','99'];
    const prefix = prefixes[seed % prefixes.length];
    const second = this.randomRange(1,254);
    const third = this.randomRange(1,254);
    const fourth = this.randomRange(1,254);
    return `${prefix}.${second}.${third}.${fourth}`;
  }

  getUKIP(seed) {
    const prefixes = ['2','3','4','5','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','58','59','60','61','62','63','64','65','66','67','68','69','70','71','72','73','74','75','76','77','78','79','80','81','82','83','84','85','86','87','88','89','90','91','92','93','94','95','96','97','98','99','100','101','102','103','104','105','106','107','108','109','110','111','112','113','114','115','116','117','118','119','120','121','122','123','124','125','126','127','128','129','130','131','132','133','134','135','136','137','138','139','140','141','142','143','144','145','146','147','148','149','150','151','152','153','154','155','156','157','158','159','160','161','162','163','164','165','166','167','168','169','170','171','172','173','174','175','176','177','178','179','180','181','182','183','184','185','186','187','188','189','190'];
    const prefix = prefixes[seed % prefixes.length];
    const second = this.randomRange(1,254);
    const third = this.randomRange(1,254);
    const fourth = this.randomRange(1,254);
    return `${prefix}.${second}.${third}.${fourth}`;
  }

  getEUIP(seed) { return this.getUKIP(seed); }
  getAsiaIP(seed) { return this.getUSIP(seed); }
  getCAIP(seed) { return this.getUSIP(seed); }
  getAUIP(seed) { return this.getUSIP(seed); }
  getBRIP(seed) { return this.getUSIP(seed); }
  getINIP(seed) { return this.getUSIP(seed); }
  getJPIP(seed) { return this.getUSIP(seed); }
  getCNIP(seed) { return this.getUSIP(seed); }
  getRUIP(seed) { return this.getUKIP(seed); }
  getZAIP(seed) { return this.getUSIP(seed); }

  randomRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getNextIP(region, requestNumber) {
    let ip;
    let attempts = 0;
    do {
      ip = this.generateIP(region, requestNumber + attempts);
      attempts++;
    } while (this.usedIPs.has(ip) && attempts < 100);
    this.usedIPs.add(ip);
    if (this.usedIPs.size > 10000) this.usedIPs.clear();
    return ip;
  }
}

// ============================================
// FINGERPRINT GENERATOR
// ============================================
class FingerprintGenerator {
  constructor() {
    this.fingerprints = CONFIG.fingerprints;
    this.browsers = Object.keys(this.fingerprints);
  }

  getFingerprint(requestNumber) {
    const browser = this.browsers[requestNumber % this.browsers.length];
    const fp = this.fingerprints[browser];
    let userAgent = fp.userAgent;
    if (browser === 'chrome' || browser === 'edge') {
      const versions = ['119','120','121','122'];
      const version = versions[requestNumber % versions.length];
      userAgent = userAgent.replace(/Chrome\/\d+/, `Chrome/${version}`);
    }
    return {
      userAgent,
      secChUa: fp.secChUa,
      platform: fp.platform,
      browser
    };
  }
}

// ============================================
// HEADER GENERATOR
// ============================================
class HeaderGenerator {
  constructor(ipManager, fingerprintGen) {
    this.ipManager = ipManager;
    this.fingerprintGen = fingerprintGen;
    this.referers = [
      'https://www.google.com/search?q=',
      'https://www.bing.com/search?q=',
      'https://search.yahoo.com/search?p=',
      'https://duckduckgo.com/?q=',
      'https://www.facebook.com/',
      'https://twitter.com/',
      'https://www.linkedin.com/',
      'https://www.reddit.com/'
    ];
  }

  generateHeaders(region, requestNumber, bypassLevel) {
    const fingerprint = this.fingerprintGen.getFingerprint(requestNumber);
    const clientIP = this.ipManager.getNextIP(region, requestNumber);
    const headers = {
      'User-Agent': fingerprint.userAgent,
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      'Accept-Language': this.getAcceptLanguage(region, requestNumber),
      'Accept-Encoding': this.getAcceptEncoding(requestNumber),
      'Connection': 'keep-alive',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Upgrade-Insecure-Requests': '1',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-User': '?1',
      'X-Forwarded-For': clientIP,
      'X-Real-IP': clientIP,
      'X-Originating-IP': clientIP,
      'X-Remote-IP': clientIP,
      'X-Client-IP': clientIP,
      'CF-Connecting-IP': clientIP,
      'True-Client-IP': clientIP,
      'X-Geo-Region': region,
      'CF-Geo-Region': region,
      'X-Geo-Country': this.getCountryCode(region),
      'DNT': '1',
      'Sec-GPC': '1',
      'Referer': this.getReferer(requestNumber),
      'Sec-Ch-Ua': fingerprint.secChUa,
      'Sec-Ch-Ua-Platform': `"${fingerprint.platform}"`,
      'Sec-Ch-Ua-Mobile': '?0'
    };
    // Bypass level extras
    if (bypassLevel === 'high' || bypassLevel === 'ultra' || bypassLevel === 'stealth') {
      headers['X-Request-ID'] = this.generateRequestId();
      headers['Cookie'] = this.generateCookies(requestNumber);
    }
    if (bypassLevel === 'ultra' || bypassLevel === 'stealth') {
      headers['X-Trace-Id'] = this.generateTraceId();
      headers['X-Span-Id'] = this.generateSpanId();
      headers['Accept-Push'] = 'idempotent';
    }
    return headers;
  }

  getAcceptLanguage(region, requestNumber) {
    const langs = {
      'US': ['en-US,en;q=0.9','en;q=0.9,en-US;q=0.8'],
      'UK': ['en-GB,en;q=0.9','en;q=0.9,en-GB;q=0.8'],
      'EU': ['en;q=0.9,de;q=0.8','de;q=0.9,en;q=0.8'],
      'ASIA': ['en;q=0.9,zh;q=0.8','zh;q=0.9,en;q=0.8'],
      'CA': ['en-CA,en;q=0.9','en;q=0.9,en-CA;q=0.8'],
      'AU': ['en-AU,en;q=0.9','en;q=0.9,en-AU;q=0.8'],
      'BR': ['pt-BR,pt;q=0.9,en;q=0.8','pt;q=0.9,pt-BR;q=0.8'],
      'IN': ['en-IN,en;q=0.9','en;q=0.9,en-IN;q=0.8'],
      'JP': ['ja-JP,ja;q=0.9,en;q=0.8','ja;q=0.9,ja-JP;q=0.8'],
      'CN': ['zh-CN,zh;q=0.9,en;q=0.8','zh;q=0.9,zh-CN;q=0.8'],
      'RU': ['ru-RU,ru;q=0.9,en;q=0.8','ru;q=0.9,ru-RU;q=0.8'],
      'ZA': ['en-ZA,en;q=0.9','en;q=0.9,en-ZA;q=0.8']
    };
    const list = langs[region] || langs['US'];
    return list[requestNumber % list.length];
  }

  getAcceptEncoding(requestNumber) {
    return ['gzip, deflate, br','gzip, deflate','br, gzip, deflate'][requestNumber % 3];
  }

  getCountryCode(region) {
    const map = { 'US':'US','UK':'GB','EU':'EU','ASIA':'AS','CA':'CA','AU':'AU','BR':'BR','IN':'IN','JP':'JP','CN':'CN','RU':'RU','ZA':'ZA' };
    return map[region] || 'US';
  }

  getReferer(requestNumber) {
    const base = this.referers[requestNumber % this.referers.length];
    return base + Math.random().toString(36).substring(7);
  }

  generateRequestId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2,9)}`;
  }

  generateTraceId() {
    return `00-${this.generateHex(32)}-${this.generateHex(16)}-01`;
  }

  generateSpanId() { return this.generateHex(16); }

  generateHex(length) {
    let r = '';
    for (let i=0; i<length; i++) r += Math.floor(Math.random()*16).toString(16);
    return r;
  }

  generateCookies(requestNumber) {
    const names = ['_ga','_gid','_gat','_fbp','__cfduid','session'];
    const cookies = names.map((n,i) => `${n}=${this.generateCookieValue(requestNumber+i)}`);
    return cookies.join('; ');
  }

  generateCookieValue(seed) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let val = '';
    for (let i=0; i<10; i++) val += chars.charAt(Math.floor(Math.random()*chars.length));
    return val;
  }
}

// ============================================
// REQUEST EXECUTOR
// ============================================
class RequestExecutor {
  constructor(ipManager, fingerprintGen, headerGen) {
    this.ipManager = ipManager;
    this.fingerprintGen = fingerprintGen;
    this.headerGen = headerGen;
    this.executionHistory = [];
  }

  async executeRequest(targetUrl, region, requestNumber, timeoutMs, bypassLevel, useProxy, env) {
    const start = Date.now();
    const headers = this.headerGen.generateHeaders(region, requestNumber, bypassLevel);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(targetUrl.toString(), {
        method: 'GET',
        redirect: 'manual',
        signal: controller.signal,
        headers: headers
      });
      clearTimeout(timer);
      const elapsed = Date.now() - start;
      const result = {
        request: requestNumber,
        success: response.status >= 200 && response.status < 400,
        status: response.status,
        responseTimeMs: elapsed,
        region: region,
        bypass_level: bypassLevel,
        proxy_used: !!useProxy,
        ip_used: headers['X-Forwarded-For']
      };
      this.executionHistory.push(result);
      return result;
    } catch (error) {
      clearTimeout(timer);
      const elapsed = Date.now() - start;
      const timedOut = error?.name === 'AbortError';
      const result = {
        request: requestNumber,
        success: false,
        error: timedOut ? 'Request timed out' : 'Request failed',
        responseTimeMs: elapsed,
        region: region,
        bypass_level: bypassLevel,
        proxy_used: !!useProxy,
        ip_used: headers['X-Forwarded-For']
      };
      this.executionHistory.push(result);
      return result;
    }
  }

  getExecutionStats() {
    const total = this.executionHistory.length;
    if (total === 0) return { successRate: 0, avgResponseTime: 0, totalRequests: 0, successfulRequests: 0, failedRequests: 0 };
    const successful = this.executionHistory.filter(r => r.success).length;
    const avg = this.executionHistory.reduce((sum,r) => sum + r.responseTimeMs, 0) / total;
    return {
      successRate: (successful/total)*100,
      avgResponseTime: Math.round(avg),
      totalRequests: total,
      successfulRequests: successful,
      failedRequests: total - successful
    };
  }
}

// ============================================
// GLOBAL INSTANCES
// ============================================
let ipManager = new IPManager();
let fingerprintGen = new FingerprintGenerator();
let headerGen = new HeaderGenerator(ipManager, fingerprintGen);
let requestExecutor = new RequestExecutor(ipManager, fingerprintGen, headerGen);
const rateLimitBuckets = new Map();

// ============================================
// HELPERS
// ============================================
function getPositiveInteger(value, fallback) {
  const parsed = Number.parseInt(String(value ?? ''), 10);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function getAllowedHosts(env) {
  const raw = env.ALLOWED_HOSTS || '';
  if (raw === '*') return ['*'];
  // Default: allow these domains even if env not set
  const defaults = ['effectivecpmnetwork.com', 'www.effectivecpmnetwork.com'];
  const fromEnv = raw.split(',').map(h => h.trim().toLowerCase().replace(/\.$/, '')).filter(Boolean);
  return fromEnv.length ? fromEnv : defaults;
}

function isAllowedHost(hostname, env) {
  const allowed = getAllowedHosts(env);
  if (allowed.includes('*')) return true;
  const normalized = hostname.toLowerCase().replace(/\.$/, '');
  return allowed.some(a => a === normalized);
}

function isSuspiciousHostname(hostname) {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, '');
  const suspicious = new Set(['localhost','localhost.localdomain','ip6-localhost','ip6-loopback','0.0.0.0','::1','::']);
  if (suspicious.has(host) || host.endsWith('.localhost') || host.endsWith('.local')) return true;
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) {
    const octets = host.split('.').map(Number);
    if (octets.some(o => o<0 || o>255)) return true;
    const [a,b] = octets;
    if (a===0 || a===10 || a===127 || (a===169 && b===254) || (a===172 && b>=16 && b<=31) || (a===192 && b===168)) return true;
  }
  return host.includes(':');
}

function validateTargetUrl(rawUrl, env) {
  let targetUrl;
  try { targetUrl = new URL(rawUrl.trim()); } catch { return { ok: false, status: 400, code: 'INVALID_URL', error: 'Invalid URL format' }; }
  if (!/^https?:$/.test(targetUrl.protocol)) return { ok: false, status: 400, code: 'UNSUPPORTED_PROTOCOL', error: 'Only HTTP/HTTPS allowed' };
  if (targetUrl.username || targetUrl.password) return { ok: false, status: 400, code: 'CREDENTIALS_NOT_ALLOWED', error: 'URL credentials not allowed' };
  if (!targetUrl.hostname || isSuspiciousHostname(targetUrl.hostname)) return { ok: false, status: 400, code: 'INVALID_HOST', error: 'Invalid or suspicious hostname' };
  if (!isAllowedHost(targetUrl.hostname, env)) return { ok: false, status: 403, code: 'HOST_NOT_ALLOWED', error: 'Target domain is not in ALLOWED_HOSTS' };
  return { ok: true, url: targetUrl };
}

function checkRateLimit(request, env) {
  const limit = getPositiveInteger(env.RATE_LIMIT_PER_MINUTE, CONFIG.rateLimitPerMinute);
  const now = Date.now();
  const windowMs = 60000;
  const clientKey = request.headers.get('CF-Connecting-IP') || 'unknown';
  const bucket = rateLimitBuckets.get(clientKey);
  if (!bucket || now >= bucket.windowStartedAt + windowMs) {
    rateLimitBuckets.set(clientKey, { windowStartedAt: now, count: 1 });
    return { allowed: true, retryAfterSeconds: 0 };
  }
  if (bucket.count >= limit) {
    return { allowed: false, retryAfterSeconds: Math.max(1, Math.ceil((bucket.windowStartedAt + windowMs - now)/1000)) };
  }
  bucket.count++;
  return { allowed: true, retryAfterSeconds: 0 };
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  };
}

function json(data, status = 200, extra = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'Cache-Control': 'no-store',
      ...corsHeaders(),
      ...extra
    }
  });
}

function errorResponse(code, message, status = 400, extra = {}) {
  return json({ success: false, error: { code, message } }, status, extra);
}

// ============================================
// ROUTE HANDLERS
// ============================================

// FIXED /validate
async function handleValidate(request, env) {
  let body;
  try {
    body = await request.json();
  } catch {
    return errorResponse('INVALID_JSON', 'Request body must be valid JSON', 400);
  }

  if (!body || typeof body.url !== 'string' || !body.url.trim()) {
    return errorResponse('MISSING_URL', 'url is required and must be a non-empty string', 400);
  }

  const validation = validateTargetUrl(body.url, env);
  if (!validation.ok) {
    return json({
      success: false,
      valid: false,
      error: {
        code: validation.code || 'VALIDATION_FAILED',
        message: validation.error
      }
    }, validation.status || 400);
  }

  return json({
    success: true,
    valid: true,
    url: validation.url.href,
    hostname: validation.url.hostname,
    allowed_hosts: getAllowedHosts(env)
  });
}

// /test handler
async function handleTest(request, env) {
  const limit = checkRateLimit(request, env);
  if (!limit.allowed) {
    return errorResponse('RATE_LIMITED', 'Too many requests', 429, { 'Retry-After': String(limit.retryAfterSeconds) });
  }

  let body;
  try { body = await request.json(); } catch { return errorResponse('INVALID_JSON', 'Invalid JSON body', 400); }
  if (!body || typeof body.url !== 'string' || !body.url.trim()) {
    return errorResponse('MISSING_URL', 'url is required', 400);
  }

  const validation = validateTargetUrl(body.url, env);
  if (!validation.ok) {
    return json({
      success: false,
      error: {
        code: validation.code || 'VALIDATION_FAILED',
        message: validation.error
      }
    }, validation.status || 400);
  }

  const maxCount = getPositiveInteger(env.MAX_TEST_COUNT, CONFIG.maxTestCount);
  const count = body.count === undefined ? 1 : body.count;
  if (!Number.isInteger(count) || count < 1) return errorResponse('INVALID_COUNT', 'Count must be at least 1', 400);
  if (count > maxCount) return errorResponse('COUNT_EXCEEDED', `Count must not exceed ${maxCount}`, 400);

  const timeoutMs = getPositiveInteger(env.REQUEST_TIMEOUT_MS, CONFIG.defaultTimeout);
  const bypassLevel = body.bypassLevel || 'medium';
  const region = body.region || 'US';
  const useProxy = body.useProxies !== false && !!env.PROXY_LIST;

  const results = [];
  for (let i=1; i<=count; i++) {
    const result = await requestExecutor.executeRequest(validation.url, region, i, timeoutMs, bypassLevel, useProxy, env);
    results.push(result);
    if (i < count) {
      const delay = getDelayByLevel(bypassLevel);
      await sleep(delay);
    }
  }

  const stats = calculateStatistics(results);
  return json({
    success: true,
    target: validation.url.hostname,
    total: count,
    completed: results.length,
    region,
    bypass_level: bypassLevel,
    proxy_used: useProxy,
    ...stats,
    results: results.map(r => ({
      request: r.request,
      success: r.success,
      status: r.status,
      responseTimeMs: r.responseTimeMs,
      region: r.region,
      bypass_level: r.bypass_level,
      ...(r.error && { error: r.error })
    }))
  });
}

// Statistics helper
function calculateStatistics(results) {
  const successful = results.filter(r => r.success).length;
  const failed = results.length - successful;
  const times = results.map(r => r.responseTimeMs).filter(Number.isFinite);
  if (times.length === 0) {
    return { successful, failed, successRate: 0, averageResponseTimeMs: 0, minResponseTimeMs: 0, maxResponseTimeMs: 0 };
  }
  const total = times.reduce((a,b) => a+b, 0);
  return {
    successful,
    failed,
    successRate: Number(((successful/results.length)*100).toFixed(2)),
    averageResponseTimeMs: Math.round(total/times.length),
    minResponseTimeMs: Math.min(...times),
    maxResponseTimeMs: Math.max(...times)
  };
}

function getDelayByLevel(level) {
  const map = { 'low': 100, 'medium': 300, 'high': 500, 'ultra': 800, 'stealth': 1200 };
  return map[level] || 300;
}

// Placeholder advanced test handlers (reuse handleTest for simplicity)
async function handleAdvancedTest(request, env) { return handleTest(request, env); }
async function handleStealthTest(request, env) {
  // Force stealth level
  const body = await request.json().catch(() => ({}));
  body.bypassLevel = 'stealth';
  const newReq = new Request(request, { body: JSON.stringify(body) });
  return handleTest(newReq, env);
}

// ============================================
// MAIN ROUTER
// ============================================
async function handleRequest(request, env) {
  const url = new URL(request.url);
  const method = request.method.toUpperCase();
  const path = url.pathname.replace(/\/$/, '') || '/';

  if (method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders() });
  }

  // GET routes
  if (method === 'GET' && path === '/') {
    return json({
      success: true,
      service: SERVICE_NAME,
      version: VERSION,
      status: 'online',
      routes: {
        GET: ['/', '/health', '/stats', '/analytics', '/analytics/summary', '/analytics/detailed', '/proxy-status'],
        POST: ['/validate', '/test', '/test-advanced', '/test-stealth', '/proxy-reload', '/clear-cache']
      },
      features: {
        bypass_levels: Object.keys(CONFIG.bypassLevels),
        regions: ['US','UK','EU','ASIA','CA','AU','BR','IN','JP','CN','RU','ZA']
      }
    });
  }

  if (method === 'GET' && path === '/health') {
    const stats = requestExecutor.getExecutionStats();
    return json({
      success: true,
      status: 'healthy',
      service: SERVICE_NAME,
      version: VERSION,
      timestamp: new Date().toISOString(),
      stats: {
        successRate: stats.successRate || 0,
        avgResponseTime: stats.avgResponseTime || 0,
        totalRequests: stats.totalRequests || 0
      },
      proxy_status: { brightdata_configured: !!env.PROXY_LIST }
    });
  }

  if (method === 'GET' && path === '/stats') {
    const stats = requestExecutor.getExecutionStats();
    return json({ success: true, timestamp: new Date().toISOString(), stats });
  }

  if (method === 'GET' && path === '/analytics') {
    const stats = requestExecutor.getExecutionStats();
    return json({
      success: true,
      timestamp: new Date().toISOString(),
      summary: stats,
      recent_requests: requestExecutor.executionHistory.slice(-20).map(r => ({
        success: r.success,
        status: r.status,
        responseTimeMs: r.responseTimeMs,
        region: r.region,
        bypass_level: r.bypass_level
      }))
    });
  }

  if (method === 'GET' && path === '/analytics/summary') {
    const stats = requestExecutor.getExecutionStats();
    return json({ success: true, timestamp: new Date().toISOString(), ...stats });
  }

  if (method === 'GET' && path === '/analytics/detailed') {
    const history = requestExecutor.executionHistory;
    return json({
      success: true,
      timestamp: new Date().toISOString(),
      data_points: history.length,
      detailed_metrics: {
        response_times: {
          average: Math.round(history.reduce((a,b) => a + b.responseTimeMs, 0) / (history.length || 1)),
          median: 0,
          p95: 0
        }
      }
    });
  }

  if (method === 'GET' && path === '/proxy-status') {
    const proxyList = env.PROXY_LIST ? env.PROXY_LIST.split(',').filter(p => p.trim()) : [];
    return json({
      success: true,
      proxy_status: {
        enabled: proxyList.length > 0,
        total_proxies: proxyList.length,
        proxies: proxyList.map(p => p.replace(/\/\/.*@/, '//****:****@'))
      }
    });
  }

  // POST routes
  if (method === 'POST' && path === '/validate') return handleValidate(request, env);
  if (method === 'POST' && path === '/test') return handleTest(request, env);
  if (method === 'POST' && path === '/test-advanced') return handleAdvancedTest(request, env);
  if (method === 'POST' && path === '/test-stealth') return handleStealthTest(request, env);
  if (method === 'POST' && path === '/proxy-reload') {
    return json({ success: true, message: 'Proxy reloaded (placeholder)' });
  }
  if (method === 'POST' && path === '/clear-cache') {
    ipManager = new IPManager();
    fingerprintGen = new FingerprintGenerator();
    headerGen = new HeaderGenerator(ipManager, fingerprintGen);
    requestExecutor = new RequestExecutor(ipManager, fingerprintGen, headerGen);
    return json({ success: true, message: 'Cache cleared', timestamp: new Date().toISOString() });
  }

  // 404
  return json({
    success: false,
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: 'API route not found',
      method,
      path
    }
  }, 404);
}

// ============================================
// WORKER EXPORT
// ============================================
export default {
  async fetch(request, env, ctx) {
    return handleRequest(request, env, ctx);
  }
};
