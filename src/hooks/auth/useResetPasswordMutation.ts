import { resetPassword, ResetPasswordRequest, ResetPasswordResponse } from "@/api/auth/resetPassword";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState } from "react";

interface ValidationError {
   detail: string | { msg: string; loc: string[] }[];
}

export function useResetPasswordMutation() {
   const [resetSuccess, setResetSuccess] = useState(false);

   const resetPasswordMutation = useMutation<
      ResetPasswordResponse,
      AxiosError<ValidationError>,
      ResetPasswordRequest
   >({
      mutationFn: (data) => resetPassword(data),
      onSuccess: () => {
         setResetSuccess(true);
      },
   });

   return {
      ...resetPasswordMutation,
      resetSuccess,
   };
}