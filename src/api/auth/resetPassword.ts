import { axiosInstance } from "@/lib/axios";

export interface ResetPasswordRequest {
   token: string;
   new_password: string;
}

export interface ResetPasswordResponse {
   message: string;
}

export const resetPassword = async (
   data: ResetPasswordRequest
): Promise<ResetPasswordResponse> => {
   try {
      const response = await axiosInstance.post<ResetPasswordResponse>(
         `/auth/reset-password`,
         data
      );
      return response.data;
   } catch (error) {
      console.error("Failed to reset password:", error);
      throw error;
   }
};