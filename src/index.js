// ============================================
// MULTI-TIME LINK OPENER - ADVANCED BYPASS SYSTEM
// Version: 4.0.0 - Enterprise Grade
// ============================================

const SERVICE_NAME = "Multi Time Link Opener - Advanced Bypass";
const VERSION = "4.0.0";

// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
  maxTestCount: 500,
  defaultTimeout: 15000,
  rateLimitPerMinute: 35,
  maxRetries: 50,
  minDelay: 50,
  maxDelay: 3000,
  
  // Bypass levels
  bypassLevels: {
    LOW: 'low',
    MEDIUM: 'medium', 
    HIGH: 'high',
    ULTRA: 'ultra',
    STEALTH: 'stealth'
  },
  
  // Browser fingerprints
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
// BRIGHTDATA PROXY MANAGER
// ============================================
class BrightDataProxyManager {
  constructor(apiKey, proxyEndpoint) {
    this.apiKey = apiKey;
    this.proxyEndpoint = proxyEndpoint || 'https://api.brightdata.com/proxy';
    this.proxyCache = [];
    this.lastFetch = 0;
    this.cacheDuration = 60000; // 1 minute
  }

  async getProxyList(env) {
    // Check cache first
    const now = Date.now();
    if (this.proxyCache.length > 0 && (now - this.lastFetch) < this.cacheDuration) {
      return this.proxyCache;
    }

    // If no API key, return empty
    if (!env.BRIGHTDATA_API_KEY && !env.BRIGHTDATA_PROXY) {
      return [];
    }

    try {
      // If we have a direct proxy endpoint configured
      if (env.BRIGHTDATA_PROXY) {
        const proxy = {
          url: env.BRIGHTDATA_PROXY,
          type: 'direct'
        };
        this.proxyCache = [proxy];
        this.lastFetch = now;
        return this.proxyCache;
      }

      // Fetch from BrightData API
      const response = await fetch('https://api.brightdata.com/proxy/list', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${env.BRIGHTDATA_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        console.error('BrightData API error:', response.status);
        return [];
      }

      const data = await response.json();
      
      // Parse the proxy list based on BrightData API response format
      // Adjust this based on actual BrightData API response structure
      this.proxyCache = data.proxies?.map(p => ({
        url: `http://${p.host}:${p.port}`,
        username: p.username,
        password: p.password,
        type: p.type || 'http'
      })) || [];

      this.lastFetch = now;
      return this.proxyCache;

    } catch (error) {
      console.error('Error fetching BrightData proxies:', error);
      return [];
    }
  }

  getRandomProxy(proxies) {
    if (!proxies || proxies.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * proxies.length);
    return proxies[randomIndex];
  }
}

// ============================================
// IP & PROXY MANAGEMENT
// ============================================
class IPManager {
  constructor() {
    this.ipPool = [];
    this.currentIndex = 0;
    this.usedIPs = new Set();
    this.blacklistedIPs = new Set();
    this.sessionIPs = new Map();
  }

  // Generate realistic IP for any region
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
    const prefixes = ['12', '23', '34', '45', '56', '67', '68', '69', '70', '71', '72', '73', '74', '75', '76', '77', '78', '79', '80', '81', '82', '83', '84', '85', '86', '87', '88', '89', '90', '91', '92', '93', '94', '95', '96', '97', '98', '99'];
    const prefix = prefixes[seed % prefixes.length];
    const second = this.randomRange(1, 254);
    const third = this.randomRange(1, 254);
    const fourth = this.randomRange(1, 254);
    return `${prefix}.${second}.${third}.${fourth}`;
  }

