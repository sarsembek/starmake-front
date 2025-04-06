import { useState, useEffect } from "react";
import { useSubscription } from "@/context/SubscriptionContext";

interface UsePaginationLimitProps {
   currentPage: number;
   maxPages?: number;
}

export function usePaginationLimit({
   currentPage,
   maxPages = 3,
}: UsePaginationLimitProps) {
   const { showLimitedModal } = useSubscription();
   const [hasExceededLimit, setHasExceededLimit] = useState(false);

   // Track if we've shown the modal already
   const [hasShownModal, setHasShownModal] = useState(false);

   // Check if the user has exceeded their page limit
   useEffect(() => {
      // If on page 4 or higher, they've exceeded the limit
      if (currentPage > maxPages) {
         setHasExceededLimit(true);

         // Only show the modal once per session
         if (!hasShownModal) {
            showLimitedModal();
            setHasShownModal(true);
         }
      }
   }, [currentPage, maxPages, showLimitedModal, hasShownModal]);

   return { hasExceededLimit };
}
