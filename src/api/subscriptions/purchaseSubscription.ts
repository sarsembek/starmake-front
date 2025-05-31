import { axiosWithAuth } from "@/lib/axios";
import axios from "axios";

export interface PurchaseSubscriptionRequest {
   plan_id: number;
   return_url: string;
   metadata?: Record<string, unknown>;
}

export interface PurchaseSubscriptionResponse {
   success: boolean;
   payment_url?: string;
   message?: string;
   subscription?: {
      id: number;
      plan_id: number;
      status: string;
      start_date: string;
      end_date: string;
   };
}

/**
 * Initiates the purchase of a subscription plan
 * @param planId - The ID of the subscription plan
 * @param returnUrl - URL to return to after payment completion
 * @param metadata - Optional additional metadata
 * @returns Response containing payment URL or subscription details
 */
export const purchaseSubscription = async (
   planId: number,
   returnUrl: string,
   metadata: Record<string, unknown> = {}
): Promise<PurchaseSubscriptionResponse> => {
   try {
      const response = await axiosWithAuth.post<PurchaseSubscriptionResponse>(
         `/auth/subscription/purchase/${planId}`,
         {
            return_url: returnUrl,
            metadata,
         }
      );

      return response.data;
   } catch (error) {
      // Handle error response
      if (axios.isAxiosError(error) && error.response?.data) {
         const detail = error.response.data.detail as string | undefined;
         throw new Error(detail || "Purchase failed");
      }

      throw new Error("Subscription purchase failed");
   }
};
