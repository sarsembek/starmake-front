"use client";

import { User } from "@/types/auth/auth.type";
import {
   createContext,
   useContext,
   useState,
   useEffect,
   ReactNode,
   useCallback,
} from "react";
import Cookies from "js-cookie";

const TOKEN_COOKIE_NAME = "auth_token";

interface AuthContextType {
   user: User | null;
   token: string | null;
   isAuthenticated: boolean;
   isLoading: boolean;
   setUser: (user: User | null) => void;
   setToken: (token: string | null) => void;
   logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
   const [user, setUser] = useState<User | null>(null);
   const [tokenState, setTokenState] = useState<string | null>(null);
   const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
   const [isLoading, setIsLoading] = useState(true); // Renamed isInitialized to isLoading for clarity

   // Initialize auth state from cookies
   useEffect(() => {
      const initAuth = async () => {
         try {
            const storedToken = Cookies.get(TOKEN_COOKIE_NAME);
            const storedUser = localStorage.getItem("user");

            if (storedToken) {
               console.log(
                  "Found token in cookies:",
                  storedToken.substring(0, 10) + "..."
               );
               setToken(storedToken);

               setIsAuthenticated(true);

               // TODO: You can fetch user profile here
               // const userData = await fetchUserProfile(storedToken)
               // setUser(userData);
            }
            if (storedUser) {
               setUser(JSON.parse(storedUser));
            }
         } catch (error) {
            console.error("Failed to initialize auth:", error);
         } finally {
            // Mark initialization as complete
            setIsLoading(false);
         }
      };

      initAuth();
   }, []);

   // Update isAuthenticated whenever token changes
   useEffect(() => {
      if (!isLoading) {
         // Only update after initialization
         console.log("Auth state updated:", { token: !!tokenState, user: !!user });
         setIsAuthenticated(!!tokenState);
      }
   }, [tokenState, user, isLoading]);

   const logout = useCallback(() => {
      console.log("Logging out");
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
      Cookies.remove(TOKEN_COOKIE_NAME);
   }, []);

   // Listen for logout events (from outside React components like interceptors)
   useEffect(() => {
      const handleLogoutEvent = () => {
         logout();
      };

      window.addEventListener("auth:logout", handleLogoutEvent);

      return () => {
         window.removeEventListener("auth:logout", handleLogoutEvent);
      };
   }, [logout]);

   // Listen for auth token expiration events
   useEffect(() => {
      const handleLogoutEvent = () => {
         console.log("Auth token expired, logging out");
         logout();
      };

      window.addEventListener("auth:logout", handleLogoutEvent);

      return () => {
         window.removeEventListener("auth:logout", handleLogoutEvent);
      };
   }, [logout]);

   // When a token is set/removed, sync with cookies for middleware to access
   const setToken = useCallback((newToken: string | null) => {
      if (newToken) {
         Cookies.set(TOKEN_COOKIE_NAME, newToken, {
            expires: 7, // 7 days
            path: "/",
         });
         setTokenState(newToken);
      } else {
         Cookies.remove(TOKEN_COOKIE_NAME, { path: "/" });
         setTokenState(null);
      }
   }, []);

   return (
      <AuthContext.Provider
         value={{
            user,
            token: tokenState,
            isAuthenticated,
            isLoading,
            setUser,
            setToken,
            logout,
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
