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

   const checkAuthStatus = useCallback(async () => {
      try {
         // This endpoint should verify the HTTP-only cookie and return user data
         const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
            {
               credentials: "include", // Important: includes cookies in the request
            }
         );

         if (response.ok) {
            const userData = await response.json();
            setUser(userData.user);
            setIsAuthenticated(true);

            // Cache user data for faster loading
            localStorage.setItem("user_cache", JSON.stringify(userData.user));
            return true;
         } else {
            setUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem("user_cache");
            return false;
         }
      } catch (error) {
         console.error("Failed to check auth status:", error);
         setUser(null);
         setIsAuthenticated(false);
         return false;
      }
   }, []);

   // Initialize auth state
   useEffect(() => {
      const initAuth = async () => {
         try {
            // Try to load cached user data while checking auth status
            const cachedUser = localStorage.getItem("user_cache");
            if (cachedUser) {
               setUser(JSON.parse(cachedUser));
               setIsAuthenticated(true); // Temporarily assume authenticated
            }

            // Verify authentication with server
            await checkAuthStatus();
         } catch (error) {
            console.error("Failed to initialize auth:", error);
         } finally {
            setIsLoading(false);
         }
      };

      initAuth();
   }, [checkAuthStatus]);

   const logout = useCallback(async () => {
      try {
         // Call logout endpoint to clear the HTTP-only cookie
         await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
            method: "POST",
            credentials: "include",
         });
      } catch (error) {
         console.error("Error during logout:", error);
      }

      // Clear local state
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("user_cache");

      // Redirect to login
      window.location.href = "/login";
   }, []);

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
