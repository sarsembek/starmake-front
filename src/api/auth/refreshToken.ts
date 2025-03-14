import axios from "axios";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const TOKEN_COOKIE_NAME = "auth_token";

export interface RefreshTokenResponse {
   payload: {
      email: string;
      user_id: number;
      exp: number;
   };
   new_token?: string;
   message?: string;
}

export const refreshToken = async (): Promise<string> => {
   const currentToken = Cookies.get(TOKEN_COOKIE_NAME);

   if (!currentToken) {
      throw new Error("No token found");
   }

   try {
      const response = await axios.get<RefreshTokenResponse>(
         `${API_URL}/auth/refresh-token`,
         {
            headers: {
               Authorization: `Bearer ${currentToken}`,
            },
         }
      );

      // Check if token was expired and refreshed
      if (response.data.new_token) {
         const newToken = response.data.new_token;

         // Store the new token
         Cookies.set(TOKEN_COOKIE_NAME, newToken, {
            expires: 7, // 7 days
            path: "/",
            sameSite: "strict",
         });

         return newToken;
      }

      // Token is still valid, return current token
      return currentToken;
   } catch (error) {
      // If refresh failed, throw the error to be handled by the interceptor
      console.error("Token refresh failed", error);
      throw error;
   }
};
