import axios, {
   AxiosError,
   AxiosInstance,
   InternalAxiosRequestConfig,
} from "axios";
// Import refreshToken function directly for now
import { refreshToken } from "@/api/auth/refreshToken";

let isRefreshing = false;
let failedQueue: Array<{
   resolve: (value?: unknown) => void;
   reject: (error: Error | AxiosError) => void;
}> = [];

const processQueue = (error: Error | AxiosError | null) => {
   failedQueue.forEach((request) => {
      if (error) {
         request.reject(error);
      } else {
         request.resolve();
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
      withCredentials: true, // This is crucial for including cookies in requests
   });

   // Add response interceptor for handling 401 errors
   instance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
         const originalRequest = error.config as InternalAxiosRequestConfig;

         // Debug the error first
         console.log("Axios interceptor error:", {
            status: error.response?.status,
            url: originalRequest?.url,
            isRefreshing,
            method: originalRequest?.method,
         });

         // Check if this is a user limited error (403 with specific format)
         if (
            error.response?.status === 403 &&
            typeof error.response?.data === "object" &&
            (error.response?.data as { detail?: { ru?: string } })?.detail &&
            typeof (error.response?.data as { detail?: unknown })?.detail === "object" &&
            (error.response?.data as { detail?: { ru?: string } })?.detail?.ru === "Ваш аккаунт ограничен"
         ) {
            console.log("User limited error detected");

            // Dispatch an event that will be caught by the SubscriptionContext
            window.dispatchEvent(new CustomEvent("subscription:limited"));

            return Promise.reject(error);
         }

         // Check for 401 unauthorized error
         if (
            error.response?.status === 401 &&
            originalRequest &&
            // Check if this is not already a refresh token request
            originalRequest.url !== "/auth/refresh-token" &&
            !isRefreshing
         ) {
            if (isRefreshing) {
               return new Promise((resolve, reject) => {
                  failedQueue.push({ resolve, reject });
               })
                  .then(() => instance(originalRequest))
                  .catch((err) => Promise.reject(err));
            }

            isRefreshing = true;
            console.log("🔄 Axios interceptor: Token refresh started");

            try {
               // Use the refreshToken function directly in the interceptor
               await refreshToken();
               console.log(
                  "✅ Token refreshed successfully in axios interceptor"
               );

               // Process queued requests
               processQueue(null);

               // Retry the original request
               return instance(originalRequest);
            } catch (refreshError) {
               console.error(
                  "❌ Token refresh failed in axios interceptor:",
                  refreshError
               );
               processQueue(refreshError as AxiosError);

               // Dispatch logout event that will be handled by AuthContext
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

// Create and export the axios instance with auth handling
export const axiosWithAuth = createAxiosInstance();

// Create a regular axios instance without special handling for simple API calls
export const axiosInstance = axios.create({
   baseURL: process.env.NEXT_PUBLIC_API_URL,
   headers: {
      "Content-Type": "application/json",
   },
   withCredentials: true,
});
