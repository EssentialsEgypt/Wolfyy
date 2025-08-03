/**
 * Perform an HTTP request with automatic retries and exponential backoff.
 * This helper is useful when communicating with third‑party APIs that may
 * return transient errors such as 429 or 5xx. It will attempt the request
 * up to `maxRetries` times before throwing the last encountered error.
 *
 * @param {string|Request} input The resource to fetch
 * @param {object} [init] Fetch options
 * @param {number} [maxRetries=3] Maximum number of retries
 * @param {number} [backoff=500] Initial backoff in milliseconds
 */
export default async function fetchWithRetry(input, init = {}, maxRetries = 3, backoff = 500) {
  let attempt = 0;
  let error;
  while (attempt <= maxRetries) {
    try {
      const res = await fetch(input, init);
      // Retry on too many requests or internal server errors
      if (res.status >= 500 || res.status === 429) {
        throw new Error(`Fetch failed with status ${res.status}`);
      }
      return res;
    } catch (err) {
      error = err;
      if (attempt === maxRetries) {
        break;
      }
      const delay = backoff * Math.pow(2, attempt);
      await new Promise((resolve) => setTimeout(resolve, delay));
      attempt += 1;
    }
  }
  throw error;
}