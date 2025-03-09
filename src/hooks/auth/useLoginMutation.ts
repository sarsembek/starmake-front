import { loginUser } from "@/api/auth/loginUser";
import { LoginRequest, LoginResponse } from "@/types/auth/auth.type";
import { useAuth } from "@/context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import Cookies from "js-cookie";
// import { useRouter } from "next/router";

// Cookie configuration
const TOKEN_COOKIE_NAME = "auth_token";
const TOKEN_EXPIRY_DAYS = 7; // Store token for 7 days

export function useLoginMutation() {
   const { setUser, setToken } = useAuth();
   // const router = useRouter();

   return useMutation<LoginResponse, AxiosError, LoginRequest, unknown>({
      mutationFn: loginUser,
      onSuccess: (data) => {
         // Store token in cookies
         Cookies.set(TOKEN_COOKIE_NAME, data.token, {
            expires: TOKEN_EXPIRY_DAYS,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
         });

         // Update auth context
         setToken(data.token);
         setUser(data.user);
      },
      onError: (error) => {
         console.error("Login failed:", error);
         Cookies.remove(TOKEN_COOKIE_NAME);
      },
   });
}
