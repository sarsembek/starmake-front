import { User } from "@/types/auth/auth.type";
import { axiosWithAuth } from "@/lib/axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getUserProfile = async (): Promise<User> => {
   const response = await axiosWithAuth.get<User>(`${API_URL}/auth/profile`);
   return response.data;
};
