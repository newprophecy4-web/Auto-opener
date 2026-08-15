// ============================================================
// MULTI-TIME LINK OPENER - ENTERPRISE BYPASS SYSTEM v4.0.0
// ============================================================
// Features:
//  - 12 geographic IP pools (US, EU, ASIA, UK, CA, AU, BR, IN, JP, CN, RU, ZA)
//  - 5 bypass levels: low, medium, high, ultra, stealth
//  - BrightData proxy API integration (fallback to direct fetch)
//  - Automatic retries with exponential backoff + jitter
//  - Advanced statistics (percentiles, std dev, success rate)
//  - Rate limiting (35 req/min per IP)
//  - Full CORS support
// ============================================================

const SERVICE_NAME = "Multi Time Link Opener - Advanced Bypass";
const VERSION = "4.0.0";

// ------------------------------------------------------------------
// Configuration
// ------------------------------------------------------------------
const CONFIG = {
  maxTestCount: 500,
  defaultTimeout: 15000,
  rateLimitPerMinute: 35,
  maxRetries: 50,
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

// ------------------------------------------------------------------
// BrightData Proxy Manager (API-based)
// ------------------------------------------------------------------
class BrightDataProxyManager {
  constructor(apiKey, proxyEndpoint) {
    this.apiKey = apiKey;
    this.proxyEndpoint = proxyEndpoint;
  }

  async fetchViaProxy(targetUrl, headers, timeoutMs) {
    if (this.apiKey) {
      // Official BrightData API
      const response = await fetch('https://api.brightdata.com/request', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: targetUrl.toString(),
          headers: headers,
          timeout: timeoutMs
        })
      });
      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`BrightData API error (${response.status}): ${errText}`);
      }
      const data = await response.json();
      return new Response(data.body, {
        status: data.status || 200,
        statusText: data.statusText || '',
        headers: data.headers || {}
      });
    } else if (this.proxyEndpoint) {
      // Custom proxy service
      const response = await fetch(this.proxyEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.apiKey ? { 'Authorization': `Bearer ${this.apiKey}` } : {})
        },
        body: JSON.stringify({
          url: targetUrl.toString(),
          headers: headers,
          timeout: timeoutMs
        })
      });
      if (!response.ok) {
        throw new Error(`Proxy service error: ${response.status}`);
      }
      const data = await response.json();
      return new Response(data.body, {
        status: data.status || 200,
        statusText: data.statusText || '',
        headers: data.headers || {}
      });
    } else {
      throw new Error('No proxy configuration provided (BRIGHTDATA_API_KEY or BRIGHTDATA_PROXY required)');
    }
  }
}

// ------------------------------------------------------------------
// IP Manager – generates realistic IPs per region
// ------------------------------------------------------------------
class IPManager {
  constructor() {
    this.usedIPs = new Set();
    this.blacklistedIPs = new Set();
    this.sessionIPs = new Map();
  }

  generateIP(region = 'US', seed = 0) {
    const generators = {
      'US': this._getUSIP,
      'EU': this._getEUIP,
      'ASIA': this._getAsiaIP,
      'UK': this._getUKIP,
      'CA': this._getCAIP,
      'AU': this._getAUIP,
      'BR': this._getBRIP,
      'IN': this._getINIP,
      'JP': this._getJPIP,
      'CN': this._getCNIP,
      'RU': this._getRUIP,
      'ZA': this._getZAIP
    };
    const generator = generators[region] || this._getUSIP;
    return generator.call(this, seed);
  }

  getNextIP(region, requestNumber) {
    let ip, attempts = 0;
    do {
      ip = this.generateIP(region, requestNumber + attempts);
      attempts++;
    } while (this.usedIPs.has(ip) && attempts < 100);
    this.usedIPs.add(ip);
    if (this.usedIPs.size > 10000) this.usedIPs.clear();
    return ip;
  }