  getEUIP(seed) {
    const prefixes = ['2', '3', '4', '5', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60', '61', '62', '63', '64', '65', '66', '67', '68', '69', '70', '71', '72', '73', '74', '75', '76', '77', '78', '79', '80', '81', '82', '83', '84', '85', '86', '87', '88', '89', '90', '91', '92', '93', '94', '95', '96', '97', '98', '99', '100', '101', '102', '103', '104', '105', '106', '107', '108', '109', '110', '111', '112', '113', '114', '115', '116', '117', '118', '119', '120', '121', '122', '123', '124', '125', '126', '127', '128', '129', '130', '131', '132', '133', '134', '135', '136', '137', '138', '139', '140', '141', '142', '143', '144', '145', '146', '147', '148', '149', '150', '151', '152', '153', '154', '155', '156', '157', '158', '159', '160', '161', '162', '163', '164', '165', '166', '167', '168', '169', '170', '171', '172', '173', '174', '175', '176', '177', '178', '179', '180', '181', '182', '183', '184', '185', '186', '187', '188', '189', '190'];
    const prefix = prefixes[seed % prefixes.length];
    const second = this.randomRange(1, 254);
    const third = this.randomRange(1, 254);
    const fourth = this.randomRange(1, 254);
    return `${prefix}.${second}.${third}.${fourth}`;
  }

  getAsiaIP(seed) {
    const prefixes = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60', '61', '62', '63', '64', '65', '66', '67', '68', '69', '70', '71', '72', '73', '74', '75', '76', '77', '78', '79', '80', '81', '82', '83', '84', '85', '86', '87', '88', '89', '90', '91', '92', '93', '94', '95', '96', '97', '98', '99', '100', '101', '102', '103', '104', '105', '106', '107', '108', '109', '110', '111', '112', '113', '114', '115', '116', '117', '118', '119', '120', '121', '122', '123', '124', '125', '126', '127', '128', '129', '130', '131', '132', '133', '134', '135', '136', '137', '138', '139', '140', '141', '142', '143', '144', '145', '146', '147', '148', '149', '150', '151', '152', '153', '154', '155', '156', '157', '158', '159', '160', '161', '162', '163', '164', '165', '166', '167', '168', '169', '170', '171', '172', '173', '174', '175', '176', '177', '178', '179', '180', '181', '182', '183', '184', '185', '186', '187', '188', '189', '190', '191', '192', '193', '194', '195', '196', '197', '198', '199', '200', '201', '202', '203', '204', '205', '206', '207', '208', '209', '210', '211', '212', '213', '214', '215', '216', '217', '218', '219', '220', '221', '222', '223'];
    const prefix = prefixes[seed % prefixes.length];
    const second = this.randomRange(1, 254);
    const third = this.randomRange(1, 254);
    const fourth = this.randomRange(1, 254);
    return `${prefix}.${second}.${third}.${fourth}`;
  }

  getUKIP(seed) {
    const prefixes = ['2', '3', '4', '5', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60', '61', '62', '63', '64', '65', '66', '67', '68', '69', '70', '71', '72', '73', '74', '75', '76', '77', '78', '79', '80', '81', '82', '83', '84', '85', '86', '87', '88', '89', '90', '91', '92', '93', '94', '95', '96', '97', '98', '99', '100', '101', '102', '103', '104', '105', '106', '107', '108', '109', '110', '111', '112', '113', '114', '115', '116', '117', '118', '119', '120', '121', '122', '123', '124', '125', '126', '127', '128', '129', '130', '131', '132', '133', '134', '135', '136', '137', '138', '139', '140', '141', '142', '143', '144', '145', '146', '147', '148', '149', '150', '151', '152', '153', '154', '155', '156', '157', '158', '159', '160', '161', '162', '163', '164', '165', '166', '167', '168', '169', '170', '171', '172', '173', '174', '175', '176', '177', '178', '179', '180', '181', '182', '183', '184', '185', '186', '187', '188', '189', '190', '191', '192', '193', '194', '195', '196', '197', '198', '199', '200', '201', '202', '203', '204', '205', '206', '207', '208', '209', '210', '211', '212', '213', '214', '215', '216', '217', '218', '219', '220', '221', '222'];
    const prefix = prefixes[seed % prefixes.length];
    const second = this.randomRange(1, 254);
    const third = this.randomRange(1, 254);
    const fourth = this.randomRange(1, 254);
    return `${prefix}.${second}.${third}.${fourth}`;
  }

  getCAIP(seed) {
    const prefixes = ['23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60', '61', '62', '63', '64', '65', '66', '67', '68', '69', '70', '71', '72', '73', '74', '75', '76', '77', '78', '79', '80', '81', '82', '83', '84', '85', '86', '87', '88', '89', '90', '91', '92', '93', '94', '95', '96', '97', '98', '99', '100', '101', '102', '103', '104', '105', '106', '107', '108', '109', '110', '111', '112', '113', '114', '115', '116', '117', '118', '119', '120', '121', '122', '123', '124', '125', '126', '127', '128', '129', '130', '131', '132', '133', '134', '135', '136', '137', '138', '139', '140', '141', '142', '143', '144', '145', '146', '147', '148', '149', '150', '151', '152', '153', '154', '155', '156', '157', '158', '159', '160', '161', '162', '163', '164', '165', '166', '167', '168', '169', '170', '171', '172', '173', '174', '175', '176', '177', '178', '179', '180', '181', '182', '183', '184', '185', '186', '187', '188', '189', '190', '191', '192', '193', '194', '195', '196', '197', '198', '199', '200', '201', '202', '203', '204', '205', '206', '207', '208', '209', '210', '211', '212', '213', '214', '215', '216', '217', '218', '219', '220', '221', '222', '223'];
    const prefix = prefixes[seed % prefixes.length];
    const second = this.randomRange(1, 254);
    const third = this.randomRange(1, 254);
    const fourth = this.randomRange(1, 254);
    return `${prefix}.${second}.${third}.${fourth}`;
  }

  getAUIP(seed) {
    const prefixes = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60', '61', '62', '63', '64', '65', '66', '67', '68', '69', '70', '71', '72', '73', '74', '75', '76', '77', '78', '79', '80', '81', '82', '83', '84', '85', '86', '87', '88', '89', '90', '91', '92', '93', '94', '95', '96', '97', '98', '99', '100', '101', '102', '103', '104', '105', '106', '107', '108', '109', '110', '111', '112', '113', '114', '115', '116', '117', '118', '119', '120', '121', '122', '123', '124', '125', '126', '127', '128', '129', '130', '131', '132', '133', '134', '135', '136', '137', '138', '139', '140', '141', '142', '143', '144', '145', '146', '147', '148', '149', '150', '151', '152', '153', '154', '155', '156', '157', '158', '159', '160', '161', '162', '163', '164', '165', '166', '167', '168', '169', '170', '171', '172', '173', '174', '175', '176', '177', '178', '179', '180', '181', '182', '183', '184', '185', '186', '187', '188', '189', '190', '191', '192', '193', '194', '195', '196', '197', '198', '199', '200', '201', '202', '203', '204', '205', '206', '207', '208', '209', '210', '211', '212', '213', '214', '215', '216', '217', '218', '219', '220', '221', '222'];
    const prefix = prefixes[seed % prefixes.length];
    const second = this.randomRange(1, 254);
    const third = this.randomRange(1, 254);
    const fourth = this.randomRange(1, 254);
    return `${prefix}.${second}.${third}.${fourth}`;
  }

  getBRIP(seed) {
    const prefixes = ['177', '178', '179', '180', '181', '182', '183', '184', '185', '186', '187', '188', '189', '190', '191', '192', '193', '194', '195', '196', '197', '198', '199', '200', '201', '202', '203', '204', '205', '206', '207', '208', '209', '210', '211', '212', '213', '214', '215', '216', '217', '218', '219', '220', '221', '222', '223'];
    const prefix = prefixes[seed % prefixes.length];
    const second = this.randomRange(1, 254);
    const third = this.randomRange(1, 254);
    const fourth = this.randomRange(1, 254);
    return `${prefix}.${second}.${third}.${fourth}`;
  }

  getINIP(seed) {
    const prefixes = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60', '61', '62', '63', '64', '65', '66', '67', '68', '69', '70', '71', '72', '73', '74', '75', '76', '77', '78', '79', '80', '81', '82', '83', '84', '85', '86', '87', '88', '89', '90', '91', '92', '93', '94', '95', '96', '97', '98', '99', '100', '101', '102', '103', '104', '105', '106', '107', '108', '109', '110', '111', '112', '113', '114', '115', '116', '117', '118', '119', '120', '121', '122', '123', '124', '125', '126', '127', '128', '129', '130', '131', '132', '133', '134', '135', '136', '137', '138', '139', '140', '141', '142', '143', '144', '145', '146', '147', '148', '149', '150', '151', '152', '153', '154', '155', '156', '157', '158', '159', '160', '161', '162', '163', '164', '165', '166', '167', '168', '169', '170', '171', '172', '173', '174', '175', '176', '177', '178', '179', '180', '181', '182', '183', '184', '185', '186', '187', '188', '189', '190', '191', '192', '193', '194', '195', '196', '197', '198', '199', '200', '201', '202', '203', '204', '205', '206', '207', '208', '209', '210', '211', '212', '213', '214', '215', '216', '217', '218', '219', '220', '221', '222', '223'];
    const prefix = prefixes[seed % prefixes.length];
    const second = this.randomRange(1, 254);
    const third = this.randomRange(1, 254);
    const fourth = this.randomRange(1, 254);
    return `${prefix}.${second}.${third}.${fourth}`;
  }

  getJPIP(seed) {
    const prefixes = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60', '61', '62', '63', '64', '65', '66', '67', '68', '69', '70', '71', '72', '73', '74', '75', '76', '77', '78', '79', '80', '81', '82', '83', '84', '85', '86', '87', '88', '89', '90', '91', '92', '93', '94', '95', '96', '97', '98', '99', '100', '101', '102', '103', '104', '105', '106', '107', '108', '109', '110', '111', '112', '113', '114', '115', '116', '117', '118', '119', '120', '121', '122', '123', '124', '125', '126', '127', '128', '129', '130', '131', '132', '133', '134', '135', '136', '137', '138', '139', '140', '141', '142', '143', '144', '145', '146', '147', '148', '149', '150', '151', '152', '153', '154', '155', '156', '157', '158', '159', '160', '161', '162', '163', '164', '165', '166', '167', '168', '169', '170', '171', '172', '173', '174', '175', '176', '177', '178', '179', '180', '181', '182', '183', '184', '185', '186', '187', '188', '189', '190', '191', '192', '193', '194', '195', '196', '197', '198', '199', '200', '201', '202', '203', '204', '205', '206', '207', '208', '209', '210', '211', '212', '213', '214', '215', '216', '217', '218', '219', '220', '221', '222'];
    const prefix = prefixes[seed % prefixes.length];
    const second = this.randomRange(1, 254);
    const third = this.randomRange(1, 254);
    const fourth = this.randomRange(1, 254);
    return `${prefix}.${second}.${third}.${fourth}`;
  }

  getCNIP(seed) {
    const prefixes = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60', '61', '62', '63', '64', '65', '66', '67', '68', '69', '70', '71', '72', '73', '74', '75', '76', '77', '78', '79', '80', '81', '82', '83', '84', '85', '86', '87', '88', '89', '90', '91', '92', '93', '94', '95', '96', '97', '98', '99', '100', '101', '102', '103', '104', '105', '106', '107', '108', '109', '110', '111', '112', '113', '114', '115', '116', '117', '118', '119', '120', '121', '122', '123', '124', '125', '126', '127', '128', '129', '130', '131', '132', '133', '134', '135', '136', '137', '138', '139', '140', '141', '142', '143', '144', '145', '146', '147', '148', '149', '150', '151', '152', '153', '154', '155', '156', '157', '158', '159', '160', '161', '162', '163', '164', '165', '166', '167', '168', '169', '170', '171', '172', '173', '174', '175', '176', '177', '178', '179', '180', '181', '182', '183', '184', '185', '186', '187', '188', '189', '190', '191', '192', '193', '194', '195', '196', '197', '198', '199', '200', '201', '202', '203', '204', '205', '206', '207', '208', '209', '210', '211', '212', '213', '214', '215', '216', '217', '218', '219', '220', '221', '222', '223'];
    const prefix = prefixes[seed % prefixes.length];
    const second = this.randomRange(1, 254);
    const third = this.randomRange(1, 254);
    const fourth = this.randomRange(1, 254);
    return `${prefix}.${second}.${third}.${fourth}`;
  }

  getRUIP(seed) {
    const prefixes = ['2', '3', '4', '5', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60', '61', '62', '63', '64', '65', '66', '67', '68', '69', '70', '71', '72', '73', '74', '75', '76', '77', '78', '79', '80', '81', '82', '83', '84', '85', '86', '87', '88', '89', '90', '91', '92', '93', '94', '95', '96', '97', '98', '99', '100', '101', '102', '103', '104', '105', '106', '107', '108', '109', '110', '111', '112', '113', '114', '115', '116', '117', '118', '119', '120', '121', '122', '123', '124', '125', '126', '127', '128', '129', '130', '131', '132', '133', '134', '135', '136', '137', '138', '139', '140', '141', '142', '143', '144', '145', '146', '147', '148', '149', '150', '151', '152', '153', '154', '155', '156', '157', '158', '159', '160', '161', '162', '163', '164', '165', '166', '167', '168', '169', '170', '171', '172', '173', '174', '175', '176', '177', '178', '179', '180', '181', '182', '183', '184', '185', '186', '187', '188', '189', '190'];
    const prefix = prefixes[seed % prefixes.length];
    const second = this.randomRange(1, 254);
    const third = this.randomRange(1, 254);
    const fourth = this.randomRange(1, 254);
    return `${prefix}.${second}.${third}.${fourth}`;
  }

  getZAIP(seed) {
    const prefixes = ['41', '102', '105', '129', '146', '147', '148', '149', '150', '151', '152', '153', '154', '155', '156', '157', '158', '159', '160', '161', '162', '163', '164', '165', '166', '167', '168', '169', '170', '171', '172', '173', '174', '175', '176', '177', '178', '179', '180', '181', '182', '183', '184', '185', '186', '187', '188', '189', '190', '191', '192', '193', '194', '195', '196', '197', '198', '199', '200', '201', '202', '203', '204', '205', '206', '207', '208', '209', '210', '211', '212', '213', '214', '215', '216', '217', '218', '219', '220', '221', '222', '223'];
    const prefix = prefixes[seed % prefixes.length];
    const second = this.randomRange(1, 254);
    const third = this.randomRange(1, 254);
    const fourth = this.randomRange(1, 254);
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
    if (this.usedIPs.size > 10000) {
      this.usedIPs.clear();
    }
    return ip;
  }

  getProxyIP(proxyUrl) {
    try {
      const url = new URL(proxyUrl);
      return url.hostname;
    } catch {
      return null;
    }
  }
}

// ============================================
// BROWSER FINGERPRINT GENERATOR
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
      const versions = ['119', '120', '121', '122'];
      const version = versions[requestNumber % versions.length];
      userAgent = userAgent.replace(/Chrome\/\d+/, `Chrome/${version}`);
    }
    
    return {
      userAgent: userAgent,
      secChUa: fp.secChUa,
      platform: fp.platform,
      browser: browser,
      version: this.getBrowserVersion(userAgent)
    };
  }

