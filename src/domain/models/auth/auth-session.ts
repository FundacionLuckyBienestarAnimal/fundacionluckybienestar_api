export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  expiresAt: number | null;
  user: {
    id: string;
    email: string | null;
  };
}