  // --- Region specific generators ---
  _getUSIP(seed) {
    const prefixes = ['12','23','34','45','56','67','68','69','70','71','72','73','74','75','76','77','78','79','80','81','82','83','84','85','86','87','88','89','90','91','92','93','94','95','96','97','98','99'];
    const p = prefixes[seed % prefixes.length];
    const s = this._random(1,254), t = this._random(1,254), f = this._random(1,254);
    return `${p}.${s}.${t}.${f}`;
  }
  _getEUIP(seed) {
    const prefixes = ['2','3','4','5','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','58','59','60','61','62','63','64','65','66','67','68','69','70','71','72','73','74','75','76','77','78','79','80','81','82','83','84','85','86','87','88','89','90','91','92','93','94','95','96','97','98','99','100','101','102','103','104','105','106','107','108','109','110','111','112','113','114','115','116','117','118','119','120','121','122','123','124','125','126','127','128','129','130','131','132','133','134','135','136','137','138','139','140','141','142','143','144','145','146','147','148','149','150','151','152','153','154','155','156','157','158','159','160','161','162','163','164','165','166','167','168','169','170','171','172','173','174','175','176','177','178','179','180','181','182','183','184','185','186','187','188','189','190'];
    const p = prefixes[seed % prefixes.length];
    const s = this._random(1,254), t = this._random(1,254), f = this._random(1,254);
    return `${p}.${s}.${t}.${f}`;
  }
  _getAsiaIP(seed) {
    const prefixes = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','58','59','60','61','62','63','64','65','66','67','68','69','70','71','72','73','74','75','76','77','78','79','80','81','82','83','84','85','86','87','88','89','90','91','92','93','94','95','96','97','98','99','100','101','102','103','104','105','106','107','108','109','110','111','112','113','114','115','116','117','118','119','120','121','122','123','124','125','126','127','128','129','130','131','132','133','134','135','136','137','138','139','140','141','142','143','144','145','146','147','148','149','150','151','152','153','154','155','156','157','158','159','160','161','162','163','164','165','166','167','168','169','170','171','172','173','174','175','176','177','178','179','180','181','182','183','184','185','186','187','188','189','190','191','192','193','194','195','196','197','198','199','200','201','202','203','204','205','206','207','208','209','210','211','212','213','214','215','216','217','218','219','220','221','222','223'];
    const p = prefixes[seed % prefixes.length];
    const s = this._random(1,254), t = this._random(1,254), f = this._random(1,254);
    return `${p}.${s}.${t}.${f}`;
  }
  _getUKIP(seed) {
    const prefixes = ['2','3','4','5','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','58','59','60','61','62','63','64','65','66','67','68','69','70','71','72','73','74','75','76','77','78','79','80','81','82','83','84','85','86','87','88','89','90','91','92','93','94','95','96','97','98','99','100','101','102','103','104','105','106','107','108','109','110','111','112','113','114','115','116','117','118','119','120','121','122','123','124','125','126','127','128','129','130','131','132','133','134','135','136','137','138','139','140','141','142','143','144','145','146','147','148','149','150','151','152','153','154','155','156','157','158','159','160','161','162','163','164','165','166','167','168','169','170','171','172','173','174','175','176','177','178','179','180','181','182','183','184','185','186','187','188','189','190','191','192','193','194','195','196','197','198','199','200','201','202','203','204','205','206','207','208','209','210','211','212','213','214','215','216','217','218','219','220','221','222'];
    const p = prefixes[seed % prefixes.length];
    const s = this._random(1,254), t = this._random(1,254), f = this._random(1,254);
    return `${p}.${s}.${t}.${f}`;
  }
  _getCAIP(seed) {
    const prefixes = ['23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','58','59','60','61','62','63','64','65','66','67','68','69','70','71','72','73','74','75','76','77','78','79','80','81','82','83','84','85','86','87','88','89','90','91','92','93','94','95','96','97','98','99','100','101','102','103','104','105','106','107','108','109','110','111','112','113','114','115','116','117','118','119','120','121','122','123','124','125','126','127','128','129','130','131','132','133','134','135','136','137','138','139','140','141','142','143','144','145','146','147','148','149','150','151','152','153','154','155','156','157','158','159','160','161','162','163','164','165','166','167','168','169','170','171','172','173','174','175','176','177','178','179','180','181','182','183','184','185','186','187','188','189','190','191','192','193','194','195','196','197','198','199','200','201','202','203','204','205','206','207','208','209','210','211','212','213','214','215','216','217','218','219','220','221','222','223'];
    const p = prefixes[seed % prefixes.length];
    const s = this._random(1,254), t = this._random(1,254), f = this._random(1,254);
    return `${p}.${s}.${t}.${f}`;
  }
  _getAUIP(seed) {
    const prefixes = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','58','59','60','61','62','63','64','65','66','67','68','69','70','71','72','73','74','75','76','77','78','79','80','81','82','83','84','85','86','87','88','89','90','91','92','93','94','95','96','97','98','99','100','101','102','103','104','105','106','107','108','109','110','111','112','113','114','115','116','117','118','119','120','121','122','123','124','125','126','127','128','129','130','131','132','133','134','135','136','137','138','139','140','141','142','143','144','145','146','147','148','149','150','151','152','153','154','155','156','157','158','159','160','161','162','163','164','165','166','167','168','169','170','171','172','173','174','175','176','177','178','179','180','181','182','183','184','185','186','187','188','189','190','191','192','193','194','195','196','197','198','199','200','201','202','203','204','205','206','207','208','209','210','211','212','213','214','215','216','217','218','219','220','221','222'];
    const p = prefixes[seed % prefixes.length];
    const s = this._random(1,254), t = this._random(1,254), f = this._random(1,254);
    return `${p}.${s}.${t}.${f}`;
  }
  _getBRIP(seed) {
    const prefixes = ['177','178','179','180','181','182','183','184','185','186','187','188','189','190','191','192','193','194','195','196','197','198','199','200','201','202','203','204','205','206','207','208','209','210','211','212','213','214','215','216','217','218','219','220','221','222','223'];
    const p = prefixes[seed % prefixes.length];
    const s = this._random(1,254), t = this._random(1,254), f = this._random(1,254);
    return `${p}.${s}.${t}.${f}`;
  }
  _getINIP(seed) {
    const prefixes = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','58','59','60','61','62','63','64','65','66','67','68','69','70','71','72','73','74','75','76','77','78','79','80','81','82','83','84','85','86','87','88','89','90','91','92','93','94','95','96','97','98','99','100','101','102','103','104','105','106','107','108','109','110','111','112','113','114','115','116','117','118','119','120','121','122','123','124','125','126','127','128','129','130','131','132','133','134','135','136','137','138','139','140','141','142','143','144','145','146','147','148','149','150','151','152','153','154','155','156','157','158','159','160','161','162','163','164','165','166','167','168','169','170','171','172','173','174','175','176','177','178','179','180','181','182','183','184','185','186','187','188','189','190','191','192','193','194','195','196','197','198','199','200','201','202','203','204','205','206','207','208','209','210','211','212','213','214','215','216','217','218','219','220','221','222','223'];
    const p = prefixes[seed % prefixes.length];
    const s = this._random(1,254), t = this._random(1,254), f = this._random(1,254);
    return `${p}.${s}.${t}.${f}`;
  }
  _getJPIP(seed) {
    const prefixes = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','58','59','60','61','62','63','64','65','66','67','68','69','70','71','72','73','74','75','76','77','78','79','80','81','82','83','84','85','86','87','88','89','90','91','92','93','94','95','96','97','98','99','100','101','102','103','104','105','106','107','108','109','110','111','112','113','114','115','116','117','118','119','120','121','122','123','124','125','126','127','128','129','130','131','132','133','134','135','136','137','138','139','140','141','142','143','144','145','146','147','148','149','150','151','152','153','154','155','156','157','158','159','160','161','162','163','164','165','166','167','168','169','170','171','172','173','174','175','176','177','178','179','180','181','182','183','184','185','186','187','188','189','190','191','192','193','194','195','196','197','198','199','200','201','202','203','204','205','206','207','208','209','210','211','212','213','214','215','216','217','218','219','220','221','222'];
    const p = prefixes[seed % prefixes.length];
    const s = this._random(1,254), t = this._random(1,254), f = this._random(1,254);
    return `${p}.${s}.${t}.${f}`;
  }
  _getCNIP(seed) {
    const prefixes = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','58','59','60','61','62','63','64','65','66','67','68','69','70','71','72','73','74','75','76','77','78','79','80','81','82','83','84','85','86','87','88','89','90','91','92','93','94','95','96','97','98','99','100','101','102','103','104','105','106','107','108','109','110','111','112','113','114','115','116','117','118','119','120','121','122','123','124','125','126','127','128','129','130','131','132','133','134','135','136','137','138','139','140','141','142','143','144','145','146','147','148','149','150','151','152','153','154','155','156','157','158','159','160','161','162','163','164','165','166','167','168','169','170','171','172','173','174','175','176','177','178','179','180','181','182','183','184','185','186','187','188','189','190','191','192','193','194','195','196','197','198','199','200','201','202','203','204','205','206','207','208','209','210','211','212','213','214','215','216','217','218','219','220','221','222','223'];
    const p = prefixes[seed % prefixes.length];
    const s = this._random(1,254), t = this._random(1,254), f = this._random(1,254);
    return `${p}.${s}.${t}.${f}`;
  }
  _getRUIP(seed) {
    const prefixes = ['2','3','4','5','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','58','59','60','61','62','63','64','65','66','67','68','69','70','71','72','73','74','75','76','77','78','79','80','81','82','83','84','85','86','87','88','89','90','91','92','93','94','95','96','97','98','99','100','101','102','103','104','105','106','107','108','109','110','111','112','113','114','115','116','117','118','119','120','121','122','123','124','125','126','127','128','129','130','131','132','133','134','135','136','137','138','139','140','141','142','143','144','145','146','147','148','149','150','151','152','153','154','155','156','157','158','159','160','161','162','163','164','165','166','167','168','169','170','171','172','173','174','175','176','177','178','179','180','181','182','183','184','185','186','187','188','189','190'];
    const p = prefixes[seed % prefixes.length];
    const s = this._random(1,254), t = this._random(1,254), f = this._random(1,254);
    return `${p}.${s}.${t}.${f}`;
  }
  _getZAIP(seed) {
    const prefixes = ['41','102','105','129','146','147','148','149','150','151','152','153','154','155','156','157','158','159','160','161','162','163','164','165','166','167','168','169','170','171','172','173','174','175','176','177','178','179','180','181','182','183','184','185','186','187','188','189','190','191','192','193','194','195','196','197','198','199','200','201','202','203','204','205','206','207','208','209','210','211','212','213','214','215','216','217','218','219','220','221','222','223'];
    const p = prefixes[seed % prefixes.length];
    const s = this._random(1,254), t = this._random(1,254), f = this._random(1,254);
    return `${p}.${s}.${t}.${f}`;
  }

