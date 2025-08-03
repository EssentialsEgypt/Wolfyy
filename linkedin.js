import fetchWithRetry from '../../utils/fetchWithRetry.js';
import supabase from '../../utils/supabaseClient.js';

const CLIENT_ID = process.env.LINKEDIN_CLIENT_ID;
const CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;

const AUTHORIZE_URL = 'https://www.linkedin.com/oauth/v2/authorization';
const TOKEN_URL = 'https://www.linkedin.com/oauth/v2/accessToken';

const SCOPES = [
  'r_liteprofile',
  'r_emailaddress',
  'w_member_social',
  'rw_organization_admin',
  'w_organization_social'
];

export function getAuthorizationUrl(state, redirectUri) {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: CLIENT_ID || '',
    redirect_uri: redirectUri,
    state,
    scope: SCOPES.join(' ')
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
  // LinkedIn access tokens currently cannot be refreshed; they are long lived.
  throw new Error('LinkedIn refresh not supported');
}

export async function fetchData(user_id) {
  const { data: connection, error } = await supabase
    .from('connections')
    .select('access_token')
    .eq('user_id', user_id)
    .eq('provider', 'linkedin')
    .single();
  if (error || !connection) {
    throw new Error('No LinkedIn connection found for user');
  }
  const accessToken = connection.access_token;
  const res = await fetchWithRetry('https://api.linkedin.com/v2/me', {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  return res.json();
}
