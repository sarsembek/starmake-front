# Chatbot Conditional Display Implementation

## Overview

This implementation adds conditional display logic for the "Чатбот" (Chatbot) navigation link based on user subscription status.

## Logic

The chatbot link is shown when:

-  User is authenticated
-  User has an active subscription (`subscription.isActive = true`)
-  Subscription tier is NOT "None"

The chatbot link is hidden when:

-  User is not authenticated
-  User has no subscription (`subscription = null`)
-  User has an expired subscription
-  User has a "None" tier subscription

## Implementation Details

### Files Modified

1. **`src/components/Navbar/navbar.tsx`**

   -  Added conditional rendering for chatbot links in desktop menu, dropdown menu, and mobile menu
   -  Uncommented and activated the `navigateToChatbot()` function
   -  Added import for `shouldShowChatbot` utility function

2. **`src/utils/subscriptionUtils.ts`**
   -  Added `shouldShowChatbot(user)` utility function for reusable logic
   -  Function uses existing `getSubscriptionStatus()` to determine visibility

### Usage in Components

```tsx
// Desktop navigation menu
{
   shouldShowChatbot(user) && (
      <NavigationMenuItem>
         <NavigationMenuLink onClick={navigateToChatbot}>
            Чатбот
         </NavigationMenuLink>
      </NavigationMenuItem>
   );
}

// Dropdown menu
{
   shouldShowChatbot(user) && (
      <DropdownMenuItem onClick={navigateToChatbot}>
         <span>Чатбот</span>
      </DropdownMenuItem>
   );
}

// Mobile menu
{
   shouldShowChatbot(user) && (
      <button onClick={navigateToChatbot}>
         <span>Чатбот</span>
      </button>
   );
}
```

### Utility Function

```typescript
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
```

## Testing

The implementation includes comprehensive test cases covering:

-  Null user scenarios
-  Users without subscriptions
-  Users with expired subscriptions
-  Users with active Basic subscriptions
-  Users with active Premium subscriptions
-  Users with "None" tier subscriptions

## Chatbot Navigation

When the chatbot link is clicked, users are redirected to `https://direct.starmake.ai` with automatic HTTP-only cookie authentication.
