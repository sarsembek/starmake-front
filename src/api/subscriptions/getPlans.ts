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

// Default plans to use if API fails
const defaultPlans: SubscriptionPlan[] = [
   {
      id: 1,
      name: "Только посмотреть",
      price: 11,
      message_count: 100,
      description: "Basic plan",
      features: [
         "Возможность посмотреть всё на 30 дней",
         "Возможность использовать поиск",
      ],
   },
   {
      id: 2,
      name: "Стандартный",
      price: 16,
      message_count: 1000,
      description: "Standard plan",
      features: [
         "Возможность посмотреть всё на 30 дней",
         "Возможность использовать поиск",
      ],
   },
   {
      id: 3,
      name: "Безлимитный",
      price: 29,
      message_count: "безлимит",
      description: "Unlimited plan",
      features: ["Безлимитные сообщения", "Приоритетная поддержка"],
   },
   {
      id: 4,
      name: "Эксклюзив",
      price: 93,
      message_count: "безлимит",
      is_premium: true,
      description: "Premium plan",
      features: [
         "Личный ассистент продюсер в телеграме",
         "Обучение как набрать 100 000 подписчиков",
      ],
   },
];

/**
 * Fetches available subscription plans from the backend
 */
export const getSubscriptionPlans = async (): Promise<SubscriptionPlan[]> => {
   try {
      console.log("Fetching subscription plans from API...");
      const response = await axiosWithAuth.get<GetSubscriptionPlansResponse>(
         "auth/subscriptions/plans"
      );

      console.log("Subscription plans API response:", response);

      // Check if the response is valid
      if (
         response.data &&
         response.data.success &&
         Array.isArray(response.data.plans)
      ) {
         if (response.data.plans.length > 0) {
            console.log("Successfully fetched plan data:", response.data.plans);
            return response.data.plans;
         } else {
            console.warn("API returned empty plans array, using default plans");
            return defaultPlans;
         }
      } else {
         console.error("Invalid response format:", response.data);
         console.warn("Using default plans as fallback");
         return defaultPlans;
      }
   } catch (error) {
      console.error("Error fetching subscription plans:", error);
      // Return default plans instead of throwing an error
      console.warn("Using default plans due to API error");
      return defaultPlans;
   }
};
