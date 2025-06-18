import { axiosInstance } from "@/lib/axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface GoogleAuthUrlResponse {
  auth_url: string;
}

export interface GoogleCallbackRequest {
  code: string;
}

export interface GoogleAuthResponse {
  user: {
    email: string;
    is_active: boolean;
    is_staff: boolean;
    is_limited: boolean;
    plan_type: string;
    is_verified: boolean;
    id: number;
    request_count: number;
    start_date: string;
    end_date: string;
    left_days: number;
    name_tg: string | null;
    instagram: string | null;
    email_tg: string | null;
    role: string;
  };
  token: string;
  token_type: string;
}

/**
 * Get Google OAuth authorization URL
 */
export const getGoogleAuthUrl = async (): Promise<GoogleAuthUrlResponse> => {
  const response = await axiosInstance.get<GoogleAuthUrlResponse>(
    `${API_URL}/auth/google/login`
  );
  return response.data;
};

/**
 * Handle Google OAuth callback with authorization code
 */
export const handleGoogleCallback = async (data: GoogleCallbackRequest): Promise<GoogleAuthResponse> => {
  const response = await axiosInstance.post<GoogleAuthResponse>(
    `${API_URL}/auth/google/callback`,
    data,
    { withCredentials: true } // Important for storing HTTP-only cookies
  );
  return response.data;
}; 