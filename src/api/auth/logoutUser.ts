import { axiosWithAuth } from "@/lib/axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const logoutUser = async (): Promise<void> => {
  const response = await axiosWithAuth.post<void>(
    `${API_URL}/auth/logout`,
    {},
    { withCredentials: true } // This is crucial for storing the HTTP-only cookie
  );
  return response.data;
};