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

const LinkLogo = ({size="md"}:IconProps) => {
  return (
    <svg
      className={`${sizeVariants[size]} text-gray-800 dark:text-white`} // Lighter gray in light mode, darker in dark mode
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        stroke="#6B7280"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M13.213 9.787a3.391 3.391 0 0 0-4.795 0l-3.425 3.426a3.39 3.39 0 0 0 4.795 4.794l.321-.304m-.321-4.49a3.39 3.39 0 0 0 4.795 0l3.424-3.426a3.39 3.39 0 0 0-4.794-4.795l-1.028.961"
      />
    </svg>
  );
};

export default LinkLogo;
