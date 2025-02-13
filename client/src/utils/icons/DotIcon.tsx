import React from 'react'
interface IconProps {
  size?: "sm" | "md" | "lg" | "xl";
  onClick?: (React.MouseEventHandler<SVGSVGElement>);
}

const sizeVariants = {
  sm: "w-4 h-4", // 16px
  md: "w-6 h-6", // 24px
  lg: "w-8 h-8", // 32px
  xl: "w-10 h-10", // 40px
};
const DotIcon = ({ size = "md", onClick }: IconProps) => {
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
        stroke="#4B5563"
        strokeLinecap="round"
        strokeWidth="3"
        d="M12 6h.01M12 12h.01M12 18h.01"
      />
    </svg>
  );
};

export default DotIcon