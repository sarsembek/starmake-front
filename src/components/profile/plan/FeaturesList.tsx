"use client";

import { FC } from "react";
import { Icon } from "./Icon";
import { Feature } from "./types";

interface FeaturesListProps {
   features: Feature[];
   textColor?: string;
}

export const FeaturesList: FC<FeaturesListProps> = ({
   features,
   textColor = "text-base",
}) => (
   <ul className="space-y-2 text-base">
      {features.map((feature) => (
         <li key={feature.id} className="flex items-start gap-2">
            <span className="flex-shrink-0 mt-0.5">
               <Icon width={20} height={20} fill="#C5F500" />
            </span>
            <span
               className={`${
                  feature.isPremium ? "font-semibold" : ""
               } ${textColor}`}
            >
               {feature.text}
            </span>
         </li>
      ))}
   </ul>
);
