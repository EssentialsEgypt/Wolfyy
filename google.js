import fetchWithRetry from '../../utils/fetchWithRetry.js';
import supabase from '../../utils/supabaseClient.js';

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

const AUTHORIZE_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';

const SCOPES = [
  'https://www.googleapis.com/auth/adwords',
  'https://www.googleapis.com/auth/yt-analytics.readonly',
  'https://www.googleapis.com/auth/youtube.readonly'
];

export function getAuthorizationUrl(state, redirectUri) {
  const params = new URLSearchParams({
    client_id: CLIENT_ID || '',
    redirect_uri: redirectUri,
    response_type: 'code',
    access_type: 'offline',
    prompt: 'consent',
    scope: SCOPES.join(' '),
    state
  });
  return `${AUTHORIZE_URL}?${params.toString()}`;
}

export async function getToken(code, redirectUri) {
  const body = new URLSearchParams({
    code,
    client_id: CLIENT_ID || '',
    client_secret: CLIENT_SECRET || '',
    redirect_uri: redirectUri,
    grant_type: 'authorization_code'
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

export async function refreshToken(refresh_token) {
  const body = new URLSearchParams({
    client_id: CLIENT_ID || '',
    client_secret: CLIENT_SECRET || '',
    refresh_token,
    grant_type: 'refresh_token'
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
    .eq('provider', 'google')
    .single();
  if (error || !connection) {
    throw new Error('No Google connection found for user');
  }
  const accessToken = connection.access_token;
  // Example call: get current customer from Google Ads. Replace with actual endpoint.
  const url = 'https://googleads.googleapis.com/v14/customers:listAccessibleCustomers';
  const res = await fetchWithRetry(url, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  return res.json();
}
