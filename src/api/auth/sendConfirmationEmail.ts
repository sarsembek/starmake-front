import { axiosInstance } from "@/lib/axios";
import {
   SendConfirmationEmailRequest,
   SendConfirmationEmailResponse,
} from "@/types/auth/auth.type";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const sendConfirmationEmail = async (
   data: SendConfirmationEmailRequest
): Promise<SendConfirmationEmailResponse> => {
   const response = await axiosInstance.post<SendConfirmationEmailResponse>(
      `${API_URL}/auth/send-confirmation-email`,
      data
   );
   return response.data;
};
