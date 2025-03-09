import { sendConfirmationEmail } from "@/api/auth/sendConfirmationEmail";
import {
   SendConfirmationEmailRequest,
   SendConfirmationEmailResponse,
} from "@/types/auth/auth.type";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

export function useSendConfirmationEmail() {
   return useMutation<
      SendConfirmationEmailResponse,
      AxiosError,
      SendConfirmationEmailRequest
   >({
      mutationFn: sendConfirmationEmail,
   });
}
