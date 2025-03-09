import { LoginRequest, LoginResponse } from "@/types/auth/auth.type";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const loginUser = async (data: LoginRequest): Promise<LoginResponse> => {
   const response = await axios.post<LoginResponse>(
      `${API_URL}/auth/login`,
      data
   );
   return response.data;
};
