import {
   applyPromocode,
   ApplyPromocodeRequest,
   ApplyPromocodeResponse,
} from "@/api/promocodes/applyPromocode";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useAuth } from "@/context/AuthContext";

interface ErrorResponse {
   detail: string;
}

export function useApplyPromocodeMutation() {
   const queryClient = useQueryClient();
   const { checkAuthStatus } = useAuth();

   return useMutation<
      ApplyPromocodeResponse,
      AxiosError<ErrorResponse>,
      ApplyPromocodeRequest
   >({
      mutationFn: applyPromocode,
      onSuccess: async () => {
         // Invalidate profile query to refresh user data
         queryClient.invalidateQueries({ queryKey: ["profile"] });

         // Also update auth status to get new subscription details
         await checkAuthStatus();
      },
   });
}
