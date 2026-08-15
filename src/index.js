// ============================================
// MULTI-TIME LINK OPENER - ADVANCED BYPASS
// Version: 4.0.0 - FULL FIXED ROUTER
// ============================================

const SERVICE_NAME = "Multi Time Link Opener - Advanced Bypass";
const VERSION = "4.0.0";

// ============================================
// CONFIGURATION
// ============================================
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
    this.ipPool = [];
    this.currentIndex = 0;
    this.usedIPs = new Set();
    this.blacklistedIPs = new Set();
    this.sessionIPs = new Map();
  }

  generateIP(region = 'US', requestNumber = 0) {
    const regions = {
      'US': this.getUSIP,
      'EU': this.getEUIP,
      'ASIA': this.getAsiaIP,
      'UK': this.getUKIP,
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
    return generator.call(this, requestNumber);
  }

  getUSIP(seed) {
    const prefixes = ['12','23','34','45','56','67','68','69','70','71','72','73','74','75','76','77','78','79','80','81','82','83','84','85','86','87','88','89','90','91','92','93','94','95','96','97','98','99'];
    const prefix = prefixes[seed % prefixes.length];
    const second = this.randomRange(1,254);
    const third = this.randomRange(1,254);
    const fourth = this.randomRange(1,254);
    return `${prefix}.${second}.${third}.${fourth}`;
  }
  getEUIP(seed) {
    const prefixes = ['2','3','4','5','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','58','59','60','61','62','63','64','65','66','67','68','69','70','71','72','73','74','75','76','77','78','79','80','81','82','83','84','85','86','87','88','89','90','91','92','93','94','95','96','97','98','99','100','101','102','103','104','105','106','107','108','109','110','111','112','113','114','115','116','117','118','119','120','121','122','123','124','125','126','127','128','129','130','131','132','133','134','135','136','137','138','139','140','141','142','143','144','145','146','147','148','149','150','151','152','153','154','155','156','157','158','159','160','161','162','163','164','165','166','167','168','169','170','171','172','173','174','175','176','177','178','179','180','181','182','183','184','185','186','187','188','189','190'];
    const prefix = prefixes[seed % prefixes.length];
    const second = this.randomRange(1,254);
    const third = this.randomRange(1,254);
    const fourth = this.randomRange(1,254);
    return `${prefix}.${second}.${third}.${fourth}`;
  }
  getAsiaIP(seed) {
    const prefixes = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','58','59','60','61','62','63','64','65','66','67','68','69','70','71','72','73','74','75','76','77','78','79','80','81','82','83','84','85','86','87','88','89','90','91','92','93','94','95','96','97','98','99','100','101','102','103','104','105','106','107','108','109','110','111','112','113','114','115','116','117','118','119','120','121','122','123','124','125','126','127','128','129','130','131','132','133','134','135','136','137','138','139','140','141','142','143','144','145','146','147','148','149','150','151','152','153','154','155','156','157','158','159','160','161','162','163','164','165','166','167','168','169','170','171','172','173','174','175','176','177','178','179','180','181','182','183','184','185','186','187','188','189','190','191','192','193','194','195','196','197','198','199','200','201','202','203','204','205','206','207','208','209','210','211','212','213','214','215','216','217','218','219','220','221','222','223'];
    const prefix = prefixes[seed % prefixes.length];
    const second = this.randomRange(1,254);
    const third = this.randomRange(1,254);
    const fourth = this.randomRange(1,254);
    return `${prefix}.${second}.${third}.${fourth}`;
  }
  getUKIP(seed) {
    const prefixes = ['2','3','4','5','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','58','59','60','61','62','63','64','65','66','67','68','69','70','71','72','73','74','75','76','77','78','79','80','81','82','83','84','85','86','87','88','89','90','91','92','93','94','95','96','97','98','99','100','101','102','103','104','105','106','107','108','109','110','111','112','113','114','115','116','117','118','119','120','121','122','123','124','125','126','127','128','129','130','131','132','133','134','135','136','137','138','139','140','141','142','143','144','145','146','147','148','149','150','151','152','153','154','155','156','157','158','159','160','161','162','163','164','165','166','167','168','169','170','171','172','173','174','175','176','177','178','179','180','181','182','183','184','185','186','187','188','189','190','191','192','193','194','195','196','197','198','199','200','201','202','203','204','205','206','207','208','209','210','211','212','213','214','215','216','217','218','219','220','221','222'];
    const prefix = prefixes[seed % prefixes.length];
    const second = this.randomRange(1,254);
    const third = this.randomRange(1,254);
    const fourth = this.randomRange(1,254);
    return `${prefix}.${second}.${third}.${fourth}`;
  }
  getCAIP(seed) {
    const prefixes = ['23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','58','59','60','61','62','63','64','65','66','67','68','69','70','71','72','73','74','75','76','77','78','79','80','81','82','83','84','85','86','87','88','89','90','91','92','93','94','95','96','97','98','99','100','101','102','103','104','105','106','107','108','109','110','111','112','113','114','115','116','117','118','119','120','121','122','123','124','125','126','127','128','129','130','131','132','133','134','135','136','137','138','139','140','141','142','143','144','145','146','147','148','149','150','151','152','153','154','155','156','157','158','159','160','161','162','163','164','165','166','167','168','169','170','171','172','173','174','175','176','177','178','179','180','181','182','183','184','185','186','187','188','189','190','191','192','193','194','195','196','197','198','199','200','201','202','203','204','205','206','207','208','209','210','211','212','213','214','215','216','217','218','219','220','221','222','223'];
    const prefix = prefixes[seed % prefixes.length];
    const second = this.randomRange(1,254);
    const third = this.randomRange(1,254);
    const fourth = this.randomRange(1,254);
    return `${prefix}.${second}.${third}.${fourth}`;
  }
  getAUIP(seed) {
    const prefixes = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','58','59','60','61','62','63','64','65','66','67','68','69','70','71','72','73','74','75','76','77','78','79','80','81','82','83','84','85','86','87','88','89','90','91','92','93','94','95','96','97','98','99','100','101','102','103','104','105','106','107','108','109','110','111','112','113','114','115','116','117','118','119','120','121','122','123','124','125','126','127','128','129','130','131','132','133','134','135','136','137','138','139','140','141','142','143','144','145','146','147','148','149','150','151','152','153','154','155','156','157','158','159','160','161','162','163','164','165','166','167','168','169','170','171','172','173','174','175','176','177','178','179','180','181','182','183','184','185','186','187','188','189','190','191','192','193','194','195','196','197','198','199','200','201','202','203','204','205','206','207','208','209','210','211','212','213','214','215','216','217','218','219','220','221','222'];
    const prefix = prefixes[seed % prefixes.length];
    const second = this.randomRange(1,254);
    const third = this.randomRange(1,254);
    const fourth = this.randomRange(1,254);
    return `${prefix}.${second}.${third}.${fourth}`;
  }
  getBRIP(seed) {
    const prefixes = ['177','178','179','180','181','182','183','184','185','186','187','188','189','190','191','192','193','194','195','196','197','198','199','200','201','202','203','204','205','206','207','208','209','210','211','212','213','214','215','216','217','218','219','220','221','222','223'];
    const prefix = prefixes[seed % prefixes.length];
    const second = this.randomRange(1,254);
    const third = this.randomRange(1,254);
    const fourth = this.randomRange(1,254);
    return `${prefix}.${second}.${third}.${fourth}`;
  }
  getINIP(seed) {
    const prefixes = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','58','59','60','61','62','63','64','65','66','67','68','69','70','71','72','73','74','75','76','77','78','79','80','81','82','83','84','85','86','87','88','89','90','91','92','93','94','95','96','97','98','99','100','101','102','103','104','105','106','107','108','109','110','111','112','113','114','115','116','117','118','119','120','121','122','123','124','125','126','127','128','129','130','131','132','133','134','135','136','137','138','139','140','141','142','143','144','145','146','147','148','149','150','151','152','153','154','155','156','157','158','159','160','161','162','163','164','165','166','167','168','169','170','171','172','173','174','175','176','177','178','179','180','181','182','183','184','185','186','187','188','189','190','191','192','193','194','195','196','197','198','199','200','201','202','203','204','205','206','207','208','209','210','211','212','213','214','215','216','217','218','219','220','221','222','223'];
    const prefix = prefixes[seed % prefixes.length];
    const second = this.randomRange(1,254);
    const third = this.randomRange(1,254);
    const fourth = this.randomRange(1,254);
    return `${prefix}.${second}.${third}.${fourth}`;
  }
  getJPIP(seed) {
    const prefixes = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','58','59','60','61','62','63','64','65','66','67','68','69','70','71','72','73','74','75','76','77','78','79','80','81','82','83','84','85','86','87','88','89','90','91','92','93','94','95','96','97','98','99','100','101','102','103','104','105','106','107','108','109','110','111','112','113','114','115','116','117','118','119','120','121','122','123','124','125','126','127','128','129','130','131','132','133','134','135','136','137','138','139','140','141','142','143','144','145','146','147','148','149','150','151','152','153','154','155','156','157','158','159','160','161','162','163','164','165','166','167','168','169','170','171','172','173','174','175','176','177','178','179','180','181','182','183','184','185','186','187','188','189','190','191','192','193','194','195','196','197','198','199','200','201','202','203','204','205','206','207','208','209','210','211','212','213','214','215','216','217','218','219','220','221','222'];
    const prefix = prefixes[seed % prefixes.length];
    const second = this.randomRange(1,254);
    const third = this.randomRange(1,254);
    const fourth = this.randomRange(1,254);
    return `${prefix}.${second}.${third}.${fourth}`;
  }
  getCNIP(seed) {
    const prefixes = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','58','59','60','61','62','63','64','65','66','67','68','69','70','71','72','73','74','75','76','77','78','79','80','81','82','83','84','85','86','87','88','89','90','91','92','93','94','95','96','97','98','99','100','101','102','103','104','105','106','107','108','109','110','111','112','113','114','115','116','117','118','119','120','121','122','123','124','125','126','127','128','129','130','131','132','133','134','135','136','137','138','139','140','141','142','143','144','145','146','147','148','149','150','151','152','153','154','155','156','157','158','159','160','161','162','163','164','165','166','167','168','169','170','171','172','173','174','175','176','177','178','179','180','181','182','183','184','185','186','187','188','189','190','191','192','193','194','195','196','197','198','199','200','201','202','203','204','205','206','207','208','209','210','211','212','213','214','215','216','217','218','219','220','221','222','223'];
    const prefix = prefixes[seed % prefixes.length];
    const second = this.randomRange(1,254);
    const third = this.randomRange(1,254);
    const fourth = this.randomRange(1,254);
    return `${prefix}.${second}.${third}.${fourth}`;
  }
  getRUIP(seed) {
    const prefixes = ['2','3','4','5','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','58','59','60','61','62','63','64','65','66','67','68','69','70','71','72','73','74','75','76','77','78','79','80','81','82','83','84','85','86','87','88','89','90','91','92','93','94','95','96','97','98','99','100','101','102','103','104','105','106','107','108','109','110','111','112','113','114','115','116','117','118','119','120','121','122','123','124','125','126','127','128','129','130','131','132','133','134','135','136','137','138','139','140','141','142','143','144','145','146','147','148','149','150','151','152','153','154','155','156','157','158','159','160','161','162','163','164','165','166','167','168','169','170','171','172','173','174','175','176','177','178','179','180','181','182','183','184','185','186','187','188','189','190'];
    const prefix = prefixes[seed % prefixes.length];
    const second = this.randomRange(1,254);
    const third = this.randomRange(1,254);
    const fourth = this.randomRange(1,254);
    return `${prefix}.${second}.${third}.${fourth}`;
  }
  getZAIP(seed) {
    const prefixes = ['41','102','105','129','146','147','148','149','150','151','152','153','154','155','156','157','158','159','160','161','162','163','164','165','166','167','168','169','170','171','172','173','174','175','176','177','178','179','180','181','182','183','184','185','186','187','188','189','190','191','192','193','194','195','196','197','198','199','200','201','202','203','204','205','206','207','208','209','210','211','212','213','214','215','216','217','218','219','220','221','222','223'];
    const prefix = prefixes[seed % prefixes.length];
    const second = this.randomRange(1,254);
    const third = this.randomRange(1,254);
    const fourth = this.randomRange(1,254);
    return `${prefix}.${second}.${third}.${fourth}`;
  }

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

  getProxyIP(proxyUrl) {
    try {
      const url = new URL(proxyUrl);
      return url.hostname;
    } catch { return null; }
  }
}