  _random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getProxyIP(proxyUrl) {
    try {
      return new URL(proxyUrl).hostname;
    } catch {
      return null;
    }
  }
}

// ------------------------------------------------------------------
// Fingerprint Generator
// ------------------------------------------------------------------
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
      browser,
      version: this._getBrowserVersion(userAgent)
    };
  }

  _getBrowserVersion(ua) {
    const m = ua.match(/(Chrome|Firefox|Safari|Edge)\/(\d+)/);
    return m ? parseInt(m[2], 10) : 0;
  }
}

// ------------------------------------------------------------------
// Advanced Header Generator
// ------------------------------------------------------------------
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
      'https://www.reddit.com/',
      'https://www.youtube.com/',
      'https://www.amazon.com/',
      'https://www.ebay.com/',
      'https://www.wikipedia.org/',
      'https://www.nytimes.com/',
      'https://www.wsj.com/',
      'https://www.github.com/'
    ];
  }

  generateHeaders(region, requestNumber, bypassLevel, sessionId) {
    const fp = this.fingerprintGen.getFingerprint(requestNumber);
    const clientIP = this.ipManager.getNextIP(region, requestNumber);

    const headers = {
      'User-Agent': fp.userAgent,
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'Accept-Language': this._getAcceptLanguage(region, requestNumber),
      'Accept-Encoding': this._getAcceptEncoding(requestNumber),
      'Accept-Charset': 'utf-8, ISO-8859-1;q=0.7, *;q=0.7',
      'Connection': 'keep-alive',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Upgrade-Insecure-Requests': '1',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-User': '?1',
      'X-Requested-With': 'XMLHttpRequest',
      'X-Forwarded-For': clientIP,
      'X-Real-IP': clientIP,
      'X-Originating-IP': clientIP,
      'X-Remote-IP': clientIP,
      'X-Remote-Addr': clientIP,
      'X-Client-IP': clientIP,
      'CF-Connecting-IP': clientIP,
      'True-Client-IP': clientIP,
      'X-Geo-Region': region,
      'CF-Geo-Region': region,
      'X-Geo-Country': this._getCountryCode(region),
      'DNT': '1',
      'Sec-GPC': '1',
      'Referer': this._getReferer(requestNumber),
      'Origin': this._getOrigin(requestNumber),
      'Sec-Ch-Ua': fp.secChUa,
      'Sec-Ch-Ua-Platform': `"${fp.platform}"`,
      'Sec-Ch-Ua-Mobile': '?0',
      'Priority': 'u=0, i',
      'Te': 'trailers',
      'Save-Data': 'off',
    };

    this._addBypassHeaders(headers, bypassLevel, requestNumber, region, fp);
    return headers;
  }

  _addBypassHeaders(headers, level, reqNum, region, fp) {
    switch (level) {
      case 'stealth':
        headers['Sec-Ch-Ua'] = `"${fp.browser}";v="${fp.version}", "Not_A Brand";v="8"`;
        headers['Sec-Ch-Ua-Platform'] = `"${fp.platform}"`;
        headers['Sec-Ch-Ua-Mobile'] = '?0';
        headers['X-Device-Id'] = this._generateDeviceId(reqNum);
        headers['X-Session-Id'] = this._generateSessionId(reqNum);
        headers['X-Browser-Fingerprint'] = this._generateBrowserFingerprint(fp);
        headers['X-Request-ID'] = this._generateRequestId();
        headers['Cookie'] = this._generateCookies(reqNum);
        headers['Accept-Push'] = 'idempotent';
        headers['Accept-Signature'] = 'sig1;sig2';
        headers['Alt-Used'] = `${reqNum % 2 === 0 ? 'https' : 'http'}`;
        headers['Content-Digest'] = this._generateContentDigest();
        headers['Repr-Digest'] = this._generateReprDigest();
        headers['Want-Content-Digest'] = 'sha-256=*';
        headers['Want-Repr-Digest'] = 'sha-256=*';
        if (reqNum % 3 === 0) {
          headers['X-Forwarded-Proto'] = 'https';
          headers['X-Forwarded-Host'] = 'www.google.com';
          headers['X-Forwarded-Port'] = '443';
        }
        break;
      case 'ultra':
        headers['Accept-Language'] = this._getAcceptLanguage(region, reqNum, true);
        headers['Accept-Encoding'] = 'gzip, deflate, br, zstd';
        headers['Sec-Ch-Ua'] = `"${fp.browser}";v="${fp.version}", "Not_A Brand";v="8"`;
        headers['X-Request-ID'] = this._generateRequestId();
        headers['X-Trace-Id'] = this._generateTraceId();
        headers['X-Span-Id'] = this._generateSpanId();
        headers['X-Parent-Id'] = this._generateParentId();
        headers['Cookie'] = this._generateCookies(reqNum);
        headers['X-Device-Id'] = this._generateDeviceId(reqNum);
        break;
      case 'high':
        headers['Accept-Language'] = this._getAcceptLanguage(region, reqNum, true);
        headers['Cookie'] = this._generateCookies(reqNum);
        headers['X-Request-ID'] = this._generateRequestId();
        headers['X-Trace-Id'] = this._generateTraceId();
        this._addRandomHeaders(headers, reqNum);
        break;
      case 'medium':
        headers['Accept-Language'] = this._getAcceptLanguage(region, reqNum);
        headers['Cookie'] = this._generateCookies(reqNum);
        break;
      default: // low – minimal changes
        break;
    }
  }

  _getAcceptLanguage(region, reqNum, advanced = false) {
    const map = {
      'US': ['en-US,en;q=0.9', 'en;q=0.9,en-US;q=0.8', 'en-US;q=0.9,en;q=0.8,es;q=0.7'],
      'UK': ['en-GB,en;q=0.9', 'en;q=0.9,en-GB;q=0.8', 'en-GB;q=0.9,en;q=0.8,fr;q=0.7'],
      'EU': ['en;q=0.9,de;q=0.8,fr;q=0.7', 'de;q=0.9,en;q=0.8,fr;q=0.7', 'fr;q=0.9,en;q=0.8,de;q=0.7'],
      'ASIA': ['en;q=0.9,zh;q=0.8,ja;q=0.7', 'zh;q=0.9,en;q=0.8,ja;q=0.7', 'ja;q=0.9,en;q=0.8,zh;q=0.7'],
      'CA': ['en-CA,en;q=0.9', 'en;q=0.9,en-CA;q=0.8,fr;q=0.7'],
      'AU': ['en-AU,en;q=0.9', 'en;q=0.9,en-AU;q=0.8'],
      'BR': ['pt-BR,pt;q=0.9,en;q=0.8', 'pt;q=0.9,pt-BR;q=0.8,en;q=0.7'],
      'IN': ['en-IN,en;q=0.9', 'en;q=0.9,en-IN;q=0.8,hi;q=0.7'],
      'JP': ['ja-JP,ja;q=0.9,en;q=0.8', 'ja;q=0.9,ja-JP;q=0.8,en;q=0.7'],
      'CN': ['zh-CN,zh;q=0.9,en;q=0.8', 'zh;q=0.9,zh-CN;q=0.8,en;q=0.7'],
      'RU': ['ru-RU,ru;q=0.9,en;q=0.8', 'ru;q=0.9,ru-RU;q=0.8,en;q=0.7'],
      'ZA': ['en-ZA,en;q=0.9', 'en;q=0.9,en-ZA;q=0.8,af;q=0.7']
    };
    const list = map[region] || map['US'];
    return advanced ? list.join(', ') : list[reqNum % list.length];
  }

  _getAcceptEncoding(reqNum) {
    const enc = ['gzip, deflate, br', 'gzip, deflate, br, zstd', 'br, gzip, deflate', 'gzip, deflate'];
    return enc[reqNum % enc.length];
  }

  _getCountryCode(region) {
    const code = { US:'US', UK:'GB', EU:'EU', ASIA:'AS', CA:'CA', AU:'AU', BR:'BR', IN:'IN', JP:'JP', CN:'CN', RU:'RU', ZA:'ZA' };
    return code[region] || 'US';
  }

  _getReferer(reqNum) {
    const base = this.referers[reqNum % this.referers.length];
    const query = Math.random().toString(36).substring(7);
    return `${base}${query}`;
  }

  _getOrigin(reqNum) {
    const origins = ['https://www.google.com','https://www.bing.com','https://search.yahoo.com','https://duckduckgo.com','https://www.facebook.com'];
    return origins[reqNum % origins.length];
  }

  _generateRequestId() {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  }
  _generateTraceId() {
    return `00-${this._generateHex(32)}-${this._generateHex(16)}-01`;
  }
  _generateSpanId() { return this._generateHex(16); }
  _generateParentId() { return this._generateHex(16); }

  _generateHex(len) {
    let out = '';
    for (let i=0; i<len; i++) out += Math.floor(Math.random()*16).toString(16);
    return out;
  }

  _generateDeviceId(reqNum) {
    const hash = this._simpleHash(`${reqNum}${Date.now()}`);
    return `device-${hash.substring(0,16)}`;
  }

  _generateSessionId(reqNum) {
    const hash = this._simpleHash(`${reqNum}-${Date.now()}-${Math.random()}`);
    return `session-${hash.substring(0,20)}`;
  }

  _generateBrowserFingerprint(fp) {
    const hash = this._simpleHash(`${fp.userAgent}|${fp.platform}|${Date.now()}`);
    return hash.substring(0,32);
  }

  _generateCookies(reqNum) {
    const names = ['_ga','_gid','_gat','_fbp','_clck','_clsk','__cfduid','__cf_bm','__cflb'];
    const cookies = [];
    for (let i=0; i<5+(reqNum%3); i++) {
      const name = names[i % names.length];
      const value = this._generateCookieValue(reqNum+i);
      cookies.push(`${name}=${value}`);
    }
    cookies.push(`session=${this._generateSessionId(reqNum)}`);
    return cookies.join('; ');
  }

  _generateCookieValue(seed) {
    const len = 10 + (seed % 10);
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let val = '';
    for (let i=0; i<len; i++) val += chars[Math.floor(Math.random()*chars.length)];
    return val;
  }

  _addRandomHeaders(headers, reqNum) {
    const extra = ['X-Custom-Header','X-Client-Data','X-Client-Version','X-Source','X-Destination','X-Correlation-ID','X-Transaction-ID','X-User-ID','X-Session-ID'];
    const count = 2 + (reqNum % 3);
    for (let i=0; i<count; i++) {
      const name = extra[(reqNum+i) % extra.length];
      const value = this._generateCookieValue(reqNum+i);
      headers[name] = value;
    }
  }

  _generateContentDigest() { return `sha-256=:${this._generateHex(32)}:`; }
  _generateReprDigest() { return `sha-256=:${this._generateHex(32)}:`; }

  _simpleHash(str) {
    let hash = 0;
    for (let i=0; i<str.length; i++) {
      const ch = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + ch;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  }
}

