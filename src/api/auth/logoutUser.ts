import { axiosWithAuth } from "@/lib/axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface logoutResponse {
  message: string,
};

export const logoutUser = async (): Promise<logoutResponse> => {
  const response = await axiosWithAuth.post<logoutResponse>(
    `${API_URL}/auth/logout`,
    {},
    { withCredentials: true } // This is crucial for storing the HTTP-only cookie
  );
  return response.data;
};