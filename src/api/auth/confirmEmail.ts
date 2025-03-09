import {
   EmailConfirmationRequest,
   EmailConfirmationResponse,
} from "@/types/auth/auth.type";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const confirmEmail = async (
   data: EmailConfirmationRequest
): Promise<EmailConfirmationResponse> => {
   const response = await axios.post<EmailConfirmationResponse>(
      `${API_URL}/auth/confirm-email`,
      data
   );
   return response.data;
};
