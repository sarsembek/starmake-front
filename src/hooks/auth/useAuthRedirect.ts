// "use client";

// import { useAuth } from "@/context/AuthContext";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";

// /**
//  * Hook that redirects authenticated users away from auth pages
//  * @param redirectTo Path to redirect authenticated users to
//  */
// export function useAuthRedirect(redirectTo: string = "/") {
//    const { isAuthenticated } = useAuth();
//    const router = useRouter();
//    const [isRedirecting, setIsRedirecting] = useState(false);

//    // useEffect(() => {
//    //    // Only redirect if we know the user is authenticated
//    //    if (isAuthenticated && !isRedirecting) {
//    //       console.log(
//    //          "Redirecting authenticated user from auth page to:",
//    //          redirectTo
//    //       );
//    //       setIsRedirecting(true);
//    //       router.replace(redirectTo);
//    //    }
//    // }, [isAuthenticated, router, redirectTo, isRedirecting]);

//    return { isAuthenticated, isRedirecting };
// }
