"use client";

import { FC } from "react";
import { HeartIcon } from "./HeartIcon";

export const PopularBadge: FC = () => (
   <div className="w-fit">
      <div className="bg-[#c5f500] rounded-xl px-3 py-1.5 flex items-center">
        <HeartIcon />
         <span className="ml-2 text-xs text-black">Выбирают чаще всего</span>
      </div>
   </div>
);
