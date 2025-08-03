import jwt from 'jsonwebtoken';
import type { NextApiRequest } from 'next';

/**
 * Sign a JSON Web Token for the given user. The token contains the
 * user identifier and optional roles or metadata. The token is signed with
 * the secret defined in your environment configuration and expires after
 * 7 days by default. Adjust the expiration to suit your security needs.
 *
 * @param payload Minimal payload to embed in the JWT
 * @param expiresIn Token lifetime
 * @returns Signed JWT
 */
export function signToken(payload: object, expiresIn = '7d'): string {
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
 * @param token JWT to verify
 * @returns Decoded payload
 */
export function verifyToken(token: string): object {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not configured');
  }
  return jwt.verify(token, secret);
}

/**
 * Extract and verify JWT from Authorization header in the request.
 * Returns decoded user payload or null if invalid or missing.
 *
 * @param req Next.js API request
 * @returns Decoded user or null
 */
export async function verifyJWT(req: NextApiRequest): Promise<object | null> {
  try {
    const authHeader = req.headers.authorization || '';
    if (!authHeader.startsWith('Bearer ')) {
      return null;
    }
    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    return decoded;
  } catch (error) {
    console.error('verifyJWT error:', error);
    return null;
  }
}
