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
import { useState } from "react";
import Cookies from "js-cookie";

// Cookie configuration
const TOKEN_COOKIE_NAME = "auth_token";
// const TOKEN_EXPIRY_DAYS = 7; // Store token for 7 days

export function useLoginMutation() {
   const { setUser, checkAuthStatus, refreshProtectedRoutes } = useAuth();
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
         // Store user in localStorage for caching
         localStorage.setItem("user_cache", JSON.stringify(data.user));

         // Update auth context
         setUser(data.user);

         // Verify our auth status (cookie should now be set)
         checkAuthStatus();

         // Force a router refresh to update all protected routes
         refreshProtectedRoutes();

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
               "Please verify your email before logging in."
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
   const resendConfirmationEmail = () => {
      if (!emailForVerification) return;

      // Use mutate instead of mutateAsync to avoid promise chain
      resendConfirmationMutation.mutate(
         { email: emailForVerification },
         {
            // Optional callbacks if needed
            onError: (error) => {
               console.error("Failed to resend confirmation email:", error);
            },
         }
      );
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
