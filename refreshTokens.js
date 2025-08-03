import supabase from '../utils/supabaseClient.js';
import { refreshToken as googleRefresh } from '../services/platforms/google.js';
import { refreshToken as tiktokRefresh } from '../services/platforms/tiktok.js';
import { refreshToken as snapchatRefresh } from '../services/platforms/snapchat.js';
import { refreshToken as twitterRefresh } from '../services/platforms/twitter.js';
// Facebook, Instagram, LinkedIn and Shopify do not support refresh tokens

const PROVIDER_REFRESH_MAP = {
  google: googleRefresh,
  tiktok: tiktokRefresh,
  snapchat: snapchatRefresh,
  twitter: twitterRefresh
};

async function run() {
  console.log('Refreshing tokens...');
  const { data: connections, error } = await supabase
    .from('connections')
    .select('id,user_id,provider,access_token,refresh_token,expires_at');
  if (error) {
    console.error('Failed to fetch connections:', error);
    return;
  }
  const now = new Date();
  for (const conn of connections) {
    const { provider, refresh_token, expires_at, user_id } = conn;
    const refreshFn = PROVIDER_REFRESH_MAP[provider];
    if (!refreshFn || !refresh_token) {
      continue;
    }
    const expiry = expires_at ? new Date(expires_at) : null;
    // Refresh tokens expiring within 1 day
    if (expiry && expiry > now && expiry - now > 24 * 60 * 60 * 1000) {
      continue;
    }
    try {
      const tokenData = await refreshFn(refresh_token);
      const { access_token, refresh_token: newRefresh, expires_in } = tokenData;
      const newExpires = expires_in ? new Date(Date.now() + expires_in * 1000).toISOString() : null;
      const { error: updateError } = await supabase
        .from('connections')
        .update({
          access_token,
          refresh_token: newRefresh || refresh_token,
          expires_at: newExpires
        })
        .eq('user_id', user_id)
        .eq('provider', provider);
      if (updateError) {
        console.error(`Failed to update ${provider} token for user ${user_id}:`, updateError);
      } else {
        console.log(`Refreshed ${provider} token for user ${user_id}`);
      }
    } catch (err) {
      console.error(`Error refreshing ${provider} token for user ${user_id}:`, err);
    }
  }
  console.log('Token refresh completed');
}

run().catch((err) => {
  console.error('Refresh job failed:', err);
});
