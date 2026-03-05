const SPIDER_API_BASE = "https://api.spider.cloud";

/**
 * Get the stored Spider API key.
 */
function getApiKey(): string {
  const key = PropertiesService.getUserProperties().getProperty("SPIDER_API_KEY");
  if (!key) {
    throw new Error("No API key set. Open Spider → Settings to enter your key.");
  }
  return key;
}

/**
 * Set the Spider API key.
 */
function setApiKey(key: string): void {
  PropertiesService.getUserProperties().setProperty("SPIDER_API_KEY", key.trim());
}

/**
 * Make a POST request to the Spider API.
 */
function spiderPost(endpoint: string, payload: Record<string, unknown>): SpiderResponse {
  const key = getApiKey();
  const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
    method: "post",
    contentType: "application/json",
    headers: { Authorization: `Bearer ${key}` },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
  };
  const response = UrlFetchApp.fetch(`${SPIDER_API_BASE}${endpoint}`, options);
  return {
    status: response.getResponseCode(),
    body: response.getContentText(),
  };
}

/**
 * Make a GET request to the Spider API.
 */
function spiderGet(endpoint: string): SpiderResponse {
  const key = getApiKey();
  const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
    method: "get",
    headers: { Authorization: `Bearer ${key}` },
    muteHttpExceptions: true,
  };
  const response = UrlFetchApp.fetch(`${SPIDER_API_BASE}${endpoint}`, options);
  return {
    status: response.getResponseCode(),
    body: response.getContentText(),
  };
}

/**
 * POST with caching. Returns cached result if available.
 */
function spiderPostCached(endpoint: string, payload: Record<string, unknown>): SpiderResponse {
  const cache = CacheService.getUserCache();
  const key = cacheKey(endpoint, payload);

  const cached = cache?.get(key);
  if (cached) {
    return JSON.parse(cached) as SpiderResponse;
  }

  const result = spiderPost(endpoint, payload);

  if (result.status >= 200 && result.status < 300 && cache) {
    try {
      cache.put(key, JSON.stringify(result), 21600); // 6 hours
    } catch {
      // Cache value too large — skip caching
    }
  }

  return result;
}

interface SpiderResponse {
  status: number;
  body: string;
}
