import { FC } from "react";

interface IconProps {
   width?: number;
   height?: number;
   className?: string;
   fill?: string;
}

export const Icon: FC<IconProps> = ({
   width = 24,
   height = 24,
   className = "",
   fill = "#E5E5E5",
}) => {
   return (
      <svg
         width={width}
         height={height}
         viewBox="0 0 24 24"
         fill="none"
         xmlns="http://www.w3.org/2000/svg"
         className={className}
      >
         <g clipPath="url(#clip0_28703_225)">
            <rect width="24" height="24" rx="12" fill={fill} />
            <path
               fillRule="evenodd"
               clipRule="evenodd"
               d="M16.0303 9.96967C16.3232 10.2626 16.3232 10.7374 16.0303 11.0303L11.0303 16.0303C10.7374 16.3232 10.2626 16.3232 9.96967 16.0303L7.96967 14.0303C7.67678 13.7374 7.67678 13.2626 7.96967 12.9697C8.26256 12.6768 8.73744 12.6768 9.03033 12.9697L10.5 14.4393L14.9697 9.96967C15.2626 9.67678 15.7374 9.67678 16.0303 9.96967Z"
               fill="#5D2DE6"
            />
         </g>
         <defs>
            <clipPath id="clip0_28703_225">
               <rect width="24" height="24" rx="12" fill="white" />
            </clipPath>
         </defs>
      </svg>
   );
};
