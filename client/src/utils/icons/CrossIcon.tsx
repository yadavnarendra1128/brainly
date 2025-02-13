import React from 'react'

interface IconType {
  size?: "sm" | "md" | "lg" | "xl";
  onClick?: React.MouseEventHandler<SVGSVGElement>;
}

const sizeTypes = {
    sm: "size-2",
    md: "size-4",
    lg: "size-6",
    xl: "size-8"
  };

const CrossIcon:React.FC<IconType> = ({size="md",onClick}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="#2C2C2C"
      className={`${sizeTypes[size]} cursor-pointer`}
      onClick={onClick}
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    </svg>
  );
}

export default CrossIcon