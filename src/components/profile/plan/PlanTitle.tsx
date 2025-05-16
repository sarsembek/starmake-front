"use client";

import { FC } from "react";

interface PlanTitleProps {
   name: string;
   variant: "standard" | "premium";
}

export const PlanTitle: FC<PlanTitleProps> = ({ name, variant }) =>
   variant === "premium" ? (
      <div className="mt-14 mb-8">
         <p className="text-2xl font-semibold text-[#f1eefd] capitalize">
            тариф
         </p>
         <h1 className="text-5xl font-semibold text-[#c5f500] uppercase">
            «{name}»
         </h1>
      </div>
   ) : (
      <div className="flex items-center gap-2 font-semibold text-[#533641] text-xl">
         Тариф
         <p className="text-2xl text-black">«{name}»</p>
      </div>
   );
