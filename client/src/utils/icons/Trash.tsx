import React from 'react'

interface IconProps {
  size?: "sm" | "md" | "lg" | "xl";
  onClick?: React.MouseEventHandler<SVGSVGElement>;
}

const sizeVariants = {
  sm: "w-4 h-4", // 16px
  md: "w-6 h-6", // 24px
  lg: "w-8 h-8", // 32px
  xl: "w-10 h-10", // 40px
};

const Trash = ({size="md",onClick}:IconProps) => {
  return (
    <svg
      className={`${sizeVariants[size || "sm"]} cursor-pointer`}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
      onClick={onClick}
    >
      <path
        stroke="#6B7280"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"
      />
    </svg>
  );
}

export default Trash