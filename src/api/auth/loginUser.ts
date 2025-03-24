import { axiosInstance } from "@/lib/axios";
import { LoginRequest, LoginResponse } from "@/types/auth/auth.type";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const loginUser = async (data: LoginRequest): Promise<LoginResponse> => {
   const response = await axiosInstance.post<LoginResponse>(
      `${API_URL}/auth/login`,
      data,
      { withCredentials: true } // This is crucial for storing the HTTP-only cookie
   );
   return response.data;
};
