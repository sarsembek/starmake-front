"use client";

import React from "react";

interface LoadingSpinnerProps {
   size?: "sm" | "md" | "lg";
   className?: string;
}

export function LoadingSpinner({
   size = "md",
   className = "",
}: LoadingSpinnerProps) {
   const sizeClasses = {
      sm: "w-4 h-4",
      md: "w-8 h-8",
      lg: "w-12 h-12",
   };

   return (
      <div className={`flex justify-center items-center ${className}`}>
         <div
            className={`animate-spin rounded-full border-4 border-solid border-gray-200 border-t-blue-600 ${sizeClasses[size]}`}
            role="status"
         >
            <span className="sr-only">Loading...</span>
         </div>
      </div>
   );
}
