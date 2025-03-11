"use client";

import Image from "next/image";
import Link from "next/link";

interface LogoProps {
   href?: string;
   className?: string;
   size?: "sm" | "md" | "lg";
   showText?: boolean; // Option to show text alongside the image
}

export function Logo({ href, className = "", size = "md", showText = true }: LogoProps) {
   // Define size classes for text and image
   const sizeClasses = {
      sm: "text-sm h-6 w-auto",
      md: "text-lg h-8 w-auto",
      lg: "text-2xl h-12 w-auto",
   };

   const LogoContent = () => (
      <div className="flex items-center space-x-2">
         {/* Logo Image */}
         <Image
            src="/logo.png"
            alt="StarMake Logo"
            width={50} // Adjust based on size
            height={50}
            className={sizeClasses[size]}
         />
         {/* Logo Text (Optional) */}
         {showText && (
            <div>
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
            </div>
         )}
      </div>
   );

   // If href is provided, wrap in Link component
   if (href) {
      return (
         <Link href={href} className={`font-bold flex items-center ${className}`}>
            <LogoContent />
         </Link>
      );
   }

   // Otherwise, return just the logo
   return <div className={`font-bold flex items-center ${className}`}><LogoContent /></div>;
}
