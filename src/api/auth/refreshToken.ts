import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface RefreshTokenResponse {
   payload: {
      email: string;
      user_id: number;
      exp: number;
   };
   message?: string;
   // user?: any; // The user object returned by the server
}

export const refreshToken = async (): Promise<RefreshTokenResponse> => {
   try {
      // Simple request with withCredentials - the HTTP-only cookie is automatically sent
      const response = await axios.get<RefreshTokenResponse>(
         `${API_URL}/auth/refresh-token`,
         {
            withCredentials: true, // This sends cookies with the request
         }
      );

      // No need to handle cookies - the server sets them
      return response.data;
   } catch (error) {
      console.error("Token refresh failed", error);
      throw error;
   }
};
