/**
 * Dynamic API configuration.
 *
 * Automatically fetches the active Cloudflare Tunnel URL from a live GitHub Gist,
 * so restarting services or the server never breaks the Netlify website.
 */

const GIST_API_URL = 'https://api.github.com/gists/da0d9dfca2f184444f8ea9b1f4d9e220';

export let API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'https://legendtech.store';

let cachedApiUrl = null;
let lastFetchTime = 0;
const CACHE_LIFETIME_MS = 60 * 1000; // 1 minute in-memory cache

/**
 * Dynamically resolves the active backend URL from the live GitHub Gist registry.
 */
export async function getApiBaseUrl() {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  const now = Date.now();
  if (cachedApiUrl && now - lastFetchTime < CACHE_LIFETIME_MS) {
    return cachedApiUrl;
  }

  try {
    const stored = sessionStorage.getItem('active_insta_api_url');
    const storedTime = Number(sessionStorage.getItem('active_insta_api_time') || 0);
    if (stored && now - storedTime < CACHE_LIFETIME_MS) {
      cachedApiUrl = stored;
      API_BASE_URL = stored;
      lastFetchTime = storedTime;
      return stored;
    }
  } catch (e) {}

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(GIST_API_URL, {
      signal: controller.signal,
      headers: { Accept: 'application/vnd.github+json' },
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const content = data?.files?.['tunnel.json']?.content;
      if (content) {
        const parsed = JSON.parse(content);
        if (parsed?.url && parsed.url.startsWith('https://')) {
          cachedApiUrl = parsed.url.trim().replace(/\/$/, '');
          API_BASE_URL = cachedApiUrl;
          lastFetchTime = now;
          try {
            sessionStorage.setItem('active_insta_api_url', cachedApiUrl);
            sessionStorage.setItem('active_insta_api_time', String(now));
          } catch (e) {}
          return cachedApiUrl;
        }
      }
    }
  } catch (err) {
    console.warn('Could not fetch active tunnel from Gist, using fallback:', err);
  }

  return cachedApiUrl || API_BASE_URL;
}

// Pre-resolve on load
getApiBaseUrl().catch(() => {});

/**
 * Returns the full avatar proxy URL for a given raw image URL.
 */
export const getAvatarProxyUrl = async (rawUrl) => {
  if (!rawUrl) return null;
  const baseUrl = await getApiBaseUrl();
  return `${baseUrl}/api/avatar-proxy?url=${encodeURIComponent(rawUrl)}`;
};
