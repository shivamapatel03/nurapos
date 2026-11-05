export interface SignupFormData {
  name: string;
  email: string;
  password: string;
}

export interface SignupResponseData {
  verificationId: string;
  expiresAtUtc: string;
}

export interface ApiResponse<T = any> {
  statusCode: number;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
  traceId?: string;
}

export interface VerifyEmailRequest {
  email: string;
  code: string;
  verificationId?: string;
}

export interface AuthSession {
  userId: number;
  email: string;
  token: string;
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAtUtc: string;
  refreshTokenExpiresAtUtc: string;
  createdAt: string;
  posPinConfigured: boolean;
  posPinVerified?: boolean;
}

export interface EmailVerificationResponseData {
  isVerified: boolean;
  session: AuthSession;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface EmailRequest {
  email: string;
}

export interface PosPinRequest {
  pin: string;
}

export interface PosPinTokenResponse {
  accessToken: string;
  accessTokenExpiresAtUtc: string;
  tokenType: string;
}

export interface VerifyPasswordCodeRequest {
  email: string;
  code: string;
}

export interface VerifyPasswordCodeResponseData {
  resetToken: string;
}

export interface PasswordResetFormData {
  email: string;
  resetToken: string;
  newPassword: string;
  confirmPassword: string;
}
