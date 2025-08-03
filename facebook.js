import fetchWithRetry from '../../utils/fetchWithRetry.js';
import supabase from '../../utils/supabaseClient.js';

const CLIENT_ID = process.env.FACEBOOK_CLIENT_ID;
const CLIENT_SECRET = process.env.FACEBOOK_CLIENT_SECRET;
const API_VERSION = process.env.FACEBOOK_API_VERSION || 'v18.0';

/**
 * Build the Facebook OAuth authorization URL. A random state value should be
 * supplied by the caller to mitigate CSRF attacks. The redirect URI must
 * match one of the URIs configured in your Facebook app settings.
 *
 * @param {string} state Random value for CSRF protection
 * @param {string} redirectUri Full callback URI
 */
export function getAuthorizationUrl(state, redirectUri) {
  const scope = ['ads_management', 'pages_read_engagement'].join(',');
  const params = new URLSearchParams({
    client_id: CLIENT_ID || '',
    redirect_uri: redirectUri,
    state,
    response_type: 'code',
    scope
  });
  return `https://www.facebook.com/${API_VERSION}/dialog/oauth?${params.toString()}`;
}

/**
 * Exchange a Facebook authorization code for an access token. Returns an
 * object containing `access_token`, `token_type` and `expires_in`. Facebook
 * does not issue refresh tokens; when the token expires the user must
 * re‑authenticate.
 *
 * @param {string} code Authorization code from the callback
 * @param {string} redirectUri The same redirect URI used during login
 */
export async function getToken(code, redirectUri) {
  const url =
    `https://graph.facebook.com/${API_VERSION}/oauth/access_token?` +
    new URLSearchParams({
      client_id: CLIENT_ID || '',
      redirect_uri: redirectUri,
      client_secret: CLIENT_SECRET || '',
      code
    }).toString();
  const res = await fetchWithRetry(url);
  const data = await res.json();
  if (data.error) {
    throw new Error(data.error.message);
  }
  return data;
}

/**
 * Facebook access tokens cannot be refreshed programmatically. This function
 * exists to maintain a consistent API shape across platforms and will
 * always throw.
 */
export async function refreshToken() {
  throw new Error('Facebook does not support refresh tokens');
}

/**
 * Fetch campaigns and basic account information from the Facebook Marketing API
 * for the authenticated user. Looks up the stored access token in the
 * connections table and performs a Graph API call.
 *
 * @param {string} user_id Supabase user identifier
 */
export async function fetchData(user_id) {
  const { data: connection, error } = await supabase
    .from('connections')
    .select('access_token')
    .eq('user_id', user_id)
    .eq('provider', 'facebook')
    .single();
  if (error || !connection) {
    throw new Error('No Facebook connection found for user');
  }
  const accessToken = connection.access_token;
  const url =
    `https://graph.facebook.com/${API_VERSION}/me/adaccounts?` +
    new URLSearchParams({
      fields: 'id,name,status,account_status,currency,timezone_name',
      access_token: accessToken
    }).toString();
  const res = await fetchWithRetry(url);
  const json = await res.json();
  if (json.error) {
    throw new Error(json.error.message);
  }
  return json;
}
