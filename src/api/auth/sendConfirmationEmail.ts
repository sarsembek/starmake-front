import {
   SendConfirmationEmailRequest,
   SendConfirmationEmailResponse,
} from "@/types/auth/auth.type";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const sendConfirmationEmail = async (
   data: SendConfirmationEmailRequest
): Promise<SendConfirmationEmailResponse> => {
   const response = await axios.post<SendConfirmationEmailResponse>(
      `${API_URL}/auth/send-confirmation-email`,
      data
   );
   return response.data;
};
