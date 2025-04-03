import { axiosInstance } from "@/lib/axios";

export interface ForgotPasswordRequest {
   email: string;
}

export interface ForgotPasswordResponse {
   message: string;
}

export const forgotPassword = async (
   data: ForgotPasswordRequest
): Promise<ForgotPasswordResponse> => {
   try {
      const response = await axiosInstance.post<ForgotPasswordResponse>(
         `/auth/forgot-password`,
         data
      );
      return response.data;
   } catch (error) {
      console.error("Failed to request password reset:", error);
      throw error;
   }
};