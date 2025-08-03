import type { NextApiRequest } from 'next';

export function verifyJWT(req: NextApiRequest): Promise<object | null>;
