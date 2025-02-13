import React, { ReactElement, cloneElement } from "react";

interface ButtonInterface {
  title: string;
  size: "lg" | "sm" | "md";
  startIcon?: ReactElement;
  endIcon?: ReactElement;
  variant: "primary" | "secondary";
  onClick?: React.MouseEventHandler;
}

const sizeStyles = {
  lg: "px-8 py-4 text-xl rounded-xl",
  md: "px-4 py-2 text-base rounded-md",
  sm: "px-2 py-1 text-sm rounded-sm",
};

const variantStyles = {
  primary: "bg-purple-600 text-white",
  secondary: "bg-purple-300 text-purple-600 border-2 border-purple-400",
};

const Button = ({
  size,
  title,
  variant,
  startIcon,
  endIcon,
  onClick,
  
}: ButtonInterface) => {
  const enhancedStartIcon = startIcon
    ? cloneElement(startIcon, { size })
    : null;
  const enhancedEndIcon = endIcon ? cloneElement(endIcon, { size }) : null;

  return (
    <button
      className={`${sizeStyles[size]} ${variantStyles[variant]} cursor-pointer flex items-center`}
      onClick={onClick}
    >
      {enhancedStartIcon}
      <div className="hidden md:block lg:block px-2">{title}</div>
      {enhancedEndIcon}
    </button>
  );
};

export default Button;
