import { axiosInstance } from "@/lib/axios";
import {
   EmailConfirmationRequest,
   EmailConfirmationResponse,
} from "@/types/auth/auth.type";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const confirmEmail = async (
   data: EmailConfirmationRequest
): Promise<EmailConfirmationResponse> => {
   const response = await axiosInstance.post<EmailConfirmationResponse>(
      `${API_URL}/auth/confirm-email`,
      data,
   );
   return response.data;
};
