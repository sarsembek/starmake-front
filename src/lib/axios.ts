import axios, {
   AxiosError,
   AxiosInstance,
   InternalAxiosRequestConfig,
} from "axios";

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

   // No need to add token to requests - HTTP-only cookies are sent automatically

   // Add response interceptor for handling 401 errors
   instance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
         const originalRequest = error.config as InternalAxiosRequestConfig;

         // If error is 401 and not a refresh token request itself
         if (
            error.response?.status === 401 &&
            originalRequest &&
            !originalRequest.url?.includes("refresh-token") &&
            !isRefreshing
         ) {
            if (isRefreshing) {
               // If already refreshing, queue this request
               return new Promise((resolve, reject) => {
                  failedQueue.push({ resolve, reject });
               })
                  .then(() => {
                     return instance(originalRequest);
                  })
                  .catch((err) => {
                     return Promise.reject(err);
                  });
            }

            isRefreshing = true;

            try {
               // Call refresh endpoint - the server will update the HTTP-only cookie
               await axios.get(
                  `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
                  {
                     withCredentials: true,
                  }
               );

               // Process queued requests
               processQueue(null);

               // Retry the original request
               return instance(originalRequest);
            } catch (refreshError) {
               // If refresh fails, clear auth state and redirect to login
               processQueue(refreshError as AxiosError);

               // Dispatch logout event
               window.dispatchEvent(new Event("auth:logout"));

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
