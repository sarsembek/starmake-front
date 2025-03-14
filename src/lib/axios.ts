import axios, {
   AxiosError,
   AxiosInstance,
   //  AxiosRequestConfig,
   InternalAxiosRequestConfig,
} from "axios";
import Cookies from "js-cookie";
import { refreshToken } from "@/api/auth/refreshToken";

const TOKEN_COOKIE_NAME = "auth_token";
let isRefreshing = false;
let failedQueue: Array<{
   resolve: (token: string) => void;
   reject: (error: Error | AxiosError) => void;
}> = [];

const processQueue = (
   error: Error | AxiosError | null,
   token: string | null = null
) => {
   failedQueue.forEach((request) => {
      if (token) {
         request.resolve(token);
      } else {
         request.reject(error || new Error("Token refresh failed"));
      }
   });
   failedQueue = [];
};

export const createAxiosInstance = (): AxiosInstance => {
   const instance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      headers: {
         "Content-Type": "application/json",
      },
   });

   // Add token to all requests
   instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
         const token = Cookies.get(TOKEN_COOKIE_NAME);
         if (token) {
            config.headers.Authorization = `Bearer ${token}`;
         }
         return config;
      },
      (error: Error | AxiosError) => Promise.reject(error)
   );

   // Add response interceptor for token refresh
   instance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
         const originalRequest = error.config as InternalAxiosRequestConfig;

         // If error is 401 and not a refresh token request itself
         if (
            error.response?.status === 401 &&
            originalRequest &&
            !originalRequest.url?.includes("refresh-token")
         ) {
            if (isRefreshing) {
               // If we're already refreshing, add this request to the queue
               return new Promise<string>((resolve, reject) => {
                  failedQueue.push({ resolve, reject });
               })
                  .then((token) => {
                     originalRequest.headers.Authorization = `Bearer ${token}`;
                     return instance(originalRequest);
                  })
                  .catch((err) => {
                     return Promise.reject(err);
                  });
            }

            isRefreshing = true;

            try {
               // Try to refresh the token
               const newToken = await refreshToken();

               // Update the original request with new token
               originalRequest.headers.Authorization = `Bearer ${newToken}`;

               // Process the queue with new token
               processQueue(null, newToken);

               // Retry the original request
               return instance(originalRequest);
            } catch (refreshError) {
               // If refreshing failed, logout the user
               processQueue(refreshError as Error, null);

               // Dispatch logout event for the auth context to handle
               window.dispatchEvent(new CustomEvent("auth:logout"));

               return Promise.reject(refreshError);
            } finally {
               isRefreshing = false;
            }
         }

         return Promise.reject(error);
      }
   );

   return instance;
};

// Export a singleton instance
export const axiosWithAuth = createAxiosInstance();
