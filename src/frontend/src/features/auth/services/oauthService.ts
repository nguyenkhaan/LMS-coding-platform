import axios from 'axios';
import { useAuthStore } from '@/features/auth/model/useAuthStore';
import { User, Role } from '@/features/auth/model/auth';
import { toast } from 'sonner';

// Gateway URL default (routes http://localhost:4040/auth-provider/auth -> http://localhost:4001/api/auth)
const GATEWAY_AUTH_URL = import.meta.env.VITE_AUTH_API_URL || 'http://localhost:4040/auth-provider/auth';
const FACEBOOK_APP_ID = import.meta.env.VITE_FACEBOOK_APP_ID || '';
const OAUTH_REDIRECT_URI = import.meta.env.VITE_OAUTH_REDIRECT_URI || `${window.location.origin}/login`;

export interface OAuthBackendResponse {
  access_token: string;
  refresh_token: string;
  user?: {
    id?: number;
    email?: string;
    fullName?: string;
    roles?: Role[];
  };
}

/**
 * Decode payload from JWT access token issued by auth-provider backend
 */
function parseJwtPayload(token: string): { sub?: string; email?: string; roles?: Role[] } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export const oauthService = {
  /**
   * Send Google OAuth authorization code to API Gateway -> Backend Auth Provider (/auth/google)
   */
  loginWithGoogle: async (authCode: string): Promise<boolean> => {
    try {
      if (!authCode) {
        toast.error('No Google authorization code received.');
        return false;
      }

      // Post authorization code to Gateway (http://localhost:4040/auth-provider/auth/google)
      const response = await axios.post<OAuthBackendResponse>(`${GATEWAY_AUTH_URL}/google`, {
        credential_code: authCode,
      });

      const { access_token, refresh_token } = response.data;
      if (!access_token) {
        throw new Error('Backend authentication did not return an access token.');
      }

      // Extract user and role claims from backend response or JWT token payload
      const jwtClaims = parseJwtPayload(access_token);
      const userFromBackend = response.data.user;

      const userId = userFromBackend?.id ? Number(userFromBackend.id) : jwtClaims?.sub ? Number(jwtClaims.sub) : 0;
      const userEmail = userFromBackend?.email || jwtClaims?.email || '';
      const userRoles: Role[] = userFromBackend?.roles || jwtClaims?.roles || ['STUDENT'];
      const fullName = userFromBackend?.fullName || (userEmail ? userEmail.split('@')[0] : 'User');

      const authenticatedUser: User = {
        id: userId,
        email: userEmail,
        fullName: fullName,
        roles: userRoles,
        accountStatus: 'ACTIVE',
      };

      // Update auth store with real tokens and user profile
      useAuthStore.getState().setAuth(authenticatedUser, access_token, refresh_token);
      toast.success('Successfully signed in with Google!');
      return true;
    } catch (err: unknown) {
      console.error('Google OAuth authentication failed:', err);
      const errorMsg = axios.isAxiosError(err) && err.response?.data?.detail
        ? err.response.data.detail
        : err instanceof Error
        ? err.message
        : 'Google Sign-In failed on the backend.';

      toast.error(errorMsg);
      // Strictly NO fake fallback user or fake tokens
      return false;
    }
  },

  /**
   * Initiate Facebook OAuth flow (redirect to Facebook Dialog)
   */
  loginWithFacebook: async (fbAccessToken?: string): Promise<boolean> => {
    try {
      if (fbAccessToken) {
        // Post Facebook access token to Gateway -> Auth Provider
        const response = await axios.post<OAuthBackendResponse>(`${GATEWAY_AUTH_URL}/facebook`, {
          access_token: fbAccessToken,
        });

        const { access_token, refresh_token } = response.data;
        if (!access_token) {
          throw new Error('Backend did not return an access token for Facebook login.');
        }

        const jwtClaims = parseJwtPayload(access_token);
        const userFromBackend = response.data.user;

        const userId = userFromBackend?.id ? Number(userFromBackend.id) : jwtClaims?.sub ? Number(jwtClaims.sub) : 0;
        const userEmail = userFromBackend?.email || jwtClaims?.email || '';
        const userRoles: Role[] = userFromBackend?.roles || jwtClaims?.roles || ['STUDENT'];

        const authenticatedUser: User = {
          id: userId,
          email: userEmail,
          fullName: userFromBackend?.fullName || (userEmail ? userEmail.split('@')[0] : 'Facebook User'),
          roles: userRoles,
          accountStatus: 'ACTIVE',
        };

        useAuthStore.getState().setAuth(authenticatedUser, access_token, refresh_token);
        toast.success('Successfully signed in with Facebook!');
        return true;
      }

      // Generate standard Facebook authorization URL (Frontend safe without client secrets)
      if (FACEBOOK_APP_ID) {
        const params = new URLSearchParams({
          client_id: FACEBOOK_APP_ID,
          redirect_uri: OAUTH_REDIRECT_URI,
          scope: 'email,public_profile',
          response_type: 'code',
        });
        const authorizeUrl = `https://www.facebook.com/v18.0/dialog/oauth?${params.toString()}`;
        window.location.href = authorizeUrl;
        return true;
      }

      toast.error('Facebook App ID is not configured in VITE_FACEBOOK_APP_ID.');
      return false;
    } catch (err: unknown) {
      console.error('Facebook OAuth error:', err);
      const errorMsg = axios.isAxiosError(err) && err.response?.data?.detail
        ? err.response.data.detail
        : err instanceof Error
        ? err.message
        : 'Facebook Sign-In failed.';

      toast.error(errorMsg);
      // Strictly NO fake fallback user or fake tokens
      return false;
    }
  },
};
