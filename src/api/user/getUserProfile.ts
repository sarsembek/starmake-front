import { User } from "@/types/auth/auth.type";
import { axiosWithAuth } from "@/lib/axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getUserProfile = async (): Promise<User> => {
   // The profile endpoint returns the user directly, not wrapped in a 'user' property
   const response = await axiosWithAuth.get<User>(`${API_URL}/auth/profile`);
   return response.data;
};