  getBrowserVersion(userAgent) {
    const match = userAgent.match(/(Chrome|Firefox|Safari|Edge)\/(\d+)/);
    return match ? parseInt(match[2]) : 0;
  }
}

// ============================================
// ADVANCED HEADER GENERATOR
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
    const encodings = [
      'gzip, deflate, br',
      'gzip, deflate, br, zstd',
      'br, gzip, deflate',
      'gzip, deflate'
    ];
    return encodings[requestNumber % encodings.length];
  }

  getCountryCode(region) {
    const codes = {
      'US': 'US', 'UK': 'GB', 'EU': 'EU', 'ASIA': 'AS',
      'CA': 'CA', 'AU': 'AU', 'BR': 'BR', 'IN': 'IN',
      'JP': 'JP', 'CN': 'CN', 'RU': 'RU', 'ZA': 'ZA'
    };
    return codes[region] || 'US';
  }

  getReferer(requestNumber) {
    const baseReferer = this.referers[requestNumber % this.referers.length];
    const query = Math.random().toString(36).substring(7);
    return `${baseReferer}${query}`;
  }

  getOrigin(requestNumber) {
    const origins = [
      'https://www.google.com',
      'https://www.bing.com',
      'https://search.yahoo.com',
      'https://duckduckgo.com',
      'https://www.facebook.com'
    ];
    return origins[requestNumber % origins.length];
  }

  generateRequestId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  generateTraceId() {
    return `00-${this.generateHex(32)}-${this.generateHex(16)}-01`;
  }

  generateSpanId() {
    return this.generateHex(16);
  }

  generateParentId() {
    return this.generateHex(16);
  }

  generateHex(length) {
    let result = '';
    for (let i = 0; i < length; i++) {
      result += Math.floor(Math.random() * 16).toString(16);
    }
    return result;
  }

  generateDeviceId(requestNumber) {
    const seed = requestNumber + Date.now();
    const hash = this.simpleHash(seed.toString());
    return `device-${hash.substring(0, 16)}`;
  }

  generateSessionId(requestNumber) {
    const session = `${requestNumber}-${Date.now()}-${Math.random()}`;
    const hash = this.simpleHash(session);
    return `session-${hash.substring(0, 20)}`;
  }

  generateBrowserFingerprint(fingerprint) {
    const parts = [
      fingerprint.userAgent,
      fingerprint.platform,
      Date.now().toString()
    ];
    const combined = parts.join('|');
    return this.simpleHash(combined).substring(0, 32);
  }

  generateCookies(requestNumber) {
    const cookies = [];
    const cookieNames = ['_ga', '_gid', '_gat', '_fbp', '_clck', '_clsk', '__cfduid', '__cf_bm', '__cflb'];
    
    for (let i = 0; i < 5 + (requestNumber % 3); i++) {
      const name = cookieNames[i % cookieNames.length];
      const value = this.generateCookieValue(requestNumber + i);
      cookies.push(`${name}=${value}`);
    }
    
    cookies.push(`session=${this.generateSessionId(requestNumber)}`);
    return cookies.join('; ');
  }

  generateCookieValue(seed) {
    const length = 10 + (seed % 10);
    let value = '';
    for (let i = 0; i < length; i++) {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      value += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return value;
  }

  addRandomHeaders(headers, requestNumber) {
    const extraHeaders = [
      'X-Custom-Header', 'X-Client-Data', 'X-Client-Version',
      'X-Source', 'X-Destination', 'X-Correlation-ID',
      'X-Transaction-ID', 'X-User-ID', 'X-Session-ID'
    ];
    
    const count = 2 + (requestNumber % 3);
    for (let i = 0; i < count; i++) {
      const name = extraHeaders[(requestNumber + i) % extraHeaders.length];
      const value = this.generateCookieValue(requestNumber + i);
      headers[name] = value;
    }
  }

  generateContentDigest() {
    return `sha-256=:${this.generateHex(32)}:`;
  }

  generateReprDigest() {
    return `sha-256=:${this.generateHex(32)}:`;
  }

  simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  }
}

