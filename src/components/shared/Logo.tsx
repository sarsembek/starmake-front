"use client";

import Link from "next/link";

interface LogoProps {
   href?: string;
   className?: string;
   size?: "sm" | "md" | "lg";
}

export function Logo({ href, className = "", size = "md" }: LogoProps) {
   // Define size classes
   const sizeClasses = {
      sm: "text-sm",
      md: "text-lg",
      lg: "text-2xl",
   };

   const LogoContent = () => (
      <>
         <span
            className={`bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-purple-300 font-extrabold ${sizeClasses[size]}`}
            style={{
               textShadow: "0px 0px 1px rgba(168, 85, 247, 0.4)",
            }}
         >
            STAR
         </span>
         <span className={`text-gray-700 dark:text-gray-400 ${sizeClasses[size]}`}>
            MAKE
         </span>
      </>
   );

   // If href is provided, wrap in Link component
   if (href) {
      return (
         <Link href={href} className={`font-bold ${sizeClasses[size]} ${className}`}>
            <LogoContent />
         </Link>
      );
   }

   // Otherwise, return just the logo text
   return (
      <div className={`font-bold ${sizeClasses[size]} ${className}`}>
         <LogoContent />
      </div>
   );
}
