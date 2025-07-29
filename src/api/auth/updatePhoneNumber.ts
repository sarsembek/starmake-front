import { axiosWithAuth } from "@/lib/axios";

export interface UpdatePhoneNumberRequest {
   phone_number: string;
}

export interface UpdatePhoneNumberResponse {
   success: boolean;
   message?: string;
}

/**
 * Updates the user's phone number
 * @param phoneNumber - The phone number to update
 * @returns Response indicating success or failure
 */
export const updatePhoneNumber = async (
   phoneNumber: string
): Promise<UpdatePhoneNumberResponse> => {
   try {
      const response = await axiosWithAuth.put<UpdatePhoneNumberResponse>(
         "/auth/phone-number",
         {
            phone_number: phoneNumber,
         }
      );

      return response.data;
   } catch (error) {
      console.error("Failed to update phone number:", error);
      throw error;
   }
};
