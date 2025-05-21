"use client";

import { FC } from "react";

interface PricingDisplayProps {
   price: number;
   variant: "standard" | "premium";
}

export const PricingDisplay: FC<PricingDisplayProps> = ({ price, variant }) =>
   variant === "premium" ? (
      <div className="flex items-start gap-2 font-semibold md:justify-end">
         <span className="text-[60px] md:text-[80px] leading-[60px] md:leading-[80px] text-[#c5f500]">
            ${price}
         </span>
         <p className="text-xl md:text-2xl text-[#f1eefd] mt-2 md:mt-3">
            / месяц
         </p>
      </div>
   ) : (
      <div className="flex items-center gap-2 font-semibold py-5">
         <span className="text-[80px] leading-[80px]">${price}</span>
         <p className="text-2xl text-[#0A0A0A80] mb-6">/месяц</p>
      </div>
   );