// ============================================
// REQUEST EXECUTOR WITH ADVANCED BYPASS
// ============================================
class RequestExecutor {
  constructor(ipManager, fingerprintGen, headerGen, brightDataManager) {
    this.ipManager = ipManager;
    this.fingerprintGen = fingerprintGen;
    this.headerGen = headerGen;
    this.brightDataManager = brightDataManager;
    this.executionHistory = [];
    this.failedAttempts = new Map();
  }

  async executeRequest(targetUrl, region, requestNumber, timeoutMs, bypassLevel, useProxy, env) {
    const startTime = Date.now();
    const sessionId = this.headerGen.generateSessionId(requestNumber);
    
    const headers = this.headerGen.generateHeaders(
      region, 
      requestNumber, 
      bypassLevel,
      sessionId
    );

    let proxyUrl = null;
    let proxyData = null;

    if (useProxy) {
      // Try BrightData first if API key is available
      if (env.BRIGHTDATA_API_KEY || env.BRIGHTDATA_PROXY) {
        const proxies = await this.brightDataManager.getProxyList(env);
        if (proxies && proxies.length > 0) {
          proxyData = this.brightDataManager.getRandomProxy(proxies);
          if (proxyData) {
            proxyUrl = proxyData.url;
            // Add proxy authentication to headers
            if (proxyData.username && proxyData.password) {
              const auth = btoa(`${proxyData.username}:${proxyData.password}`);
              headers['Proxy-Authorization'] = `Basic ${auth}`;
            }
          }
        }
      }
      
      // Fallback to PROXY_LIST env var
      if (!proxyUrl && env.PROXY_LIST) {
        proxyUrl = this.getNextProxy(env.PROXY_LIST.split(',').filter(p => p.trim()));
      }
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
        
        // If using proxy, make request through proxy
        if (proxyUrl) {
          response = await this.executeWithProxy(
            targetUrl, 
            proxyUrl, 
            headers, 
            timeoutMs, 
            env
          );
        } else {
          response = await fetch(targetUrl.toString(), fetchOptions);
        }

        clearTimeout(timer);

        const responseTime = Date.now() - attemptStart;
        const totalTime = Date.now() - startTime;

        const result = {
          request: requestNumber,
          attempt: attempt,
          success: response.status >= 200 && response.status < 400,
          status: response.status,
          responseTimeMs: totalTime,
          attemptTimeMs: responseTime,
          proxy_used: !!proxyUrl,
          proxy_type: proxyData ? 'brightdata' : (proxyUrl ? 'custom' : 'none'),
          region: region,
          bypass_level: bypassLevel,
          ip_used: headers['X-Forwarded-For'],
          session_id: sessionId,
          user_agent: headers['User-Agent'],
          headers_count: Object.keys(headers).length,
        };

        if (!result.success && this.shouldRetry(response.status, attempt)) {
          const waitTime = this.getRetryDelay(attempt);
          await this.sleep(waitTime);
          continue;
        }

        this.executionHistory.push(result);
        return result;

      } catch (error) {
        lastError = error;
        const totalTime = Date.now() - startTime;
        
        if (attempt < maxRetries && this.isRetryableError(error)) {
          const waitTime = this.getRetryDelay(attempt);
          await this.sleep(waitTime);
          continue;
        }

        const result = {
          request: requestNumber,
          attempt: attempt,
          success: false,
          error: error.message || 'Request failed',
          responseTimeMs: totalTime,
          proxy_used: !!proxyUrl,
          proxy_type: proxyData ? 'brightdata' : (proxyUrl ? 'custom' : 'none'),
          region: region,
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
      proxy_type: proxyData ? 'brightdata' : (proxyUrl ? 'custom' : 'none'),
      region: region,
      bypass_level: bypassLevel,
      session_id: sessionId,
    };

    this.executionHistory.push(result);
    return result;
  }

  async executeWithProxy(targetUrl, proxyUrl, headers, timeoutMs, env) {
    // If using a proxy URL directly
    const proxyUrlObj = new URL(proxyUrl);
    const proxyHost = proxyUrlObj.hostname;
    const proxyPort = proxyUrlObj.port || (proxyUrlObj.protocol === 'https:' ? 443 : 80);
    
    // Build request through proxy
    const response = await fetch(targetUrl.toString(), {
      method: 'GET',
      headers: headers,
      // Note: Cloudflare Workers don't support direct proxy configuration
      // You would need to use a proxy service or do the request server-side
    });

    return response;
  }

  getNextProxy(proxyList) {
    if (!proxyList || proxyList.length === 0) return null;
    const index = Math.floor(Math.random() * proxyList.length);
    return proxyList[index];
  }

  shouldRetry(status, attempt) {
    const retryableStatuses = [429, 503, 504, 408, 500, 502];
    return retryableStatuses.includes(status) && attempt < CONFIG.maxRetries;
  }

  isRetryableError(error) {
    const retryableErrors = ['AbortError', 'TimeoutError', 'NetworkError'];
    return retryableErrors.some(e => error.name === e || error.message.includes(e));
  }

  getRetryDelay(attempt) {
    const baseDelay = 1000;
    const maxDelay = 30000;
    const exponential = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
    const jitter = Math.random() * 500;
    return exponential + jitter;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getExecutionStats() {
    const total = this.executionHistory.length;
    if (total === 0) return { successRate: 0, avgResponseTime: 0 };

    const successful = this.executionHistory.filter(r => r.success).length;
    const avgResponseTime = this.executionHistory.reduce((sum, r) => sum + r.responseTimeMs, 0) / total;
    
    return {
      successRate: (successful / total) * 100,
      avgResponseTime: Math.round(avgResponseTime),
      totalRequests: total,
      successfulRequests: successful,
      failedRequests: total - successful
    };
  }
}

// ============================================
// MAIN WORKER HANDLER
// ============================================
let ipManager = new IPManager();
let fingerprintGen = new FingerprintGenerator();
let headerGen = new HeaderGenerator(ipManager, fingerprintGen);
let brightDataManager = new BrightDataProxyManager();
let requestExecutor = new RequestExecutor(ipManager, fingerprintGen, headerGen, brightDataManager);

const rateLimitBuckets = new Map();

export default {
  async fetch(request, env, ctx) {
    // Initialize BrightData with env
    brightDataManager.apiKey = env.BRIGHTDATA_API_KEY || '';
    brightDataManager.proxyEndpoint = env.BRIGHTDATA_PROXY || '';
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
      features: {
        bypass_levels: Object.keys(CONFIG.bypassLevels),
        regions: ['US', 'UK', 'EU', 'ASIA', 'CA', 'AU', 'BR', 'IN', 'JP', 'CN', 'RU', 'ZA'],
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

  if (method === "GET" && url.pathname === "/health") {
    const stats = requestExecutor.getExecutionStats();
    const proxyStatus = {
      brightdata: {
        configured: !!(env.BRIGHTDATA_API_KEY || env.BRIGHTDATA_PROXY),
        api_key_present: !!env.BRIGHTDATA_API_KEY,
        proxy_endpoint_present: !!env.BRIGHTDATA_PROXY
      }
    };
    return json({
      success: true,
      status: "healthy",
      service: SERVICE_NAME,
      timestamp: new Date().toISOString(),
      stats: stats,
      proxy_status: proxyStatus,
      active_proxies: env.PROXY_LIST ? env.PROXY_LIST.split(',').length : 0
    });
  }

  if (method === "POST" && url.pathname === "/validate") {
    return await handleValidate(request, env);
  }

  if (method === "POST" && url.pathname === "/test") {
    return await handleTest(request, env);
  }

  if (method === "POST" && url.pathname === "/test-advanced") {
    return await handleAdvancedTest(request, env);
  }

  if (method === "POST" && url.pathname === "/test-stealth") {
    return await handleStealthTest(request, env);
  }

  if (method === "GET" && url.pathname === "/stats") {
    return await handleStats(request, env);
  }

  if (method === "POST" && url.pathname === "/clear-cache") {
    return await handleClearCache(request, env);
  }

  return errorResponse("Route not found", 404);
}

// ============================================
// HANDLER FUNCTIONS (same as before)
// ============================================
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
    validation_level: "full",
    bypass_capable: true
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

  const maxCount = getPositiveInteger(env.MAX_TEST_COUNT, CONFIG.maxTestCount);
  const count = body.count === undefined ? 1 : body.count;

  if (!Number.isInteger(count) || count < 1) {
    return errorResponse("Count must be at least 1", 400);
  }
  if (count > maxCount) {
    return errorResponse(`Count must not exceed ${maxCount}`, 400);
  }

  const timeoutMs = getPositiveInteger(env.REQUEST_TIMEOUT_MS, CONFIG.defaultTimeout);
  const bypassLevel = body.bypassLevel || 'medium';
  const region = body.region || 'US';
  const useProxies = body.useProxies !== false && !!(env.BRIGHTDATA_API_KEY || env.BRIGHTDATA_PROXY || env.PROXY_LIST);

  const results = [];
  for (let i = 1; i <= count; i++) {
    const result = await requestExecutor.executeRequest(
      validation.url,
      region,
      i,
      timeoutMs,
      bypassLevel,
      useProxies,
      env
    );
    results.push(result);
    
    const delay = getDelayByLevel(bypassLevel);
    if (i < count) {
      await sleep(delay);
    }
  }

  const statistics = calculateAdvancedStatistics(results);

  return json({
    success: true,
    target: validation.url.hostname,
    total: count,
    completed: results.length,
    region: region,
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
      proxy_type: r.proxy_type,
      region: r.region,
      bypass_level: r.bypass_level,
      ...(r.error && { error: r.error })
    }))
  });
}

