import { AuthSession } from '../types/auth';

const TOKEN_KEY = 'nurapos_access_token';
const REFRESH_TOKEN_KEY = 'nurapos_refresh_token';
const SESSION_KEY = 'nurapos_auth_session';

/**
 * Persists the authenticated user session to browser storage
 */
export function saveAuthSession(session: AuthSession): void {
  if (typeof window === 'undefined') return;

  try {
    const accessToken = session.accessToken || session.token;
    localStorage.setItem(TOKEN_KEY, accessToken);
    if (session.refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, session.refreshToken);
    }
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));

    // Also set standard auth cookie for middleware / server compatibility if needed
    document.cookie = `nurapos_token=${encodeURIComponent(accessToken)}; path=/; max-age=86400; SameSite=Lax`;
  } catch (error) {
    console.error('Failed to save auth session:', error);
  }
}

/**
 * Retrieves the stored user session
 */
export function getAuthSession(): AuthSession | null {
  if (typeof window === 'undefined') return null;

  try {
    const data = localStorage.getItem(SESSION_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function updatePosPinConfigured(configured = true): void {
  const session = getAuthSession();
  if (session) {
    session.posPinConfigured = configured;
    saveAuthSession(session);
  }
}

export function updatePosPinVerified(tokenResponse: {
  accessToken: string;
  accessTokenExpiresAtUtc?: string;
}): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(TOKEN_KEY, tokenResponse.accessToken);
    document.cookie = `nurapos_token=${encodeURIComponent(tokenResponse.accessToken)}; path=/; max-age=86400; SameSite=Lax`;
    const session = getAuthSession();
    if (session) {
      session.accessToken = tokenResponse.accessToken;
      session.token = tokenResponse.accessToken;
      session.posPinConfigured = true;
      session.posPinVerified = true;
      if (tokenResponse.accessTokenExpiresAtUtc) {
        session.accessTokenExpiresAtUtc = tokenResponse.accessTokenExpiresAtUtc;
      }
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    }
  } catch (error) {
    console.error('Failed to update POS PIN verification state:', error);
  }
}

/**
 * Returns current access token
 */
export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Returns current refresh token
 */
export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

/**
 * Clears authentication tokens and session
 */
export function clearAuthSession(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem('nurapos_user_email');
    localStorage.removeItem('nurapos_user_id');
    localStorage.removeItem('nuradesk_user_name');

    // Remove any remaining nurapos or nuradesk items
    const toRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && (k.startsWith('nurapos_') || k.startsWith('nuradesk_user'))) {
        toRemove.push(k);
      }
    }
    toRemove.forEach((k) => localStorage.removeItem(k));

    sessionStorage.clear();

    // Expire cookie thoroughly across standard paths
    document.cookie = 'nurapos_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0; SameSite=Lax';
    document.cookie = 'nurapos_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0';
  } catch (error) {
    console.error('Failed to clear auth session:', error);
  }
}

/**
 * Checks if user is authenticated with a valid token
 */
export function isAuthenticated(): boolean {
  const token = getAccessToken();
  const refreshToken = getRefreshToken();
  if (!token && !refreshToken) return false;
  if (token && !isTokenExpired(token)) return true;
  if (refreshToken && !isTokenExpired(refreshToken)) return true;
  return false;
}

/**
 * Parses JWT expiration
 */
export function isTokenExpired(token?: string | null): boolean {
  if (!token) return true;

  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false; // Not standard JWT, treat as valid if present

    const payload = JSON.parse(atob(parts[1]));
    if (!payload.exp) return false;

    // Add 10-second buffer
    return Date.now() >= (payload.exp * 1000) - 10000;
  } catch {
    return false;
  }
}

const POS_SESSION_KEY = 'nurapos_pos_session';

export interface PosSessionStorageData {
  posSessionToken: string;
  employee: {
    id: number;
    name: string;
    role: string;
  };
  shiftRequired: boolean;
  terminalId?: string;
  franchiseId?: number;
}

export function savePosSession(data: PosSessionStorageData): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(TOKEN_KEY, data.posSessionToken);
    localStorage.setItem(POS_SESSION_KEY, JSON.stringify(data));
    document.cookie = `nurapos_token=${encodeURIComponent(data.posSessionToken)}; path=/; max-age=86400; SameSite=Lax`;
  } catch (error) {
    console.error('Failed to save POS session:', error);
  }
}

export function getPosSession(): PosSessionStorageData | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(POS_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearPosSession(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(POS_SESSION_KEY);
  } catch {}
}
