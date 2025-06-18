import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { getGoogleAuthUrl, handleGoogleCallback, GoogleCallbackRequest, GoogleAuthResponse } from "@/api/auth/googleAuth";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";

export function useGoogleAuth() {
  const { setUser, checkAuthStatus, refreshProtectedRoutes } = useAuth();
  const router = useRouter();

  // Mutation for getting Google OAuth URL and redirecting
  const initiateGoogleAuth = useMutation({
    mutationFn: getGoogleAuthUrl,
    onSuccess: (data) => {
      // Redirect to Google OAuth
      window.location.href = data.auth_url;
    },
    onError: (error: AxiosError) => {
      console.error("Failed to get Google auth URL:", error);
    },
  });

  // Mutation for handling Google OAuth callback
  const handleGoogleAuthCallback = useMutation<GoogleAuthResponse, AxiosError, GoogleCallbackRequest>({
    mutationFn: handleGoogleCallback,
    onSuccess: (data) => {
      // Convert null values to undefined to match User type
      const user = {
        ...data.user,
        name_tg: data.user.name_tg || undefined,
        instagram: data.user.instagram || undefined,
        email_tg: data.user.email_tg || undefined,
      };

      // Store user in localStorage for caching
      localStorage.setItem("user_cache", JSON.stringify(user));

      // Update auth context
      setUser(user);

      // Verify our auth status (cookie should now be set)
      checkAuthStatus();

      // Force a router refresh to update all protected routes
      refreshProtectedRoutes();

      // Handle navigation after successful login
      const urlParams = new URLSearchParams(window.location.search);
      const fromParam = urlParams.get("from");
      const returnPath = localStorage.getItem("returnPath") || fromParam || "/";

      // Clear return path from storage
      localStorage.removeItem("returnPath");

      // Navigate to the return path
      setTimeout(() => {
        router.push(returnPath);
      }, 100);
    },
    onError: (error: AxiosError) => {
      console.error("Google auth callback failed:", error);
      
      // Redirect to login page with error
      router.push("/login?error=google_auth_failed");
    },
  });

  return {
    initiateGoogleAuth: initiateGoogleAuth.mutate,
    handleGoogleAuthCallback: handleGoogleAuthCallback.mutate,
    isGoogleAuthLoading: initiateGoogleAuth.isPending,
    isCallbackLoading: handleGoogleAuthCallback.isPending,
  };
} 