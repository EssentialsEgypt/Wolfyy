export function getToken(code: string, redirectUri: string): Promise<any>;
export function refreshToken(refresh_token: string): Promise<any>;
export function fetchData(user_id: number): Promise<any>;
