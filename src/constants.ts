export enum NError {
  NOT_ADMIN = 'NotAdmin',
  MISSING_AUTH_HEADER = 'MissingAuthHeader',
  UNVERIFIABLE_TOKEN = 'UnverifiableToken',
  TOKEN_EXPIRED = 'TokenExpired',
  NOT_FOUND = 'NotFound',
  MISSING_REFRESH_TOKEN = 'MissingRefreshToken',
}

export enum NErrorContext {
  AUTHENTICATION = 'Authentication',
  REFRESH = 'Refresh',
}

export const anonymousUrls = [
  'published',
  'signup',
  'login',
  'random',
  'valid',
] as const;

export const REFRESH_COOKIE_KEY = 'nbRefresh';
