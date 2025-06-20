"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useGoogleAuth } from "@/hooks/auth/useGoogleAuth";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";

function GoogleCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { handleGoogleAuthCallback } = useGoogleAuth();
  const [status, setStatus] = useState<"processing" | "success" | "error">("processing");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error) {
      setStatus("error");
      setErrorMessage("Аутентификация Google была отменена или завершилась с ошибкой.");
      return;
    }

    if (!code) {
      setStatus("error");
      setErrorMessage("Код авторизации от Google не получен.");
      return;
    }

    // Process the authentication
    handleGoogleAuthCallback(
      { code },
      {
        onSuccess: () => {
          setStatus("success");
        },
        onError: (error: unknown) => {
          setStatus("error");
          if (error && typeof error === 'object' && 'response' in error) {
            const axiosError = error as { response?: { status?: number } };
            if (axiosError.response?.status === 400) {
              setErrorMessage("Неверный код авторизации.");
            } else if (axiosError.response?.status === 401) {
              setErrorMessage("Ошибка аутентификации. Пожалуйста, попробуйте еще раз.");
            } else {
              setErrorMessage("Произошла ошибка во время аутентификации. Пожалуйста, попробуйте еще раз.");
            }
          } else {
            setErrorMessage("Произошла ошибка во время аутентификации. Пожалуйста, попробуйте еще раз.");
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
              <h2 className="text-xl font-semibold mb-2">Аутентификация через Google...</h2>
              <p className="text-gray-600">Пожалуйста, подождите, пока мы завершим вашу аутентификацию.</p>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2 text-green-700">Аутентификация прошла успешно!</h2>
              <p className="text-gray-600">Перенаправляем вас в приложение...</p>
            </>
          )}

          {status === "error" && (
            <>
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
              <h2 className="text-xl font-semibold mb-2 text-red-700">Ошибка аутентификации</h2>
              <p className="text-gray-600">Перенаправляем вас обратно на страницу входа...</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full mx-auto p-6">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <LoadingSpinner className="mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Загрузка...</h2>
            <p className="text-gray-600">Пожалуйста, подождите, пока мы обрабатываем ваш запрос.</p>
          </div>
        </div>
      </div>
    }>
      <GoogleCallbackContent />
    </Suspense>
  );
} 