// ------------------------------------------------------------------
// Request Executor – handles retries, proxy, and statistics
// ------------------------------------------------------------------
class RequestExecutor {
  constructor(ipManager, fingerprintGen, headerGen, brightDataManager) {
    this.ipManager = ipManager;
    this.fingerprintGen = fingerprintGen;
    this.headerGen = headerGen;
    this.brightDataManager = brightDataManager;
    this.executionHistory = [];
  }

  async executeRequest(targetUrl, region, requestNumber, timeoutMs, bypassLevel, useProxy, env) {
    const startTime = Date.now();
    const sessionId = this.headerGen._generateSessionId(requestNumber);
    const headers = this.headerGen.generateHeaders(region, requestNumber, bypassLevel, sessionId);

    let proxyType = 'none';
    let lastError = null;
    let attempt = 0;
    const maxRetries = CONFIG.maxRetries;

    while (attempt < maxRetries) {
      attempt++;
      const attemptStart = Date.now();

      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeoutMs);

        const fetchOptions = {
          method: 'GET',
          redirect: 'manual',
          signal: controller.signal,
          headers: headers,
        };

        let response;
        if (useProxy) {
          const hasBrightData = !!(env.BRIGHTDATA_API_KEY || env.BRIGHTDATA_PROXY);
          if (hasBrightData) {
            try {
              response = await this.brightDataManager.fetchViaProxy(targetUrl, headers, timeoutMs);
              proxyType = 'brightdata';
            } catch (proxyErr) {
              // fallback to direct
              console.warn('BrightData proxy failed, falling back to direct:', proxyErr.message);
              response = await fetch(targetUrl.toString(), fetchOptions);
              proxyType = 'fallback-direct';
            }
          } else {
            response = await fetch(targetUrl.toString(), fetchOptions);
            proxyType = 'direct';
          }
        } else {
          response = await fetch(targetUrl.toString(), fetchOptions);
          proxyType = 'direct';
        }

        clearTimeout(timer);

        const totalTime = Date.now() - startTime;
        const result = {
          request: requestNumber,
          attempt,
          success: response.status >= 200 && response.status < 400,
          status: response.status,
          responseTimeMs: totalTime,
          attemptTimeMs: Date.now() - attemptStart,
          proxy_used: useProxy,
          proxy_type: proxyType,
          region,
          bypass_level: bypassLevel,
          ip_used: headers['X-Forwarded-For'],
          session_id: sessionId,
          user_agent: headers['User-Agent'],
          headers_count: Object.keys(headers).length,
        };

        if (!result.success && this._shouldRetry(response.status, attempt)) {
          await this._sleep(this._getRetryDelay(attempt));
          continue;
        }

        this.executionHistory.push(result);
        return result;

      } catch (err) {
        lastError = err;
        const totalTime = Date.now() - startTime;
        if (attempt < maxRetries && this._isRetryable(err)) {
          await this._sleep(this._getRetryDelay(attempt));
          continue;
        }

        const result = {
          request: requestNumber,
          attempt,
          success: false,
          error: err.message || 'Request failed',
          responseTimeMs: totalTime,
          proxy_used: useProxy,
          proxy_type: proxyType,
          region,
          bypass_level: bypassLevel,
          session_id: sessionId,
          user_agent: headers['User-Agent'],
        };
        this.executionHistory.push(result);
        return result;
      }
    }

    // exhausted
    const result = {
      request: requestNumber,
      attempt: maxRetries,
      success: false,
      error: lastError?.message || 'All retry attempts failed',
      responseTimeMs: Date.now() - startTime,
      proxy_used: useProxy,
      proxy_type: proxyType,
      region,
      bypass_level: bypassLevel,
      session_id: sessionId,
    };
    this.executionHistory.push(result);
    return result;
  }

  _shouldRetry(status, attempt) {
    const retryable = [429, 503, 504, 408, 500, 502];
    return retryable.includes(status) && attempt < CONFIG.maxRetries;
  }

  _isRetryable(err) {
    const names = ['AbortError', 'TimeoutError', 'NetworkError'];
    return names.some(n => err.name === n || err.message.includes(n));
  }

  _getRetryDelay(attempt) {
    const base = 1000;
    const max = 30000;
    const exp = Math.min(base * Math.pow(2, attempt), max);
    const jitter = Math.random() * 500;
    return exp + jitter;
  }

  _sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getExecutionStats() {
    const total = this.executionHistory.length;
    if (total === 0) return { successRate: 0, avgResponseTime: 0, totalRequests: 0, successfulRequests: 0, failedRequests: 0 };
    const successful = this.executionHistory.filter(r => r.success).length;
    const avg = this.executionHistory.reduce((s, r) => s + r.responseTimeMs, 0) / total;
    return {
      successRate: (successful / total) * 100,
      avgResponseTime: Math.round(avg),
      totalRequests: total,
      successfulRequests: successful,
      failedRequests: total - successful
    };
  }
}

