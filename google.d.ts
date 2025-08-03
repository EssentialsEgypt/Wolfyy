export function getToken(code: string, redirectUri: string): Promise<any>;
export function refreshToken(refresh_token: string): Promise<any>;
export function fetchAdsData(user_id: number): Promise<any>;
export function fetchAnalyticsData(user_id: number): Promise<any>;
