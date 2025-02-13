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

const DocumentLogo = ({ size = "md" }: IconProps) => (
  <svg
    className={`${sizeVariants[size]} text-gray-800 dark:text-white`}
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="#808080"
    viewBox="0 0 24 24"
  >
    <path
      fillRule="evenodd"
      d="M9 2.221V7H4.221a2 2 0 0 1 .365-.5L8.5 2.586A2 2 0 0 1 9 2.22ZM11 2v5a2 2 0 0 1-2 2H4v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-7Z"
      clipRule="evenodd"
    />
  </svg>
);

export default DocumentLogo;