// ------------------------------------------------------------------
// Rate Limiter
// ------------------------------------------------------------------
const rateLimitBuckets = new Map();

function checkRateLimit(request, env) {
  const limit = getPositiveInteger(env.RATE_LIMIT_PER_MINUTE, CONFIG.rateLimitPerMinute);
  const now = Date.now();
  const windowMs = 60000;
  const clientKey = request.headers.get('CF-Connecting-IP') || 'unknown';
  const bucket = rateLimitBuckets.get(clientKey);

  if (!bucket || now >= bucket.windowStartedAt + windowMs) {
    rateLimitBuckets.set(clientKey, { windowStartedAt: now, count: 1 });
    _pruneRateLimitBuckets(now, windowMs);
    return { allowed: true, retryAfterSeconds: 0 };
  }
  if (bucket.count >= limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((bucket.windowStartedAt + windowMs - now) / 1000))
    };
  }
  bucket.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

function _pruneRateLimitBuckets(now, windowMs) {
  if (rateLimitBuckets.size < 1000) return;
  for (const [key, bucket] of rateLimitBuckets) {
    if (now >= bucket.windowStartedAt + windowMs) rateLimitBuckets.delete(key);
  }
}

// ------------------------------------------------------------------
// Utility Functions
// ------------------------------------------------------------------
function getPositiveInteger(value, fallback) {
  const parsed = Number.parseInt(String(value ?? ''), 10);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function getDelayByLevel(level) {
  const map = { low:100, medium:300, high:500, ultra:800, stealth:1200 };
  return map[level] || 300;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  };
}

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'Cache-Control': 'no-store',
      ...corsHeaders(),
      ...extraHeaders,
    },
  });
}

