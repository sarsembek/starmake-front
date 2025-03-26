"use client";

import { User } from "@/types/auth/auth.type";
import { useRefreshToken } from "@/hooks/auth/useRefreshToken";
// import { axiosWithAuth } from "@/lib/axios";
import {
   createContext,
   useContext,
   useState,
   useEffect,
   ReactNode,
   useCallback,
} from "react";

interface AuthContextType {
   user: User | null;
   isAuthenticated: boolean;
   isLoading: boolean;
   setUser: (user: User | null) => void;
   logout: () => void;
   checkAuthStatus: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
   const [user, setUser] = useState<User | null>(null);
   const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
   const [isLoading, setIsLoading] = useState(true);
   const { refresh } = useRefreshToken();

   const checkAuthStatus = useCallback(async () => {
      try {
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
            return true;
         } else if (response.status === 401) {
            // If we get a 401, try refreshing the token
            console.log("Profile fetch returned 401, attempting token refresh...");
            const { success, user: refreshedUser, email } = await refresh();
            console.log("Token refresh result:", { success, hasUser: !!refreshedUser, email });
   
            if (success) {
               if (refreshedUser) {
                  setUser(refreshedUser);
                  setIsAuthenticated(true);
                  return true;
               } else if (email) {
                  // We have a valid token but couldn't fetch the profile
                  // Let's try once more to get the profile
                  try {
                     console.log("Retrying profile fetch after successful token refresh");
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
                        localStorage.setItem("user_cache", JSON.stringify(userData));
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
            console.log("Profile fetch failed, attempting token refresh as fallback...");
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
      }
   }, [refresh]);

   const logout = useCallback(async () => {
      try {
         await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
            method: "POST",
            credentials: "include",
         });
      } catch (error) {
         console.error("Error during logout:", error);
      }

      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("user_cache");
      window.location.href = "/login";
   }, []);

   // Initialize auth state
   useEffect(() => {
      const initAuth = async () => {
         try {
            // Try to load cached user data for immediate UI update
            const cachedUser = localStorage.getItem("user_cache");
            if (cachedUser) {
               setUser(JSON.parse(cachedUser));
               setIsAuthenticated(true); // Temporarily assume authenticated
            }

            // Even with cached data, always verify with server
            await checkAuthStatus();
         } catch (error) {
            console.error("Failed to initialize auth:", error);
         } finally {
            setIsLoading(false);
         }
      };

      // Add an event listener for token refresh failure events
      const handleAuthLogout = () => {
         logout();
      };

      window.addEventListener("auth:logout", handleAuthLogout);

      initAuth();

      return () => {
         window.removeEventListener("auth:logout", handleAuthLogout);
      };
   }, [checkAuthStatus, logout]);

   return (
      <AuthContext.Provider
         value={{
            user,
            isAuthenticated,
            isLoading,
            setUser,
            logout,
            checkAuthStatus,
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