async function handleAdvancedTest(request, env) {
  // Same as before but with BrightData support
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

  const count = body.count || 10;
  const maxCount = getPositiveInteger(env.MAX_TEST_COUNT, CONFIG.maxTestCount);
  if (count > maxCount) {
    return errorResponse(`Count must not exceed ${maxCount}`, 400);
  }

  const timeoutMs = getPositiveInteger(env.REQUEST_TIMEOUT_MS, CONFIG.defaultTimeout);
  const useProxies = body.useProxies !== false && !!(env.BRIGHTDATA_API_KEY || env.BRIGHTDATA_PROXY || env.PROXY_LIST);
  const testAllLevels = body.testAllLevels !== false;
  const regions = body.regions || ['US', 'UK', 'EU', 'ASIA'];
  const bypassLevels = testAllLevels ? 
    ['low', 'medium', 'high', 'ultra', 'stealth'] : 
    [body.bypassLevel || 'high'];

  const allResults = [];
  const summary = {};

  for (const region of regions) {
    summary[region] = {};
    
    for (const level of bypassLevels) {
      const results = [];
      const perLevelCount = Math.ceil(count / bypassLevels.length);
      
      for (let i = 1; i <= perLevelCount; i++) {
        const result = await requestExecutor.executeRequest(
          validation.url,
          region,
          i,
          timeoutMs,
          level,
          useProxies,
          env
        );
        results.push(result);
        allResults.push(result);
        
        const delay = getDelayByLevel(level);
        if (i < perLevelCount) {
          await sleep(delay);
        }
      }
      
      const stats = calculateAdvancedStatistics(results);
      summary[region][level] = {
        count: results.length,
        ...stats
      };
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
      proxy_type: r.proxy_type,
      ...(r.error && { error: r.error })
    }))
  });
}

