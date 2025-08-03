import { getAuthorizationUrl } from '../../../../services/platforms/twitter.js';

export default function twitterLogin(req, res) {
  const { redirectUri } = req.query;
  const callback = redirectUri || `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/twitter/callback`;
  const state = Date.now().toString();
  const url = getAuthorizationUrl(state, callback);
  res.status(200).json({ url });
}