function errorResponse(error, status, extraHeaders = {}) {
  return json({ success: false, error }, status, extraHeaders);
}

function validateTargetUrl(rawUrl, env) {
  let targetUrl;
  try { targetUrl = new URL(rawUrl.trim()); } catch { return { ok: false, status: 400, error: 'Invalid URL' }; }
  if (!/^https?:$/.test(targetUrl.protocol)) return { ok: false, status: 400, error: 'Unsupported protocol' };
  if (targetUrl.username || targetUrl.password) return { ok: false, status: 400, error: 'Credentials not allowed' };
  if (!targetUrl.hostname || isSuspiciousHostname(targetUrl.hostname)) return { ok: false, status: 400, error: 'Invalid host' };
  const allowed = env.ALLOWED_HOSTS || '*';
  if (allowed !== '*' && !isAllowedHost(targetUrl.hostname, env)) return { ok: false, status: 403, error: 'Domain not allowed' };
  return { ok: true, url: targetUrl };
}

function getAllowedHosts(env) {
  return String(env.ALLOWED_HOSTS || '').split(',').map(h => h.trim().toLowerCase().replace(/\.$/, '')).filter(Boolean);
}

function isAllowedHost(hostname, env) {
  const normalized = hostname.toLowerCase().replace(/\.$/, '');
  return getAllowedHosts(env).some(allowed => allowed === normalized);
}

function isSuspiciousHostname(hostname) {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, '');
  const suspicious = new Set(['localhost','localhost.localdomain','ip6-localhost','ip6-loopback','0.0.0.0','::1','::']);
  if (suspicious.has(host) || host.endsWith('.localhost') || host.endsWith('.local')) return true;
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) {
    const oct = host.split('.').map(Number);
    if (oct.some(o => o<0 || o>255)) return true;
    const [a,b] = oct;
    return (a===0 || a===10 || a===127 || (a===169 && b===254) || (a===172 && b>=16 && b<=31) || (a===192 && b===168));
  }
  return host.includes(':');
}

