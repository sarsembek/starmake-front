import { confirmEmail } from "@/api/auth/confirmEmail";
import {
   EmailConfirmationRequest,
   EmailConfirmationResponse,
   ValidationError,
} from "@/types/auth/auth.type";
import { useAuth } from "@/context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

export function useEmailConfirmation() {
   const { setUser } = useAuth();

   return useMutation<
      EmailConfirmationResponse,
      AxiosError<ValidationError>,
      EmailConfirmationRequest
   >({
      mutationFn: confirmEmail,
      onSuccess: (data) => {
         // Update user state with the verified user data
         setUser(data);
      },
   });
}
