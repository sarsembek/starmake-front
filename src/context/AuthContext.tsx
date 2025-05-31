"use client";

import { User } from "@/types/auth/auth.type";
import { useRefreshToken } from "@/hooks/auth/useRefreshToken";
import {
   createContext,
   useContext,
   useState,
   useEffect,
   ReactNode,
   useCallback,
   useRef,
} from "react";
import { logoutUser } from "@/api/auth/logoutUser";
import {
   cleanupPaymentParams,
   getPaymentStatusFromUrl,
} from "@/utils/payment-utils";

interface AuthContextType {
   user: User | null;
   isAuthenticated: boolean;
   isLoading: boolean;
   isLimited: boolean; // Uncomment this state
   setUser: (user: User | null) => void;
   logout: () => void;
   checkAuthStatus: () => Promise<boolean>;
   setIsLimited: (state: boolean) => void; // Uncomment setter function
   processPaymentReturn: () => { status: string | null };
   updateSubscriptionStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
   const [user, setUser] = useState<User | null>(null);
   const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
   const [isLoading, setIsLoading] = useState(true);
   const [isLimited, setIsLimited] = useState(false); // Uncomment state for limited access
   const { refresh } = useRefreshToken();
   const authCheckInProgress = useRef(false);

   // Store initial checkAuthStatus implementation in ref to avoid dependency cycles
   const checkAuthStatusRef = useRef<() => Promise<boolean> | null>(null);

