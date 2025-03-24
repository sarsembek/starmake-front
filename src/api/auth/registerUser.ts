import { axiosInstance } from "@/lib/axios";
import { RegisterRequest, RegisterResponse } from "@/types/auth/auth.type";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const registerUser = async (
   data: RegisterRequest
): Promise<RegisterResponse> => {
   const response = await axiosInstance.post<RegisterResponse>(
      `${API_URL}/auth/register`,
      data
   );
   return response.data;
};
