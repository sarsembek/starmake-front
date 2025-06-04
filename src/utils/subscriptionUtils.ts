import { User } from "@/types/auth/auth.type";

/**
 * Utility functions for handling subscription status and limitations
 */

export interface SubscriptionStatus {
   isActive: boolean;
   isExpired: boolean;
   isLimited: boolean;
   tier: string;
   messagesLeft?: number;
   expiresAt?: Date;
}

/**
 * Determines the current subscription status of a user
 * Handles both new and legacy subscription structures
 */
export function getSubscriptionStatus(user: User | null): SubscriptionStatus {
   if (!user) {
      return {
         isActive: false,
         isExpired: true,
         isLimited: true,
         tier: "None",
      };
   }

   // Check new subscription structure first
   if (user.subscription) {
      const now = new Date();
      const expiresAt = user.subscription.expires_at
         ? new Date(user.subscription.expires_at)
         : null;
      const isExpired = expiresAt ? now > expiresAt : false;
      const tier = user.subscription.tier;

      // Determine if tier is limited (Basic, Trial, or other limited tiers)
      const limitedTiers = ["Basic", "Trial", "Free"];
      const isLimited =
         limitedTiers.includes(tier) ||
         isExpired ||
         user.subscription_expired === true;

      return {
         isActive: !isExpired && !user.subscription_expired,
         isExpired: isExpired || user.subscription_expired === true,
         isLimited,
         tier,
         messagesLeft: user.subscription.messages_left,
         expiresAt: expiresAt || undefined,
      };
   }

   // Fallback to legacy structure
   const isLimited = user.is_limited === true;
   const tier = user.plan_type || "Basic";

   return {
      isActive: !isLimited,
      isExpired: isLimited,
      isLimited,
      tier,
   };
}

/**
 * Checks if user has exceeded page limits for pagination
 */
export function hasExceededPageLimit(
   user: User | null,
   currentPage: number,
   maxPages: number = 3
): boolean {
   const status = getSubscriptionStatus(user);
   return currentPage > maxPages && status.isLimited;
}

/**
 * Gets a user-friendly subscription status message
 */
export function getSubscriptionStatusMessage(user: User | null): string {
   const status = getSubscriptionStatus(user);

   if (!status.isActive) {
      if (status.isExpired) {
         return "Подписка истекла";
      }
      return "Нет активной подписки";
   }

   if (status.expiresAt) {
      const daysLeft = Math.ceil(
         (status.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      );
      if (daysLeft <= 7) {
         return `Подписка истекает через ${daysLeft} дн.`;
      }
   }

   return "Подписка активна";
}

/**
 * Formats subscription expiry date for display
 */
export function formatExpiryDate(dateString: string | Date): string {
   const date =
      typeof dateString === "string" ? new Date(dateString) : dateString;
   return date.toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
   });
}

/**
 * Determines if chatbot should be accessible based on user subscription
 * Chatbot is available for users with any active subscription (not null/None)
 */
export function shouldShowChatbot(user: User | null): boolean {
   if (!user) return false;

   const subscriptionStatus = getSubscriptionStatus(user);
   // Show chatbot if user has any active subscription (not null/None tier)
   return subscriptionStatus.isActive && subscriptionStatus.tier !== "None";
}
