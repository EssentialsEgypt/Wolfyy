import fetchWithRetry from '../../utils/fetchWithRetry.js';
import supabase from '../../utils/supabaseClient.js';

const CLIENT_ID = process.env.INSTAGRAM_CLIENT_ID;
const CLIENT_SECRET = process.env.INSTAGRAM_CLIENT_SECRET;
const API_VERSION = process.env.FACEBOOK_API_VERSION || 'v18.0';

export function getAuthorizationUrl(state, redirectUri) {
  const params = new URLSearchParams({
    client_id: CLIENT_ID || '',
    redirect_uri: redirectUri,
    state,
    response_type: 'code',
    scope: 'instagram_basic,ads_management'
  });
  return `https://api.instagram.com/oauth/authorize?${params.toString()}`;
}

export async function getToken(code, redirectUri) {
  const url =
    'https://api.instagram.com/oauth/access_token';
  const body = new URLSearchParams({
    client_id: CLIENT_ID || '',
    client_secret: CLIENT_SECRET || '',
    grant_type: 'authorization_code',
    redirect_uri: redirectUri,
    code
  });
  const res = await fetchWithRetry(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString()
  });
  const data = await res.json();
  if (data.error_type) {
    throw new Error(data.error_message);
  }
  return data;
}

export async function refreshToken(refresh_token) {
  // Instagram long‑lived tokens can be extended. Implement as needed.
  throw new Error('Instagram token refresh not implemented');
}

export async function fetchData(user_id) {
  const { data: connection, error } = await supabase
    .from('connections')
    .select('access_token, user_id')
    .eq('user_id', user_id)
    .eq('provider', 'instagram')
    .single();
  if (error || !connection) {
    throw new Error('No Instagram connection found for user');
  }
  const accessToken = connection.access_token;
  const url = `https://graph.instagram.com/me/media?fields=id,caption&access_token=${accessToken}`;
  const res = await fetchWithRetry(url);
  return res.json();
}
