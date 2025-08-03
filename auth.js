import jwt from 'jsonwebtoken';

/**
 * Sign a JSON Web Token for the given user. The token contains the
 * user identifier and optional roles or metadata. The token is signed with
 * the secret defined in your environment configuration and expires after
 * 7 days by default. Adjust the expiration to suit your security needs.
 *
 * @param {object} payload Minimal payload to embed in the JWT
 * @param {string} [expiresIn='7d'] Token lifetime
 * @returns {string} Signed JWT
 */
export function signToken(payload, expiresIn = '7d') {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not configured');
  }
  return jwt.sign(payload, secret, { expiresIn });
}

/**
 * Verify a JSON Web Token and return the decoded payload. If verification
 * fails the function will throw. Use this inside API route middleware to
 * authenticate users.
 *
 * @param {string} token JWT to verify
 * @returns {object} Decoded payload
 */
export function verifyToken(token) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not configured');
  }
  return jwt.verify(token, secret);
}