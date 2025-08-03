import fetchWithRetry from '../../utils/fetchWithRetry.js';
import supabase from '../../utils/supabaseClient.js';

const CLIENT_ID = process.env.SNAPCHAT_CLIENT_ID;
const CLIENT_SECRET = process.env.SNAPCHAT_CLIENT_SECRET;

const AUTHORIZE_URL = 'https://accounts.snapchat.com/accounts/oauth2/auth';
const TOKEN_URL = 'https://accounts.snapchat.com/accounts/oauth2/token';

const SCOPES = [
  'campaigns.read',
  'ads.read',
  'profile.read'
];

export function getAuthorizationUrl(state, redirectUri) {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: CLIENT_ID || '',
    redirect_uri: redirectUri,
    scope: SCOPES.join(' '),
    state
  });
  return `${AUTHORIZE_URL}?${params.toString()}`;
}

export async function getToken(code, redirectUri) {
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri,
    client_id: CLIENT_ID || '',
    client_secret: CLIENT_SECRET || ''
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
    grant_type: 'refresh_token',
    refresh_token,
    client_id: CLIENT_ID || '',
    client_secret: CLIENT_SECRET || ''
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
    .eq('provider', 'snapchat')
    .single();
  if (error || !connection) {
    throw new Error('No Snapchat connection found for user');
  }
  const accessToken = connection.access_token;
  // Example call; replace with your desired endpoint
  const res = await fetchWithRetry('https://adsapi.snapchat.com/v1/advertisers', {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  return res.json();
}
