import { forgotPassword, ForgotPasswordRequest, ForgotPasswordResponse } from "@/api/auth/forgotPassword";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState } from "react";

interface ValidationError {
   detail: string | { msg: string; loc: string[] }[];
}

export function useForgotPasswordMutation() {
   const [emailSent, setEmailSent] = useState(false);

   const forgotPasswordMutation = useMutation<
      ForgotPasswordResponse,
      AxiosError<ValidationError>,
      ForgotPasswordRequest
   >({
      mutationFn: (data) => forgotPassword(data),
      onSuccess: () => {
         setEmailSent(true);
      },
   });

   return {
      ...forgotPasswordMutation,
      emailSent,
      resetState: () => setEmailSent(false),
   };
}