import { axiosWithAuth } from "@/lib/axios";

// Types for card data
export interface CardData {
   cardNumber: string;
   expiryMonth: string;
   expiryYear: string;
   cvv: string;
   cardholderName: string;
}

// Types for payment request
export interface PaymentRequest {
   card_data: CardData;
   metadata: {
      plan_id: number;
   };
}

// Types for 3D Secure data
export interface ThreeDSData {
   acsUrl: string;
   creq: string;
   threeDSSessionData: string;
   transaction_id: string;
}

// Types for payment response
export interface PaymentResponse {
   success: boolean;
   status: "paid" | "pending_auth" | "failed";
   payment_id: string;
   requires_3ds: boolean;
   threeds_data?: ThreeDSData;
   message?: string;
}

// Types for 3DS completion request
export interface Complete3DSRequest {
   transaction_id: string;
   threeDSSessionData: string;
   cres: string;
}

// Types for subscription purchase request
export interface PurchaseSubscriptionRequest {
   planId: number;
   returnUrl: string;
}

// Types for subscription purchase response
export interface PurchaseSubscriptionResponse {
   success: boolean;
   payment_url: string;
   message?: string;
}

// Types for payment status check
export interface PaymentStatusRequest {
   payment_id?: string;
   transaction_id?: string;
}

// Types for payment status response
export interface PaymentStatusResponse {
   success: boolean;
   status: "paid" | "pending" | "failed";
   message?: string;
}

// Custom error interface
export interface PaymentError extends Error {
   response?: {
      data?: {
         message?: string;
      };
   };
}

/**
 * Process a direct card payment for a subscription
 */
export const processPayment = async (
   data: PaymentRequest
): Promise<PaymentResponse> => {
   try {
      const response = await axiosWithAuth.post<PaymentResponse>(
         "/payments/process",
         data
      );
      return response.data;
   } catch (error: unknown) {
      console.error("Failed to process payment:", error);
      throw error as PaymentError;
   }
};

/**
 * Complete 3D Secure authentication after challenge
 */
export const complete3DSAuthentication = async (
   data: Complete3DSRequest
): Promise<PaymentResponse> => {
   try {
      const response = await axiosWithAuth.post<PaymentResponse>(
         "/payments/complete-3ds",
         data
      );
      return response.data;
   } catch (error: unknown) {
      console.error("Failed to complete 3DS authentication:", error);
      throw error as PaymentError;
   }
};

/**
 * Purchase a subscription plan by generating a payment link
 */
export const purchaseSubscription = async (
   data: PurchaseSubscriptionRequest
): Promise<PurchaseSubscriptionResponse> => {
   try {
      const response = await axiosWithAuth.post<PurchaseSubscriptionResponse>(
         `/subscriptions/purchase/${data.planId}`,
         null,
         {
            params: { return_url: data.returnUrl },
         }
      );
      return response.data;
   } catch (error: unknown) {
      console.error("Failed to purchase subscription:", error);
      throw error as PaymentError;
   }
};

/**
 * Check the status of a payment
 */
export const checkPaymentStatus = async (
   data: PaymentStatusRequest
): Promise<PaymentStatusResponse> => {
   try {
      const response = await axiosWithAuth.get<PaymentStatusResponse>(
         "/payments/status",
         {
            params: data,
         }
      );
      return response.data;
   } catch (error: unknown) {
      console.error("Failed to check payment status:", error);
      throw error as PaymentError;
   }
};
