import { loginUser } from "@/api/auth/loginUser";
import { LoginRequest, LoginResponse } from "@/types/auth/auth.type";
import { useAuth } from "@/context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import Cookies from "js-cookie";

// Cookie configuration
const TOKEN_COOKIE_NAME = "auth_token";

export function useLoginMutation() {
   const { setUser, checkAuthStatus, refreshProtectedRoutes } = useAuth();

   const loginMutation = useMutation<LoginResponse, AxiosError, LoginRequest>({
      mutationFn: loginUser,
      onSuccess: (data) => {
         // Store user in localStorage for caching
         localStorage.setItem("user_cache", JSON.stringify(data.user));

         // Update auth context
         setUser(data.user);

         // Verify our auth status (cookie should now be set)
         checkAuthStatus();

         // Force a router refresh to update all protected routes
         refreshProtectedRoutes();
      },
      onError: (error) => {
         console.error("Login failed:", error);
         Cookies.remove(TOKEN_COOKIE_NAME);
      },
   });

   return loginMutation;
}
