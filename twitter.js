import fetchWithRetry from '../../utils/fetchWithRetry.js';
import supabase from '../../utils/supabaseClient.js';

const CLIENT_ID = process.env.TWITTER_CLIENT_ID;
const CLIENT_SECRET = process.env.TWITTER_CLIENT_SECRET;

// Twitter/X currently supports OAuth 2.0 for user context with PKCE. For
// simplicity this module implements the confidential client flow. If you
// require OAuth 1.0a for ads access you will need to adapt these functions.

const AUTHORIZE_URL = 'https://twitter.com/i/oauth2/authorize';
const TOKEN_URL = 'https://api.twitter.com/2/oauth2/token';

const SCOPES = [
  'tweet.read',
  'users.read',
  'offline.access'
];

export function getAuthorizationUrl(state, redirectUri) {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: CLIENT_ID || '',
    redirect_uri: redirectUri,
    scope: SCOPES.join(' '),
    state,
    code_challenge: state,
    code_challenge_method: 'plain'
  });
  return `${AUTHORIZE_URL}?${params.toString()}`;
}

export async function getToken(code, redirectUri) {
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri,
    client_id: CLIENT_ID || '',
    code_verifier: code // In the plain PKCE example we reuse the state
  });
  const res = await fetchWithRetry(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
    // Twitter requires Basic auth with client credentials for confidential clients
    // but for PKCE flows this header must be omitted
  });
  const data = await res.json();
  if (data.error) {
    throw new Error(data.error_description || data.error);
  }
  return data;
}

export async function refreshToken(refresh_token) {
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token,
    client_id: CLIENT_ID || ''
  });
  const res = await fetchWithRetry(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString()
  });
  const data = await res.json();
  if (data.error) {
    throw new Error(data.error_description || data.error);
  }
  return data;
}

export async function fetchData(user_id) {
  const { data: connection, error } = await supabase
    .from('connections')
    .select('access_token')
    .eq('user_id', user_id)
    .eq('provider', 'twitter')
    .single();
  if (error || !connection) {
    throw new Error('No Twitter connection found for user');
  }
  const accessToken = connection.access_token;
  const res = await fetchWithRetry('https://api.twitter.com/2/users/me', {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  return res.json();
}
