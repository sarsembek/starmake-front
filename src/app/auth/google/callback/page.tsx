"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useGoogleAuth } from "@/hooks/auth/useGoogleAuth";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";

export default function GoogleCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { handleGoogleAuthCallback, isCallbackLoading } = useGoogleAuth();
  const [status, setStatus] = useState<"processing" | "success" | "error">("processing");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error) {
      setStatus("error");
      setErrorMessage("Google authentication was cancelled or failed.");
      return;
    }

    if (!code) {
      setStatus("error");
      setErrorMessage("No authorization code received from Google.");
      return;
    }

    // Process the authentication
    handleGoogleAuthCallback(
      { code },
      {
        onSuccess: () => {
          setStatus("success");
        },
        onError: (error: any) => {
          setStatus("error");
          if (error.response?.status === 400) {
            setErrorMessage("Invalid authorization code.");
          } else if (error.response?.status === 401) {
            setErrorMessage("Authentication failed. Please try again.");
          } else {
            setErrorMessage("An error occurred during authentication. Please try again.");
          }
        },
      }
    );
  }, [searchParams, handleGoogleAuthCallback]);

  // Redirect to login page after error with delay
  useEffect(() => {
    if (status === "error") {
      const timer = setTimeout(() => {
        router.push("/login?error=google_auth_failed");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [status, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          {status === "processing" && (
            <>
              <LoadingSpinner className="mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Authenticating with Google...</h2>
              <p className="text-gray-600">Please wait while we complete your authentication.</p>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2 text-green-700">Authentication Successful!</h2>
              <p className="text-gray-600">Redirecting you to the application...</p>
            </>
          )}

          {status === "error" && (
            <>
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
              <h2 className="text-xl font-semibold mb-2 text-red-700">Authentication Failed</h2>
              <p className="text-gray-600">Redirecting you back to login page...</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 