async function handleStealthTest(request, env) {
  const body = await request.json().catch(() => ({}));
  
  if (!body.url) {
    return errorResponse("URL is required", 400);
  }

  const validation = validateTargetUrl(body.url, env);
  if (!validation.ok) {
    return errorResponse(validation.error, validation.status);
  }

  const count = Math.min(body.count || 3, 10);
  const timeoutMs = getPositiveInteger(env.REQUEST_TIMEOUT_MS, CONFIG.defaultTimeout);
  const useProxies = body.useProxies !== false && !!(env.BRIGHTDATA_API_KEY || env.BRIGHTDATA_PROXY || env.PROXY_LIST);

  const regions = ['US', 'UK', 'EU', 'ASIA', 'CA', 'AU', 'BR'];
  const stealthLevels = ['ultra', 'stealth'];
  
  const results = [];
  for (let i = 1; i <= count; i++) {
    const region = regions[Math.floor(Math.random() * regions.length)];
    const level = stealthLevels[i % stealthLevels.length];
    
    await sleep(getRandomDelay(2000, 5000));
    
    const result = await requestExecutor.executeRequest(
      validation.url,
      region,
      i,
      timeoutMs,
      level,
      useProxies,
      env
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
      proxy_type: r.proxy_type
    }))
  });
}

