import { useState, useEffect } from "react";
import { useSubscription } from "@/context/SubscriptionContext";
import { useAuth } from "@/context/AuthContext";

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
      // Only apply page limit if user is actually limited
      const isUserLimited = user?.is_limited === true;

      // If on page 4 or higher AND user is limited, they've exceeded the limit
      if (currentPage > maxPages && isUserLimited) {
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