function calculateAdvancedStatistics(results) {
  const successful = results.filter(r => r.success).length;
  const failed = results.length - successful;
  const times = results.map(r => r.responseTimeMs).filter(v => Number.isFinite(v));
  if (times.length === 0) {
    return { successful, failed, successRate: 0, averageResponseTimeMs: 0, minResponseTimeMs: 0, maxResponseTimeMs: 0, medianResponseTimeMs: 0, p95ResponseTimeMs: 0, p99ResponseTimeMs: 0 };
  }
  const sorted = [...times].sort((a,b) => a-b);
  const total = times.reduce((s,v) => s+v, 0);
  const medianIdx = Math.floor(sorted.length/2);
  const p95Idx = Math.floor(sorted.length * 0.95);
  const p99Idx = Math.floor(sorted.length * 0.99);
  const mean = total / times.length;
  const sqDiff = times.map(v => (v - mean) ** 2);
  const stdDev = Math.sqrt(sqDiff.reduce((s,v) => s+v, 0) / times.length);
  return {
    successful,
    failed,
    successRate: Number(((successful / results.length) * 100).toFixed(2)),
    averageResponseTimeMs: Math.round(mean),
    minResponseTimeMs: Math.min(...times),
    maxResponseTimeMs: Math.max(...times),
    medianResponseTimeMs: sorted[medianIdx] || 0,
    p95ResponseTimeMs: sorted[p95Idx] || sorted[sorted.length-1] || 0,
    p99ResponseTimeMs: sorted[p99Idx] || sorted[sorted.length-1] || 0,
    total_response_time_ms: total,
    stdDevResponseTimeMs: Math.round(stdDev)
  };
}

// ------------------------------------------------------------------
// Main Worker
// ------------------------------------------------------------------
let ipManager = new IPManager();
let fingerprintGen = new FingerprintGenerator();
let headerGen = new HeaderGenerator(ipManager, fingerprintGen);
let brightDataManager = new BrightDataProxyManager();
let requestExecutor = new RequestExecutor(ipManager, fingerprintGen, headerGen, brightDataManager);

export default {
  async fetch(request, env, ctx) {
    brightDataManager.apiKey = env.BRIGHTDATA_API_KEY || '';
    brightDataManager.proxyEndpoint = env.BRIGHTDATA_PROXY || '';
    return handleRequest(request, env);
  },
};

async function handleRequest(request, env) {
  const url = new URL(request.url);
  const method = request.method.toUpperCase();

  if (method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders() });
  }

  // --- Routes ---
  if (method === 'GET' && url.pathname === '/') {
    return json({
      success: true,
      service: SERVICE_NAME,
      status: 'online',
      version: VERSION,
      features: {
        bypass_levels: Object.values(CONFIG.bypassLevels),
        regions: ['US','UK','EU','ASIA','CA','AU','BR','IN','JP','CN','RU','ZA'],
        max_retries: CONFIG.maxRetries,
        ip_rotation: true,
        fingerprint_rotation: true,
        session_management: true,
        proxy_support: {
          brightdata: !!(env.BRIGHTDATA_API_KEY || env.BRIGHTDATA_PROXY),
          custom: !!env.PROXY_LIST
        }
      }
    });
  }

  if (method === 'GET' && url.pathname === '/health') {
    const stats = requestExecutor.getExecutionStats();
    return json({
      success: true,
      status: 'healthy',
      service: SERVICE_NAME,
      timestamp: new Date().toISOString(),
      stats,
      proxy_status: {
        brightdata_configured: !!(env.BRIGHTDATA_API_KEY || env.BRIGHTDATA_PROXY)
      }
    });
  }

  if (method === 'POST' && url.pathname === '/validate') {
    return handleValidate(request, env);
  }

  if (method === 'POST' && url.pathname === '/test') {
    return handleTest(request, env);
  }

  if (method === 'POST' && url.pathname === '/test-advanced') {
    return handleAdvancedTest(request, env);
  }

  if (method === 'POST' && url.pathname === '/test-stealth') {
    return handleStealthTest(request, env);
  }

  if (method === 'GET' && url.pathname === '/stats') {
    const stats = requestExecutor.getExecutionStats();
    return json({
      success: true,
      timestamp: new Date().toISOString(),
      ...stats,
      proxy_status: {
        brightdata_configured: !!(env.BRIGHTDATA_API_KEY || env.BRIGHTDATA_PROXY)
      }
    });
  }

  if (method === 'POST' && url.pathname === '/clear-cache') {
    ipManager = new IPManager();
    fingerprintGen = new FingerprintGenerator();
    headerGen = new HeaderGenerator(ipManager, fingerprintGen);
    brightDataManager = new BrightDataProxyManager(env.BRIGHTDATA_API_KEY || '', env.BRIGHTDATA_PROXY || '');
    requestExecutor = new RequestExecutor(ipManager, fingerprintGen, headerGen, brightDataManager);
    return json({
      success: true,
      message: 'Cache cleared successfully',
      timestamp: new Date().toISOString()
    });
  }

  return errorResponse('Route not found', 404);
}

// ------------------------------------------------------------------
// Request Handlers
// ------------------------------------------------------------------
async function handleValidate(request, env) {
  let body;
  try { body = await request.json(); } catch { return errorResponse('Invalid JSON', 400); }
  if (!body || typeof body.url !== 'string' || !body.url.trim()) return errorResponse('URL required', 400);
  const validation = validateTargetUrl(body.url, env);
  if (!validation.ok) return errorResponse(validation.error, validation.status);
  return json({
    success: true,
    allowed: true,
    hostname: validation.url.hostname,
    validation_level: 'full',
    bypass_capable: true
  });
}