async function handleStats(request, env) {
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

async function handleClearCache(request, env) {
  ipManager = new IPManager();
  fingerprintGen = new FingerprintGenerator();
  headerGen = new HeaderGenerator(ipManager, fingerprintGen);
  brightDataManager = new BrightDataProxyManager();
  brightDataManager.apiKey = env.BRIGHTDATA_API_KEY || '';
  brightDataManager.proxyEndpoint = env.BRIGHTDATA_PROXY || '';
  requestExecutor = new RequestExecutor(ipManager, fingerprintGen, headerGen, brightDataManager);
  
  return json({
    success: true,
    message: "Cache cleared successfully",
    timestamp: new Date().toISOString()
  });
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

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

  const allowedHosts = getPositiveInteger(env.ALLOWED_HOSTS, '');
  if (allowedHosts !== '*' && !isAllowedHost(targetUrl.hostname, env)) {
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

  return host.includes(":");
}

function calculateAdvancedStatistics(results) {
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
      medianResponseTimeMs: 0,
      p95ResponseTimeMs: 0,
      p99ResponseTimeMs: 0
    };
  }

  const sorted = [...responseTimes].sort((a, b) => a - b);
  const totalResponseTime = responseTimes.reduce((sum, value) => sum + value, 0);
  const medianIndex = Math.floor(sorted.length / 2);
  const p95Index = Math.floor(sorted.length * 0.95);
  const p99Index = Math.floor(sorted.length * 0.99);

  const stats = {
    successful,
    failed,
    successRate: Number(((successful / results.length) * 100).toFixed(2)),
    averageResponseTimeMs: Math.round(totalResponseTime / responseTimes.length),
    minResponseTimeMs: Math.min(...responseTimes),
    maxResponseTimeMs: Math.max(...responseTimes),
    medianResponseTimeMs: sorted[medianIndex] || 0,
    p95ResponseTimeMs: sorted[p95Index] || sorted[sorted.length - 1] || 0,
    p99ResponseTimeMs: sorted[p99Index] || sorted[sorted.length - 1] || 0,
    total_response_time_ms: totalResponseTime,
    stdDevResponseTimeMs: Math.round(calculateStdDev(responseTimes))
  };

  return stats;
}

function calculateStdDev(values) {
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
  const avgSquaredDiff = squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
  return Math.sqrt(avgSquaredDiff);
}

function getDelayByLevel(level) {
  const delays = {
    'low': 100,
    'medium': 300,
    'high': 500,
    'ultra': 800,
    'stealth': 1200
  };
  return delays[level] || 300;
}

function getRandomDelay(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function checkRateLimit(request, env) {
  const limit = getPositiveInteger(
    env.RATE_LIMIT_PER_MINUTE,
    CONFIG.rateLimitPerMinute,
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
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
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
