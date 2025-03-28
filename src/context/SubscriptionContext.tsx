"use client";

import React, {
   createContext,
   useContext,
   useState,
   ReactNode,
   useEffect,
} from "react";
import { SubscriptionLimitModal } from "@/components/shared/SubscriptionLimitModal";

interface SubscriptionContextType {
   showLimitedModal: () => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(
   undefined
);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
   const [isLimitedModalOpen, setIsLimitedModalOpen] = useState(false);

   const showLimitedModal = () => {
      setIsLimitedModalOpen(true);
   };

   // Listen for subscription:limited events from axios
   useEffect(() => {
      const handleSubscriptionLimited = () => {
         showLimitedModal();
      };

      window.addEventListener(
         "subscription:limited",
         handleSubscriptionLimited
      );

      return () => {
         window.removeEventListener(
            "subscription:limited",
            handleSubscriptionLimited
         );
      };
   }, []);

   return (
      <SubscriptionContext.Provider value={{ showLimitedModal }}>
         {children}
         <SubscriptionLimitModal
            isOpen={isLimitedModalOpen}
            onClose={() => setIsLimitedModalOpen(false)}
         />
      </SubscriptionContext.Provider>
   );
}

export function useSubscription() {
   const context = useContext(SubscriptionContext);
   if (context === undefined) {
      throw new Error(
         "useSubscription must be used within a SubscriptionProvider"
      );
   }
   return context;
}
