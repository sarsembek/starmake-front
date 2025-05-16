"use client";

import { FC } from "react";
import { Feature } from "./types";

interface PremiumFeaturesListProps {
   features: Feature[];
   textColor?: string;
}

export const PremiumFeaturesList: FC<PremiumFeaturesListProps> = ({
   features,
   textColor = "text-base",
}) => (
   <ul className="space-y-2 text-base">
      {features.map((feature) => (
         <li key={feature.id} className="flex items-start gap-2">
            <span className="flex-shrink-0 mt-0.5">
               <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
               >
                  <path
                     d="M6.6768 6.22246C7.44841 5.48326 8.54257 0 10.0319 0C11.5213 0 12.0326 5.30006 13.2024 6.2309C16.43 6.2309 19.1864 6.23623 19.7839 6.65758C20.927 7.46443 17.2591 10.3021 15.2431 10.9474C16.3145 14.6405 17.2263 18 15.6072 18C11.7783 18 5.32625 9.16761 10.0319 9.16761C14.7377 9.16761 8.35679 17.9008 4.37137 18C2.66172 17.9008 3.75091 13.885 4.88421 10.9432C2.75331 10.4963 -3.31161e-05 8.61433 2.98732e-10 7.05571C1.98701e-05 6.06585 5.61052 6.2309 6.6768 6.22246Z"
                     fill="#C5F500"
                  />
               </svg>
            </span>
            <span className={`font-semibold ${textColor}`}>{feature.text}</span>
         </li>
      ))}
   </ul>
);
