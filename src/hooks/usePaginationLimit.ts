import { useState, useEffect } from "react";
import { useSubscription } from "@/context/SubscriptionContext";
import { useAuth } from "@/context/AuthContext";
import { hasExceededPageLimit } from "@/utils/subscriptionUtils";

interface UsePaginationLimitProps {
   currentPage: number;
   maxPages?: number;
}

export function usePaginationLimit({
   currentPage,
   maxPages = 3,
}: UsePaginationLimitProps) {
   const { showLimitedModal } = useSubscription();
   const { user } = useAuth();
   const [hasExceededLimit, setHasExceededLimit] = useState(false);

   // Track if we've shown the modal already
   const [hasShownModal, setHasShownModal] = useState(false);

   // Check if the user has exceeded their page limit
   useEffect(() => {
      // Use the utility function to determine if user has exceeded page limit
      const hasExceeded = hasExceededPageLimit(user, currentPage, maxPages);

      if (hasExceeded) {
         setHasExceededLimit(true);

         // Only show the modal once per session
         if (!hasShownModal) {
            showLimitedModal();
            setHasShownModal(true);
         }
      } else {
         setHasExceededLimit(false);
      }
   }, [currentPage, maxPages, showLimitedModal, hasShownModal, user]);

   return { hasExceededLimit };
}
