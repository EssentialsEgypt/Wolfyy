import fetchWithRetry from '../../utils/fetchWithRetry.js';
import supabase from '../../utils/supabaseClient.js';

const API_KEY = process.env.SHOPIFY_API_KEY;
const API_SECRET = process.env.SHOPIFY_API_SECRET;

/**
 * Build the Shopify OAuth authorization URL. Note that the shop domain is
 * required and should be provided by the client when initiating the login.
 *
 * @param {string} shop The *.myshopify.com shop domain
 * @param {string} state Random CSRF token
 * @param {string} redirectUri Callback URL
 */
export function getAuthorizationUrl(shop, state, redirectUri) {
  const scopes = ['read_products', 'read_orders', 'write_orders'].join(',');
  const params = new URLSearchParams({
    client_id: API_KEY || '',
    scope: scopes,
    redirect_uri: redirectUri,
    state,
    'grant_options[]': 'per-user'
  });
  return `https://${shop}/admin/oauth/authorize?${params.toString()}`;
}

/**
 * Exchange the authorization code for an access token. The shop domain must
 * accompany the request.
 *
 * @param {string} shop The *.myshopify.com shop domain
 * @param {string} code Authorization code
 */
export async function getToken(shop, code) {
  const url = `https://${shop}/admin/oauth/access_token`;
  const body = JSON.stringify({
    client_id: API_KEY || '',
    client_secret: API_SECRET || '',
    code
  });
  const res = await fetchWithRetry(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body
  });
  const data = await res.json();
  if (data.errors) {
    throw new Error(data.errors);
  }
  return data;
}

export async function refreshToken() {
  // Shopify access tokens do not expire when using the per-user option. If you
  // request offline tokens they will expire when the app is uninstalled.
  throw new Error('Shopify tokens cannot be refreshed');
}

export async function fetchData(user_id) {
  // Fetch shop information for the user. The shop domain must be stored in
  // the connections table along with the token.
  const { data: connection, error } = await supabase
    .from('connections')
    .select('access_token, shop')
    .eq('user_id', user_id)
    .eq('provider', 'shopify')
    .single();
  if (error || !connection) {
    throw new Error('No Shopify connection found for user');
  }
  const { access_token, shop } = connection;
  const res = await fetchWithRetry(`https://${shop}/admin/api/2024-07/shop.json`, {
    headers: { 'X-Shopify-Access-Token': access_token }
  });
  return res.json();
}
