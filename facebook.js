import fetchWithRetry from '../../fetchWithRetry';
import supabase from '../../utils/supabaseClient';

const FACEBOOK_CLIENT_ID = process.env.FACEBOOK_CLIENT_ID;
const FACEBOOK_CLIENT_SECRET = process.env.FACEBOOK_CLIENT_SECRET;
const FACEBOOK_API_VERSION = process.env.FACEBOOK_API_VERSION || 'v12.0';

export async function getToken(code, redirectUri) {
  try {
    const url = "https://graph.facebook.com/" + FACEBOOK_API_VERSION + "/oauth/access_token?client_id=" + FACEBOOK_CLIENT_ID + "&redirect_uri=" + encodeURIComponent(redirectUri) + "&client_secret=" + FACEBOOK_CLIENT_SECRET + "&code=" + code;
    const response = await fetchWithRetry(url);
    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    return data;
  } catch (error) {
    console.error('Error in getToken:', error);
    throw error;
  }
}

export async function refreshToken(refresh_token) {
  try {
    throw new Error('Token refresh is not supported by Facebook.');
  } catch (error) {
    console.error('Error in refreshToken:', error);
    throw error;
  }
}

export async function fetchData(user_id) {
  try {
    const { data: connection, error } = await supabase
      .from('connections')
      .select('access_token')
      .eq('user_id', user_id)
      .single();

    if (error || !connection) {
      throw new Error('No connection record found for the user.');
    }

    const accessToken = connection.access_token;
    const url = "https://graph.facebook.com/" + FACEBOOK_API_VERSION + "/me/adaccounts?fields=campaigns{id,name,status}&access_token=" + accessToken;

    const response = await fetchWithRetry(url);
    const result = await response.json();

    if (result.error) {
      throw new Error(result.error.message);
    }

    return result;
  } catch (error) {
    console.error('Error in fetchData:', error);
    throw error;
  }
}
