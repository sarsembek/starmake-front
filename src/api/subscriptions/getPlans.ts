import { axiosWithAuth } from "@/lib/axios";

export interface SubscriptionPlan {
   id: number;
   name: string;
   description: string;
   price: number;
   features: string[];
   message_count?: number | string;
   is_premium?: boolean;
}

interface GetSubscriptionPlansResponse {
   success: boolean;
   plans: SubscriptionPlan[];
}

/**
 * Fetches available subscription plans from the backend
 */
export const getSubscriptionPlans = async (): Promise<SubscriptionPlan[]> => {
   try {
      const response = await axiosWithAuth.get<GetSubscriptionPlansResponse>(
         "auth/subscriptions/plans"
      );

      if (response.data.success) {
         return response.data.plans;
      } else {
         throw new Error("Failed to fetch subscription plans");
      }
   } catch (error) {
      console.error("Error fetching subscription plans:", error);
      throw error;
   }
};
