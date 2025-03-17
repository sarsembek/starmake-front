"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { ProgressFooter } from "@/components/script-builder/progress-footer";

export default function ScriptBuilderLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   const pathname = usePathname();
   const [progressValue, setProgressValue] = useState(50);
   const [prevPath, setPrevPath] = useState("/");
   const [nextPath, setNextPath] = useState("/");
   const [isNextDisabled, setIsNextDisabled] = useState(false);

   // Set progress value and paths based on current route
   useEffect(() => {
      if (pathname === "/script-builder") {
         setProgressValue(50);
         setPrevPath("/");
         setNextPath("/script-builder/write-script"); // Default next path
         setIsNextDisabled(true); // Disabled until option is selected
      } else if (pathname === "/script-builder/write-script") {
         setProgressValue(70);
         setPrevPath("/script-builder");
         setNextPath("/script-builder/next-step");
         setIsNextDisabled(false); // Enable button on subsequent pages
      } else if (pathname === "/script-builder/use-template") {
         setProgressValue(70);
         setPrevPath("/script-builder");
         setNextPath("/script-builder/next-step");
         setIsNextDisabled(false); // Enable button on subsequent pages
      } else if (pathname === "/script-builder/next-step") {
         setProgressValue(100);
         setPrevPath(
            pathname.includes("use-template")
               ? "/script-builder/use-template"
               : "/script-builder/write-script"
         );
         setNextPath("/");
         setIsNextDisabled(false); // Enable button on final page
      }
   }, [pathname]);

   // Listen for option selection event from ChooseOption component
   useEffect(() => {
      const handleOptionSelected = () => {
         // Enable the next button when an option is selected
         setIsNextDisabled(false);
      };

      // Add event listener
      window.addEventListener("optionSelected", handleOptionSelected);

      // Clean up event listener
      return () => {
         window.removeEventListener("optionSelected", handleOptionSelected);
      };
   }, []);

   // Don't show footer on next-step page
   const showFooter = !pathname.includes("next-step");

   return (
      <>
         <div className="pb-24">{children}</div>

         {showFooter && (
            <div className="fixed bottom-0 left-0 right-0 bg-background border-t">
               <div className="container mx-auto px-4 py-4">
                  <ProgressFooter
                     progressValue={progressValue}
                     onPrevious={() => (window.location.href = prevPath)}
                     onNext={() => (window.location.href = nextPath)}
                     isNextDisabled={isNextDisabled}
                  />
               </div>
            </div>
         )}
      </>
   );
}
