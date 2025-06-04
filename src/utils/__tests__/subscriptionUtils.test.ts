// import { shouldShowChatbot, getSubscriptionStatus } from "../subscriptionUtils";
// import { User } from "@/types/auth/auth.type";

// describe("Chatbot Subscription Logic", () => {
//    test("shouldShowChatbot returns false for null user", () => {
//       expect(shouldShowChatbot(null)).toBe(false);
//    });

//    test("shouldShowChatbot returns false for user with no subscription", () => {
//       const user: User = {
//          email: "test@example.com",
//          is_verified: true,
//          is_active: true,
//          is_staff: false,
//          is_limited: true,
//          plan_type: "None",
//       };
//       expect(shouldShowChatbot(user)).toBe(false);
//    });

//    test("shouldShowChatbot returns false for user with expired subscription", () => {
//       const user: User = {
//          email: "test@example.com",
//          is_verified: true,
//          is_active: true,
//          is_staff: false,
//          is_limited: false,
//          plan_type: "Basic",
//          subscription: {
//             tier: "Basic",
//             expires_at: "2024-01-01T00:00:00Z", // Expired date
//             messages_left: 0,
//          },
//          subscription_expired: true,
//       };
//       expect(shouldShowChatbot(user)).toBe(false);
//    });

//    test("shouldShowChatbot returns true for user with active Basic subscription", () => {
//       const futureDate = new Date();
//       futureDate.setMonth(futureDate.getMonth() + 1);

//       const user: User = {
//          email: "test@example.com",
//          is_verified: true,
//          is_active: true,
//          is_staff: false,
//          is_limited: false,
//          plan_type: "Basic",
//          subscription: {
//             tier: "Basic",
//             expires_at: futureDate.toISOString(),
//             messages_left: 100,
//          },
//          subscription_expired: false,
//       };
//       expect(shouldShowChatbot(user)).toBe(true);
//    });

//    test("shouldShowChatbot returns true for user with active Premium subscription", () => {
//       const futureDate = new Date();
//       futureDate.setMonth(futureDate.getMonth() + 1);

//       const user: User = {
//          email: "test@example.com",
//          is_verified: true,
//          is_active: true,
//          is_staff: false,
//          is_limited: false,
//          plan_type: "Premium",
//          subscription: {
//             tier: "Premium",
//             expires_at: futureDate.toISOString(),
//             messages_left: 1000,
//          },
//          subscription_expired: false,
//       };
//       expect(shouldShowChatbot(user)).toBe(true);
//    });

//    test("shouldShowChatbot returns false for user with None tier", () => {
//       const user: User = {
//          email: "test@example.com",
//          is_verified: true,
//          is_active: true,
//          is_staff: false,
//          is_limited: true,
//          plan_type: "None",
//          subscription: {
//             tier: "None",
//             expires_at: "2025-12-31T00:00:00Z",
//             messages_left: 0,
//          },
//       };
//       expect(shouldShowChatbot(user)).toBe(false);
//    });
// });
