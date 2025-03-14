import { useAuth } from "@/context/AuthContext";
import { axiosWithAuth } from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useProtectedApi() {
   const { isAuthenticated, token } = useAuth();
   const router = useRouter();

   useEffect(() => {
      if (!isAuthenticated && !token) {
         router.push("/login");
      }
   }, [isAuthenticated, token, router]);

   return {
      api: axiosWithAuth,
      isAuthenticated,
   };
}
