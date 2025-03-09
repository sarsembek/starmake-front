import { RegisterRequest, RegisterResponse } from "@/types/auth/auth.type";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const registerUser = async (data: RegisterRequest): Promise<RegisterResponse> => {
  const response = await axios.post<RegisterResponse>(
    `${API_URL}/auth/register`,
    data
  );
  return response.data;
};