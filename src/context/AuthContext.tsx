"use client";

import { User } from "@/types/auth/auth.type";
import {
   createContext,
   useContext,
   useState,
   useEffect,
   ReactNode,
} from "react";
import Cookies from "js-cookie";

const TOKEN_COOKIE_NAME = "auth_token";

interface AuthContextType {
   user: User | null;
   token: string | null;
   isAuthenticated: boolean;
   setUser: (user: User | null) => void;
   setToken: (token: string | null) => void;
   logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
   const [user, setUser] = useState<User | null>(null);
   const [token, setToken] = useState<string | null>(null);
   const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

   useEffect(() => {
      // Load token from cookies on initial load
      const storedToken = Cookies.get(TOKEN_COOKIE_NAME);
      if (storedToken) {
         setToken(storedToken);
         setIsAuthenticated(true);
         // Optionally fetch user data here using the token
         // fetchUserProfile(storedToken).then(setUser);
      }
   }, []);

   const logout = () => {
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
      Cookies.remove(TOKEN_COOKIE_NAME);
   };

   return (
      <AuthContext.Provider
         value={{
            user,
            token,
            isAuthenticated,
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
