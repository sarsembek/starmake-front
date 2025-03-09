import { loginUser } from "@/api/auth/loginUser";
import { sendConfirmationEmail } from "@/api/auth/sendConfirmationEmail";
import {
   LoginRequest,
   LoginResponse,
   UnverifiedEmailError,
} from "@/types/auth/auth.type";
import { useAuth } from "@/context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import Cookies from "js-cookie";
import { useState } from "react";

// Cookie configuration
const TOKEN_COOKIE_NAME = "auth_token";
const TOKEN_EXPIRY_DAYS = 7; // Store token for 7 days

export function useLoginMutation() {
   const { setUser, setToken } = useAuth();
   const [needsVerification, setNeedsVerification] = useState(false);
   const [emailForVerification, setEmailForVerification] = useState<
      string | null
   >(null);

   const loginMutation = useMutation<
      LoginResponse,
      AxiosError<UnverifiedEmailError>,
      LoginRequest
   >({
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

         // Reset verification state
         setNeedsVerification(false);
         setEmailForVerification(null);
      },
      onError: (error, variables) => {
         console.error("Login failed:", error);

         // Check if error is about unverified email
         if (
            error.response?.status === 403 &&
            error.response.data.detail ===
               "Please verify your email before accessing this resource."
         ) {
            // Set state for verification needed
            setNeedsVerification(true);
            setEmailForVerification(variables.email);
         }

         Cookies.remove(TOKEN_COOKIE_NAME);
      },
   });

   // Create mutation for sending confirmation email
   const resendConfirmationMutation = useMutation({
      mutationFn: sendConfirmationEmail,
   });

   // Function to handle resending the confirmation email
   const resendConfirmationEmail = async () => {
      if (!emailForVerification) return;

      try {
         await resendConfirmationMutation.mutateAsync({
            email: emailForVerification,
         });
      } catch (error) {
         console.error("Failed to resend confirmation email:", error);
      }
   };

   return {
      ...loginMutation,
      needsVerification,
      emailForVerification,
      isResendingConfirmation: resendConfirmationMutation.isPending,
      resendConfirmationSuccess: resendConfirmationMutation.isSuccess,
      resendConfirmationError: resendConfirmationMutation.isError,
      resendConfirmationEmail,
   };
}
