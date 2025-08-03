import fetch from 'node-fetch';
import supabase from '../../utils/supabaseClient';

const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_ADS_API_URL = 'https://googleads.googleapis.com/v11/customers';
const GOOGLE_ANALYTICS_API_URL = 'https://analyticsdata.googleapis.com/v1beta/properties';

async function getToken(code, redirectUri) {
  try {
    const params = new URLSearchParams();
    params.append('client_id', process.env.GOOGLE_CLIENT_ID);
    params.append('client_secret', process.env.GOOGLE_CLIENT_SECRET);
    params.append('code', code);
    params.append('redirect_uri', redirectUri);
    params.append('grant_type', 'authorization_code');

    const response = await fetch(GOOGLE_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to get token: ${errorData.error_description || response.statusText}`);
    }

    const tokenData = await response.json();
    return tokenData;
  } catch (error) {
    console.error('Error in getToken:', error);
    throw error;
  }
}

async function refreshToken(refresh_token) {
  try {
    const params = new URLSearchParams();
    params.append('client_id', process.env.GOOGLE_CLIENT_ID);
    params.append('client_secret', process.env.GOOGLE_CLIENT_SECRET);
    params.append('refresh_token', refresh_token);
    params.append('grant_type', 'refresh_token');

    const response = await fetch(GOOGLE_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to refresh token: ${errorData.error_description || response.statusText}`);
    }

    const tokenData = await response.json();
    return tokenData;
  } catch (error) {
    console.error('Error in refreshToken:', error);
    throw error;
  }
}

async function fetchAdsData(user_id) {
  try {
    // Retrieve user token from Supabase
    const { data, error } = await supabase
      .from('google_tokens')
      .select('*')
      .eq('user_id', user_id)
      .single();

    if (error || !data) {
      throw new Error('Google token not found for user');
    }

    const accessToken = data.access_token;
    const customerId = data.customer_id; // Assuming customer_id is stored

    if (!accessToken || !customerId) {
      throw new Error('Missing access token or customer ID');
    }

    const url = `${GOOGLE_ADS_API_URL}/${customerId}/campaigns`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to fetch ads data: ${errorData.error.message || response.statusText}`);
    }

    const adsData = await response.json();
    return adsData;
  } catch (error) {
    console.error('Error in fetchAdsData:', error);
    throw error;
  }
}

async function fetchAnalyticsData(user_id) {
  try {
    // Retrieve user token and property ID from Supabase
    const { data, error } = await supabase
      .from('google_tokens')
      .select('*')
      .eq('user_id', user_id)
      .single();

    if (error || !data) {
      throw new Error('Google token not found for user');
    }

    const accessToken = data.access_token;
    const propertyId = data.property_id; // Assuming GA4 property ID is stored

    if (!accessToken || !propertyId) {
      throw new Error('Missing access token or property ID');
    }

    const url = `${GOOGLE_ANALYTICS_API_URL}/${propertyId}:runReport`;

    const body = {
      dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
      metrics: [{ name: 'activeUsers' }, { name: 'sessions' }],
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to fetch analytics data: ${errorData.error.message || response.statusText}`);
    }

    const analyticsData = await response.json();
    return analyticsData;
  } catch (error) {
    console.error('Error in fetchAnalyticsData:', error);
    throw error;
  }
}

export { getToken, refreshToken, fetchAdsData, fetchAnalyticsData };
