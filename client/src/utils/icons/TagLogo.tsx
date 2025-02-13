import React from "react";

interface IconProps {
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeVariants = {
  sm: "w-4 h-4", // 16px
  md: "w-6 h-6", // 24px
  lg: "w-8 h-8", // 32px
  xl: "w-10 h-10", // 40px
};

const TagLogo = ({ size = "md" }: IconProps) => {
  return (
    <svg
      className={`${sizeVariants[size]} text-gray-800 dark:text-white`} // Fixed className & applied size
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        stroke="#6B7280"
        strokeLinecap="round" // Fixed attribute name
        strokeLinejoin="round" // Fixed attribute name
        strokeWidth="2" // Fixed attribute name
        d="M15.583 8.445h.01M10.86 19.71l-6.573-6.63a.993.993 0 0 1 0-1.4l7.329-7.394A.98.98 0 0 1 12.31 4l5.734.007A1.968 1.968 0 0 1 20 5.983v5.5a.992.992 0 0 1-.316.727l-7.44 7.5a.974.974 0 0 1-1.384.001Z"
      />
    </svg>
  );
};

export default TagLogo;