   // Create the implementation once
   checkAuthStatusRef.current = async () => {
      // Prevent concurrent checks
      if (authCheckInProgress.current) {
         console.log("Auth check already in progress, skipping...");
         return isAuthenticated;
      }

      try {
         authCheckInProgress.current = true;
         console.log("Checking auth status...");

         // First try the direct profile fetch to check cookie validity
         const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/profile`,
            {
               credentials: "include",
            }
         );

         console.log("Profile fetch response status:", response.status);

         if (response.ok) {
            const userData = await response.json();
            console.log("User data fetched successfully");
            setUser(userData);
            setIsAuthenticated(true);
            localStorage.setItem("user_cache", JSON.stringify(userData));

            // Check if user is limited based on subscription expiration
            setIsLimited(userData.is_limited);

            return true;
         } else if (response.status === 401) {
            // If we get a 401, try refreshing the token
            console.log(
               "Profile fetch returned 401, attempting token refresh..."
            );
            const { success, user: refreshedUser, email } = await refresh();
            console.log("Token refresh result:", {
               success,
               hasUser: !!refreshedUser,
               email,
            });

            if (success) {
               if (refreshedUser) {
                  setUser(refreshedUser);
                  setIsAuthenticated(true);
                  return true;
               } else if (email) {
                  // We have a valid token but couldn't fetch the profile
                  // Let's try once more to get the profile
                  try {
                     console.log(
                        "Retrying profile fetch after successful token refresh"
                     );
                     const profileResponse = await fetch(
                        `${process.env.NEXT_PUBLIC_API_URL}/auth/profile`,
                        {
                           credentials: "include",
                        }
                     );

                     if (profileResponse.ok) {
                        const userData = await profileResponse.json();
                        setUser(userData);
                        setIsAuthenticated(true);
                        localStorage.setItem(
                           "user_cache",
                           JSON.stringify(userData)
                        );
                        return true;
                     }
                  } catch (profileError) {
                     console.error("Profile retry failed:", profileError);
                  }
               }
            }

            // If we reached here, authentication failed
            setUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem("user_cache");
            return false;
         } else if (response.status === 403) {
            // Check if this is our specific limited error
            try {
               const errorData = await response.json();
               if (errorData?.detail?.ru === "Ваш аккаунт ограничен") {
                  console.log("User account is limited");
                  // setIsLimited(true);
                  // localStorage.setItem("user_limited", "true");
                  return false;
               }
            } catch (parseError) {
               console.error("Error parsing response", parseError);
            }
         }

         // Other error cases
         setUser(null);
         setIsAuthenticated(false);
         localStorage.removeItem("user_cache");
         return false;
      } catch (error) {
         console.error("Failed to check auth status:", error);

         // Try the refresh token flow as fallback
         try {
            console.log(
               "Profile fetch failed, attempting token refresh as fallback..."
            );
            const { success, user: refreshedUser } = await refresh();

            if (success && refreshedUser) {
               setUser(refreshedUser);
               setIsAuthenticated(true);
               return true;
            }
         } catch (refreshError) {
            console.error("Refresh token fallback also failed:", refreshError);
         }

         setUser(null);
         setIsAuthenticated(false);
         localStorage.removeItem("user_cache");
         return false;
      } finally {
         authCheckInProgress.current = false;
      }
   };

   // Expose stable function that delegates to ref implementation
   const checkAuthStatus = useCallback(async () => {
      return checkAuthStatusRef.current
         ? (await checkAuthStatusRef.current()) ?? false
         : false;
   }, []);

   const logout = useCallback(async () => {
      try {
         const response = await logoutUser();

         // Only perform logout actions if the server confirms successful logout
         if (response && response.message === "Logged out successfully") {
            setUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem("user_cache");
            window.location.href = "/login";
         } else {
            console.error("Logout failed: Server did not confirm logout");
         }
      } catch (error) {
         console.error("Logout error:", error);
      }
   }, []);

   // Initialize auth state
   useEffect(() => {
      let isMounted = true;

      const initAuth = async () => {
         try {
            // Try to load cached user data for immediate UI update
            const cachedUser = localStorage.getItem("user_cache");
            if (cachedUser && isMounted) {
               setUser(JSON.parse(cachedUser));
               setIsAuthenticated(true); // Temporarily assume authenticated
            }

            // Check if user was previously limited on initial load
            const wasLimited = localStorage.getItem("user_limited") === "true";
            if (wasLimited) {
               setIsLimited(true);
            }

            // Even with cached data, always verify with server
            if (isMounted && checkAuthStatusRef.current) {
               await checkAuthStatusRef.current();
            }
         } catch (error) {
            console.error("Failed to initialize auth:", error);
         } finally {
            if (isMounted) {
               setIsLoading(false);
            }
         }
      };

      // Add an event listener for token refresh failure events
      const handleAuthLogout = () => {
         logout();
      };

      window.addEventListener("auth:logout", handleAuthLogout);

      initAuth();

      return () => {
         isMounted = false;
         window.removeEventListener("auth:logout", handleAuthLogout);
      };
   }, [logout]); // Include 'logout' in the dependency array

   const processPaymentReturn = () => {
      const status = getPaymentStatusFromUrl();

      if (status) {
         // Update user state based on payment status
         setUser((prevUser) => {
            if (prevUser) {
               return {
                  ...prevUser,
                  subscription_status: status,
               };
            }
            return prevUser;
         });

         // Update limited state if necessary
         if (status === "active") {
            setIsLimited(false);
         } else if (status === "canceled" || status === "expired") {
            setIsLimited(true);
         }
      }

      // Clean up URL parameters after processing
      cleanupPaymentParams();

      // Return the status to match the interface
      return { status };
   };

   const updateSubscriptionStatus = useCallback(async () => {
      try {
         const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/update-subscription-status`,
            {
               method: "POST",
               credentials: "include",
               headers: {
                  "Content-Type": "application/json",
               },
               body: JSON.stringify({}),
            }
         );

         if (response.ok) {
            const data = await response.json();
            console.log("Subscription status updated:", data);

            // Update user state with new subscription status
            setUser((prevUser) => {
               if (prevUser) {
                  return {
                     ...prevUser,
                     subscription_status: data.status,
                  };
               }
               return prevUser;
            });

            // Update limited state based on new status
            setIsLimited(data.status === "active" ? false : true);
         } else {
            console.error(
               "Failed to update subscription status:",
               response.status
            );
         }
      } catch (error) {
         console.error("Error updating subscription status:", error);
      }
   }, []);

   return (
      <AuthContext.Provider
         value={{
            user,
            isAuthenticated,
            isLoading,
            isLimited, // Provide this to consumers
            setUser,
            logout,
            checkAuthStatus,
            setIsLimited, // Provide the setter
            processPaymentReturn,
            updateSubscriptionStatus,
         }}
      >
         {children}
      </AuthContext.Provider>
   );
}

export function useAuth() {
   const context = useContext(AuthContext);
   if (context === undefined) {
      throw new Error("useAuth must be used within an AuthProvider");
   }
   return context;
}
