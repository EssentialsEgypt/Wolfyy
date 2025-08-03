import fetchWithRetry from '../../utils/fetchWithRetry.js';
import supabase from '../../utils/supabaseClient.js';

const CLIENT_KEY = process.env.TIKTOK_CLIENT_KEY;
const CLIENT_SECRET = process.env.TIKTOK_CLIENT_SECRET;

// TikTok Marketing API OAuth endpoints
const AUTHORIZE_URL = 'https://www.tiktok.com/v2/auth/authorize/';
const TOKEN_URL = 'https://business-api.tiktok.com/open_api/oauth2/v1/token/';

export function getAuthorizationUrl(state, redirectUri) {
  const params = new URLSearchParams({
    app_id: CLIENT_KEY || '',
    redirect_uri: redirectUri,
    state,
    scope: 'advertiser.read',
    response_type: 'code'
  });
  return `${AUTHORIZE_URL}?${params.toString()}`;
}

export async function getToken(code, redirectUri) {
  const body = new URLSearchParams({
    app_id: CLIENT_KEY || '',
    secret: CLIENT_SECRET || '',
    grant_type: 'authorization_code',
    auth_code: code,
    redirect_uri: redirectUri
  });
  const res = await fetchWithRetry(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString()
  });
  const data = await res.json();
  if (data.code !== 0) {
    throw new Error(data.message || 'TikTok token error');
  }
  return {
    access_token: data.data.access_token,
    refresh_token: data.data.refresh_token,
    expires_in: data.data.expires_in
  };
}

export async function refreshToken(refresh_token) {
  const body = new URLSearchParams({
    app_id: CLIENT_KEY || '',
    secret: CLIENT_SECRET || '',
    grant_type: 'refresh_token',
    refresh_token
  });
  const res = await fetchWithRetry(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString()
  });
  const data = await res.json();
  if (data.code !== 0) {
    throw new Error(data.message || 'TikTok refresh error');
  }
  return {
    access_token: data.data.access_token,
    refresh_token: data.data.refresh_token,
    expires_in: data.data.expires_in
  };
}

export async function fetchData(user_id) {
  const { data: connection, error } = await supabase
    .from('connections')
    .select('access_token')
    .eq('user_id', user_id)
    .eq('provider', 'tiktok')
    .single();
  if (error || !connection) {
    throw new Error('No TikTok connection found for user');
  }
  const accessToken = connection.access_token;
  // Example call: list advertisers; customise for your needs
  const url = `https://business-api.tiktok.com/open_api/v1.3/advertiser/info/?access_token=${accessToken}`;
  const res = await fetchWithRetry(url);
  return res.json();
}