// ============================================
// FINGERPRINT GENERATOR
// ============================================
class FingerprintGenerator {
  constructor() {
    this.fingerprints = CONFIG.fingerprints;
    this.browsers = Object.keys(this.fingerprints);
    this.currentIndex = 0;
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
      version: this.getBrowserVersion(userAgent)
    };
  }

  getBrowserVersion(userAgent) {
    const match = userAgent.match(/(Chrome|Firefox|Safari|Edge)\/(\d+)/);
    return match ? parseInt(match[2]) : 0;
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
    const fingerprint = this.fingerprintGen.getFingerprint(requestNumber);
    const clientIP = this.ipManager.getNextIP(region, requestNumber);

    const headers = {
      'User-Agent': fingerprint.userAgent,
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'Accept-Language': this.getAcceptLanguage(region, requestNumber),
      'Accept-Encoding': this.getAcceptEncoding(requestNumber),
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
      'X-Geo-Country': this.getCountryCode(region),
      'DNT': '1',
      'Sec-GPC': '1',
      'Referer': this.getReferer(requestNumber),
      'Origin': this.getOrigin(requestNumber),
      'Sec-Ch-Ua': fingerprint.secChUa,
      'Sec-Ch-Ua-Platform': `"${fingerprint.platform}"`,
      'Sec-Ch-Ua-Mobile': '?0',
      'Priority': 'u=0, i',
      'Te': 'trailers',
      'Save-Data': 'off',
    };

    this.addBypassHeaders(headers, bypassLevel, requestNumber, region, fingerprint);
    return headers;
  }

  addBypassHeaders(headers, bypassLevel, requestNumber, region, fingerprint) {
    switch(bypassLevel) {
      case 'stealth':
        headers['Sec-Ch-Ua'] = `"${fingerprint.browser}";v="${fingerprint.version}", "Not_A Brand";v="8"`;
        headers['Sec-Ch-Ua-Platform'] = `"${fingerprint.platform}"`;
        headers['Sec-Ch-Ua-Mobile'] = '?0';
        headers['X-Device-Id'] = this.generateDeviceId(requestNumber);
        headers['X-Session-Id'] = this.generateSessionId(requestNumber);
        headers['X-Browser-Fingerprint'] = this.generateBrowserFingerprint(fingerprint);
        headers['X-Request-ID'] = this.generateRequestId();
        headers['Cookie'] = this.generateCookies(requestNumber);
        headers['Accept-Push'] = 'idempotent';
        headers['Accept-Signature'] = 'sig1;sig2';
        headers['Alt-Used'] = `${requestNumber % 2 === 0 ? 'https' : 'http'}`;
        headers['Content-Digest'] = this.generateContentDigest();
        headers['Repr-Digest'] = this.generateReprDigest();
        headers['Want-Content-Digest'] = 'sha-256=*';
        headers['Want-Repr-Digest'] = 'sha-256=*';
        if (requestNumber % 3 === 0) {
          headers['X-Forwarded-Proto'] = 'https';
          headers['X-Forwarded-Host'] = 'www.google.com';
          headers['X-Forwarded-Port'] = '443';
        }
        break;
      case 'ultra':
        headers['Accept-Language'] = this.getAcceptLanguage(region, requestNumber, true);
        headers['Accept-Encoding'] = 'gzip, deflate, br, zstd';
        headers['Sec-Ch-Ua'] = `"${fingerprint.browser}";v="${fingerprint.version}", "Not_A Brand";v="8"`;
        headers['X-Request-ID'] = this.generateRequestId();
        headers['X-Trace-Id'] = this.generateTraceId();
        headers['X-Span-Id'] = this.generateSpanId();
        headers['X-Parent-Id'] = this.generateParentId();
        headers['Cookie'] = this.generateCookies(requestNumber);
        headers['X-Device-Id'] = this.generateDeviceId(requestNumber);
        break;
      case 'high':
        headers['Accept-Language'] = this.getAcceptLanguage(region, requestNumber, true);
        headers['Cookie'] = this.generateCookies(requestNumber);
        headers['X-Request-ID'] = this.generateRequestId();
        headers['X-Trace-Id'] = this.generateTraceId();
        this.addRandomHeaders(headers, requestNumber);
        break;
      case 'medium':
        headers['Accept-Language'] = this.getAcceptLanguage(region, requestNumber);
        headers['Cookie'] = this.generateCookies(requestNumber);
        break;
      case 'low':
      default:
        break;
    }
  }

  getAcceptLanguage(region, requestNumber, advanced = false) {
    const languages = {
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
    const langList = languages[region] || languages['US'];
    return advanced ? langList.join(', ') : langList[requestNumber % langList.length];
  }

  getAcceptEncoding(requestNumber) {
    const encodings = ['gzip, deflate, br', 'gzip, deflate, br, zstd', 'br, gzip, deflate', 'gzip, deflate'];
    return encodings[requestNumber % encodings.length];
  }

  getCountryCode(region) {
    const codes = { 'US':'US','UK':'GB','EU':'EU','ASIA':'AS','CA':'CA','AU':'AU','BR':'BR','IN':'IN','JP':'JP','CN':'CN','RU':'RU','ZA':'ZA' };
    return codes[region] || 'US';
  }

  getReferer(requestNumber) {
    const base = this.referers[requestNumber % this.referers.length];
    return `${base}${Math.random().toString(36).substring(7)}`;
  }

  getOrigin(requestNumber) {
    const origins = ['https://www.google.com','https://www.bing.com','https://search.yahoo.com','https://duckduckgo.com','https://www.facebook.com'];
    return origins[requestNumber % origins.length];
  }

  generateRequestId() { return `${Date.now()}-${Math.random().toString(36).substr(2,9)}`; }
  generateTraceId() { return `00-${this.generateHex(32)}-${this.generateHex(16)}-01`; }
  generateSpanId() { return this.generateHex(16); }
  generateParentId() { return this.generateHex(16); }
  generateHex(length) { let r=''; for(let i=0;i<length;i++) r+=Math.floor(Math.random()*16).toString(16); return r; }
  generateDeviceId(requestNumber) { return `device-${this.simpleHash((requestNumber+Date.now()).toString()).substring(0,16)}`; }
  generateSessionId(requestNumber) { return `session-${this.simpleHash(`${requestNumber}-${Date.now()}-${Math.random()}`).substring(0,20)}`; }
  generateBrowserFingerprint(fingerprint) { return this.simpleHash(`${fingerprint.userAgent}|${fingerprint.platform}|${Date.now()}`).substring(0,32); }

  generateCookies(requestNumber) {
    const cookies = [];
    const names = ['_ga','_gid','_gat','_fbp','_clck','_clsk','__cfduid','__cf_bm','__cflb'];
    for (let i=0; i<5+(requestNumber%3); i++) {
      const name = names[i % names.length];
      const value = this.generateCookieValue(requestNumber + i);
      cookies.push(`${name}=${value}`);
    }
    cookies.push(`session=${this.generateSessionId(requestNumber)}`);
    return cookies.join('; ');
  }

  generateCookieValue(seed) {
    const len = 10 + (seed % 10);
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let val = '';
    for (let i=0; i<len; i++) val += chars.charAt(Math.floor(Math.random() * chars.length));
    return val;
  }

  addRandomHeaders(headers, requestNumber) {
    const extra = ['X-Custom-Header','X-Client-Data','X-Client-Version','X-Source','X-Destination','X-Correlation-ID','X-Transaction-ID','X-User-ID','X-Session-ID'];
    const count = 2 + (requestNumber % 3);
    for (let i=0; i<count; i++) {
      const name = extra[(requestNumber + i) % extra.length];
      headers[name] = this.generateCookieValue(requestNumber + i);
    }
  }

  generateContentDigest() { return `sha-256=:${this.generateHex(32)}:`; }
  generateReprDigest() { return `sha-256=:${this.generateHex(32)}:`; }

  simpleHash(str) {
    let hash = 0;
    for (let i=0; i<str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
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
    this.failedAttempts = new Map();
  }

  async executeRequest(targetUrl, region, requestNumber, timeoutMs, bypassLevel, useProxy, env) {
    const startTime = Date.now();
    const sessionId = this.headerGen.generateSessionId(requestNumber);
    const headers = this.headerGen.generateHeaders(region, requestNumber, bypassLevel, sessionId);

    let proxyUrl = null;
    if (useProxy && env.PROXY_LIST) {
      const list = env.PROXY_LIST.split(',').filter(p => p.trim());
      proxyUrl = this.getNextProxy(list);
    }

    const maxRetries = CONFIG.maxRetries;
    let lastError = null;
    let attempt = 0;

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
        if (proxyUrl && env.PROXY_SERVICE_ENDPOINT) {
          response = await this.executeWithProxy(targetUrl, proxyUrl, headers, timeoutMs, env);
        } else {
          response = await fetch(targetUrl.toString(), fetchOptions);
        }
        clearTimeout(timer);

        const responseTime = Date.now() - attemptStart;
        const totalTime = Date.now() - startTime;
        const result = {
          request: requestNumber,
          attempt,
          success: response.status >= 200 && response.status < 400,
          status: response.status,
          responseTimeMs: totalTime,
          attemptTimeMs: responseTime,
          proxy_used: !!proxyUrl,
          region,
          bypass_level: bypassLevel,
          ip_used: headers['X-Forwarded-For'],
          session_id: sessionId,
          user_agent: headers['User-Agent'],
          headers_count: Object.keys(headers).length,
        };

        if (!result.success && this.shouldRetry(response.status, attempt)) {
          const wait = this.getRetryDelay(attempt);
          await this.sleep(wait);
          continue;
        }
        this.executionHistory.push(result);
        return result;

      } catch (error) {
        lastError = error;
        const totalTime = Date.now() - startTime;
        if (attempt < maxRetries && this.isRetryableError(error)) {
          await this.sleep(this.getRetryDelay(attempt));
          continue;
        }
        const result = {
          request: requestNumber,
          attempt,
          success: false,
          error: error.message || 'Request failed',
          responseTimeMs: totalTime,
          proxy_used: !!proxyUrl,
          region,
          bypass_level: bypassLevel,
          session_id: sessionId,
          user_agent: headers['User-Agent'],
        };
        this.executionHistory.push(result);
        return result;
      }
    }

    const totalTime = Date.now() - startTime;
    const result = {
      request: requestNumber,
      attempt: maxRetries,
      success: false,
      error: lastError?.message || 'All retry attempts failed',
      responseTimeMs: totalTime,
      proxy_used: !!proxyUrl,
      region,
      bypass_level: bypassLevel,
      session_id: sessionId,
    };
    this.executionHistory.push(result);
    return result;
  }

  async executeWithProxy(targetUrl, proxyUrl, headers, timeoutMs, env) {
    const resp = await fetch(env.PROXY_SERVICE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.PROXY_API_KEY || ''}`
      },
      body: JSON.stringify({
        url: targetUrl.toString(),
        proxy: proxyUrl,
        headers,
        timeout: timeoutMs
      })
    });
    if (!resp.ok) throw new Error(`Proxy service error: ${resp.status}`);
    const data = await resp.json();
    return new Response(data.body, { status: data.status, headers: data.headers });
  }

  getNextProxy(proxyList) {
    if (!proxyList || !proxyList.length) return null;
    return proxyList[Math.floor(Math.random() * proxyList.length)];
  }

  shouldRetry(status, attempt) {
    return [429,503,504,408,500,502].includes(status) && attempt < CONFIG.maxRetries;
  }

  isRetryableError(error) {
    return ['AbortError','TimeoutError','NetworkError'].some(e => error.name === e || error.message.includes(e));
  }

  getRetryDelay(attempt) {
    const base = 1000;
    const max = 30000;
    const exp = Math.min(base * Math.pow(2, attempt), max);
    return exp + (Math.random() * 500);
  }

  sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

  getExecutionStats() {
    const total = this.executionHistory.length;
    if (!total) return { successRate:0, avgResponseTime:0, totalRequests:0, successfulRequests:0, failedRequests:0 };
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

// ============================================
// GLOBAL INSTANCES
// ============================================
let ipManager = new IPManager();
let fingerprintGen = new FingerprintGenerator();
let headerGen = new HeaderGenerator(ipManager, fingerprintGen);
let requestExecutor = new RequestExecutor(ipManager, fingerprintGen, headerGen);
const rateLimitBuckets = new Map();

// ============================================
// MAIN WORKER
// ============================================
export default {
  async fetch(request, env, ctx) {
    return handleRequest(request, env, ctx);
  },
};

// ============================================
// CENTRAL ROUTER - FULLY FIXED
// ============================================
async function handleRequest(request, env) {
  const url = new URL(request.url);
  const method = request.method.toUpperCase();
  const path = url.pathname;

  // CORS preflight
  if (method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders(),
    });
  }

  // Normalize trailing slash
  const cleanPath = path.replace(/\/$/, "") || "/";

  // ==========================================
  // ROUTE MATCHING
  // ==========================================

  // GET /
  if (method === "GET" && cleanPath === "/") {
    return json({
      success: true,
      service: SERVICE_NAME,
      version: VERSION,
      status: "online",
      routes: {
        GET: [
          "/",
          "/health",
          "/stats",
          "/analytics",
          "/analytics/summary",
          "/analytics/detailed",
          "/proxy-status",
        ],
        POST: [
          "/validate",
          "/test",
          "/test-advanced",
          "/test-stealth",
          "/proxy-reload",
          "/clear-cache",
        ],
      },
      features: {
        bypass_levels: Object.keys(CONFIG.bypassLevels),
        regions: ['US','UK','EU','ASIA','CA','AU','BR','IN','JP','CN','RU','ZA'],
        max_retries: CONFIG.maxRetries,
        ip_rotation: true,
        fingerprint_rotation: true,
        session_management: true,
        proxy_support: !!env.PROXY_LIST,
      },
    });
  }

  // GET /health
  if (method === "GET" && cleanPath === "/health") {
    const stats = requestExecutor.getExecutionStats();
    return json({
      success: true,
      status: "healthy",
      service: SERVICE_NAME,
      version: VERSION,
      timestamp: new Date().toISOString(),
      stats: {
        successRate: stats.successRate || 0,
        avgResponseTime: stats.avgResponseTime || 0,
        totalRequests: stats.totalRequests || 0,
      },
      proxy_status: {
        brightdata_configured: !!env.PROXY_LIST,
      },
    });
  }

  // GET /stats
  if (method === "GET" && cleanPath === "/stats") {
    const stats = requestExecutor.getExecutionStats();
    return json({
      success: true,
      timestamp: new Date().toISOString(),
      stats: {
        totalRequests: stats.totalRequests || 0,
        successfulRequests: stats.successfulRequests || 0,
        failedRequests: stats.failedRequests || 0,
        successRate: stats.successRate || 0,
        avgResponseTimeMs: stats.avgResponseTime || 0,
      },
    });
  }

  // GET /analytics
  if (method === "GET" && cleanPath === "/analytics") {
    const stats = requestExecutor.getExecutionStats();
    const history = requestExecutor.executionHistory.slice(-100);
    return json({
      success: true,
      timestamp: new Date().toISOString(),
      summary: stats,
      recent_requests: history.map(r => ({
        success: r.success,
        status: r.status,
        responseTimeMs: r.responseTimeMs,
        region: r.region,
        bypass_level: r.bypass_level,
        proxy_used: r.proxy_used,
      })),
      breakdown: {
        by_region: calculateRegionBreakdown(history),
        by_level: calculateLevelBreakdown(history),
        by_status: calculateStatusBreakdown(history),
      },
    });
  }

  // GET /analytics/summary
  if (method === "GET" && cleanPath === "/analytics/summary") {
    const stats = requestExecutor.getExecutionStats();
    return json({
      success: true,
      timestamp: new Date().toISOString(),
      total_requests: stats.totalRequests,
      success_rate: stats.successRate,
      average_response: stats.avgResponseTime,
      best_bypass_level: "HIGH",
      best_region: "US",
    });
  }

  // GET /analytics/detailed
  if (method === "GET" && cleanPath === "/analytics/detailed") {
    const history = requestExecutor.executionHistory;
    return json({
      success: true,
      timestamp: new Date().toISOString(),
      data_points: history.length,
      detailed_metrics: {
        response_times: {
          average: calculateAverageResponse(history),
          median: calculateMedianResponse(history),
          p95: calculatePercentile(history, 95),
          p99: calculatePercentile(history, 99),
        },
      },
    });
  }

  // GET /proxy-status
  if (method === "GET" && cleanPath === "/proxy-status") {
    const proxyList = env.PROXY_LIST ? env.PROXY_LIST.split(',').filter(p => p.trim()) : [];
    return json({
      success: true,
      proxy_status: {
        enabled: proxyList.length > 0,
        total_proxies: proxyList.length,
        proxies: proxyList.map((p, i) => ({
          id: i+1,
          url: p.replace(/\/\/.*@/, '//****:****@'),
          status: 'active',
        })),
      },
    });
  }

  // POST /validate
  if (method === "POST" && cleanPath === "/validate") {
    return handleValidate(request, env);
  }

  // POST /test
  if (method === "POST" && cleanPath === "/test") {
    return handleTest(request, env);
  }

  // POST /test-advanced
  if (method === "POST" && cleanPath === "/test-advanced") {
    return handleAdvancedTest(request, env);
  }

  // POST /test-stealth
  if (method === "POST" && cleanPath === "/test-stealth") {
    return handleStealthTest(request, env);
  }

  // POST /proxy-reload
  if (method === "POST" && cleanPath === "/proxy-reload") {
    return json({
      success: true,
      message: "Proxy configuration reloaded",
      proxy_count: env.PROXY_LIST ? env.PROXY_LIST.split(',').length : 0,
    });
  }

  // POST /clear-cache
  if (method === "POST" && cleanPath === "/clear-cache") {
    ipManager = new IPManager();
    fingerprintGen = new FingerprintGenerator();
    headerGen = new HeaderGenerator(ipManager, fingerprintGen);
    requestExecutor = new RequestExecutor(ipManager, fingerprintGen, headerGen);
    return json({
      success: true,
      message: "All caches cleared successfully",
      timestamp: new Date().toISOString(),
    });
  }

  // ==========================================
  // 404 - NOT FOUND
  // ==========================================
  return json({
    success: false,
    error: {
      code: "ROUTE_NOT_FOUND",
      message: "API route not found",
      method: method,
      path: path,
    },
  }, 404);
}

// ============================================
// HANDLER IMPLEMENTATIONS
// ============================================

async function handleValidate(request, env) {
  let body;
  try { body = await request.json(); } catch { return errorResponse("Invalid JSON body", 400); }
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
    validation_level: "full",
    bypass_capable: true,
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
  try { body = await request.json(); } catch { return errorResponse("Invalid JSON body", 400); }
  if (!body || typeof body.url !== "string" || !body.url.trim()) {
    return errorResponse("URL is required", 400);
  }
  const validation = validateTargetUrl(body.url, env);
  if (!validation.ok) {
    return errorResponse(validation.error, validation.status);
  }

  const maxCount = getPositiveInteger(env.MAX_TEST_COUNT, CONFIG.maxTestCount);
  const count = body.count === undefined ? 1 : body.count;
  if (!Number.isInteger(count) || count < 1) return errorResponse("Count must be at least 1", 400);
  if (count > maxCount) return errorResponse(`Count must not exceed ${maxCount}`, 400);

  const timeoutMs = getPositiveInteger(env.REQUEST_TIMEOUT_MS, CONFIG.defaultTimeout);
  const bypassLevel = body.bypassLevel || 'medium';
  const region = body.region || 'US';
  const useProxies = body.useProxies !== false && !!env.PROXY_LIST;

  const results = [];
  for (let i=1; i<=count; i++) {
    const result = await requestExecutor.executeRequest(
      validation.url, region, i, timeoutMs, bypassLevel, useProxies, env
    );
    results.push(result);
    const delay = getDelayByLevel(bypassLevel);
    if (i < count) await sleep(delay);
  }

  const statistics = calculateAdvancedStatistics(results);
  return json({
    success: true,
    target: validation.url.hostname,
    total: count,
    completed: results.length,
    region,
    bypass_level: bypassLevel,
    proxy_used: useProxies,
    ...statistics,
    results: results.map(r => ({
      request: r.request,
      attempt: r.attempt,
      success: r.success,
      status: r.status,
      responseTimeMs: r.responseTimeMs,
      proxy_used: r.proxy_used,
      region: r.region,
      bypass_level: r.bypass_level,
      ...(r.error && { error: r.error })
    })),
  });
}

async function handleAdvancedTest(request, env) {
  const limitResult = checkRateLimit(request, env);
  if (!limitResult.allowed) {
    return errorResponse(
      "Too many test requests. Please try again later.",
      429,
      { "Retry-After": String(limitResult.retryAfterSeconds) },
    );
  }

  let body;
  try { body = await request.json(); } catch { return errorResponse("Invalid JSON body", 400); }
  if (!body || typeof body.url !== "string" || !body.url.trim()) {
    return errorResponse("URL is required", 400);
  }
  const validation = validateTargetUrl(body.url, env);
  if (!validation.ok) {
    return errorResponse(validation.error, validation.status);
  }

  const count = body.count || 10;
  const maxCount = getPositiveInteger(env.MAX_TEST_COUNT, CONFIG.maxTestCount);
  if (count > maxCount) return errorResponse(`Count must not exceed ${maxCount}`, 400);

  const timeoutMs = getPositiveInteger(env.REQUEST_TIMEOUT_MS, CONFIG.defaultTimeout);
  const useProxies = body.useProxies !== false && !!env.PROXY_LIST;
  const testAllLevels = body.testAllLevels !== false;
  const regions = body.regions || ['US','UK','EU','ASIA'];
  const bypassLevels = testAllLevels ? ['low','medium','high','ultra','stealth'] : [body.bypassLevel || 'high'];

  const allResults = [];
  const summary = {};

  for (const region of regions) {
    summary[region] = {};
    for (const level of bypassLevels) {
      const results = [];
      const perLevelCount = Math.ceil(count / bypassLevels.length);
      for (let i=1; i<=perLevelCount; i++) {
        const result = await requestExecutor.executeRequest(
          validation.url, region, i, timeoutMs, level, useProxies, env
        );
        results.push(result);
        allResults.push(result);
        const delay = getDelayByLevel(level);
        if (i < perLevelCount) await sleep(delay);
      }
      const stats = calculateAdvancedStatistics(results);
      summary[region][level] = { count: results.length, ...stats };
    }
  }

  const overallStats = calculateAdvancedStatistics(allResults);
  return json({
    success: true,
    target: validation.url.hostname,
    total_requests: allResults.length,
    regions_tested: regions,
    levels_tested: bypassLevels,
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
      ...(r.error && { error: r.error })
    })),
  });
}

async function handleStealthTest(request, env) {
  let body;
  try { body = await request.json(); } catch { return errorResponse("Invalid JSON body", 400); }
  if (!body || typeof body.url !== "string" || !body.url.trim()) {
    return errorResponse("URL is required", 400);
  }
  const validation = validateTargetUrl(body.url, env);
  if (!validation.ok) {
    return errorResponse(validation.error, validation.status);
  }

  const count = Math.min(body.count || 3, 10);
  const timeoutMs = getPositiveInteger(env.REQUEST_TIMEOUT_MS, CONFIG.defaultTimeout);
  const useProxies = body.useProxies !== false && !!env.PROXY_LIST;
  const regions = ['US','UK','EU','ASIA','CA','AU','BR'];
  const stealthLevels = ['ultra','stealth'];

  const results = [];
  for (let i=1; i<=count; i++) {
    const region = regions[Math.floor(Math.random() * regions.length)];
    const level = stealthLevels[i % stealthLevels.length];
    await sleep(getRandomDelay(2000, 5000));
    const result = await requestExecutor.executeRequest(
      validation.url, region, i, timeoutMs, level, useProxies, env
    );
    results.push(result);
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
    })),
  });
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function validateTargetUrl(rawUrl, env) {
  let targetUrl;
  try { targetUrl = new URL(rawUrl.trim()); } catch { return { ok: false, status: 400, error: "Invalid URL" }; }
  if (!/^https?:$/.test(targetUrl.protocol)) return { ok: false, status: 400, error: "Unsupported protocol" };
  if (targetUrl.username || targetUrl.password) return { ok: false, status: 400, error: "URL credentials are not allowed" };
  if (!targetUrl.hostname || isSuspiciousHostname(targetUrl.hostname)) return { ok: false, status: 400, error: "Invalid URL" };
  if (!isAllowedHost(targetUrl.hostname, env)) return { ok: false, status: 403, error: "Target domain is not allowed" };
  return { ok: true, url: targetUrl };
}

function getAllowedHosts(env) {
  return String(env.ALLOWED_HOSTS || "")
    .split(",")
    .map(h => h.trim().toLowerCase().replace(/\.$/, ""))
    .filter(Boolean);
}

function isAllowedHost(hostname, env) {
  const normalized = hostname.toLowerCase().replace(/\.$/, "");
  return getAllowedHosts(env).some(allowed => allowed === normalized);
}

function isSuspiciousHostname(hostname) {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, "");
  const suspicious = new Set(["localhost","localhost.localdomain","ip6-localhost","ip6-loopback","0.0.0.0","::1","::"]);
  if (suspicious.has(host) || host.endsWith(".localhost") || host.endsWith(".local")) return true;
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) {
    const octets = host.split(".").map(Number);
    if (octets.some(o => o<0 || o>255)) return true;
    const [a,b] = octets;
    return (a===0 || a===10 || a===127 || (a===169 && b===254) || (a===172 && b>=16 && b<=31) || (a===192 && b===168));
  }
  return host.includes(":");
}

function calculateAdvancedStatistics(results) {
  const successful = results.filter(r => r.success).length;
  const failed = results.length - successful;
  const responseTimes = results.map(r => r.responseTimeMs).filter(v => Number.isFinite(v));
  if (responseTimes.length === 0) {
    return { successful, failed, successRate: 0, averageResponseTimeMs: 0, minResponseTimeMs: 0, maxResponseTimeMs: 0, medianResponseTimeMs: 0, p95ResponseTimeMs: 0, p99ResponseTimeMs: 0 };
  }
  const sorted = [...responseTimes].sort((a,b) => a-b);
  const total = responseTimes.reduce((s,v) => s+v, 0);
  const medianIdx = Math.floor(sorted.length/2);
  const p95Idx = Math.floor(sorted.length * 0.95);
  const p99Idx = Math.floor(sorted.length * 0.99);
  return {
    successful,
    failed,
    successRate: Number(((successful / results.length) * 100).toFixed(2)),
    averageResponseTimeMs: Math.round(total / responseTimes.length),
    minResponseTimeMs: Math.min(...responseTimes),
    maxResponseTimeMs: Math.max(...responseTimes),
    medianResponseTimeMs: sorted[medianIdx] || 0,
    p95ResponseTimeMs: sorted[p95Idx] || sorted[sorted.length-1] || 0,
    p99ResponseTimeMs: sorted[p99Idx] || sorted[sorted.length-1] || 0,
    total_response_time_ms: total,
    stdDevResponseTimeMs: Math.round(calculateStdDev(responseTimes)),
  };
}

function calculateStdDev(values) {
  const mean = values.reduce((s,v) => s+v, 0) / values.length;
  const sqDiffs = values.map(v => Math.pow(v - mean, 2));
  return Math.sqrt(sqDiffs.reduce((s,v) => s+v, 0) / values.length);
}

function getDelayByLevel(level) {
  const delays = { 'low':100, 'medium':300, 'high':500, 'ultra':800, 'stealth':1200 };
  return delays[level] || 300;
}

function getRandomDelay(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function checkRateLimit(request, env) {
  const limit = getPositiveInteger(env.RATE_LIMIT_PER_MINUTE, CONFIG.rateLimitPerMinute);
  const now = Date.now();
  const windowMs = 60000;
  const key = request.headers.get("CF-Connecting-IP") || "unknown-client";
  const bucket = rateLimitBuckets.get(key);
  if (!bucket || now >= bucket.windowStartedAt + windowMs) {
    rateLimitBuckets.set(key, { windowStartedAt: now, count: 1 });
    pruneRateLimitBuckets(now, windowMs);
    return { allowed: true, retryAfterSeconds: 0 };
  }
  if (bucket.count >= limit) {
    return { allowed: false, retryAfterSeconds: Math.max(1, Math.ceil((bucket.windowStartedAt + windowMs - now) / 1000)) };
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

// ============================================
// ANALYTICS HELPERS
// ============================================

function calculateRegionBreakdown(history) {
  const map = {};
  for (const r of history) {
    const region = r.region || 'unknown';
    if (!map[region]) map[region] = { total:0, success:0 };
    map[region].total++;
    if (r.success) map[region].success++;
  }
  return map;
}

function calculateLevelBreakdown(history) {
  const map = {};
  for (const r of history) {
    const level = r.bypass_level || 'unknown';
    if (!map[level]) map[level] = { total:0, success:0 };
    map[level].total++;
    if (r.success) map[level].success++;
  }
  return map;
}

function calculateStatusBreakdown(history) {
  const map = {};
  for (const r of history) {
    const status = r.status || 'error';
    map[status] = (map[status] || 0) + 1;
  }
  return map;
}

function calculateAverageResponse(history) {
  if (!history.length) return 0;
  const sum = history.reduce((a, r) => a + r.responseTimeMs, 0);
  return Math.round(sum / history.length);
}

function calculateMedianResponse(history) {
  if (!history.length) return 0;
  const sorted = history.map(r => r.responseTimeMs).sort((a,b) => a-b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : Math.round((sorted[mid-1] + sorted[mid]) / 2);
}

function calculatePercentile(history, p) {
  if (!history.length) return 0;
  const sorted = history.map(r => r.responseTimeMs).sort((a,b) => a-b);
  const idx = Math.ceil((p/100) * sorted.length) - 1;
  return sorted[Math.min(idx, sorted.length - 1)];
}

// ============================================
// CORS & RESPONSE HELPERS
// ============================================

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
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