async function handleTest(request, env) {
  const limit = checkRateLimit(request, env);
  if (!limit.allowed) {
    return errorResponse('Too many requests. Try again later.', 429, { 'Retry-After': String(limit.retryAfterSeconds) });
  }

  let body;
  try { body = await request.json(); } catch { return errorResponse('Invalid JSON', 400); }
  if (!body || typeof body.url !== 'string' || !body.url.trim()) return errorResponse('URL required', 400);

  const validation = validateTargetUrl(body.url, env);
  if (!validation.ok) return errorResponse(validation.error, validation.status);

  const maxCount = getPositiveInteger(env.MAX_TEST_COUNT, CONFIG.maxTestCount);
  const count = body.count === undefined ? 1 : body.count;
  if (!Number.isInteger(count) || count < 1) return errorResponse('Count must be at least 1', 400);
  if (count > maxCount) return errorResponse(`Count cannot exceed ${maxCount}`, 400);

  const timeoutMs = getPositiveInteger(env.REQUEST_TIMEOUT_MS, CONFIG.defaultTimeout);
  const bypassLevel = body.bypassLevel || 'medium';
  const region = body.region || 'US';
  const useProxies = body.useProxies !== false && !!(env.BRIGHTDATA_API_KEY || env.BRIGHTDATA_PROXY || env.PROXY_LIST);

  const results = [];
  for (let i=1; i<=count; i++) {
    const res = await requestExecutor.executeRequest(validation.url, region, i, timeoutMs, bypassLevel, useProxies, env);
    results.push(res);
    if (i < count) await sleep(getDelayByLevel(bypassLevel));
  }

  const stats = calculateAdvancedStatistics(results);
  return json({
    success: true,
    target: validation.url.hostname,
    total: count,
    completed: results.length,
    region,
    bypass_level: bypassLevel,
    proxy_used: useProxies,
    ...stats,
    results: results.map(r => ({
      request: r.request,
      attempt: r.attempt,
      success: r.success,
      status: r.status,
      responseTimeMs: r.responseTimeMs,
      proxy_used: r.proxy_used,
      proxy_type: r.proxy_type,
      region: r.region,
      bypass_level: r.bypass_level,
      ...(r.error && { error: r.error })
    }))
  });
}

async function handleAdvancedTest(request, env) {
  const limit = checkRateLimit(request, env);
  if (!limit.allowed) {
    return errorResponse('Too many requests. Try again later.', 429, { 'Retry-After': String(limit.retryAfterSeconds) });
  }

  let body;
  try { body = await request.json(); } catch { return errorResponse('Invalid JSON', 400); }
  if (!body || typeof body.url !== 'string' || !body.url.trim()) return errorResponse('URL required', 400);

  const validation = validateTargetUrl(body.url, env);
  if (!validation.ok) return errorResponse(validation.error, validation.status);

  const count = body.count || 10;
  const maxCount = getPositiveInteger(env.MAX_TEST_COUNT, CONFIG.maxTestCount);
  if (count > maxCount) return errorResponse(`Count cannot exceed ${maxCount}`, 400);

  const timeoutMs = getPositiveInteger(env.REQUEST_TIMEOUT_MS, CONFIG.defaultTimeout);
  const useProxies = body.useProxies !== false && !!(env.BRIGHTDATA_API_KEY || env.BRIGHTDATA_PROXY || env.PROXY_LIST);
  const testAllLevels = body.testAllLevels !== false;
  const regions = body.regions || ['US','UK','EU','ASIA'];
  const levels = testAllLevels ? ['low','medium','high','ultra','stealth'] : [body.bypassLevel || 'high'];

  const allResults = [];
  const summary = {};
  for (const region of regions) {
    summary[region] = {};
    for (const level of levels) {
      const results = [];
      const perLevelCount = Math.ceil(count / levels.length);
      for (let i=1; i<=perLevelCount; i++) {
        const res = await requestExecutor.executeRequest(validation.url, region, i, timeoutMs, level, useProxies, env);
        results.push(res);
        allResults.push(res);
        if (i < perLevelCount) await sleep(getDelayByLevel(level));
      }
      summary[region][level] = {
        count: results.length,
        ...calculateAdvancedStatistics(results)
      };
    }
  }

  const overallStats = calculateAdvancedStatistics(allResults);
  return json({
    success: true,
    target: validation.url.hostname,
    total_requests: allResults.length,
    regions_tested: regions,
    levels_tested: levels,
    proxy_used: useProxies,
    overall_stats: overallStats,
    detailed_summary: summary,
    results: allResults.map(r => ({
      request: r.request,
      region: r.region,
      bypass_level: r.bypass_level,
      success: r.success,
      status: r.status,
      responseTimeMs: r.responseTimeMs,
      proxy_type: r.proxy_type,
      ...(r.error && { error: r.error })
    }))
  });
}

async function handleStealthTest(request, env) {
  let body;
  try { body = await request.json(); } catch { body = {}; }
  if (!body.url) return errorResponse('URL required', 400);

  const validation = validateTargetUrl(body.url, env);
  if (!validation.ok) return errorResponse(validation.error, validation.status);

  const count = Math.min(body.count || 3, 10);
  const timeoutMs = getPositiveInteger(env.REQUEST_TIMEOUT_MS, CONFIG.defaultTimeout);
  const useProxies = body.useProxies !== false && !!(env.BRIGHTDATA_API_KEY || env.BRIGHTDATA_PROXY || env.PROXY_LIST);

  const regions = ['US','UK','EU','ASIA','CA','AU','BR'];
  const levels = ['ultra','stealth'];
  const results = [];
  for (let i=1; i<=count; i++) {
    const region = regions[Math.floor(Math.random() * regions.length)];
    const level = levels[i % levels.length];
    await sleep(2000 + Math.random() * 3000);
    const res = await requestExecutor.executeRequest(validation.url, region, i, timeoutMs, level, useProxies, env);
    results.push(res);
  }

  const stats = calculateAdvancedStatistics(results);
  return json({
    success: true,
    target: validation.url.hostname,
    mode: 'stealth',
    total: count,
    ...stats,
    results: results.map(r => ({
      request: r.request,
      region: r.region,
      success: r.success,
      status: r.status,
      responseTimeMs: r.responseTimeMs,
      bypass_level: r.bypass_level,
      proxy_type: r.proxy_type
    }))
  });
}
